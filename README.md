# 山不野智能包装质检管理平台

本提交包按功能分区整理，包含可运行的前后端源码、真实 SQLite 演示数据、诊断报告样例、系统截图和项目演示 PPT。核心模型统一命名为 `yolo_hrca_seg`，基线版和轻量版用于展示可复用的迭代对照。

## 快速运行

运行环境：Windows 10/11，Node.js 20 或更高版本。

1. 双击根目录的 `一键启动.bat`。
2. 首次运行会自动安装依赖并构建前端。
3. 浏览器会自动打开平台；若 3000 端口被占用，程序会自动选择 3000—3099 范围内的空闲端口。
4. 使用结束后双击 `一键关闭.bat`。

重复点击启动脚本不会创建重复实例。每次运行使用独立日志文件，保存在自动生成的 `logs/` 目录。

## 目录说明

```text
山不野智能质检平台-上传包/
├── frontend/                 # React、TypeScript 前端源码
│   ├── src/                  # 页面、组件与接口封装
│   ├── index.html
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/                  # Express、SQLite 后端
│   └── server.ts
├── model/                    # 模型命名、版本与上传说明
├── data/                     # 真实演示数据库与诊断报告样例
│   ├── inspection.db
│   └── reports/
├── docs/                     # 功能、架构与开发说明
├── presentation/             # 项目演示 PPT
├── screenshots/              # 平台及产线配图
├── scripts/                  # 一键启停的内部 PowerShell 脚本
├── package.json              # 项目依赖与构建命令
├── package-lock.json         # 锁定依赖版本
├── 一键启动.bat
└── 一键关闭.bat
```

## 常用命令

```bash
npm install
npm run build
npm run lint
npm run dev
```

## 上传说明

- 已排除 `node_modules/`、`logs/`、PID 文件、端口文件和 SQLite 临时文件。
- `data/inspection.db` 为可直接演示的业务数据库；`data/reports/` 为系统真实生成的诊断报告样例。
- 训练权重文件通常较大，本提交包不伪造权重；可通过平台“上传新模型”功能导入 ONNX、TensorRT Engine、PyTorch 或通用二进制模型。
- 如平台限制单文件大小，可单独上传 `presentation/` 中的 PPT，或使用随包生成的 ZIP 文件。
