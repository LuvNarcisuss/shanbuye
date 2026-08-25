export interface Product {
  id: number;
  name: string;
  brand: string;
}

export interface Line {
  id: number;
  name: string;
  status: 'running' | 'warning' | 'stopped';
  product: string;
  yield: number;
  speed: string;
}

export interface Rule {
  id: string;
  name: string;
  type: string;
  threshold: number;
  enabled: boolean;
  version: string;
  lastModified: string;
}

export interface Model {
  id: string;
  name: string;
  iteration: string;
  mAP: number;
  fps: number;
  status: 'active' | 'archived' | 'testing';
  uploadDate: string;
  fileName?: string;
  fileSize?: number;
  notes?: string;
}

export interface AuditLog {
  id: number;
  time: string;
  user: string;
  module: string;
  type: string;
  detail: string;
}
