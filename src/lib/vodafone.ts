import { Alert, Position } from '../types';

export const VF = {
  cfg: {
    baseUrl: localStorage.getItem('vf_url') || '',
    user: localStorage.getItem('vf_user') || '',
    pass: localStorage.getItem('vf_pass') || '',
    devices: JSON.parse(localStorage.getItem('vf_devices') || '[]'),
    token: null as string | null,
  },
  get live() {
    return !!(this.cfg.user && this.cfg.pass && this.cfg.baseUrl && this.cfg.token);
  },

  async auth() {
    try {
      const r = await fetch(`${this.cfg.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.cfg.user, password: this.cfg.pass }),
      });
      const d = await r.json();
      if (d.access_token) {
        this.cfg.token = d.access_token;
        return true;
      }
    } catch {}
    return false;
  },

  async getPosition(deviceId: string): Promise<Position> {
    if (this.live) {
      try {
        const r = await fetch(`${this.cfg.baseUrl}/vehicles/${deviceId}/location`, {
          headers: { Authorization: `Bearer ${this.cfg.token}` },
        });
        const d = await r.json();
        return {
          lat: d.latitude,
          lng: d.longitude,
          speed: d.speed,
          heading: d.heading,
          timestamp: d.timestamp,
          ignition: d.ignitionStatus,
          battery: d.batteryVoltage,
          signal: d.gsmSignal,
          source: 'VODAFONE',
          deviceId,
        };
      } catch {}
    }
    return this._mockPos(deviceId);
  },

  async getAlerts(deviceId: string): Promise<Alert> {
    if (this.live) {
      try {
        const r = await fetch(`${this.cfg.baseUrl}/vehicles/${deviceId}/alerts`, {
          headers: { Authorization: `Bearer ${this.cfg.token}` },
        });
        return await r.json();
      } catch {}
    }
    return this._mockAlerts();
  },

  _ri: 0,
  _rp: 0,
  _route: [
    { lat: 38.7169, lng: -9.1392 },
    { lat: 38.95, lng: -9.05 },
    { lat: 39.3, lng: -8.8 },
    { lat: 39.75, lng: -8.6 },
    { lat: 40.2, lng: -8.42 },
    { lat: 40.625, lng: -8.65 },
    { lat: 41.1496, lng: -8.611 },
  ],
  _mockPos(deviceId: string): Position {
    this._rp += 0.008 + Math.random() * 0.006;
    if (this._rp >= 1) {
      this._rp = 0;
      this._ri = (this._ri + 1) % (this._route.length - 1);
    }
    const p0 = this._route[this._ri];
    const p1 = this._route[Math.min(this._ri + 1, this._route.length - 1)];
    
    const bearing = (p0: {lat: number, lng: number}, p1: {lat: number, lng: number}) => {
      const r = (d: number) => (d * Math.PI) / 180;
      const dL = r(p1.lng - p0.lng);
      const y = Math.sin(dL) * Math.cos(r(p1.lat));
      const x =
        Math.cos(r(p0.lat)) * Math.sin(r(p1.lat)) -
        Math.sin(r(p0.lat)) * Math.cos(r(p1.lat)) * Math.cos(dL);
      return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
    };

    return {
      lat: +(p0.lat + (p1.lat - p0.lat) * this._rp + (Math.random() - 0.5) * 0.002).toFixed(5),
      lng: +(p0.lng + (p1.lng - p0.lng) * this._rp + (Math.random() - 0.5) * 0.002).toFixed(5),
      speed: Math.round(70 + Math.random() * 50),
      heading: Math.round(bearing(p0, p1)),
      timestamp: new Date().toISOString(),
      ignition: 'ON',
      battery: +(12.3 + Math.random() * 0.5).toFixed(1),
      signal: Math.round(3 + Math.random() * 2),
      source: 'MOCK',
      deviceId,
    };
  },
  _mockAlerts(): Alert {
    return {
      towAway: false,
      tamper: false,
      gsmJamming: false,
      lowBattery: false,
      adrStatus: 'PRESENT',
      systemHealth: 'OK',
      ignition: 'ON',
      stolenVehicleAlert: false,
    };
  },
};
