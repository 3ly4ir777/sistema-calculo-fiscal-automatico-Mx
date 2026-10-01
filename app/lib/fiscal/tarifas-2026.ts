import { TarifaISR, RenglonSubsidio } from './types';

const FUENTE_TARIFAS = {
  tipo: 'DOF' as const,
  descripcion:
    'Anexo 8 de la Resolución Miscelánea Fiscal 2026. Tarifas de retención de ISR por sueldos y salarios.',
  url: 'https://www.sat.gob.mx/normatividad/',
  fechaPublicacion: '2025-12-28',
};

const FUENTE_SUBSIDIO = {
  tipo: 'DOF' as const,
  descripcion:
    'Decreto que otorga el subsidio para el empleo (vigente).',
  url: 'https://www.dof.gob.mx/',
  fechaPublicacion: '2024-12-31',
};

// ═══════════════════════════════════════════════════════════
// TARIFA DIARIA 2026
// ═══════════════════════════════════════════════════════════
export const TARIFA_DIARIA_2026: TarifaISR = {
  ejercicio: 2026,
  periodicidad: 'diario',
  regimen: 'sueldos',
  fuente: FUENTE_TARIFAS,
  renglones: [
    { limiteInferior: 0.01, limiteSuperior: 27.78, cuotaFija: 0, tasa: 0.0192 },
    { limiteInferior: 27.79, limiteSuperior: 235.81, cuotaFija: 0.53, tasa: 0.064 },
    { limiteInferior: 235.82, limiteSuperior: 414.41, cuotaFija: 13.85, tasa: 0.1088 },
    { limiteInferior: 414.42, limiteSuperior: 481.73, cuotaFija: 33.28, tasa: 0.16 },
    { limiteInferior: 481.74, limiteSuperior: 576.76, cuotaFija: 44.05, tasa: 0.1792 },
    { limiteInferior: 576.77, limiteSuperior: 1163.25, cuotaFija: 61.08, tasa: 0.2136 },
    { limiteInferior: 1163.26, limiteSuperior: 1833.44, cuotaFija: 186.35, tasa: 0.2352 },
    { limiteInferior: 1833.45, limiteSuperior: 3500.35, cuotaFija: 343.98, tasa: 0.30 },
    { limiteInferior: 3500.36, limiteSuperior: 4667.13, cuotaFija: 844.05, tasa: 0.32 },
    { limiteInferior: 4667.14, limiteSuperior: 14001.38, cuotaFija: 1217.42, tasa: 0.34 },
    { limiteInferior: 14001.39, limiteSuperior: null, cuotaFija: 4391.07, tasa: 0.35 },
  ],
};

// ═══════════════════════════════════════════════════════════
// TARIFA SEMANAL 2026
// ═══════════════════════════════════════════════════════════
export const TARIFA_SEMANAL_2026: TarifaISR = {
  ejercicio: 2026,
  periodicidad: 'semanal',
  regimen: 'sueldos',
  fuente: FUENTE_TARIFAS,
  renglones: [
    { limiteInferior: 0.01, limiteSuperior: 194.46, cuotaFija: 0, tasa: 0.0192 },
    { limiteInferior: 194.47, limiteSuperior: 1650.67, cuotaFija: 3.71, tasa: 0.064 },
    { limiteInferior: 1650.68, limiteSuperior: 2900.87, cuotaFija: 96.95, tasa: 0.1088 },
    { limiteInferior: 2900.88, limiteSuperior: 3372.11, cuotaFija: 232.96, tasa: 0.16 },
    { limiteInferior: 3372.12, limiteSuperior: 4037.32, cuotaFija: 308.35, tasa: 0.1792 },
    { limiteInferior: 4037.33, limiteSuperior: 8142.75, cuotaFija: 427.56, tasa: 0.2136 },
    { limiteInferior: 8142.76, limiteSuperior: 12834.08, cuotaFija: 1304.45, tasa: 0.2352 },
    { limiteInferior: 12834.09, limiteSuperior: 24502.45, cuotaFija: 2407.86, tasa: 0.30 },
    { limiteInferior: 24502.46, limiteSuperior: 32669.91, cuotaFija: 5908.35, tasa: 0.32 },
    { limiteInferior: 32669.92, limiteSuperior: 98009.66, cuotaFija: 8521.94, tasa: 0.34 },
    { limiteInferior: 98009.67, limiteSuperior: null, cuotaFija: 30737.49, tasa: 0.35 },
  ],
};

// ═══════════════════════════════════════════════════════════
// TARIFA DECENAL 2026
// ═══════════════════════════════════════════════════════════
export const TARIFA_DECENAL_2026: TarifaISR = {
  ejercicio: 2026,
  periodicidad: 'decenal',
  regimen: 'sueldos',
  fuente: FUENTE_TARIFAS,
  renglones: [
    { limiteInferior: 0.01, limiteSuperior: 277.80, cuotaFija: 0, tasa: 0.0192 },
    { limiteInferior: 277.81, limiteSuperior: 2358.10, cuotaFija: 5.30, tasa: 0.064 },
    { limiteInferior: 2358.11, limiteSuperior: 4144.10, cuotaFija: 138.50, tasa: 0.1088 },
    { limiteInferior: 4144.11, limiteSuperior: 4817.30, cuotaFija: 332.80, tasa: 0.16 },
    { limiteInferior: 4817.31, limiteSuperior: 5767.60, cuotaFija: 440.50, tasa: 0.1792 },
    { limiteInferior: 5767.61, limiteSuperior: 11632.50, cuotaFija: 610.80, tasa: 0.2136 },
    { limiteInferior: 11632.51, limiteSuperior: 18334.40, cuotaFija: 1863.50, tasa: 0.2352 },
    { limiteInferior: 18334.41, limiteSuperior: 35003.50, cuotaFija: 3439.80, tasa: 0.30 },
    { limiteInferior: 35003.51, limiteSuperior: 46671.30, cuotaFija: 8440.50, tasa: 0.32 },
    { limiteInferior: 46671.31, limiteSuperior: 140013.80, cuotaFija: 12174.20, tasa: 0.34 },
    { limiteInferior: 140013.81, limiteSuperior: null, cuotaFija: 43910.70, tasa: 0.35 },
  ],
};

// ═══════════════════════════════════════════════════════════
// TARIFA QUINCENAL 2026
// ═══════════════════════════════════════════════════════════
export const TARIFA_QUINCENAL_2026: TarifaISR = {
  ejercicio: 2026,
  periodicidad: 'quincenal',
  regimen: 'sueldos',
  fuente: FUENTE_TARIFAS,
  renglones: [
    { limiteInferior: 0.01, limiteSuperior: 416.70, cuotaFija: 0, tasa: 0.0192 },
    { limiteInferior: 416.71, limiteSuperior: 3537.15, cuotaFija: 7.95, tasa: 0.064 },
    { limiteInferior: 3537.16, limiteSuperior: 6216.15, cuotaFija: 207.75, tasa: 0.1088 },
    { limiteInferior: 6216.16, limiteSuperior: 7225.95, cuotaFija: 499.20, tasa: 0.16 },
    { limiteInferior: 7225.96, limiteSuperior: 8651.40, cuotaFija: 660.75, tasa: 0.1792 },
    { limiteInferior: 8651.41, limiteSuperior: 17448.75, cuotaFija: 916.20, tasa: 0.2136 },
    { limiteInferior: 17448.76, limiteSuperior: 27501.60, cuotaFija: 2795.25, tasa: 0.2352 },
    { limiteInferior: 27501.61, limiteSuperior: 52505.25, cuotaFija: 5159.70, tasa: 0.30 },
    { limiteInferior: 52505.26, limiteSuperior: 70006.95, cuotaFija: 12660.75, tasa: 0.32 },
    { limiteInferior: 70006.96, limiteSuperior: 210020.70, cuotaFija: 18261.30, tasa: 0.34 },
    { limiteInferior: 210020.71, limiteSuperior: null, cuotaFija: 65866.05, tasa: 0.35 },
  ],
};

// ═══════════════════════════════════════════════════════════
// TARIFA MENSUAL 2026
// ═══════════════════════════════════════════════════════════
export const TARIFA_MENSUAL_2026: TarifaISR = {
  ejercicio: 2026,
  periodicidad: 'mensual',
  regimen: 'sueldos',
  fuente: FUENTE_TARIFAS,
  renglones: [
    { limiteInferior: 0.01, limiteSuperior: 844.59, cuotaFija: 0, tasa: 0.0192 },
    { limiteInferior: 844.60, limiteSuperior: 7168.51, cuotaFija: 16.22, tasa: 0.064 },
    { limiteInferior: 7168.52, limiteSuperior: 12598.02, cuotaFija: 420.95, tasa: 0.1088 },
    { limiteInferior: 12598.03, limiteSuperior: 14644.64, cuotaFija: 1011.68, tasa: 0.16 },
    { limiteInferior: 14644.65, limiteSuperior: 17533.64, cuotaFija: 1339.14, tasa: 0.1792 },
    { limiteInferior: 17533.65, limiteSuperior: 35362.83, cuotaFija: 1856.84, tasa: 0.2136 },
    { limiteInferior: 35362.84, limiteSuperior: 55736.68, cuotaFija: 5665.16, tasa: 0.2352 },
    { limiteInferior: 55736.69, limiteSuperior: 106410.50, cuotaFija: 10457.09, tasa: 0.30 },
    { limiteInferior: 106410.51, limiteSuperior: 141880.66, cuotaFija: 25659.23, tasa: 0.32 },
    { limiteInferior: 141880.67, limiteSuperior: 425641.99, cuotaFija: 37009.69, tasa: 0.34 },
    { limiteInferior: 425642.00, limiteSuperior: null, cuotaFija: 133488.54, tasa: 0.35 },
  ],
};

// ═══════════════════════════════════════════════════════════
// MAPA DE TARIFAS
// ═══════════════════════════════════════════════════════════
export const TARIFAS_ISR_2026 = {
  diario: TARIFA_DIARIA_2026,
  semanal: TARIFA_SEMANAL_2026,
  decenal: TARIFA_DECENAL_2026,
  quincenal: TARIFA_QUINCENAL_2026,
  mensual: TARIFA_MENSUAL_2026,
} as const;

// ═══════════════════════════════════════════════════════════
// SUBSIDIO AL EMPLEO (tabla mensual oficial, se prorratea)
// ═══════════════════════════════════════════════════════════
export const SUBSIDIO_EMPLEO_MENSUAL_2026: RenglonSubsidio[] = [
  { limiteInferior: 0.01, limiteSuperior: 1768.96, subsidio: 407.02 },
  { limiteInferior: 1768.97, limiteSuperior: 2653.38, subsidio: 406.83 },
  { limiteInferior: 2653.39, limiteSuperior: 3472.84, subsidio: 406.62 },
  { limiteInferior: 3472.85, limiteSuperior: 3537.15, subsidio: 392.77 },
  { limiteInferior: 3537.16, limiteSuperior: 4446.15, subsidio: 382.46 },
  { limiteInferior: 4446.16, limiteSuperior: 4717.18, subsidio: 354.23 },
  { limiteInferior: 4717.19, limiteSuperior: 5335.42, subsidio: 324.87 },
  { limiteInferior: 5335.43, limiteSuperior: 6224.67, subsidio: 294.63 },
  { limiteInferior: 6224.68, limiteSuperior: 7113.90, subsidio: 253.54 },
  { limiteInferior: 7113.91, limiteSuperior: 7382.33, subsidio: 217.61 },
  { limiteInferior: 7382.34, limiteSuperior: null, subsidio: 0 },
];

export const FUENTE_SUBSIDIO_EMPLEO = FUENTE_SUBSIDIO;