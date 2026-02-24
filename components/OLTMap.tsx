
import React from 'react';
import { OLTInfo } from '../types';

interface OLTMapProps {
  olt: OLTInfo;
}

const OLTMap: React.FC<OLTMapProps> = ({ olt }) => {
  // สร้าง URL สำหรับ Google Maps Embed โดยปักหมุดที่พิกัดของ OLT
  const mapUrl = `https://maps.google.com/maps?q=${olt.latitude},${olt.longitude}&z=15&output=embed`;

  return (
    <div className="bg-slate-200 rounded-2xl overflow-hidden relative shadow-inner border border-slate-300 h-full min-h-[400px]">
      {/* Real Google Maps Iframe */}
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'grayscale(0.1) contrast(1.1)' }}
        src={mapUrl}
        allowFullScreen
        loading="lazy"
        title={`Map location for ${olt.name}`}
        className="absolute inset-0 z-0"
      ></iframe>
      
      {/* Custom Marker Overlay (Centered over the map pin) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] flex flex-col items-center pointer-events-none z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-white relative z-10">
            <i className="fas fa-tower-broadcast text-lg"></i>
          </div>
        </div>
        <div className="mt-3 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-2xl shadow-2xl border border-slate-200 text-center animate-bounce-subtle z-20 min-w-[180px]">
          <p className="font-bold text-slate-800 text-sm leading-tight">{olt.name}</p>
        </div>
      </div>

      {/* Status Badge Overlay */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700 text-white text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
          <span>Live Infrastructure Map</span>
        </div>
      </div>
      
      {/* Glass Frame Border */}
      <div className="absolute inset-0 pointer-events-none border-[6px] border-white/10 rounded-2xl z-30"></div>
    </div>
  );
};

export default OLTMap;
