import { ParametrosIMSS } from './tipos';

// ═══════════════════════════════════════════════════════════
// PARÁMETROS IMSS 2026
// ═══════════════════════════════════════════════════════════
// ⚠️ ADVERTENCIA:
// - UMA 2026 aún no publicada al momento del MVP. Se usa UMA 2025.
// - Las tasas de Cesantía y Vejez cambian anualmente (reforma 2020).
//   Aquí se usa la tasa 2025 como referencia. Actualizar con DOF.
// ═══════════════════════════════════════════════════════════
export const PARAMETROS_IMSS_2026: ParametrosIMSS = {
  ejercicio: 2026,
  umaDiaria: 113.14, // UMA 2025 (INEGI). TODO: actualizar cuando publique 2026.
  topeUMA: 25,
  primaRiesgoMin: 0.005,
  primaRiesgoMax: 0.15,
  fuente: {
    descripcion:
      'Ley del Seguro Social vigente + valores UMA publicados por INEGI.',
    url: 'https://www.imss.gob.mx/',
    fechaPublicacion: '2025-02-01',
  },
};

// ═══════════════════════════════════════════════════════════
// TASAS POR RAMO (LSS)
// ═══════════════════════════════════════════════════════════
// Nota: Enfermedades y Maternidad se calcula por partes:
//   - Cuota fija: 20.40% del UMA diario × días (patronal)
//   - Excedente de 3 UMA: 1.10% patronal + 0.40% obrero
//   - Prestaciones en dinero: 0.70% patronal + 0.25% obrero
//   - Pensionados y beneficiarios: 1.05% patronal + 0.375% obrero
//   - Ayuda gastos matrimonio: 1.00% patronal
// ═══════════════════════════════════════════════════════════
export const TASAS_IMSS = {
  enfermedadMaternidad: {
    cuotaFijaPatronalUMA: 0.204, // 20.40% del UMA diario
    excedente3UMA: { obrero: 0.004, patronal: 0.011 },
    prestacionesDinero: { obrero: 0.0025, patronal: 0.007 },
    pensionados: { obrero: 0.00375, patronal: 0.0105 },
    gastosMatrimonio: { obrero: 0, patronal: 0.01 },
  },
  invalidezVida: { obrero: 0.00625, patronal: 0.00625 },
  retiro: { obrero: 0, patronal: 0.02 },
  cesantiaVejez: {
    // TODO: A partir de 2027 esta tasa cambia según salario y antigüedad.
    // Por ahora usamos la tasa 2025 vigente para el tramo base.
    obrero: 0.01125,
    patronal: 0.03150,
  },
  guarderiasPrestaciones: { obrero: 0, patronal: 0.01 },
  infonavit: { obrero: 0, patronal: 0.05 },
};

// ═══════════════════════════════════════════════════════════
// TABLA DE CESANTÍA Y VEJEZ POR TRAMO DE SBC EN UMAS
// ═══════════════════════════════════════════════════════════
// Reforma 2020: la tasa patronal sube progresivamente por tramo.
// Aquí se deja un esquema simplificado 2025. TODO: parametrizar 2026.
// ═══════════════════════════════════════════════════════════
export const CESANTIA_VEJEZ_2025 = {
  obrero: 0.01125,
  patronal: 0.03150,
};