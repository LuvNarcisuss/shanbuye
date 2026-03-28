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
  version: string;
  mAP: number;
  fps: number;
  status: 'active' | 'archived' | 'testing';
  uploadDate: string;
}
