import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: number;
  status: 'ok' | 'ng';
  x: number;
  name: string;
}

interface Props {
  productName: string;
  isPaused?: boolean;
  onScan?: (status: 'ok' | 'ng') => void;
}

export default function ProductionLineAnimation({ productName, isPaused = false, onScan }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isRejecting, setIsRejecting] = useState(false);
  const [scannedIds, setScannedIds] = useState<Set<number>>(new Set());

  // Spawn products with randomized intervals
  useEffect(() => {
    if (isPaused) return;
    
    let timeoutId: NodeJS.Timeout;
    
    const spawn = () => {
      const isNG = Math.random() > 0.92; // 8% defect rate
      setProducts(prev => [
        ...prev,
        { id: Date.now(), status: isNG ? 'ng' : 'ok', x: 0, name: productName }
      ]);
      
      // Random interval between 600ms and 1500ms
      const nextInterval = Math.floor(Math.random() * 900) + 600;
      timeoutId = setTimeout(spawn, nextInterval);
    };

    timeoutId = setTimeout(spawn, 800);
    return () => clearTimeout(timeoutId);
  }, [isPaused, productName]);

  // Move products and handle rejection
  useEffect(() => {
    if (isPaused) return;
    const moveInterval = setInterval(() => {
      setProducts(prev => {
        return prev
          .map(p => ({ ...p, x: p.x + 1.5 }))
          .filter(p => p.x < 100);
      });
    }, 50);
    return () => clearInterval(moveInterval);
  }, [isPaused]);

  // Trigger rejection animation based on product position
  useEffect(() => {
    if (isPaused) return;
    
    // Inspection scan (around x=35)
    products.forEach(p => {
      if (p.x >= 35 && p.x <= 40 && !scannedIds.has(p.id)) {
        setScannedIds(prev => new Set(prev).add(p.id));
        onScan?.(p.status);
      }
    });

    const ngProductAtRejection = products.find(p => p.status === 'ng' && p.x >= 65 && p.x <= 70);
    if (ngProductAtRejection) {
      setIsRejecting(true);
      setTimeout(() => setIsRejecting(false), 500);
    }
  }, [products, isPaused, scannedIds, onScan]);

  return (
    <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
      {/* Conveyor Belt */}
      <div className="absolute top-1/2 left-0 w-full h-6 bg-slate-800 -translate-y-1/2 border-y border-slate-700">
        <div className="absolute inset-0 flex overflow-hidden">
          <motion.div 
            animate={isPaused ? { x: 0 } : { x: [0, -40] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="flex min-w-[200%]"
          >
            {[...Array(40)].map((_, i) => (
              <div key={i} className="w-10 h-full border-r border-slate-700/50 flex-shrink-0" />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Sensor 1 */}
      <div className="absolute top-[30%] left-[15%] flex flex-col items-center">
        <div className="w-1 h-8 bg-slate-600"></div>
        <div className="w-4 h-4 bg-slate-500 rounded-sm flex items-center justify-center">
          <div className={`w-2 h-2 rounded-full ${products.some(p => p.x > 13 && p.x < 17) ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-slate-700'}`}></div>
        </div>
        <span className="text-[8px] text-slate-500 mt-1 font-bold uppercase">Sensor 1</span>
      </div>

      {/* Inspection Box */}
      <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-20 h-24 bg-slate-800 border border-slate-700 rounded-lg flex flex-col items-center justify-center z-10">
        <div className="text-[10px] text-slate-500 font-bold mb-2">检测黑盒</div>
        <div className="w-12 h-1 bg-slate-900 rounded-full overflow-hidden">
          <motion.div 
            animate={isPaused ? { x: 0 } : { x: [-48, 48] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-full bg-emerald-500/50"
          />
        </div>
        <div className="mt-2 flex gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${!isPaused && products.some(p => p.x > 28 && p.x < 35) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
        </div>
      </div>

      {/* Sensor 2 */}
      <div className="absolute top-[30%] left-[55%] flex flex-col items-center">
        <div className="w-1 h-8 bg-slate-600"></div>
        <div className="w-4 h-4 bg-slate-500 rounded-sm flex items-center justify-center">
          <div className={`w-2 h-2 rounded-full ${products.some(p => p.x > 53 && p.x < 57) ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-slate-700'}`}></div>
        </div>
        <span className="text-[8px] text-slate-500 mt-1 font-bold uppercase">Sensor 2</span>
      </div>

      {/* Rejection Mechanism (Baffle Only) */}
      <motion.div 
        animate={{ rotate: isRejecting ? -45 : 0 }}
        className="absolute top-[45%] left-[68%] w-1 h-12 bg-amber-500 origin-bottom z-20"
      />

      {/* Waterwheel */}
      <div className="absolute top-1/2 left-[75%] -translate-y-1/2 w-24 h-24 border-4 border-slate-700 rounded-full flex items-center justify-center">
        <motion.div 
          animate={isPaused ? {} : { rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="relative w-full h-full"
        >
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-slate-600"
              style={{ transform: `rotate(${i * 45}deg) translateY(-10px)`, transformOrigin: 'bottom center' }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
          </div>
        </motion.div>
        <div className="absolute -bottom-6 text-[8px] text-slate-500 font-bold uppercase">翻转水车</div>
      </div>

      {/* Products */}
      {products.map(p => {
        let top = '50%';
        let left = `${p.x}%`;
        let rotate = 0;
        let opacity = p.x > 98 ? 0 : 1;
        let scale = p.x > 98 ? 0.8 : 1;

        if (p.status === 'ok' && p.x > 72 && p.x < 88) {
          const angle = ((p.x - 72) / 16) * Math.PI - Math.PI;
          const radius = 12;
          left = `${80 + Math.cos(angle) * 8}%`;
          top = `${50 + Math.sin(angle) * radius}%`;
          rotate = (p.x - 72) * 10;
        } else if (p.status === 'ok' && p.x >= 88) {
          top = '50%';
        }

        if (p.status === 'ng' && p.x > 68) {
          top = `${50 + (p.x - 68) * 2}%`;
          rotate = (p.x - 68) * 5;
        }

        return (
          <motion.div
            key={p.id}
            initial={{ left: '0%', top: '50%', opacity: 0, scale: 0.8 }}
            animate={{ 
              left, 
              top,
              opacity,
              scale,
              rotate
            }}
            transition={{ ease: "linear", duration: 0.05 }}
            className={`absolute w-14 h-14 -translate-y-1/2 -translate-x-1/2 rounded-xl flex items-center justify-center text-[8px] font-bold z-30 shadow-2xl border-2 ${
              p.status === 'ok' 
                ? 'bg-white text-slate-800 border-slate-200' 
                : 'bg-red-500 text-white border-red-400'
            }`}
          >
            <div className="flex flex-col items-center px-1 text-center">
              <span className="leading-tight mb-0.5">{p.name}</span>
              <span className={`px-1 rounded-sm ${p.status === 'ok' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-700 text-white'}`}>
                {p.status === 'ok' ? 'OK' : 'NG'}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-2 left-4 flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-white rounded-sm"></div>
          <span className="text-[10px] text-slate-400 font-bold">合格品</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-red-500 rounded-sm"></div>
          <span className="text-[10px] text-slate-400 font-bold">不合格品</span>
        </div>
      </div>
    </div>
  );
}
