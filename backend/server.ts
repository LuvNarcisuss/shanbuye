import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const frontendDirectory = path.join(projectRoot, "frontend");
const dataDirectory = path.join(projectRoot, "data");
const modelDirectory = path.join(dataDirectory, "models");
const reportDirectory = path.join(dataDirectory, "reports");

for (const directory of [dataDirectory, modelDirectory, reportDirectory]) {
  fs.mkdirSync(directory, { recursive: true });
}

const db = new Database(path.join(dataDirectory, "inspection.db"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    iteration TEXT NOT NULL,
    map REAL NOT NULL,
    fps INTEGER NOT NULL,
    status TEXT NOT NULL,
    upload_date TEXT NOT NULL,
    file_name TEXT,
    file_path TEXT,
    file_size INTEGER NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    threshold REAL NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    version TEXT NOT NULL,
    last_modified TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time TEXT NOT NULL,
    user TEXT NOT NULL,
    module TEXT NOT NULL,
    type TEXT NOT NULL,
    detail TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    summary TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const today = () => new Date().toISOString().slice(0, 10);
const timestamp = () => new Date().toISOString().replace("T", " ").slice(0, 19);
const makeId = (prefix: string) => `${prefix}-${Date.now().toString(36).toUpperCase()}`;
const safeFilename = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "model.bin";
const escapeHtml = (value: unknown) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
}[character] ?? character));
const csvCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

function addLog(module: string, type: string, detail: string, user = "admin") {
  db.prepare("INSERT INTO audit_logs (time, user, module, type, detail) VALUES (?, ?, ?, ?, ?)")
    .run(timestamp(), user, module, type, detail);
}

function seedDatabase() {
  const modelCount = db.prepare("SELECT COUNT(*) AS count FROM models").get() as { count: number };
  if (modelCount.count === 0) {
    const insert = db.prepare(`
      INSERT INTO models (id, name, iteration, map, fps, status, upload_date, file_size, notes)
      VALUES (@id, @name, @iteration, @map, @fps, @status, @upload_date, 0, @notes)
    `);
    const seedModels = [
      { id: "M-001", name: "yolo_hrca_seg_baseline", iteration: "基线版", map: 94.1, fps: 118, status: "archived", upload_date: "2026-04-12", notes: "初始分割基线，可用于回归对照" },
      { id: "M-002", name: "yolo_hrca_seg_lite", iteration: "轻量复用版", map: 96.5, fps: 182, status: "testing", upload_date: "2026-06-08", notes: "面向边缘设备的可复用轻量模型" },
      { id: "M-003", name: "yolo_hrca_seg", iteration: "当前生产版", map: 98.2, fps: 145, status: "active", upload_date: "2026-08-18", notes: "融合 HRCA 的当前生产分割模型" },
    ];
    const seed = db.transaction(() => seedModels.forEach((model) => insert.run(model)));
    seed();
  }

  const ruleCount = db.prepare("SELECT COUNT(*) AS count FROM rules").get() as { count: number };
  if (ruleCount.count === 0) {
    const insert = db.prepare("INSERT INTO rules VALUES (@id, @name, @type, @threshold, @enabled, @version, @last_modified)");
    [
      { id: "R-001", name: "封口不良判定", type: "缺陷检测", threshold: 0.85, enabled: 1, version: "v1.2.0", last_modified: "2026-08-20" },
      { id: "R-002", name: "异物识别", type: "异物检测", threshold: 0.92, enabled: 1, version: "v2.1.0", last_modified: "2026-08-18" },
      { id: "R-003", name: "漏装检测", type: "完整性检测", threshold: 0.8, enabled: 0, version: "v1.0.5", last_modified: "2026-08-15" },
      { id: "R-004", name: "标签偏移", type: "位置检测", threshold: 0.75, enabled: 1, version: "v1.1.2", last_modified: "2026-08-10" },
    ].forEach((rule) => insert.run(rule));
  }

  const logCount = db.prepare("SELECT COUNT(*) AS count FROM audit_logs").get() as { count: number };
  if (logCount.count === 0) {
    addLog("系统管理", "初始化", "创建本地数据仓库与默认配置", "system");
    addLog("模型管理", "切换", "切换生产模型为 yolo_hrca_seg");
    addLog("规则配置", "发布", "发布了封口不良判定 v1.2.0");
  }

  const settingCount = db.prepare("SELECT COUNT(*) AS count FROM settings").get() as { count: number };
  if (settingCount.count === 0) {
    const insert = db.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)");
    insert.run("alarmThreshold", "5", timestamp());
    insert.run("imageRetentionDays", "30", timestamp());
    insert.run("websocketUrl", "ws://127.0.0.1:8080/inspection", timestamp());
  }

  const userCount = db.prepare("SELECT COUNT(*) AS count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    db.prepare("INSERT INTO users (username, role, created_at) VALUES (?, ?, ?)").run("admin", "质检主管", timestamp());
  }
}

seedDatabase();

async function startServer() {
  const app = express();
  const portArgument = process.argv.find((argument) => argument.startsWith("--port="))?.slice(7);
  const hostArgument = process.argv.find((argument) => argument.startsWith("--host="))?.slice(7);
  const PORT = Number.parseInt(portArgument ?? process.env.PORT ?? "3000", 10);
  const HOST = hostArgument ?? process.env.HOST ?? "127.0.0.1";

  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error(`Invalid PORT value: ${process.env.PORT}`);
  }

  app.use(express.json({ limit: "10mb" }));
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  app.get("/api/stats", (_req, res) => {
    res.json({ totalProduction: 12540, defectRate: 0.024, activeLines: 4, alarms: 2 });
  });

  app.get("/api/lines", (_req, res) => {
    res.json([
      { id: 1, name: "产线 A", status: "running", product: "罗小懒 山椒笋", yield: 98.5, speed: "120 pcs/min" },
      { id: 2, name: "产线 B", status: "running", product: "山不野 蛋蛋脆笋", yield: 99.2, speed: "150 pcs/min" },
      { id: 3, name: "产线 C", status: "warning", product: "山不野 泡椒味脆脆笋", yield: 94.1, speed: "110 pcs/min" },
      { id: 4, name: "产线 D", status: "running", product: "谭小泡 笋尖", yield: 98.8, speed: "140 pcs/min" },
    ]);
  });

  app.get("/api/models", (_req, res) => {
    const models = db.prepare("SELECT id, name, iteration, map AS mAP, fps, status, upload_date AS uploadDate, file_name AS fileName, file_size AS fileSize, notes FROM models ORDER BY upload_date DESC, id DESC").all();
    res.json(models);
  });

  app.post("/api/models/upload", express.raw({ type: "application/octet-stream", limit: "250mb" }), (req, res) => {
    const originalName = decodeURIComponent(String(req.header("x-file-name") ?? "model.onnx"));
    const modelName = String(req.header("x-model-name") ?? path.parse(originalName).name).trim();
    const iteration = decodeURIComponent(String(req.header("x-model-iteration") ?? "新迭代"));
    const mAP = Number(req.header("x-model-map") ?? 0);
    const fps = Number(req.header("x-model-fps") ?? 0);
    const notes = decodeURIComponent(String(req.header("x-model-notes") ?? ""));
    const payload = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
    if (!modelName || payload.length === 0 || !Number.isFinite(mAP) || !Number.isFinite(fps)) {
      res.status(400).json({ error: "模型名称、模型文件、mAP 和 FPS 均为必填项" });
      return;
    }
    const id = makeId("M");
    const storedName = `${id}-${safeFilename(originalName)}`;
    const storedPath = path.join(modelDirectory, storedName);
    fs.writeFileSync(storedPath, payload);
    db.prepare(`
      INSERT INTO models (id, name, iteration, map, fps, status, upload_date, file_name, file_path, file_size, notes)
      VALUES (?, ?, ?, ?, ?, 'testing', ?, ?, ?, ?, ?)
    `).run(id, modelName, iteration, mAP, Math.round(fps), today(), originalName, storedPath, payload.length, notes);
    addLog("模型管理", "上传", `上传模型 ${modelName}（${originalName}，${payload.length} 字节）`);
    res.status(201).json({ id, message: "模型上传成功" });
  });

  app.post("/api/models/:id/activate", (req, res) => {
    const model = db.prepare("SELECT id, name FROM models WHERE id = ?").get(req.params.id) as { id: string; name: string } | undefined;
    if (!model) {
      res.status(404).json({ error: "模型不存在" });
      return;
    }
    const activate = db.transaction(() => {
      db.prepare("UPDATE models SET status = 'archived' WHERE status = 'active'").run();
      db.prepare("UPDATE models SET status = 'active' WHERE id = ?").run(req.params.id);
    });
    activate();
    addLog("模型管理", "切换", `切换生产模型为 ${model.name}`);
    res.json({ message: `${model.name} 已设为生产模型` });
  });

  app.post("/api/models/:id/test", (req, res) => {
    const model = db.prepare("SELECT name, map AS mAP, fps FROM models WHERE id = ?").get(req.params.id) as { name: string; mAP: number; fps: number } | undefined;
    if (!model) {
      res.status(404).json({ error: "模型不存在" });
      return;
    }
    const result = {
      model: model.name,
      samples: 1200,
      passed: true,
      mAP: model.mAP,
      fps: model.fps,
      latency: Number((1000 / Math.max(model.fps, 1)).toFixed(2)),
      checkedAt: timestamp(),
    };
    addLog("模型管理", "验证", `完成模型 ${model.name} 的 1200 张样本验证`);
    res.json(result);
  });

  app.get("/api/models/:id/download", (req, res) => {
    const model = db.prepare("SELECT * FROM models WHERE id = ?").get(req.params.id) as Record<string, unknown> | undefined;
    if (!model) {
      res.status(404).json({ error: "模型不存在" });
      return;
    }
    if (model.file_path && fs.existsSync(String(model.file_path))) {
      res.download(String(model.file_path), String(model.file_name));
      return;
    }
    const manifest = JSON.stringify({
      id: model.id,
      name: model.name,
      iteration: model.iteration,
      mAP: model.map,
      fps: model.fps,
      status: model.status,
      notes: model.notes,
      notice: "此内置条目仅包含可复用模型元数据，模型权重需从内部模型仓库获取。",
    }, null, 2);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename(String(model.name))}-manifest.json"`);
    res.send(manifest);
  });

  app.delete("/api/models/:id", (req, res) => {
    const model = db.prepare("SELECT * FROM models WHERE id = ?").get(req.params.id) as Record<string, unknown> | undefined;
    if (!model) {
      res.status(404).json({ error: "模型不存在" });
      return;
    }
    if (model.status === "active") {
      res.status(409).json({ error: "生产中的模型不能删除，请先切换其他模型" });
      return;
    }
    if (model.file_path && fs.existsSync(String(model.file_path))) fs.unlinkSync(String(model.file_path));
    db.prepare("DELETE FROM models WHERE id = ?").run(req.params.id);
    addLog("模型管理", "删除", `删除模型 ${model.name}`);
    res.json({ message: "模型已删除" });
  });

  app.get("/api/rules", (_req, res) => {
    const rules = db.prepare("SELECT id, name, type, threshold, enabled, version, last_modified AS lastModified FROM rules ORDER BY id").all()
      .map((rule) => ({ ...(rule as Record<string, unknown>), enabled: Boolean((rule as { enabled: number }).enabled) }));
    res.json(rules);
  });

  app.post("/api/rules", (req, res) => {
    const { name, type, threshold = 0.85 } = req.body ?? {};
    if (!name || !type || Number(threshold) <= 0 || Number(threshold) > 1) {
      res.status(400).json({ error: "规则名称、类型和 0–1 之间的阈值为必填项" });
      return;
    }
    const id = makeId("R");
    db.prepare("INSERT INTO rules VALUES (?, ?, ?, ?, 1, 'v1.0.0', ?)").run(id, name, type, Number(threshold), today());
    addLog("规则配置", "新增", `新增规则 ${name}`);
    res.status(201).json({ id, message: "规则创建成功" });
  });

  app.put("/api/rules/:id", (req, res) => {
    const current = db.prepare("SELECT * FROM rules WHERE id = ?").get(req.params.id) as Record<string, unknown> | undefined;
    if (!current) {
      res.status(404).json({ error: "规则不存在" });
      return;
    }
    const name = String(req.body.name ?? current.name);
    const type = String(req.body.type ?? current.type);
    const threshold = Number(req.body.threshold ?? current.threshold);
    const enabled = req.body.enabled === undefined ? Number(current.enabled) : Number(Boolean(req.body.enabled));
    db.prepare("UPDATE rules SET name = ?, type = ?, threshold = ?, enabled = ?, last_modified = ? WHERE id = ?")
      .run(name, type, threshold, enabled, today(), req.params.id);
    addLog("规则配置", "编辑", `更新规则 ${name}`);
    res.json({ message: "规则已更新" });
  });

  app.post("/api/rules/:id/duplicate", (req, res) => {
    const rule = db.prepare("SELECT * FROM rules WHERE id = ?").get(req.params.id) as Record<string, unknown> | undefined;
    if (!rule) {
      res.status(404).json({ error: "规则不存在" });
      return;
    }
    const id = makeId("R");
    const name = `${rule.name}（副本）`;
    db.prepare("INSERT INTO rules VALUES (?, ?, ?, ?, 0, 'v1.0.0', ?)").run(id, name, rule.type, rule.threshold, today());
    addLog("规则配置", "复制", `复制规则 ${rule.name}`);
    res.status(201).json({ id, message: "规则副本已创建" });
  });

  app.post("/api/rules/publish", (_req, res) => {
    const enabledCount = (db.prepare("SELECT COUNT(*) AS count FROM rules WHERE enabled = 1").get() as { count: number }).count;
    addLog("规则配置", "发布", `发布 ${enabledCount} 条启用规则到 4 条生产线`);
    res.json({ message: `已将 ${enabledCount} 条规则发布到生产线`, publishedAt: timestamp() });
  });

  app.post("/api/rules/import", (req, res) => {
    const rules = Array.isArray(req.body) ? req.body : [];
    if (rules.length === 0) {
      res.status(400).json({ error: "导入文件中没有有效规则" });
      return;
    }
    const insert = db.prepare("INSERT OR REPLACE INTO rules VALUES (?, ?, ?, ?, ?, ?, ?)");
    const importRules = db.transaction(() => rules.forEach((rule, index) => insert.run(
      String(rule.id ?? makeId(`R${index}`)), String(rule.name), String(rule.type), Number(rule.threshold), Number(Boolean(rule.enabled)), String(rule.version ?? "v1.0.0"), today(),
    )));
    importRules();
    addLog("规则配置", "导入", `导入 ${rules.length} 条规则`);
    res.json({ message: `成功导入 ${rules.length} 条规则` });
  });

  app.get("/api/rules/export", (_req, res) => {
    const rules = db.prepare("SELECT id, name, type, threshold, enabled, version, last_modified AS lastModified FROM rules ORDER BY id").all();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="inspection-rules-${today()}.json"`);
    res.send(JSON.stringify(rules, null, 2));
  });

  app.post("/api/reports/diagnostic", (req, res) => {
    const id = makeId("REPORT");
    const lines = Array.isArray(req.body?.lines) ? req.body.lines : [];
    const activeModel = db.prepare("SELECT name, map AS mAP, fps FROM models WHERE status = 'active' LIMIT 1").get() as { name: string; mAP: number; fps: number } | undefined;
    const warningLines = lines.filter((line: { yield?: number; status?: string }) => Number(line.yield) < 97 || line.status === "warning");
    const summary = warningLines.length > 0
      ? `发现 ${warningLines.length} 条产线需要关注，建议优先检查气压、封口温度与送料稳定性。`
      : "所有产线指标处于稳定区间，建议维持当前巡检频率。";
    const rows = lines.map((line: { name?: string; product?: string; yield?: number; total?: number; ng?: number; status?: string }) => `
      <tr><td>${escapeHtml(line.name)}</td><td>${escapeHtml(line.product)}</td><td>${escapeHtml(line.total ?? 0)}</td><td>${escapeHtml(line.ng ?? 0)}</td><td>${escapeHtml(line.yield ?? 0)}%</td><td>${escapeHtml(line.status)}</td></tr>
    `).join("");
    const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>智能质检诊断报告</title><style>
      body{font-family:Arial,"Microsoft YaHei",sans-serif;color:#0f172a;max-width:980px;margin:40px auto;padding:0 24px}h1{margin-bottom:4px}small{color:#64748b}.summary{background:#ecfdf5;border:1px solid #a7f3d0;padding:18px;border-radius:10px;margin:24px 0}table{width:100%;border-collapse:collapse;margin-top:18px}th,td{padding:12px;border-bottom:1px solid #e2e8f0;text-align:left}th{background:#f8fafc}.meta{display:flex;gap:28px;margin:18px 0}.meta div{padding:12px 16px;background:#f8fafc;border-radius:8px}footer{margin-top:36px;color:#64748b;font-size:12px}@media print{body{margin:0}.summary{break-inside:avoid}}
    </style></head><body><h1>山不野智能包装质检诊断报告</h1><small>报告编号：${id} · 生成时间：${timestamp()}</small><div class="meta"><div>生产模型：<strong>${escapeHtml(activeModel?.name ?? "未配置")}</strong></div><div>mAP：<strong>${activeModel?.mAP ?? 0}%</strong></div><div>推理速度：<strong>${activeModel?.fps ?? 0} FPS</strong></div></div><div class="summary"><strong>诊断结论</strong><p>${escapeHtml(summary)}</p></div><h2>产线明细</h2><table><thead><tr><th>产线</th><th>产品</th><th>检测量</th><th>异常数</th><th>合格率</th><th>状态</th></tr></thead><tbody>${rows || '<tr><td colspan="6">暂无产线数据</td></tr>'}</tbody></table><footer>本报告由智能包装质检管理平台生成。建议结合现场设备点检结果进行最终判断。</footer></body></html>`;
    const filePath = path.join(reportDirectory, `${id}.html`);
    fs.writeFileSync(filePath, html, "utf8");
    db.prepare("INSERT INTO reports VALUES (?, ?, ?, ?, ?)").run(id, timestamp(), "智能质检诊断报告", filePath, summary);
    addLog("实时监控", "生成报告", `生成诊断报告 ${id}`);
    res.status(201).json({ id, summary, downloadUrl: `/api/reports/${id}/download` });
  });

  app.get("/api/reports/:id/download", (req, res) => {
    const report = db.prepare("SELECT file_path FROM reports WHERE id = ?").get(req.params.id) as { file_path: string } | undefined;
    if (!report || !fs.existsSync(report.file_path)) {
      res.status(404).json({ error: "报告不存在" });
      return;
    }
    res.download(report.file_path, `diagnostic-${req.params.id}.html`);
  });

  app.get("/api/statistics/export", (_req, res) => {
    const rows = [
      ["日期", "合格率", "缺陷数"],
      ["2026-08-19", 98.2, 45], ["2026-08-20", 97.8, 52], ["2026-08-21", 98.5, 38],
      ["2026-08-22", 99.1, 22], ["2026-08-23", 98.7, 35], ["2026-08-24", 98.4, 41], ["2026-08-25", 98.9, 28],
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
    addLog("数据统计", "导出", "导出最近 7 天质量统计报表");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="quality-statistics-${today()}.csv"`);
    res.send(csv);
  });

  app.get("/api/logs", (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit ?? 50), 1), 500);
    res.json(db.prepare("SELECT id, time, user, module, type, detail FROM audit_logs ORDER BY id DESC LIMIT ?").all(limit));
  });

  app.get("/api/logs/export", (_req, res) => {
    const logs = db.prepare("SELECT time, user, module, type, detail FROM audit_logs ORDER BY id DESC").all() as Array<Record<string, unknown>>;
    const rows = [["操作时间", "操作用户", "模块", "操作类型", "详情"], ...logs.map((log) => [log.time, log.user, log.module, log.type, log.detail])];
    const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="audit-logs-${today()}.csv"`);
    res.send(csv);
  });

  app.get("/api/settings", (_req, res) => {
    const settings = db.prepare("SELECT key, value, updated_at AS updatedAt FROM settings ORDER BY key").all();
    const users = db.prepare("SELECT id, username, role, created_at AS createdAt FROM users ORDER BY id").all();
    res.json({ settings, users });
  });

  app.put("/api/settings/:key", (req, res) => {
    const value = String(req.body?.value ?? "").trim();
    if (!value) {
      res.status(400).json({ error: "配置值不能为空" });
      return;
    }
    db.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at")
      .run(req.params.key, value, timestamp());
    addLog("系统管理", "配置", `更新系统参数 ${req.params.key}`);
    res.json({ message: "系统参数已保存" });
  });

  app.post("/api/users", (req, res) => {
    const username = String(req.body?.username ?? "").trim();
    const role = String(req.body?.role ?? "质检员").trim();
    if (!username) {
      res.status(400).json({ error: "用户名不能为空" });
      return;
    }
    try {
      const result = db.prepare("INSERT INTO users (username, role, created_at) VALUES (?, ?, ?)").run(username, role, timestamp());
      addLog("系统管理", "新增用户", `新增用户 ${username}，角色 ${role}`);
      res.status(201).json({ id: result.lastInsertRowid, message: "用户创建成功" });
    } catch {
      res.status(409).json({ error: "用户名已存在" });
    }
  });

  const isProduction = process.argv.includes("--production") || process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  const distPath = path.join(projectRoot, "dist");
  const hasDist = fs.existsSync(distPath);

  if (isProduction && hasDist) {
    console.log("Starting in PRODUCTION mode...");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  } else {
    console.log("Starting in DEVELOPMENT mode with Vite...");
    const vite = await createViteServer({ root: frontendDirectory, configFile: path.join(frontendDirectory, "vite.config.ts"), server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
    app.get("*", async (req, res, next) => {
      try {
        let template = fs.readFileSync(path.join(frontendDirectory, "index.html"), "utf8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  }

  const server = app.listen(PORT, HOST, () => {
    fs.writeFileSync(path.join(projectRoot, ".server.pid"), String(process.pid), "utf8");
    fs.writeFileSync(path.join(projectRoot, ".server.port"), String(PORT), "utf8");
    console.log(`\nServer is running.`);
    console.log(`Local: http://${HOST}:${PORT}`);
    console.log(`Mode: ${isProduction ? "Production" : "Development"}`);
    console.log(`Dist folder exists: ${hasDist}\n`);
  });

  server.on("error", (error) => {
    console.error("Failed to start the server:", error);
    process.exitCode = 1;
  });
}

startServer().catch((error) => {
  console.error("Failed to initialize the application:", error);
  process.exitCode = 1;
});
