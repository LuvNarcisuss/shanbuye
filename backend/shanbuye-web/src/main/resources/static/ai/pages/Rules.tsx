import React, { useState } from 'react';
import { 
  Plus, 
  Copy, 
  Play, 
  Pause, 
  History, 
  Download, 
  Upload, 
  Search, 
  Filter,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Rule } from '../types';

const mockRules: Rule[] = [
  { id: '1', name: '封口不良判定', type: '缺陷检测', threshold: 0.85, enabled: true, version: 'v1.2.0', lastModified: '2025-03-20' },
  { id: '2', name: '异物识别', type: '异物检测', threshold: 0.92, enabled: true, version: 'v2.1.0', lastModified: '2025-03-18' },
  { id: '3', name: '漏装检测', type: '完整性检测', threshold: 0.80, enabled: false, version: 'v1.0.5', lastModified: '2025-03-15' },
  { id: '4', name: '标签偏移', type: '位置检测', threshold: 0.75, enabled: true, version: 'v1.1.2', lastModified: '2025-03-10' },
];

export default function Rules() {
  const [rules, setRules] = useState<Rule[]>(mockRules);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">规则与分拣策略配置</h1>
          <p className="text-slate-500 text-sm">管理缺陷判定逻辑、分拣阈值及生效策略</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> 导出
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Upload className="w-4 h-4" /> 导入
          </button>
          <button className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
            <Plus className="w-4 h-4" /> 新增规则
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索规则名称、类型..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2">
          <Filter className="w-4 h-4" /> 筛选
        </button>
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-all flex items-center gap-2">
          <Play className="w-4 h-4" /> 发布配置
        </button>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">规则名称</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">检测类型</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">判定阈值</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">当前版本</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">状态</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">最后修改</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{rule.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">ID: {rule.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                    {rule.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${rule.threshold * 100}%` }}></div>
                    </div>
                    <span className="text-sm font-mono font-bold text-slate-700">{(rule.threshold * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">{rule.version}</td>
                <td className="px-6 py-4">
                  <button 
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      rule.enabled 
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {rule.enabled ? <CheckCircle2 className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                    {rule.enabled ? '已启用' : '已停用'}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{rule.lastModified}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="编辑">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="复制">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="历史版本">
                      <History className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Validation Alert */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-blue-900">配置生效提示</h4>
          <p className="text-xs text-blue-700 mt-1">
            修改规则后需点击“发布配置”方可推送到生产线。系统会自动进行冲突校验，确保同一工位不会存在互斥规则。
          </p>
        </div>
      </div>
    </div>
  );
}
