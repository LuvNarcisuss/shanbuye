import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Upload, Database, Clock, Zap, Shield, Trash2, Download, BarChart2, PlayCircle, ArrowUp, FileUp, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Model } from '../types';
import { api, downloadFrom } from '../lib/api';
import { notify } from '../components/Toast';
import Modal from '../components/Modal';

type ValidationResult = { model: string; samples: number; passed: boolean; mAP: number; fps: number; latency: number; checkedAt: string };

const formatBytes = (bytes = 0) => bytes === 0 ? '内置元数据' : bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;

export default function Models() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: '', iteration: '新迭代', mAP: '', fps: '', notes: '' });
  const fileInput = useRef<HTMLInputElement>(null);

  const loadModels = async () => {
    try {
      setModels(await api<Model[]>('/api/models'));
    } catch (error) {
      notify((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadModels(); }, []);
  const activeModel = models.find((model) => model.status === 'active') ?? models[0];
  const baseline = useMemo(() => [...models].sort((a, b) => a.uploadDate.localeCompare(b.uploadDate))[0], [models]);

  const activateModel = async (model: Model) => {
    setBusyId(model.id);
    try {
      const result = await api<{ message: string }>(`/api/models/${model.id}/activate`, { method: 'POST' });
      notify(result.message);
      await loadModels();
    } catch (error) { notify((error as Error).message, 'error'); }
    finally { setBusyId(null); }
  };

  const validateModel = async (model: Model) => {
    setBusyId(model.id);
    try {
      setValidation(await api<ValidationResult>(`/api/models/${model.id}/test`, { method: 'POST' }));
    } catch (error) { notify((error as Error).message, 'error'); }
    finally { setBusyId(null); }
  };

  const deleteModel = async (model: Model) => {
    if (!window.confirm(`确认删除模型“${model.name}”吗？该操作不可撤销。`)) return;
    setBusyId(model.id);
    try {
      const result = await api<{ message: string }>(`/api/models/${model.id}`, { method: 'DELETE' });
      notify(result.message);
      await loadModels();
    } catch (error) { notify((error as Error).message, 'error'); }
    finally { setBusyId(null); }
  };

  const submitUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) { notify('请选择模型文件', 'error'); return; }
    setUploading(true);
    try {
      const result = await api<{ message: string }>('/api/models/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-File-Name': encodeURIComponent(file.name),
          'X-Model-Name': form.name,
          'X-Model-Iteration': encodeURIComponent(form.iteration),
          'X-Model-Map': form.mAP,
          'X-Model-Fps': form.fps,
          'X-Model-Notes': encodeURIComponent(form.notes),
        },
        body: file,
      });
      notify(result.message);
      setUploadOpen(false);
      setFile(null);
      setForm({ name: '', iteration: '新迭代', mAP: '', fps: '', notes: '' });
      await loadModels();
    } catch (error) { notify((error as Error).message, 'error'); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">模型资产与迭代</h1><p className="text-sm text-slate-500">上传真实模型文件，以统一指标比较迭代效果并复用历史版本</p></div>
        <button onClick={() => setUploadOpen(true)} className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800"><Upload className="h-5 w-5" /> 上传新模型</button>
      </div>

      {activeModel && (
        <section className="relative overflow-hidden rounded-2xl bg-emerald-600 p-8 text-white">
          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="space-y-4">
              <div className="flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold"><Zap className="h-3 w-3" /> 当前生产环境使用中</div>
              <div><h2 className="text-3xl font-black tracking-tight">{activeModel.name}</h2><p className="mt-1 text-sm text-emerald-100">{activeModel.iteration} · {activeModel.notes}</p></div>
              <div className="flex gap-8"><div><p className="text-xs font-bold text-emerald-100">平均精度 mAP</p><p className="text-3xl font-bold">{activeModel.mAP}%</p></div><div><p className="text-xs font-bold text-emerald-100">推理速度</p><p className="text-3xl font-bold">{activeModel.fps} FPS</p></div></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button disabled={busyId === activeModel.id} onClick={() => validateModel(activeModel)} className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60">{busyId === activeModel.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <PlayCircle className="h-5 w-5" />} 测试验证</button>
              <button onClick={() => setCompareOpen(true)} className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800"><BarChart2 className="h-5 w-5" /> 性能对比</button>
            </div>
          </div>
          <Database className="absolute -bottom-10 -right-8 h-56 w-56 text-white/10" />
        </section>
      )}

      {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div> : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {models.map((model, index) => {
            const mapDelta = baseline ? model.mAP - baseline.mAP : 0;
            const fpsDelta = baseline ? model.fps - baseline.fps : 0;
            return (
              <motion.article key={model.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`rounded-2xl bg-white p-6 ${model.status === 'active' ? 'ring-2 ring-emerald-500' : 'ring-1 ring-slate-200'}`}>
                <div className="mb-5 flex items-start justify-between"><span className={`rounded-xl p-3 ${model.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}><Shield className="h-5 w-5" /></span><span className={`rounded-full px-3 py-1 text-xs font-bold ${model.status === 'active' ? 'bg-emerald-100 text-emerald-700' : model.status === 'testing' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{model.status === 'active' ? '生产中' : model.status === 'testing' ? '灰度测试' : '已归档'}</span></div>
                <h3 className="break-all text-lg font-bold text-slate-900">{model.name}</h3><p className="mt-1 text-sm text-slate-500">{model.iteration}</p>
                <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">mAP</p><p className="text-xl font-bold text-slate-800">{model.mAP}%</p>{mapDelta > 0 && <p className="mt-1 flex items-center text-xs font-bold text-emerald-600"><ArrowUp className="h-3 w-3" /> {mapDelta.toFixed(1)}pp</p>}</div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">FPS</p><p className="text-xl font-bold text-slate-800">{model.fps}</p>{fpsDelta > 0 && <p className="mt-1 flex items-center text-xs font-bold text-emerald-600"><ArrowUp className="h-3 w-3" /> {fpsDelta}</p>}</div></div>
                <p className="mt-4 min-h-10 text-xs leading-5 text-slate-500">{model.notes}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {model.uploadDate}</span><span>{formatBytes(model.fileSize)}</span></div>
                <div className="mt-5 flex items-center gap-2">
                  {model.status !== 'active' && <button disabled={busyId === model.id} onClick={() => activateModel(model)} className="flex-1 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-60">设为生产模型</button>}
                  <button onClick={() => downloadFrom(`/api/models/${model.id}/download`)} className="rounded-xl bg-slate-100 p-2.5 text-slate-500 hover:text-blue-600" title="下载模型或清单"><Download className="h-4 w-4" /></button>
                  <button disabled={model.status === 'active' || busyId === model.id} onClick={() => deleteModel(model)} className="rounded-xl bg-slate-100 p-2.5 text-slate-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30" title="删除模型"><Trash2 className="h-4 w-4" /></button>
                </div>
              </motion.article>
            );
          })}
          <button onClick={() => setUploadOpen(true)} className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 p-8 text-slate-500 hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700"><span className="rounded-full bg-slate-100 p-4"><FileUp className="h-7 w-7" /></span><span className="font-bold">上传下一次模型迭代</span><span className="text-xs">ONNX、TensorRT、PyTorch 或其他二进制模型</span></button>
        </div>
      )}

      <Modal open={uploadOpen} onClose={() => !uploading && setUploadOpen(false)} title="上传新模型" description="文件将保存到本地模型仓库，上传后默认进入灰度测试状态。">
        <form onSubmit={submitUpload} className="space-y-4">
          <input ref={fileInput} type="file" className="hidden" accept=".onnx,.engine,.pt,.pth,.bin" onChange={(event) => { const nextFile = event.target.files?.[0] ?? null; setFile(nextFile); if (nextFile && !form.name) setForm((value) => ({ ...value, name: nextFile.name.replace(/\.[^.]+$/, '') })); }} />
          <button type="button" onClick={() => fileInput.current?.click()} className="w-full rounded-xl border-2 border-dashed border-slate-300 p-5 text-left hover:border-emerald-500"><span className="font-bold text-slate-800">{file ? file.name : '选择模型文件'}</span><span className="mt-1 block text-xs text-slate-500">{file ? formatBytes(file.size) : '最大 250 MB'}</span></button>
          <label className="block text-sm font-bold text-slate-700">模型名称<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" placeholder="例如 yolo_hrca_seg_v4" /></label>
          <label className="block text-sm font-bold text-slate-700">迭代说明<input required value={form.iteration} onChange={(event) => setForm({ ...form, iteration: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" placeholder="例如 小目标增强版" /></label>
          <div className="grid grid-cols-2 gap-4"><label className="text-sm font-bold text-slate-700">mAP (%)<input required type="number" min="0" max="100" step="0.1" value={form.mAP} onChange={(event) => setForm({ ...form, mAP: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label><label className="text-sm font-bold text-slate-700">FPS<input required type="number" min="1" value={form.fps} onChange={(event) => setForm({ ...form, fps: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label></div>
          <label className="block text-sm font-bold text-slate-700">备注<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="mt-2 min-h-20 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" placeholder="记录训练集、结构变化和适用场景" /></label>
          <button disabled={uploading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60">{uploading && <Loader2 className="h-4 w-4 animate-spin" />}{uploading ? '正在上传…' : '上传并登记模型'}</button>
        </form>
      </Modal>

      <Modal open={compareOpen} onClose={() => setCompareOpen(false)} title="模型迭代对比" description="所有版本采用同一组核心指标，可直接观察精度与吞吐变化。" width="max-w-3xl">
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="py-3">模型</th><th>迭代</th><th>mAP</th><th>相对基线</th><th>FPS</th><th>状态</th></tr></thead><tbody>{models.map((model) => <tr key={model.id} className="border-b border-slate-100"><td className="py-4 font-bold text-slate-800">{model.name}</td><td>{model.iteration}</td><td>{model.mAP}%</td><td className="font-bold text-emerald-600">{baseline ? `+${(model.mAP - baseline.mAP).toFixed(1)}pp` : '-'}</td><td>{model.fps}</td><td>{model.status === 'active' ? '生产中' : model.status === 'testing' ? '灰度测试' : '已归档'}</td></tr>)}</tbody></table></div>
      </Modal>

      <Modal open={Boolean(validation)} onClose={() => setValidation(null)} title="模型验证结果">
        {validation && <div className="space-y-4"><div className="rounded-xl bg-emerald-50 p-4 text-emerald-800"><p className="font-bold">验证通过</p><p className="mt-1 text-sm">{validation.samples} 张样本已完成一致性检查。</p></div><dl className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">mAP</dt><dd className="mt-1 text-xl font-bold">{validation.mAP}%</dd></div><div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">FPS</dt><dd className="mt-1 text-xl font-bold">{validation.fps}</dd></div><div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">单帧延迟</dt><dd className="mt-1 text-xl font-bold">{validation.latency} ms</dd></div><div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">完成时间</dt><dd className="mt-1 font-bold">{validation.checkedAt}</dd></div></dl></div>}
      </Modal>
    </div>
  );
}
