export interface EntradaHonorarios {
  subtotal: number;              // honorarios sin IVA
  aplicaRetencionISR: boolean;   // default true
  aplicaRetencionIVA: boolean;   // default true si el cliente es PM
  tasaIVA: number;               // 0.16
}

export interface ResultadoHonorarios {
  subtotal: number;
  iva: number;
  ivaTrasladado: number;
  retencionISR: number;
  retencionIVA: number;
  ivaNeto: number;
  totalFactura: number;
  totalACobrar: number;
  fuente: string;
}