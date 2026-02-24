
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { CustomerConfig } from '../types';

interface SystemAPIProps {
  customers: CustomerConfig[];
}

interface ApiLog {
  id: string;
  method: 'GET' | 'POST' | 'PUT';
  endpoint: string;
  payload?: any;
  response: any;
  timestamp: string;
  status: number;
}

const SystemAPI: React.FC<SystemAPIProps> = ({ customers }) => {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [userInput, setUserInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // --- Mock External API Functions ---
  const externalApi = {
    rebootOnt: async (customerId: string) => {
      const log: ApiLog = {
        id: Math.random().toString(36).substr(2, 9),
        method: 'POST',
        endpoint: `/api/v2/ont/reboot`,
        payload: { customerId, force: true },
        response: { status: "success", message: `ONT for ${customerId} is rebooting...` },
        timestamp: new Date().toLocaleTimeString(),
        status: 200
      };
      setLogs(prev => [...prev, log]);
      return log.response;
    },
    getSignalInfo: async (customerId: string) => {
      const customer = customers.find(c => c.customerId.includes(customerId));
      const log: ApiLog = {
        id: Math.random().toString(36).substr(2, 9),
        method: 'GET',
        endpoint: `/api/v2/monitoring/signal/${customerId}`,
        response: { 
          power: customer ? customer.signalStrength : -22.5, 
          temp: "42C", 
          voltage: "3.3V" 
        },
        timestamp: new Date().toLocaleTimeString(),
        status: 200
      };
      setLogs(prev => [...prev, log]);
      return log.response;
    },
    clearMacTable: async (port: string) => {
      const log: ApiLog = {
        id: Math.random().toString(36).substr(2, 9),
        method: 'PUT',
        endpoint: `/api/v2/olt/port/clear-mac`,
        payload: { port_id: port },
        response: { status: "cleared", entries_removed: 14 },
        timestamp: new Date().toLocaleTimeString(),
        status: 200
      };
      setLogs(prev => [...prev, log]);
      return log.response;
    }
  };

  // --- Gemini Function Declarations ---
  const rebootOntDeclaration: FunctionDeclaration = {
    name: 'reboot_ont',
    parameters: {
      type: Type.OBJECT,
      description: 'สั่งรีบูต ONT ของลูกค้าจากระยะไกล',
      properties: {
        customerId: { type: Type.STRING, description: 'ID หรือ Alias ของลูกค้า' }
      },
      required: ['customerId']
    }
  };

  const getSignalDeclaration: FunctionDeclaration = {
    name: 'get_realtime_signal',
    parameters: {
      type: Type.OBJECT,
      description: 'ดึงค่าสัญญาณล่าสุดแบบ Real-time จาก ONT',
      properties: {
        customerId: { type: Type.STRING, description: 'ID หรือ Alias ของลูกค้า' }
      },
      required: ['customerId']
    }
  };

  const handleExecute = async () => {
    if (!userInput.trim()) return;
    setIsExecuting(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userInput,
        config: {
          tools: [{ functionDeclarations: [rebootOntDeclaration, getSignalDeclaration] }]
        }
      });

      const calls = response.functionCalls;
      if (calls) {
        for (const call of calls) {
          if (call.name === 'reboot_ont') {
            await externalApi.rebootOnt(call.args.customerId as string);
          } else if (call.name === 'get_realtime_signal') {
            await externalApi.getSignalInfo(call.args.customerId as string);
          }
        }
      }
    } catch (error) {
      console.error("API Bridge Error:", error);
    } finally {
      setIsExecuting(false);
      setUserInput('');
    }
  };

  return (
    <div className="p-8 h-full flex flex-col space-y-6 animate-fadeIn">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <i className="fas fa-plug text-amber-500"></i>
            External API Hub
          </h1>
          <p className="text-slate-500 mt-1">Direct REST API Integration & System Automation Control</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-widest">Gateway Online</span>
           </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        {/* API Control Center */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest text-slate-400">Command Input</h3>
            <div className="space-y-4">
              <textarea 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="พิมพ์คำสั่งเพื่อเรียกใช้ API เช่น 'ช่วย Reboot ONT ให้ลูกค้า 5030277134 หน่อย'"
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none text-sm font-medium"
              />
              <button 
                onClick={handleExecute}
                disabled={isExecuting || !userInput.trim()}
                className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExecuting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-terminal text-xs"></i>}
                Execute API Function
              </button>
            </div>
          </div>

          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <i className="fas fa-project-diagram text-8xl"></i>
            </div>
            <h4 className="font-bold text-blue-200 text-[10px] uppercase tracking-[0.2em] mb-4">Available Endpoints</h4>
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-blue-100">POST /ont/reboot</span>
                <span className="bg-blue-400/30 px-2 py-0.5 rounded font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-blue-100">GET /monitoring/signal</span>
                <span className="bg-blue-400/30 px-2 py-0.5 rounded font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-blue-100">PUT /olt/port/clear</span>
                <span className="bg-blue-400/30 px-2 py-0.5 rounded font-bold">TESTING</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Traffic Logs */}
        <div className="lg:col-span-2 flex flex-col bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden min-h-[500px]">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center px-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">REST API traffic monitor</span>
            </div>
            <button onClick={() => setLogs([])} className="text-slate-500 hover:text-white text-xs transition-colors">
               <i className="fas fa-eraser mr-2"></i>Clear Logs
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto font-mono text-sm space-y-4 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-3">
                <i className="fas fa-satellite-dish text-4xl opacity-20"></i>
                <p className="text-xs uppercase tracking-widest font-bold">Waiting for system trigger...</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl animate-fadeIn">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.method === 'POST' ? 'bg-blue-500/20 text-blue-400' : 
                        log.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {log.method}
                      </span>
                      <span className="text-slate-300 font-bold">{log.endpoint}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex gap-4">
                      <span>{log.timestamp}</span>
                      <span className="text-emerald-500">HTTP {log.status}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {log.payload && (
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Request Payload</p>
                        <pre className="text-[11px] text-slate-400 bg-black/30 p-2 rounded border border-slate-800">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Response Body</p>
                      <pre className="text-[11px] text-blue-400 bg-blue-500/5 p-2 rounded border border-blue-500/10">
                        {JSON.stringify(log.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default SystemAPI;
