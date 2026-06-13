import React, { useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

const THRESHOLD = 70;

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false);
  const [distance, setDistance] = useState(0);
  const startY = useRef(null);

  const onTouchStart = (e) => {
    if (window.scrollY === 0) startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      setDistance(Math.min(delta * 0.5, THRESHOLD + 20));
      setPulling(true);
    }
  };

  const onTouchEnd = async () => {
    if (distance >= THRESHOLD) {
      await onRefresh();
    }
    setDistance(0);
    setPulling(false);
    startY.current = null;
  };

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} className="relative">
      {pulling && (
        <div
          className="flex items-center justify-center overflow-hidden transition-all"
          style={{ height: distance }}>
          <Loader2 className={`w-5 h-5 text-primary ${distance >= THRESHOLD ? 'animate-spin' : ''}`} />
        </div>
      )}
      {children}
    </div>
  );
}
