import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Play, 
  Pause, 
  Maximize2, 
  RefreshCw,
  ArrowRight,
  Info,
  Settings,
  Box,
  Cpu,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Line } from '../types';
import ProductionLineAnimation from '../components/ProductionLineAnimation';

const PRODUCTS = [
  { id: 1, name: '罗小懒 山椒笋', brand: '罗小懒' },
  { id: 2, name: '山不野 蛋蛋脆笋', brand: '山不野' },
  { id: 3, name: '山不野 泡椒味脆脆笋', brand: '山不野' },
  { id: 4, name: '谭小泡 笋尖', brand: '谭小泡' },
];

const MODELS = [
  { id: 'yolov8m-cls', name: 'yolov8m-cls', desc: '平衡型 (推荐)', accuracy: '98.2%' },
  { id: 'yolov8s-cls', name: 'yolov8s-cls', desc: '速度型', accuracy: '96.5%' },
  { id: 'yolov8n-cls', name: 'yolov8n-cls', desc: '轻量型', accuracy: '94.1%' },
];

export default function Dashboard() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [lineAssignments, setLineAssignments] = useState<Record<number, number>>({});
  const [selectedModel] = useState('yolov8m-cls');
  
  const [lines, setLines] = useState<Line[]>([]);
  const [selectedLine, setSelectedLine] = useState<Line | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const [lineStats, setLineStats] = useState<Record<number, { total: number; ng: number }>>({});

  useEffect(() => {
    fetch('/api/lines')
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then(data => {
        setLines(data);
        initializeStatsAndAssignments(data);
      })
      .catch(() => {
        // Fallback for static deployments (like Vercel)
        const mockLines: Line[] = [
          { id: 1, name: "产线 A", status: "running", product: "罗小懒 山椒笋", yield: 98.5, speed: "120 pcs/min" },
          { id: 2, name: "产线 B", status: "running", product: "山不野 蛋蛋脆笋", yield: 99.2, speed: "150 pcs/min" },
          { id: 3, name: "产线 C", status: "warning", product: "山不野 泡椒味脆脆笋", yield: 94.1, speed: "110 pcs/min" },
          { id: 4, name: "产线 D", status: "running", product: "谭小泡 笋尖", yield: 98.8, speed: "140 pcs/min" }
        ];
        setLines(mockLines);
        initializeStatsAndAssignments(mockLines);
      });
  }, []);

  const initializeStatsAndAssignments = (data: Line[]) => {
    if (data.length > 0) setSelectedLine(data[0]);
    
    // Initialize stats for each line
    const initialStats: Record<number, { total: number; ng: number }> = {};
    const initialAssignments: Record<number, number> = {};
    data.forEach((line: Line, index: number) => {
      initialStats[line.id] = { total: 1240, ng: 0 };
      // Default assignment: line 1 -> product 1, line 2 -> product 2, etc.
      initialAssignments[line.id] = PRODUCTS[index % PRODUCTS.length].id;
    });
    setLineStats(initialStats);
    setLineAssignments(initialAssignments);
  };

  const handleScan = (lineId: number, status: 'ok' | 'ng') => {
    setLineStats(prev => ({
      ...prev,
      [lineId]: {
        total: (prev[lineId]?.total || 0) + 1,
        ng: (prev[lineId]?.ng || 0) + (status === 'ng' ? 1 : 0)
      }
    }));
  };

  const handleStart = () => {
    setIsConfigured(true);
  };

  if (!isConfigured) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 py-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">生产线启动配置</h1>
          <p className="text-slate-500">请为每条生产线选择需要生产的产品</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 space-y-6">
            {lines.map((line, index) => (
              <div key={line.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-slate-400">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{line.name}</h3>
                    <p className="text-xs text-slate-400">产线 ID: {line.id}</p>
                  </div>
                </div>
                
                <div className="flex-1 max-w-xs">
                  <select 
                    value={lineAssignments[line.id] || ''}
                    onChange={(e) => setLineAssignments(prev => ({ ...prev, [line.id]: Number(e.target.value) }))}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  >
                    {PRODUCTS.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
            <button
              onClick={handleStart}
              className="px-12 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-3"
            >
              启动生产监控 <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium">AI 模型已就绪</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium">传感器连接正常</span>
          </div>
        </div>
      </div>
    );
  }

  const filteredLines = lines; // All lines are shown, but with their assigned products

  const totalProduction = Object.values(lineStats).reduce((acc, curr) => acc + (curr as any).total, 0) as number;
  const totalNG = Object.values(lineStats).reduce((acc, curr) => acc + (curr as any).ng, 0) as number;
  const avgYield = totalProduction > 0 ? ((totalProduction - totalNG) / totalProduction * 100).toFixed(1) : '98.2';

  const stats = [
    { label: '今日总产量', value: totalProduction.toLocaleString(), icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '平均合格率', value: `${avgYield}%`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '当前报警数', value: totalNG.toString(), icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: '运行中产线', value: `${filteredLines.length}/4`, icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const getAssignedProduct = (lineId: number) => {
    const productId = lineAssignments[lineId];
    return PRODUCTS.find(p => p.id === productId)?.name || '未知产品';
  };

  const activeLines = isGridView ? filteredLines : (selectedLine ? [selectedLine] : []);

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5"
          >
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Real-time Monitoring Feed */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-900">实时监控看板</h2>
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                <button 
                  onClick={() => setIsGridView(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!isGridView ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  单屏
                </button>
                <button 
                  onClick={() => setIsGridView(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isGridView ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  多屏
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsConfigured(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <Settings className="w-4 h-4" /> 重新配置
              </button>
              <button 
                onClick={() => setIsRefreshing(!isRefreshing)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isRefreshing ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}
              >
                {isRefreshing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRefreshing ? '暂停监控' : '恢复监控'}
              </button>
            </div>
          </div>

          <div className={`grid gap-6 ${isGridView && activeLines.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {activeLines.map((line) => (
              <div key={line.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden group">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${line.status === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                    <span className="font-bold text-slate-800">{line.name}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold">{getAssignedProduct(line.id)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-blue-600">{selectedModel}</span>
                    <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                      <Maximize2 className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
                
                <div className="aspect-video bg-slate-900 relative">
                  <ProductionLineAnimation 
                    productName={getAssignedProduct(line.id)} 
                    isPaused={!isRefreshing} 
                    onScan={(status) => handleScan(line.id, status)}
                  />
                  
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-right">
                      <p className="text-[8px] uppercase tracking-wider opacity-60 font-bold">合格率</p>
                      <p className="text-xs font-bold font-mono">
                        {lineStats[line.id]?.total > 0 
                          ? ((lineStats[line.id].total - lineStats[line.id].ng) / lineStats[line.id].total * 100).toFixed(1) 
                          : line.yield}%
                      </p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-right">
                      <p className="text-[8px] uppercase tracking-wider opacity-60 font-bold">速度</p>
                      <p className="text-xs font-bold font-mono">{line.speed}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-400 font-bold uppercase">实时产量</span>
                      <span className="text-sm font-bold text-slate-700">{(lineStats[line.id]?.total || 0).toLocaleString()}</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-400 font-bold uppercase">异常数</span>
                      <span className="text-sm font-bold text-amber-600">{lineStats[line.id]?.ng || 0}</span>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-800">多产线协同监控模式</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              当前系统已开启多产线协同监控。AI 模型 <strong>{selectedModel}</strong> 正在同时处理 <strong>{filteredLines.length}</strong> 条产线的视觉数据。
              系统会自动根据各产线的负载情况动态分配算力，确保检测延迟低于 15ms。
            </p>
          </div>
        </div>

        {/* Production Line List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">产线状态</h2>
              <button className="text-xs text-emerald-600 font-bold hover:underline">管理全部</button>
            </div>
            <div className="space-y-4">
              {filteredLines.map(line => (
                <button
                  key={line.id}
                  onClick={() => {
                    setSelectedLine(line);
                    setIsGridView(false);
                  }}
                  className={`w-full p-4 rounded-2xl border transition-all text-left group ${
                    !isGridView && selectedLine?.id === line.id 
                      ? 'border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/5' 
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">{line.name}</span>
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      line.status === 'running' ? 'bg-emerald-100 text-emerald-700' :
                      line.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {line.status === 'running' ? '运行中' : line.status === 'warning' ? '异常' : '已停止'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{getAssignedProduct(line.id)}</span>
                    <span className="font-mono">
                      {lineStats[line.id]?.total > 0 
                        ? ((lineStats[line.id].total - lineStats[line.id].ng) / lineStats[line.id].total * 100).toFixed(1) 
                        : line.yield}%
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${lineStats[line.id]?.total > 0 
                          ? ((lineStats[line.id].total - lineStats[line.id].ng) / lineStats[line.id].total * 100) 
                          : line.yield}%` 
                      }}
                      className={`h-full rounded-full ${
                        (lineStats[line.id]?.total > 0 
                          ? ((lineStats[line.id].total - lineStats[line.id].ng) / lineStats[line.id].total * 100) 
                          : line.yield) > 95 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0F172A] p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">智能诊断助手</h3>
              <p className="text-slate-400 text-sm mb-6">基于 AI 的生产线健康度分析，当前系统检测到产线 C 存在轻微波动，建议关注其气压稳定性，其余产线运行平稳。</p>
              <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                生成诊断报告 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
