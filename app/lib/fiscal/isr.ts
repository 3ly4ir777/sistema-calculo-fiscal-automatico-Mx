import {
  Periodicidad,
  ResultadoISR,
  PERIODICIDAD_DIAS,
} from './types';
import {
  TARIFAS_ISR_2026,
  SUBSIDIO_EMPLEO_MENSUAL_2026,
  FUENTE_SUBSIDIO_EMPLEO,
} from './tarifas-2026';

const DIAS_BASE_MES = 30.4;

export function calcularISRSueldos(
  baseGravable: number,
  periodicidad: Periodicidad = 'quincenal',
): ResultadoISR {
  if (baseGravable <= 0) {
    throw new Error('La base gravable debe ser mayor a cero.');
  }

  const tarifa = TARIFAS_ISR_2026[periodicidad];
  if (!tarifa) {
    throw new Error(`No hay tarifa para la periodicidad: ${periodicidad}`);
  }

  // 1. Encontrar el renglón de la tarifa
  const renglon = tarifa.renglones.find(
    (r) =>
      baseGravable >= r.limiteInferior &&
      (r.limiteSuperior === null || baseGravable <= r.limiteSuperior),
  );
  if (!renglon) {
    throw new Error('La base gravable está fuera de los rangos de la tarifa.');
  }

  // 2. Calcular ISR antes de subsidio
  const excedente = baseGravable - renglon.limiteInferior;
  const impuestoMarginal = excedente * renglon.tasa;
  const isrAntesSubsidio = impuestoMarginal + renglon.cuotaFija;

  // 3. Calcular subsidio al empleo prorrateado al periodo
  const subsidioMensual = calcularSubsidioMensual(baseGravable, periodicidad);
  const diasPeriodo = PERIODICIDAD_DIAS[periodicidad];
  const subsidioEmpleo = (subsidioMensual / DIAS_BASE_MES) * diasPeriodo;

  // 4. ISR neto (nunca negativo)
  const isrNeto = Math.max(0, isrAntesSubsidio - subsidioEmpleo);

  return {
    baseGravable,
    periodicidad,
    renglonAplicado: renglon,
    excedente,
    impuestoMarginal,
    isrAntesSubsidio,
    subsidioEmpleo,
    isrNeto,
    fuente: tarifa.fuente,
    versionRegla: `ISR-SUELDOS-${tarifa.ejercicio}.1`,
  };
}

/**
 * El subsidio al empleo se calcula sobre la base mensual.
 * Para periodos no mensuales, prorrateamos la base al equivalente mensual
 * para ubicar el renglón correcto, y luego prorrateamos el subsidio.
 */
function calcularSubsidioMensual(
  baseGravable: number,
  periodicidad: Periodicidad,
): number {
  const diasPeriodo = PERIODICIDAD_DIAS[periodicidad];
  const baseMensualEquivalente = (baseGravable / diasPeriodo) * DIAS_BASE_MES;

  const renglon = SUBSIDIO_EMPLEO_MENSUAL_2026.find(
    (r) =>
      baseMensualEquivalente >= r.limiteInferior &&
      (r.limiteSuperior === null || baseMensualEquivalente <= r.limiteSuperior),
  );

  return renglon?.subsidio ?? 0;
}

export function obtenerFuenteSubsidio() {
  return FUENTE_SUBSIDIO_EMPLEO;
}