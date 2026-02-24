
import React, { useState, useRef } from 'react';
import { CustomerConfig } from '../types';

interface CSVImporterProps {
  setCustomers: React.Dispatch<React.SetStateAction<CustomerConfig[]>>;
}

const CSVImporter: React.FC<CSVImporterProps> = ({ setCustomers }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [recordsCount, setRecordsCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [csvUrl, setCsvUrl] = useState('https://docs.google.com/spreadsheets/d/e/2PACX-1vRVrGwYnxX7LqSBVR3v9Ov17Zo5IAOjYktgrMuaFsVgxw-ZptK4kzDe0n1vKy6PjxaX-8M3kxs9A3yP/pub?output=csv');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processUrl = (url: string): Promise<CustomerConfig[]> => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(text => {
          try {
            text = text.replace(/^\uFEFF/, '');
            const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
            
            if (lines.length < 2) {
              reject(new Error("ไฟล์ว่างเปล่าหรือไม่ถูกต้อง"));
              return;
            }

            const delimiter = lines[0].includes(';') ? ';' : ',';
            const newCustomers: CustomerConfig[] = lines.slice(1).map((line, i) => {
              // ใช้ parseCSVLine แยก CSV ที่รองรับ quoted fields
              const values = parseCSVLine(line, delimiter);
              
              const alias = values[0] || `ID-${Date.now()}-${i}`;
              
              // ใช้ค่าพิกัดเริ่มต้นเนื่องจาก CSV ไม่มี lat/long
              let lat = 13.7367;
              let long = 100.5232;

              return {
                customerId: alias,
                customerName: values[1] || `Subscriber ${alias}`,
                deviceName: values[1] || 'Unknown OLT',
                frame: values[2] || '0',
                slot: values[3] || '0',
                port: values[4] || '0',
                onuId: values[5] || '1',
                sn: values[6] || `SN-${i}`,
                terminalType: 'ONT-Standard',
                status: (values[11] || 'online').toLowerCase() as 'online' | 'offline',
                signalStrength: -18.0 - (Math.random() * 8),
                date: values[12] || new Date().toISOString().split('T')[0], // Date from CSV or today
                olt: {
                  id: `OLT-${(values[7] || '10.1.1.1').replace(/\./g, '-')}`,
                  name: values[1] || 'OLT Node',
                  ip: values[7] || '10.1.1.1',
                  type: values[8] || 'Standard OLT',
                  portUsage: values[9] || 'N/A',
                  locationName: values[10] ? values[10].trim() : 'Unknown Site',
                  latitude: lat,
                  longitude: long
                }
              };
            });
            resolve(newCustomers);
          } catch (err) {
            reject(err);
          }
        })
        .catch(err => reject(err));
    });
  };

  // ฟังก์ชันสำหรับแยก CSV ที่รองรับ quoted fields
  const parseCSVLine = (line: string, delimiter: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === delimiter && !inQuotes) {
        // Field delimiter
        result.push(current.trim());
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    // Add the last field
    result.push(current.trim());
    
    // Remove quotes from fields
    return result.map(field => field.replace(/^"|"$/g, ''));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus('idle');
      setErrorMessage('');
    }
  };

  const processFile = (file: File): Promise<CustomerConfig[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          let text = e.target?.result as string;
          text = text.replace(/^\uFEFF/, '');
          const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
          
          if (lines.length < 2) {
            reject(new Error("ไฟล์ว่างเปล่าหรือไม่ถูกต้อง"));
            return;
          }

          const delimiter = lines[0].includes(';') ? ';' : ',';
          const newCustomers: CustomerConfig[] = lines.slice(1).map((line, i) => {
            // ใช้ parseCSVLine แยก CSV ที่รองรับ quoted fields
            const values = parseCSVLine(line, delimiter);
            
            const alias = values[0] || `ID-${Date.now()}-${i}`;
            
            // ใช้ค่าพิกัดเริ่มต้นเนื่องจาก CSV ไม่มี lat/long
            let lat = 13.7367;
            let long = 100.5232;

            return {
              customerId: alias,
              customerName: values[1] || `Subscriber ${alias}`,
              deviceName: values[1] || 'Unknown OLT',
              frame: values[2] || '0',
              slot: values[3] || '0',
              port: values[4] || '0',
              onuId: values[5] || '1',
              sn: values[6] || `SN-${i}`,
              terminalType: 'ONT-Standard',
              status: (values[11] || 'online').toLowerCase() as 'online' | 'offline',
              signalStrength: -18.0 - (Math.random() * 8),
              date: values[12] || new Date().toISOString().split('T')[0], // Date from CSV or today
              olt: {
                id: `OLT-${(values[7] || '10.1.1.1').replace(/\./g, '-')}`,
                name: values[1] || 'OLT Node',
                ip: values[7] || '10.1.1.1',
                type: values[8] || 'Standard OLT',
                portUsage: values[9] || 'N/A',
                locationName: values[10] ? values[10].trim() : 'Unknown Site',
                latitude: lat,
                longitude: long
              }
            };
          });
          resolve(newCustomers);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleUrlImport = async () => {
    if (!csvUrl.trim()) {
      setErrorMessage('กรุณาใส่ URL ของ CSV');
      return;
    }
    
    setIsProcessing(true);
    setProgress(20);

    try {
      const freshData = await processUrl(csvUrl.trim());
      setProgress(70);
      
      // Update logic: อัปเดตข้อมูลเก่า ไม่ลบทิ้ง
      setCustomers(prevCustomers => {
        const updatedCustomers = [...prevCustomers];
        
        freshData.forEach(newCustomer => {
          const existingIndex = updatedCustomers.findIndex(c => c.customerId === newCustomer.customerId);
          
          if (existingIndex >= 0) {
            // อัปเดตข้อมูลเก่า
            updatedCustomers[existingIndex] = {
              ...updatedCustomers[existingIndex],
              status: newCustomer.status,
              date: newCustomer.date,
              olt: {
                ...updatedCustomers[existingIndex].olt,
                ...newCustomer.olt
              }
            };
          } else {
            // เพิ่มข้อมูลใหม่
            updatedCustomers.push(newCustomer);
          }
        });
        
        return updatedCustomers;
      });
      
      setRecordsCount(freshData.length);
      setUploadStatus('success');
      setProgress(100);
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลจาก URL");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(20);

    try {
      const freshData = await processFile(file);
      setProgress(70);
      
      // Update logic: อัปเดตข้อมูลเก่า ไม่ลบทิ้ง
      setCustomers(prevCustomers => {
        const updatedCustomers = [...prevCustomers];
        
        freshData.forEach(newCustomer => {
          const existingIndex = updatedCustomers.findIndex(c => c.customerId === newCustomer.customerId);
          
          if (existingIndex >= 0) {
            // อัปเดตข้อมูลเก่า
            updatedCustomers[existingIndex] = {
              ...updatedCustomers[existingIndex],
              status: newCustomer.status,
              date: newCustomer.date,
              olt: {
                ...updatedCustomers[existingIndex].olt,
                ...newCustomer.olt
              }
            };
          } else {
            // เพิ่มข้อมูลใหม่
            updatedCustomers.push(newCustomer);
          }
        });
        
        return updatedCustomers;
      });
      
      setRecordsCount(freshData.length);
      setUploadStatus('success');
      setProgress(100);
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.message || "เกิดข้อผิดพลาดในการประมวลผล");
    } finally {
      setIsProcessing(false);
      setFile(null);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Database Master Sync</h1>
        <p className="text-slate-500 mt-1">Replace all local records with the latest engineering CSV data.</p>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* URL Import Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Import from Google Sheets URL</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">CSV URL</label>
              <input
                type="url"
                value={csvUrl}
                onChange={(e) => setCsvUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              disabled={isProcessing}
              onClick={handleUrlImport}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-500/20 disabled:opacity-50"
            >
              <i className="fas fa-download mr-2"></i>
              Import from URL
            </button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
          <div className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all ${file ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200'}`}>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${file ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-300'}`}>
               <i className={`fas ${file ? 'fa-file-csv' : 'fa-upload'} text-3xl`}></i>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">{file ? file.name : 'Select CSV Data File'}</h3>
            <p className="text-slate-400 text-sm text-center mb-8 max-w-sm">
              ระบบจะบันทึกข้อมูลลงใน IndexedDB ของเบราว์เซอร์ ซึ่งรองรับข้อมูลได้มหาศาลและไม่สูญหายเมื่อปิดโปรแกรม
            </p>
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
            
            <div className="flex gap-4">
              <button 
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()} 
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                Browse File
              </button>
              {file && !isProcessing && (
                <button onClick={handleUpload} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                  Sync Database Now
                </button>
              )}
            </div>
          </div>

          {isProcessing && (
            <div className="mt-12 space-y-4">
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>Saving to Browser Database...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="mt-8 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-4 animate-fadeIn">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                <i className="fas fa-check"></i>
              </div>
              <div>
                <h4 className="font-bold text-emerald-900 text-lg leading-tight">Sync Completed!</h4>
                <p className="text-emerald-700 text-sm mt-1">บันทึกข้อมูล {recordsCount.toLocaleString()} รายการ ลงในฐานข้อมูลถาวรเรียบร้อยแล้ว</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVImporter;
