import { CustomerConfig, UserRole, User, DashboardStats } from '../types';

export const MOCK_USERS: User[] = [
  { id: '1', username: 'admin_isp', role: UserRole.ADMIN },
  { id: '2', username: 'staff_viewer', role: UserRole.USER }
];

export const MOCK_CUSTOMERS: CustomerConfig[] = [
  {
    customerId: '5030277134 | OR-BOR-JOR',
    customerName: 'บริษัท อมร พร็อพเพอร์ตี้ จำกัด',
    deviceName: 'ควนดินสอ_MA5603T',
    frame: '0', slot: '12', port: '4', onuId: '1',
    sn: 'ZTEGC1122334',
    terminalType: 'ZTE-F670L',
    status: 'online',
    signalStrength: -19.2,
    olt: {
      id: 'OLT-KD-01', name: 'ควนดินสอ_MA5603T', ip: '10.50.12.1',
      type: 'Huawei MA5603T', portUsage: '124 / 256 Ports',
      locationName: 'ควนดินสอ', latitude: 7.58028, longitude: 99.96083
    }
  },
  {
    customerId: 'CUST | 001 | BKK',
    customerName: 'Somchai Jaidee',
    deviceName: 'OLT-BKK-01',
    frame: '0', slot: '4', port: '1', onuId: '12',
    sn: 'ZTEGC1234567',
    terminalType: 'ZTE-F660',
    status: 'online',
    signalStrength: -18.5,
    olt: {
      id: 'OLT1', name: 'Central OLT - Sukhumvit', ip: '10.20.30.1',
      type: 'Huawei MA5800-X17', portUsage: '210 / 256 Ports',
      locationName: 'สถานีต้นทาง สุขุมวิท', latitude: 13.7367, longitude: 100.5232
    }
  },
  {
    customerId: 'CUST002',
    customerName: 'Wichai Raksat',
    deviceName: 'OLT-BKK-02',
    frame: '0', slot: '2', port: '8', onuId: '5',
    sn: 'HWTC88776655',
    terminalType: 'HG8245H',
    status: 'online',
    signalStrength: -21.2,
    olt: {
      id: 'OLT2', name: 'Northern OLT - Chatuchak', ip: '10.20.35.10',
      type: 'Nokia 7360 ISAM FX', portUsage: '88 / 128 Ports',
      locationName: 'ตึกชุมสาย จตุจักร', latitude: 13.8282, longitude: 100.5284
    }
  },
  {
    customerId: '6030277134 | ทดสอบ',
    customerName: 'ทดสอบ',
    deviceName: 'ทดสอบ',
    frame: '0', slot: '12', port: '4', onuId: '1',
    sn: 'ZTEGC1122334',
    terminalType: 'ZTE-F670L',
    status: 'offline', // เปลี่ยนเป็น Offline
    signalStrength: 0,
    olt: {
      id: 'OLT-KD-01', name: 'ควนดินสอ_MA5603T', ip: '10.50.12.1',
      type: 'Huawei MA5603T', portUsage: '124 / 256 Ports',
      locationName: 'ควนดินสอ', latitude: 7.58028, longitude: 99.96083
    }
  }
];

export const MOCK_STATS: DashboardStats = {
  totalCustomers: 152420,
  onlineCustomers: 148900,
  totalOlts: 450,
  activeAlarms: 13 // เพิ่มขึ้น 1 เพราะมีคน offline ในวันที่ 3
};