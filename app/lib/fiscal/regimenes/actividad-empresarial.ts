import { TARIFA_MENSUAL_2026 } from '../tarifas-2026';
import { RenglonTarifa } from '../types';

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
] as const;

export type Mes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface EntradaActividadEmpresarial {
  ingresosAcumulados: number;      // del 1 de enero al último día del mes declarado
  deduccionesAcumuladas: number;   // gastos deducibles acumulados
  mes: Mes;                        // 1 = enero, 12 = diciembre
  pagosProvisionalesPrevios: number;
}

export interface ResultadoActividadEmpresarial {
  mes: Mes;
  mesNombre: string;
  factorEscala: number;            // = mes (para mostrar por qué la tarifa crece)
  ingresosAcumulados: number;
  deduccionesAcumuladas: number;
  baseGravable: number;
  renglonAplicado: RenglonTarifa;
  excedente: number;
  impuestoMarginal: number;
  cuotaFija: number;
  isrAcumulado: number;
  pagosProvisionalesPrevios: number;
  isrDelMes: number;
  fuente: string;
  versionRegla: string;
}

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Genera la tarifa acumulada para el mes N del ejercicio.
 *
 * El SAT define la tarifa de pagos provisionales escalando la tarifa
 * mensual base (Enero) × N. Verificado contra los valores de la hoja
 * "Pagos Mensuales" del Excel del proyecto: Marzo = Enero × 3, etc.
 */
function generarTarifaMes(mes: Mes): RenglonTarifa[] {
  const base = TARIFA_MENSUAL_2026.renglones;

  return base.map((r, i) => {
    // El primer límite inferior SIEMPRE queda en 0.01 (no se escala).
    const limiteInferior =
      i === 0
        ? 0.01
        : redondear(base[i - 1].limiteSuperior! * mes + 0.01);

    const limiteSuperior =
      r.limiteSuperior === null ? null : redondear(r.limiteSuperior * mes);

    return {
      limiteInferior,
      limiteSuperior,
      cuotaFija: redondear(r.cuotaFija * mes),
      tasa: r.tasa,
    };
  });
}

export function calcularActividadEmpresarial(
  entrada: EntradaActividadEmpresarial,
): ResultadoActividadEmpresarial {
  const {
    ingresosAcumulados,
    deduccionesAcumuladas,
    mes,
    pagosProvisionalesPrevios,
  } = entrada;

  // ── Validaciones ──
  if (mes < 1 || mes > 12) {
    throw new Error('El mes debe estar entre 1 y 12.');
  }
  if (ingresosAcumulados <= 0) {
    throw new Error('Los ingresos acumulados deben ser mayores a cero.');
  }
  if (deduccionesAcumuladas < 0) {
    throw new Error('Las deducciones no pueden ser negativas.');
  }
  if (pagosProvisionalesPrevios < 0) {
    throw new Error('Los pagos previos no pueden ser negativos.');
  }

  const baseGravable = ingresosAcumulados - deduccionesAcumuladas;

  // ── Caso sin base gravable: ISR = 0 ──
  if (baseGravable <= 0) {
    return {
      mes,
      mesNombre: MESES[mes - 1],
      factorEscala: mes,
      ingresosAcumulados,
      deduccionesAcumuladas,
      baseGravable: 0,
      renglonAplicado: {
        limiteInferior: 0,
        limiteSuperior: null,
        cuotaFija: 0,
        tasa: 0,
      },
      excedente: 0,
      impuestoMarginal: 0,
      cuotaFija: 0,
      isrAcumulado: 0,
      pagosProvisionalesPrevios,
      isrDelMes: 0,
      fuente:
        'Tarifa mensual de pagos provisionales — Actividad Empresarial (Anexo 8 RMF 2026).',
      versionRegla: 'ACT-EMP-2026.1',
    };
  }

  // ── Ubicar renglón en la tarifa del mes ──
  const renglones = generarTarifaMes(mes);
  const renglon = renglones.find(
    (r) =>
      baseGravable >= r.limiteInferior &&
      (r.limiteSuperior === null || baseGravable <= r.limiteSuperior),
  );
  if (!renglon) {
    throw new Error('La base gravable está fuera de los rangos de la tarifa.');
  }

  // ── Cálculo ──
  const excedente = baseGravable - renglon.limiteInferior;
  const impuestoMarginal = excedente * renglon.tasa;
  const isrAcumulado = impuestoMarginal + renglon.cuotaFija;
  const isrDelMes = Math.max(0, isrAcumulado - pagosProvisionalesPrevios);

  return {
    mes,
    mesNombre: MESES[mes - 1],
    factorEscala: mes,
    ingresosAcumulados,
    deduccionesAcumuladas,
    baseGravable,
    renglonAplicado: renglon,
    excedente,
    impuestoMarginal,
    cuotaFija: renglon.cuotaFija,
    isrAcumulado,
    pagosProvisionalesPrevios,
    isrDelMes,
    fuente:
      'Tarifa mensual de pagos provisionales — Actividad Empresarial (Anexo 8 RMF 2026).',
    versionRegla: 'ACT-EMP-2026.1',
  };
}