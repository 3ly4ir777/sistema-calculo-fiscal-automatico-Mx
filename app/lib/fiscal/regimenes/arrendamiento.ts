import { TARIFA_MENSUAL_2026 } from '../tarifas-2026';

export interface ResultadoArrendamiento {
  ingresos: number;
  renglonAplicado: {
    limiteInferior: number;
    cuotaFija: number;
    tasa: number;
  };
  excedente: number;
  impuestoMarginal: number;
  isr: number;
  fuente: string;
  versionRegla: string;
}

export function calcularArrendamiento(
  ingresosMensuales: number,
): ResultadoArrendamiento {
  if (ingresosMensuales <= 0) {
    throw new Error('Los ingresos deben ser mayores a cero.');
  }

  const renglon = TARIFA_MENSUAL_2026.renglones.find(
    (r) =>
      ingresosMensuales >= r.limiteInferior &&
      (r.limiteSuperior === null || ingresosMensuales <= r.limiteSuperior),
  );
  if (!renglon) {
    throw new Error('Los ingresos están fuera de los rangos de la tarifa.');
  }

  const excedente = ingresosMensuales - renglon.limiteInferior;
  const impuestoMarginal = excedente * renglon.tasa;
  const isr = impuestoMarginal + renglon.cuotaFija;

  return {
    ingresos: ingresosMensuales,
    renglonAplicado: {
      limiteInferior: renglon.limiteInferior,
      cuotaFija: renglon.cuotaFija,
      tasa: renglon.tasa,
    },
    excedente,
    impuestoMarginal,
    isr,
    fuente:
      'Tarifa mensual de pagos provisionales para personas físicas con ingresos por arrendamiento (Anexo 8 RMF 2026).',
    versionRegla: 'ARRENDAMIENTO-2026.1',
  };
}