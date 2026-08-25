import React, { useEffect, useRef, useState } from 'react';
import { Plus, Copy, Play, Pause, History, Download, Upload, Search, Filter, CheckCircle2, AlertCircle, MoreVertical, Edit2, Loader2 } from 'lucide-react';
import { Rule } from '../types';
import { api, downloadFrom } from '../lib/api';
import { notify } from '../components/Toast';
import Modal from '../components/Modal';

const emptyForm = { name: '', type: '缺陷检测', threshold: '0.85' };

export default function Rules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [enabledOnly, setEnabledOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [historyRule, setHistoryRule] = useState<Rule | null>(null);
  const [editing, setEditing] = useState<Rule | null>(null);
  const [form, setForm] = useState(emptyForm);
  const importInput = useRef<HTMLInputElement>(null);

  const loadRules = async () => {
    try { setRules(await api<Rule[]>('/api/rules')); }
    catch (error) { notify((error as Error).message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadRules(); }, []);

  const filteredRules = rules.filter((rule) => (!enabledOnly || rule.enabled) && `${rule.name}${rule.type}`.toLowerCase().includes(searchTerm.toLowerCase()));

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (rule: Rule) => { setEditing(rule); setForm({ name: rule.name, type: rule.type, threshold: String(rule.threshold) }); setModalOpen(true); };

  const saveRule = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await api<{ message: string }>(editing ? `/api/rules/${editing.id}` : '/api/rules', {
        method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, type: form.type, threshold: Number(form.threshold) }),
      });
      notify(result.message); setModalOpen(false); await loadRules();
    } catch (error) { notify((error as Error).message, 'error'); }
  };

  const toggleRule = async (rule: Rule) => {
    try {
      await api(`/api/rules/${rule.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: !rule.enabled }) });
      notify(`${rule.name} 已${rule.enabled ? '停用' : '启用'}`); await loadRules();
    } catch (error) { notify((error as Error).message, 'error'); }
  };

  const duplicateRule = async (rule: Rule) => {
    try { const result = await api<{ message: string }>(`/api/rules/${rule.id}/duplicate`, { method: 'POST' }); notify(result.message); await loadRules(); }
    catch (error) { notify((error as Error).message, 'error'); }
  };

  const publishRules = async () => {
    try { const result = await api<{ message: string }>('/api/rules/publish', { method: 'POST' }); notify(result.message); }
    catch (error) { notify((error as Error).message, 'error'); }
  };

  const importRules = async (file: File) => {
    try {
      const content = JSON.parse(await file.text());
      const result = await api<{ message: string }>('/api/rules/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) });
      notify(result.message); await loadRules();
    } catch (error) { notify(`导入失败：${(error as Error).message}`, 'error'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">规则与分拣策略配置</h1><p className="text-sm text-slate-500">管理缺陷判定逻辑、分拣阈值及生效策略</p></div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => downloadFrom('/api/rules/export')} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><Download className="h-4 w-4" /> 导出</button>
          <input ref={importInput} type="file" accept="application/json,.json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importRules(file); event.currentTarget.value = ''; }} />
          <button onClick={() => importInput.current?.click()} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><Upload className="h-4 w-4" /> 导入</button>
          <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700"><Plus className="h-4 w-4" /> 新增规则</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <div className="relative min-w-60 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="搜索规则名称、类型..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm" /></div>
        <button onClick={() => setEnabledOnly(!enabledOnly)} className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold ${enabledOnly ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}><Filter className="h-4 w-4" /> {enabledOnly ? '仅看已启用' : '全部状态'}</button>
        <button onClick={publishRules} className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100"><Play className="h-4 w-4" /> 发布配置</button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-200">
        {loading ? <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-emerald-600" /></div> : <table className="w-full min-w-[900px] text-left"><thead><tr className="border-b border-slate-100 bg-slate-50"><th className="px-6 py-4 text-xs font-bold text-slate-500">规则名称</th><th className="px-6 py-4 text-xs font-bold text-slate-500">检测类型</th><th className="px-6 py-4 text-xs font-bold text-slate-500">判定阈值</th><th className="px-6 py-4 text-xs font-bold text-slate-500">当前版本</th><th className="px-6 py-4 text-xs font-bold text-slate-500">状态</th><th className="px-6 py-4 text-xs font-bold text-slate-500">最后修改</th><th className="px-6 py-4 text-right text-xs font-bold text-slate-500">操作</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{filteredRules.map((rule) => <tr key={rule.id} className="group hover:bg-slate-50"><td className="px-6 py-4"><p className="font-bold text-slate-800">{rule.name}</p><p className="font-mono text-xs text-slate-400">{rule.id}</p></td><td className="px-6 py-4 text-sm text-slate-600">{rule.type}</td><td className="px-6 py-4"><div className="flex items-center gap-2"><div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-emerald-500" style={{ width: `${rule.threshold * 100}%` }} /></div><span className="font-mono text-sm font-bold">{(rule.threshold * 100).toFixed(0)}%</span></div></td><td className="px-6 py-4 font-mono text-sm text-slate-500">{rule.version}</td><td className="px-6 py-4"><button onClick={() => toggleRule(rule)} className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${rule.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{rule.enabled ? <CheckCircle2 className="h-3 w-3" /> : <Pause className="h-3 w-3" />}{rule.enabled ? '已启用' : '已停用'}</button></td><td className="px-6 py-4 text-sm text-slate-500">{rule.lastModified}</td><td className="px-6 py-4"><div className="flex justify-end gap-1"><button onClick={() => openEdit(rule)} className="rounded-lg p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600" title="编辑"><Edit2 className="h-4 w-4" /></button><button onClick={() => duplicateRule(rule)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600" title="复制"><Copy className="h-4 w-4" /></button><button onClick={() => setHistoryRule(rule)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="历史版本"><History className="h-4 w-4" /></button><button onClick={() => openEdit(rule)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="更多详情"><MoreVertical className="h-4 w-4" /></button></div></td></tr>)}</tbody></table>}
        {!loading && filteredRules.length === 0 && <div className="py-16 text-center text-sm text-slate-500">没有匹配的规则</div>}
      </div>

      <div className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4"><AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" /><div><h4 className="text-sm font-bold text-blue-900">配置生效提示</h4><p className="mt-1 text-xs text-blue-700">修改规则后需点击“发布配置”推送到生产线，系统会记录发布操作并进行启用状态校验。</p></div></div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? '编辑规则' : '新增规则'}>
        <form onSubmit={saveRule} className="space-y-4"><label className="block text-sm font-bold text-slate-700">规则名称<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label><label className="block text-sm font-bold text-slate-700">检测类型<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal"><option>缺陷检测</option><option>异物检测</option><option>完整性检测</option><option>位置检测</option></select></label><label className="block text-sm font-bold text-slate-700">判定阈值：{Math.round(Number(form.threshold) * 100)}%<input type="range" min="0.5" max="0.99" step="0.01" value={form.threshold} onChange={(event) => setForm({ ...form, threshold: event.target.value })} className="mt-3 w-full accent-emerald-600" /></label><button className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700">保存规则</button></form>
      </Modal>

      <Modal open={Boolean(historyRule)} onClose={() => setHistoryRule(null)} title="规则版本记录">
        {historyRule && <div className="space-y-3"><div className="rounded-xl bg-slate-50 p-4"><div className="flex items-center justify-between"><span className="font-bold text-slate-800">{historyRule.version}</span><span className="text-xs text-emerald-700">当前版本</span></div><p className="mt-2 text-sm text-slate-500">{historyRule.lastModified} 更新，判定阈值为 {(historyRule.threshold * 100).toFixed(0)}%。</p></div><p className="text-xs text-slate-500">后续每次发布可在此扩展完整版本差异记录。</p></div>}
      </Modal>
    </div>
  );
}
