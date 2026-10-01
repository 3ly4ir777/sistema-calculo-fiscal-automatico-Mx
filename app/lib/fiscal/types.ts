export type Periodicidad =
  | 'diario'
  | 'semanal'
  | 'decenal'
  | 'quincenal'
  | 'mensual';

export const PERIODICIDAD_DIAS: Record<Periodicidad, number> = {
  diario: 1,
  semanal: 7,
  decenal: 10,
  quincenal: 15,
  mensual: 30,
};

export const PERIODICIDAD_LABEL: Record<Periodicidad, string> = {
  diario: 'Diaria (1 día)',
  semanal: 'Semanal (7 días)',
  decenal: 'Decenal (10 días)',
  quincenal: 'Quincenal (15 días)',
  mensual: 'Mensual (30 días)',
};

export interface RenglonTarifa {
  limiteInferior: number;
  limiteSuperior: number | null;
  cuotaFija: number;
  tasa: number;
}

export interface TarifaISR {
  ejercicio: number;
  periodicidad: Periodicidad;
  regimen: string;
  renglones: RenglonTarifa[];
  fuente: FuenteOficial;
}

export interface FuenteOficial {
  tipo: 'DOF' | 'SAT' | 'RMF' | 'LISR';
  descripcion: string;
  url?: string;
  fechaPublicacion: string;
}

export interface RenglonSubsidio {
  limiteInferior: number;
  limiteSuperior: number | null;
  subsidio: number;
}

export interface ResultadoISR {
  baseGravable: number;
  periodicidad: Periodicidad;
  renglonAplicado: RenglonTarifa;
  excedente: number;
  impuestoMarginal: number;
  isrAntesSubsidio: number;
  subsidioEmpleo: number;
  isrNeto: number;
  fuente: FuenteOficial;
  versionRegla: string;
}