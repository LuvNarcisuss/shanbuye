import React, { useEffect, useState } from 'react';
import { Users, Shield, Settings as SettingsIcon, History, Database, Globe, Lock, ChevronRight, UserPlus, Loader2 } from 'lucide-react';
import { AuditLog } from '../types';
import { api, downloadFrom } from '../lib/api';
import { notify } from '../components/Toast';
import Modal from '../components/Modal';

type SettingRow = { key: string; value: string; updatedAt: string };
type UserRow = { id: number; username: string; role: string; createdAt: string };

export default function System() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ username: '', role: '质检员' });
  const [settingValue, setSettingValue] = useState('');

  const loadData = async () => {
    try {
      const [nextLogs, systemData] = await Promise.all([api<AuditLog[]>('/api/logs?limit=100'), api<{ settings: SettingRow[]; users: UserRow[] }>('/api/settings')]);
      setLogs(nextLogs); setSettings(systemData.settings); setUsers(systemData.users);
    } catch (error) { notify((error as Error).message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadData(); }, []);

  const settingConfig: Record<string, { key: string; title: string; description: string }> = {
    '基础参数': { key: 'websocketUrl', title: '基础参数', description: '配置检测数据 WebSocket 地址' },
    '存储设置': { key: 'imageRetentionDays', title: '存储设置', description: '配置缺陷图片保留天数' },
    '安全策略': { key: 'alarmThreshold', title: '安全与报警策略', description: '配置触发连续缺陷报警的数量阈值' },
  };

  const openPanel = (label: string) => {
    setPanel(label);
    const config = settingConfig[label];
    if (config) setSettingValue(settings.find((item) => item.key === config.key)?.value ?? '');
  };

  const saveSetting = async () => {
    const config = panel ? settingConfig[panel] : undefined;
    if (!config) return;
    try {
      const result = await api<{ message: string }>(`/api/settings/${config.key}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: settingValue }) });
      notify(result.message); setPanel(null); await loadData();
    } catch (error) { notify((error as Error).message, 'error'); }
  };

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await api<{ message: string }>('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) });
      notify(result.message); setNewUser({ username: '', role: '质检员' }); setPanel(null); await loadData();
    } catch (error) { notify((error as Error).message, 'error'); }
  };

  const sections = [
    { title: '用户与权限管理', icon: Users, description: '管理系统用户、角色分配及权限审计', actions: [{ label: '新增用户', icon: UserPlus }, { label: '角色管理', icon: Shield }, { label: '登录审计', icon: History }] },
    { title: '系统参数配置', icon: SettingsIcon, description: '配置数据连接、报警阈值与存储策略', actions: [{ label: '基础参数', icon: Globe }, { label: '存储设置', icon: Database }, { label: '安全策略', icon: Lock }] },
  ];

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold text-slate-900">系统管理</h1><p className="text-sm text-slate-500">配置平台核心参数、用户权限及系统日志</p></div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">{sections.map((section) => <section key={section.title} className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"><div className="p-6"><div className="mb-5 flex items-center gap-4"><span className="rounded-xl bg-slate-100 p-3"><section.icon className="h-6 w-6 text-slate-500" /></span><div><h3 className="text-lg font-bold text-slate-800">{section.title}</h3><p className="text-sm text-slate-500">{section.description}</p></div></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{section.actions.map((action) => <button key={action.label} onClick={() => openPanel(action.label)} className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"><action.icon className="h-4 w-4" />{action.label}</button>)}</div></div><div className="bg-slate-50 p-4"><button onClick={() => openPanel(section.actions[0].label)} className="flex w-full items-center justify-between rounded-xl bg-white p-4 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:text-emerald-700"><span>查看详细设置</span><ChevronRight className="h-4 w-4" /></button></div></section>)}</div>

      <section id="audit-logs" className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"><div className="flex items-center justify-between border-b border-slate-100 p-6"><div><h3 className="font-bold text-slate-800">关键操作日志</h3><p className="mt-1 text-xs text-slate-500">共加载 {logs.length} 条真实审计记录</p></div><button onClick={() => { downloadFrom('/api/logs/export'); notify('审计日志开始下载'); }} className="text-xs font-bold text-emerald-700 hover:underline">导出全部日志</button></div>
        {loading ? <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-emerald-600" /></div> : <div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left"><thead><tr className="bg-slate-50"><th className="px-6 py-4 text-xs font-bold text-slate-500">操作时间</th><th className="px-6 py-4 text-xs font-bold text-slate-500">操作用户</th><th className="px-6 py-4 text-xs font-bold text-slate-500">模块</th><th className="px-6 py-4 text-xs font-bold text-slate-500">操作类型</th><th className="px-6 py-4 text-xs font-bold text-slate-500">详情</th></tr></thead><tbody className="divide-y divide-slate-100">{logs.map((log) => <tr key={log.id} className="hover:bg-slate-50"><td className="px-6 py-4 font-mono text-sm text-slate-500">{log.time}</td><td className="px-6 py-4 text-sm font-bold text-slate-700">{log.user}</td><td className="px-6 py-4 text-sm text-slate-600">{log.module}</td><td className="px-6 py-4"><span className="rounded bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">{log.type}</span></td><td className="px-6 py-4 text-sm text-slate-500">{log.detail}</td></tr>)}</tbody></table></div>}
      </section>

      <Modal open={panel === '新增用户'} onClose={() => setPanel(null)} title="新增系统用户"><form onSubmit={createUser} className="space-y-4"><label className="block text-sm font-bold text-slate-700">用户名<input required value={newUser.username} onChange={(event) => setNewUser({ ...newUser, username: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label><label className="block text-sm font-bold text-slate-700">角色<select value={newUser.role} onChange={(event) => setNewUser({ ...newUser, role: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal"><option>质检员</option><option>生产主管</option><option>系统管理员</option></select></label><button className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white">创建用户</button></form></Modal>
      <Modal open={panel === '角色管理'} onClose={() => setPanel(null)} title="用户与角色"><div className="space-y-3">{users.map((user) => <div key={user.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><div><p className="font-bold text-slate-800">{user.username}</p><p className="text-xs text-slate-500">创建于 {user.createdAt}</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">{user.role}</span></div>)}</div></Modal>
      <Modal open={panel === '登录审计'} onClose={() => setPanel(null)} title="登录与操作审计"><div className="space-y-3">{logs.slice(0, 10).map((log) => <div key={log.id} className="rounded-xl border border-slate-200 p-3"><div className="flex justify-between text-xs text-slate-500"><span>{log.user} · {log.module}</span><span>{log.time}</span></div><p className="mt-1 text-sm font-medium text-slate-700">{log.detail}</p></div>)}</div></Modal>
      <Modal open={Boolean(panel && settingConfig[panel])} onClose={() => setPanel(null)} title={panel ? settingConfig[panel]?.title ?? '' : ''} description={panel ? settingConfig[panel]?.description : ''}><label className="block text-sm font-bold text-slate-700">配置值<input value={settingValue} onChange={(event) => setSettingValue(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label><button onClick={saveSetting} className="mt-5 w-full rounded-xl bg-emerald-600 py-3 font-bold text-white">保存配置</button></Modal>
    </div>
  );
}
