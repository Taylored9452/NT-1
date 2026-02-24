<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/19-slIjrCsR9WJzIJABomX_osN2aWib8P

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

ไฟล์ CSVImporter

- fetch(url)					ดึงจาก url
- const [csvUrl, setCsvUrl] = useState
- const updatedCustomers 			อัพเดตข้อมูล

ไฟล์ AdminPanel

-  customers.filter(c => c.status === 'online')	แสดงที่ online

Excel เทียบตัวแปล App

1.Alias			=	costomer
2.Device Name 		=	costomerName / olt.name
3.Frame			=	Frame
4.Slot			=	slot
5.Port			=	Port
6.ONU ID		=	onu Id
7.SN			=	SN
8.OLT IP		=	olt.ip
9.OLT Type		=	olt.tpye
10.Gpon Port Usage	=	olt.portUsage
11.Location		=	olt.lat/olt.long (รวมเป็น 1) เปลี่ยนเป็น locationName
**เพิ่มเข้ามาทดสอบ**
12.Status		=	status
13.Date			=	date

Url ทดสอบ CSV จาก Sheet

API1 Date 2026-01-01 Status Online 19	https://docs.google.com/spreadsheets/d/e/2PACX-1vRVrGwYnxX7LqSBVR3v9Ov17Zo5IAOjYktgrMuaFsVgxw-ZptK4kzDe0n1vKy6PjxaX-8M3kxs9A3yP/pub?output=csv
API2 Date 2026-01-02 Status Online 9	https://docs.google.com/spreadsheets/d/e/2PACX-1vQBkFHJKlqyaBFNCrAy93_xzan8bsHj3X4xG8muHItxitmpIIh9ZVNgggs7hgVjiBTaDC0dD1SEFEwg/pub?output=csv
API3 Date 2026-01-02 Status Online 21 เพิ่มที่ใหม่มา 2 	https://docs.google.com/spreadsheets/d/e/2PACX-1vTXJLI5h4lYiVIRQE2G5-yVMv15a4DMaAXlQH16-yZP7qEvB6PzHwa50zX7fJA5ix5H4iGLLMj6LHyc/pub?output=csv