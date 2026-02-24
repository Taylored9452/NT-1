
📑 Project Overview
ระบบจัดการข้อมูลลูกค้าและสถานะ OLT โดยดึงข้อมูลผ่าน Google Sheets CSV API และแสดงผลผ่านหน้า Admin Panel

🚀 Getting Started
ติดตั้ง Node.js ให้เรียบร้อย

Setup: 
``npm install``

Configuration: 
สร้างไฟล์ .env.local และกำหนดค่า

Bash
``npm run dev``

🛠️ System Logic
1.ไฟล์ CSVImporter

-ใช้ ``fetch(url)`` เพื่อดึงข้อมูลจาก Google Sheets (CSV Output)

-ใช้ ``[csvUrl, setCsvUrl]`` ในการจัดการ URL ของแหล่งข้อมูล

-ตัวแปร ``updatedCustomers`` ทำหน้าที่รับค่าที่ Parse มาจาก CSV เพื่อเตรียมอัปเดตเข้าสู่ระบบ

2.AdminPanel

แสดงเฉพาะลูกค้าที่มีสถานะออนไลน์เท่านั้น ``customers.filter(c => c.status === 'online')``

📊 Data Mapping (Excel vs App Variable)

เพื่อให้ข้อมูลในระบบตรงกับฟอร์แมต Excel/CSV ที่ได้รับมา ให้ใช้การอัปเดตตัวแปรดังนี้

1 Alias ``customer``

2 Device Name ``customerName / olt.name``

3 Frame,frame

4 Slot  ``slot``

5 Port ``port``

6 ONU ID ``onuId``

7 SN ``sn``

8 OLT IP ``olt.ip``

9 OLT Type ``olt.type``

10 Gpon Port Usage ``olt.portUsage``

11 Location ยุบ ``olt.lat + olt.long`` เป็น ``locationName``

12 Status ``status`` (เพิ่มใหม่เพื่อทดสอบ)

13 Date ``date`` (เพิ่มใหม่เพื่อทดสอบ)

🔗 Test API Endpoints (Google Sheets CSV)

คุณสามารถใช้ URL เหล่านี้ในการทดสอบฟังก์ชัน fetch ใน CSVImporter:

API1 Date 2026-01-01 Status Online 19	https://docs.google.com/spreadsheets/d/e/2PACX-1vRVrGwYnxX7LqSBVR3v9Ov17Zo5IAOjYktgrMuaFsVgxw-ZptK4kzDe0n1vKy6PjxaX-8M3kxs9A3yP/pub?output=csv

API2 Date 2026-01-02 Status Online 9	https://docs.google.com/spreadsheets/d/e/2PACX-1vQBkFHJKlqyaBFNCrAy93_xzan8bsHj3X4xG8muHItxitmpIIh9ZVNgggs7hgVjiBTaDC0dD1SEFEwg/pub?output=csv

API3 Date 2026-01-03 Status Online 21 เพิ่มที่ใหม่มา 2 	https://docs.google.com/spreadsheets/d/e/2PACX-1vTXJLI5h4lYiVIRQE2G5-yVMv15a4DMaAXlQH16-yZP7qEvB6PzHwa50zX7fJA5ix5H4iGLLMj6LHyc/pub?output=csv
