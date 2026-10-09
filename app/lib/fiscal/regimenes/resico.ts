// RESICO Personas Físicas
// Fuente: SAT — Régimen Simplificado de Confianza
// El cálculo se hace sobre ingresos efectivamente cobrados, SIN deducciones.

export type PeriodicidadResico = 'mensual' | 'anual';

interface RenglonResico {
  limiteIngresos: number | null; // null = "en adelante"
  tasa: number;
}

const TASAS_RESICO_MENSUAL: RenglonResico[] = [
  { limiteIngresos: 25000, tasa: 0.01 },
  { limiteIngresos: 50000, tasa: 0.011 },
  { limiteIngresos: 83888.33, tasa: 0.015 },
  { limiteIngresos: 208333.33, tasa: 0.02 },
  { limiteIngresos: 291666.66, tasa: 0.025 },
];

const TASAS_RESICO_ANUAL: RenglonResico[] = [
  { limiteIngresos: 300000, tasa: 0.01 },
  { limiteIngresos: 600000, tasa: 0.011 },
  { limiteIngresos: 1000000, tasa: 0.015 },
  { limiteIngresos: 2500000, tasa: 0.02 },
  { limiteIngresos: 3500000, tasa: 0.025 },
];

export interface ResultadoResico {
  ingresos: number;
  periodicidad: PeriodicidadResico;
  tasaaplicable: number;
  isr: number;
  fuente: string;
  versionRegla: string;
}

export function calcularRESICO(
  ingresos: number,
  periodicidad: PeriodicidadResico = 'mensual',
): ResultadoResico {
  if (ingresos <= 0) throw new Error('Los ingresos deben ser mayores a cero.');

  const tabla =
    periodicidad === 'mensual' ? TASAS_RESICO_MENSUAL : TASAS_RESICO_ANUAL;

  // Si supera el último tramo, queda fuera de RESICO
  const ultimoTope = tabla[tabla.length - 1].limiteIngresos!;
  if (ingresos > ultimoTope) {
    throw new Error(
      `Los ingresos superan el tope de RESICO (${
        periodicidad === 'mensual' ? 'mensual' : 'anual'
      }: $${ultimoTope.toLocaleString('es-MX')}). El contribuyente queda fuera de este régimen.`,
    );
  }

  const renglon = tabla.find(
    (r) => r.limiteIngresos !== null && ingresos <= r.limiteIngresos,
  )!;

  const isr = ingresos * renglon.tasa;

  return {
    ingresos,
    periodicidad,
    tasaaplicable: renglon.tasa,
    isr,
    fuente:
      'Régimen Simplificado de Confianza (RESICO) Personas Físicas — tabla de tasas aplicables.',
    versionRegla: 'RESICO-PF-2026.1',
  };
}