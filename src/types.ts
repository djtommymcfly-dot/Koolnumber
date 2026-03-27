export type ServiceStatus = 'ATIVO' | 'AGENDADO' | 'EXPIRADO';
export type TrackerType = 'S5' | 'S7';
export type ServiceType = 'PARTIDA' | 'CHEGADA';

declare global {
  interface Window {
    google: any;
  }
}

export interface Service {
  id: string;
  time: string;
  type: ServiceType;
  clients: string[];
  vehicle: string;
  distance: number | null;
  tracker: TrackerType;
  destino: string;
  delayMin: number;
  delayReason: string;
}

export interface Alert {
  towAway: boolean;
  tamper: boolean;
  gsmJamming: boolean;
  lowBattery: boolean;
  adrStatus: 'PRESENT' | 'MISSING';
  systemHealth: 'OK' | 'ERROR';
  ignition: 'ON' | 'OFF';
  stolenVehicleAlert: boolean;
}

export interface Position {
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: string;
  ignition: string;
  battery: number;
  signal: number;
  source: string;
  deviceId: string;
}

export interface LogEntry {
  time: string;
  client: string;
  vehicle: string;
  action: string;
  status: ServiceStatus;
}
