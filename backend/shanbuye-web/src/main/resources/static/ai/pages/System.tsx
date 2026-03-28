import React from 'react';
import { 
  Users, 
  Shield, 
  Settings as SettingsIcon, 
  History, 
  Database, 
  Globe, 
  Lock,
  ChevronRight,
  UserPlus
} from 'lucide-react';

export default function System() {
  const sections = [
    {
      title: '用户与权限管理',
      icon: Users,
      description: '管理系统用户、角色分配及 RBAC 权限控制',
      actions: [
        { label: '新增用户', icon: UserPlus },
        { label: '角色管理', icon: Shield },
        { label: '登录审计', icon: History },
      ]
    },
    {
      title: '系统参数配置',
      icon: SettingsIcon,
      description: '配置 WebSocket 地址、报警阈值、图片保留天数等全局参数',
      actions: [
        { label: '基础参数', icon: Globe },
        { label: '存储设置', icon: Database },
        { label: '安全策略', icon: Lock },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">系统管理</h1>
        <p className="text-slate-500 text-sm">配置平台核心参数、用户权限及系统日志</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                  <section.icon className="w-7 h-7 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{section.title}</h3>
                  <p className="text-sm text-slate-500">{section.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {section.actions.map((action) => (
                  <button key={action.label} className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-all">
                    <action.icon className="w-4 h-4" /> {action.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-slate-50/50">
              <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-500 transition-all group">
                <span className="text-sm font-bold text-slate-700">查看详细设置</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Operation Logs */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">关键操作日志</h3>
          <button className="text-xs text-emerald-600 font-bold hover:underline">导出全部日志</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">操作时间</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">操作用户</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">模块</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">操作类型</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">详情</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { time: '2025-03-21 14:20:05', user: 'admin', module: '规则配置', type: '发布', detail: '发布了 封口不良判定 v1.2.0' },
                { time: '2025-03-21 13:45:12', user: 'admin', module: '模型管理', type: '切换', detail: '切换生产模型为 YOLOv8-v2.4.0' },
                { time: '2025-03-21 10:30:44', user: 'supervisor', module: '系统管理', type: '登录', detail: '用户登录系统' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4 text-sm text-slate-500 font-mono">{log.time}</td>
                  <td className="px-8 py-4 text-sm font-bold text-slate-700">{log.user}</td>
                  <td className="px-8 py-4 text-sm text-slate-600">{log.module}</td>
                  <td className="px-8 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.type === '发布' ? 'bg-emerald-100 text-emerald-700' :
                      log.type === '切换' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm text-slate-500">{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
