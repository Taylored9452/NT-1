
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface OLTInfo {
  id: string;
  name: string;
  ip: string;
  type: string;        // OLT Type (เช่น Huawei MA5800, ZTE C600)
  portUsage: string;   // GPON Port Usage (เช่น 45/64 Ports)
  locationName: string; // Physical Location Name
  latitude: number;
  longitude: number;
}

export interface CustomerConfig {
  customerId: string; // This is the 'Alias'
  customerName: string;
  deviceName: string;
  frame: string;
  slot: string;
  port: string;
  onuId: string;
  sn: string;
  terminalType: string;
  status: 'online' | 'offline';
  signalStrength: number;
  date?: string; // Date from CSV (optional)
  olt: OLTInfo;
}

export interface DashboardStats {
  totalCustomers: number;
  onlineCustomers: number;
  totalOlts: number;
  activeAlarms: number;
}
