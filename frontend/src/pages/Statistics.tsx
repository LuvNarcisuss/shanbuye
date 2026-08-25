import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Calendar, 
  Filter, 
  Download, 
  Printer, 
  FileText, 
  ChevronDown,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { downloadFrom } from '../lib/api';
import { notify } from '../components/Toast';

const data = [
  { name: '03-15', yield: 98.2, defects: 45 },
  { name: '03-16', yield: 97.8, defects: 52 },
  { name: '03-17', yield: 98.5, defects: 38 },
  { name: '03-18', yield: 99.1, defects: 22 },
  { name: '03-19', yield: 98.7, defects: 35 },
  { name: '03-20', yield: 98.4, defects: 41 },
  { name: '03-21', yield: 98.9, defects: 28 },
];

const defectData = [
  { name: '封口不良', value: 400 },
  { name: '异物', value: 300 },
  { name: '漏装', value: 200 },
  { name: '标签偏移', value: 100 },
];

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

export default function Statistics() {
  const [range, setRange] = useState<'最近7天' | '最近30天'>('最近7天');
  const [showDetails, setShowDetails] = useState(false);
  const [sortDefects, setSortDefects] = useState(false);
  const displayedDefects = sortDefects ? [...defectData].sort((a, b) => b.value - a.value) : defectData;

  const exportReport = () => {
    downloadFrom('/api/statistics/export');
    notify('质量统计报表开始下载');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">数据统计与质量分析</h1>
          <p className="text-slate-500 text-sm">多维度生产质量透视，辅助工艺优化决策</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setRange(range === '最近7天' ? '最近30天' : '最近7天'); notify(`统计周期已切换为${range === '最近7天' ? '最近30天' : '最近7天'}`, 'info'); }} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {range} <ChevronDown className="w-3 h-3" />
          </button>
          <button onClick={exportReport} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> 导出报表
          </button>
          <button onClick={() => window.print()} className="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
            <Printer className="w-4 h-4" /> 打印
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">本周总缺陷数</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-900">261</h3>
            <div className="flex items-center text-emerald-500 text-xs font-bold mb-1">
              <TrendingDown className="w-4 h-4 mr-1" /> 12.5%
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-3/4"></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">平均合格率</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-900">98.51%</h3>
            <div className="flex items-center text-emerald-500 text-xs font-bold mb-1">
              <TrendingUp className="w-4 h-4 mr-1" /> 0.4%
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[98%]"></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">主要缺陷类型</p>
          <div className="flex items-end justify-between">
            <h3 className="text-xl font-bold text-slate-900">封口不良</h3>
            <span className="text-xs text-slate-400 font-bold mb-1">占比 42%</span>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-2/5"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Yield Trend */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800">合格率趋势分析</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-slate-500">合格率 (%)</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  domain={[95, 100]}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="#10B981" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Defect Distribution */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800">缺陷类型分布</h3>
            <button onClick={() => { setSortDefects(!sortDefects); notify(sortDefects ? '已恢复默认缺陷顺序' : '已按缺陷数量排序', 'info'); }} className={`p-2 rounded-lg transition-colors ${sortDefects ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-50 text-slate-400'}`} title="切换排序">
              <Filter className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[240px] w-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={defectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {defectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4">
              {displayedDefects.map((item) => {
                const colorIndex = defectData.findIndex((entry) => entry.name === item.name);
                return (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[colorIndex] }}></div>
                    <span className="text-sm font-medium text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{item.value}</span>
                </div>
              );})}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table Placeholder */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">缺陷明细记录</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowDetails(!showDetails)} className="px-4 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all">
              {showDetails ? '收起明细' : '查看全部明细'}
            </button>
          </div>
        </div>
        {showDetails ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="py-3">日期</th><th>合格率</th><th>缺陷数</th><th>判断</th></tr></thead><tbody>{data.map((row) => <tr key={row.name} className="border-b border-slate-100"><td className="py-3 font-mono">{row.name}</td><td>{row.yield}%</td><td>{row.defects}</td><td><span className={`rounded-full px-2 py-1 text-xs font-bold ${row.yield >= 98 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{row.yield >= 98 ? '稳定' : '关注'}</span></td></tr>)}</tbody></table></div> : <div className="flex flex-col items-center justify-center py-12 text-slate-400"><FileText className="w-12 h-12 mb-4 opacity-20" /><p className="text-sm">点击“查看全部明细”以加载完整历史数据</p></div>}
      </div>
    </div>
  );
}
