
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { CustomerConfig } from '../types';

interface ExternalSystemsProps {
  customers: CustomerConfig[];
}

const ExternalSystems: React.FC<ExternalSystemsProps> = ({ customers }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [query, setQuery] = useState('');

  const runAnalysis = async (customPrompt?: string) => {
    if (customers.length === 0) {
      alert("กรุณาอัปโหลดข้อมูล CSV ก่อนเริ่มการวิเคราะห์");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // เตรียมข้อมูลย่อสำหรับ AI (ส่งเฉพาะฟิลด์ที่จำเป็นเพื่อประหยัด Token)
      const dataSummary = customers.slice(0, 100).map(c => ({
        id: c.customerId,
        olt: c.olt.name,
        signal: c.signalStrength,
        status: c.status,
        location: c.olt.locationName
      }));

      const prompt = customPrompt || `
        คุณคือผู้เชี่ยวชาญด้านโครงข่าย ISP (Network Engineer) 
        จงวิเคราะห์ข้อมูลลูกค้าจำนวน ${customers.length} ราย ต่อไปนี้:
        ${JSON.stringify(dataSummary)}
        
        ช่วยสรุป:
        1. ภาพรวมความสมบูรณ์ของสัญญาณ (Signal Health)
        2. ระบุ OLT Node ที่ดูเหมือนจะมีปัญหา (ถ้ามี)
        3. ข้อเสนอแนะในการปรับปรุงโครงข่าย
        
        ตอบเป็นภาษาไทย โดยใช้ Markdown และ Bullet points ให้สวยงาม
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAnalysis(response.text || 'ไม่สามารถวิเคราะห์ข้อมูลได้');
    } catch (error) {
      console.error("AI Analysis Error:", error);
      setAnalysis("เกิดข้อผิดพลาดในการเชื่อมต่อกับ API: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <i className="fas fa-brain text-blue-600"></i>
          AI Network Intelligence
        </h1>
        <p className="text-slate-500 mt-1">Connect your infrastructure data with Gemini AI for smart diagnostics.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Control Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fas fa-magic text-amber-500 text-sm"></i>
              Quick Diagnostics
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => runAnalysis()}
                disabled={isAnalyzing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-chart-line"></i>}
                Analyze Network Health
              </button>
              <button 
                onClick={() => runAnalysis("ช่วยมองหาจุดที่สัญญาณต่ำกว่า -25 dBm และบอกพิกัด OLT นั้นๆ มาให้หน่อย")}
                disabled={isAnalyzing}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Find Critical Signal Gaps
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
            <h3 className="font-bold text-blue-400 mb-2 uppercase text-[10px] tracking-widest">Active Data Context</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">{customers.length.toLocaleString()}</p>
                <p className="text-slate-400 text-xs">Records ready for AI</p>
              </div>
              <i className="fas fa-database text-slate-700 text-4xl"></i>
            </div>
          </div>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 min-h-[500px] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center px-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Response Console</span>
              {analysis && (
                <button onClick={() => setAnalysis('')} className="text-slate-400 hover:text-rose-500 text-xs transition-colors">
                   Clear Console
                </button>
              )}
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-slate-400">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <p className="font-medium animate-pulse">Gemini is processing your network data...</p>
                </div>
              ) : analysis ? (
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                    {analysis}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-slate-300 text-center">
                  <i className="fas fa-robot text-6xl opacity-20"></i>
                  <p className="max-w-xs text-sm">กดปุ่มวิเคราะห์เพื่อเริ่มให้ AI ช่วยตรวจสอบคุณภาพสัญญาณและโครงข่ายของคุณ</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-50">
              <div className="relative">
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runAnalysis(query)}
                  placeholder="Ask AI anything about your network... (e.g. Find me OLTs in Chatuchak)"
                  className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                />
                <button 
                  onClick={() => runAnalysis(query)}
                  disabled={isAnalyzing || !query.trim()}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white rounded-xl hover:bg-black transition-all disabled:opacity-30"
                >
                  <i className="fas fa-paper-plane text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalSystems;
