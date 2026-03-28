import React, { useState } from 'react';
import { 
  Upload, 
  Database, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  History, 
  Zap, 
  Shield, 
  Trash2,
  Download,
  BarChart2,
  PlayCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { Model } from '../types';

const mockModels: Model[] = [
  { id: 'M-001', version: 'yolov8m-cls', mAP: 98.2, fps: 145, status: 'active', uploadDate: '2025-03-25' },
  { id: 'M-002', version: 'yolov8s-cls', mAP: 96.5, fps: 180, status: 'testing', uploadDate: '2025-03-20' },
  { id: 'M-003', version: 'yolov8n-cls', mAP: 94.1, fps: 220, status: 'archived', uploadDate: '2025-02-10' },
];

export default function Models() {
  const [models] = useState<Model[]>(mockModels);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">模型资产库</h1>
          <p className="text-slate-500 text-sm">管理深度学习模型版本、性能指标及部署状态</p>
        </div>
        <button className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2">
          <Upload className="w-5 h-5" /> 上传新模型
        </button>
      </div>

      {/* Active Model Hero */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit text-xs font-bold">
              <Zap className="w-3 h-3 fill-current" /> 当前生产环境使用中
            </div>
            <h2 className="text-4xl font-black tracking-tight">yolov8m-cls</h2>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">平均精度 (mAP)</p>
                <p className="text-3xl font-bold">98.2%</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div>
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">推理速度 (FPS)</p>
                <p className="text-3xl font-bold">145</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all flex items-center gap-2">
              <PlayCircle className="w-5 h-5" /> 测试验证
            </button>
            <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2">
              <BarChart2 className="w-5 h-5" /> 性能对比
            </button>
          </div>
        </div>
        <Database className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12" />
      </div>

      {/* Model List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {models.map((model, i) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white p-6 rounded-3xl border transition-all ${
              model.status === 'active' ? 'border-emerald-500 ring-4 ring-emerald-500/5' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                <Shield className={`w-6 h-6 ${model.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`} />
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                model.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                model.status === 'testing' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-500'
              }`}>
                {model.status === 'active' ? '生产中' : model.status === 'testing' ? '灰度测试' : '已归档'}
              </div>
            </div>

            <h3 className="font-bold text-slate-800 text-lg mb-1">{model.version}</h3>
            <p className="text-slate-400 text-xs font-mono mb-6">ID: {model.id}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">mAP</p>
                <p className="text-lg font-bold text-slate-700">{model.mAP}%</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">FPS</p>
                <p className="text-lg font-bold text-slate-700">{model.fps}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
              <Clock className="w-3.5 h-3.5" /> 上传于 {model.uploadDate}
            </div>

            <div className="flex items-center gap-2">
              {model.status !== 'active' && (
                <button className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">
                  设为当前使用
                </button>
              )}
              <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}

        {/* Upload Placeholder */}
        <button className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-all">
            <Plus className="w-8 h-8 text-slate-300 group-hover:text-emerald-500 transition-all" />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-400 group-hover:text-emerald-600 transition-all">上传新版本模型</p>
            <p className="text-xs text-slate-300">支持 ONNX, TensorRT, PyTorch</p>
          </div>
        </button>
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  );
}
