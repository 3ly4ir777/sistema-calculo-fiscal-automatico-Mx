import {
  EntradaIMSS,
  ResultadoIMSS,
  RenglonCuota,
} from './tipos';
import {
  PARAMETROS_IMSS_2026,
  TASAS_IMSS,
} from './parametros-2026';

/**
 * Calcula las cuotas obrero-patronales del IMSS para un periodo.
 *
 * IMPORTANTE: esto es una implementación del MVP con las tasas
 * generales de la LSS. NO sustituye al SUA. En particular:
 *  - Cesantía y Vejez usa la tasa 2025 en lugar de la escalonada 2026.
 *  - No incluye cuotas adicionales por ramos específicos.
 *  - No aplica exenciones por discapacidad o condiciones especiales.
 */
export function calcularCuotasIMSS(entrada: EntradaIMSS): ResultadoIMSS {
  const { umaDiaria, topeUMA, fuente } = PARAMETROS_IMSS_2026;
  const { sbc, diasPeriodo, primaRiesgo } = entrada;

  if (sbc <= 0) throw new Error('El SBC debe ser mayor a cero.');
  if (diasPeriodo <= 0) throw new Error('Los días del periodo deben ser positivos.');
  if (primaRiesgo < 0.005 || primaRiesgo > 0.15) {
    throw new Error(
      'La prima de riesgo debe estar entre 0.5% y 15% (0.005 y 0.15).',
    );
  }

  // 1. Tope de 25 UMAS para SBC
  const sbcTope = umaDiaria * topeUMA;
  const sbcAjustado = Math.min(sbc, sbcTope);

  // 2. Base para excedente de 3 UMAS
  const base3UMA = umaDiaria * 3;
  const excedente3UMA = Math.max(0, sbcAjustado - base3UMA);

  const renglones: RenglonCuota[] = [];

  // ─── Enfermedades y Maternidad ───
  // Cuota fija patronal: 20.40% del UMA diario × días
  const cf = umaDiaria * TASAS_IMSS.enfermedadMaternidad.cuotaFijaPatronalUMA * diasPeriodo;
  renglones.push({
    ramo: 'Enfermedades y Maternidad',
    concepto: 'Cuota fija (20.40% UMA)',
    base: umaDiaria * diasPeriodo,
    tasaObrero: 0,
    tasaPatronal: TASAS_IMSS.enfermedadMaternidad.cuotaFijaPatronalUMA,
    importeObrero: 0,
    importePatronal: redondear(cf),
  });

  // Excedente de 3 UMAS
  const emExcedenteObrero =
    excedente3UMA * diasPeriodo * TASAS_IMSS.enfermedadMaternidad.excedente3UMA.obrero;
  const emExcedentePatronal =
    excedente3UMA * diasPeriodo * TASAS_IMSS.enfermedadMaternidad.excedente3UMA.patronal;
  renglones.push({
    ramo: 'Enfermedades y Maternidad',
    concepto: 'Excedente de 3 UMA',
    base: excedente3UMA * diasPeriodo,
    tasaObrero: TASAS_IMSS.enfermedadMaternidad.excedente3UMA.obrero,
    tasaPatronal: TASAS_IMSS.enfermedadMaternidad.excedente3UMA.patronal,
    importeObrero: redondear(emExcedenteObrero),
    importePatronal: redondear(emExcedentePatronal),
  });

  // Prestaciones en dinero
  const emPrestacionesObrero =
    sbcAjustado * diasPeriodo * TASAS_IMSS.enfermedadMaternidad.prestacionesDinero.obrero;
  const emPrestacionesPatronal =
    sbcAjustado * diasPeriodo * TASAS_IMSS.enfermedadMaternidad.prestacionesDinero.patronal;
  renglones.push({
    ramo: 'Enfermedades y Maternidad',
    concepto: 'Prestaciones en dinero',
    base: sbcAjustado * diasPeriodo,
    tasaObrero: TASAS_IMSS.enfermedadMaternidad.prestacionesDinero.obrero,
    tasaPatronal: TASAS_IMSS.enfermedadMaternidad.prestacionesDinero.patronal,
    importeObrero: redondear(emPrestacionesObrero),
    importePatronal: redondear(emPrestacionesPatronal),
  });

  // Pensionados y beneficiarios
  const emPensionadosObrero =
    sbcAjustado * diasPeriodo * TASAS_IMSS.enfermedadMaternidad.pensionados.obrero;
  const emPensionadosPatronal =
    sbcAjustado * diasPeriodo * TASAS_IMSS.enfermedadMaternidad.pensionados.patronal;
  renglones.push({
    ramo: 'Enfermedades y Maternidad',
    concepto: 'Pensionados y beneficiarios',
    base: sbcAjustado * diasPeriodo,
    tasaObrero: TASAS_IMSS.enfermedadMaternidad.pensionados.obrero,
    tasaPatronal: TASAS_IMSS.enfermedadMaternidad.pensionados.patronal,
    importeObrero: redondear(emPensionadosObrero),
    importePatronal: redondear(emPensionadosPatronal),
  });

  // Ayuda gastos matrimonio (solo patronal)
  const emMatrimonio =
    sbcAjustado * diasPeriodo * TASAS_IMSS.enfermedadMaternidad.gastosMatrimonio.patronal;
  renglones.push({
    ramo: 'Enfermedades y Maternidad',
    concepto: 'Ayuda gastos matrimonio',
    base: sbcAjustado * diasPeriodo,
    tasaObrero: 0,
    tasaPatronal: TASAS_IMSS.enfermedadMaternidad.gastosMatrimonio.patronal,
    importeObrero: 0,
    importePatronal: redondear(emMatrimonio),
  });

  // ─── Invalidez y Vida ───
  const ivObrero = sbcAjustado * diasPeriodo * TASAS_IMSS.invalidezVida.obrero;
  const ivPatronal = sbcAjustado * diasPeriodo * TASAS_IMSS.invalidezVida.patronal;
  renglones.push({
    ramo: 'Invalidez y Vida',
    concepto: 'Cuota',
    base: sbcAjustado * diasPeriodo,
    tasaObrero: TASAS_IMSS.invalidezVida.obrero,
    tasaPatronal: TASAS_IMSS.invalidezVida.patronal,
    importeObrero: redondear(ivObrero),
    importePatronal: redondear(ivPatronal),
  });

  // ─── Retiro ───
  const retiroPatronal = sbcAjustado * diasPeriodo * TASAS_IMSS.retiro.patronal;
  renglones.push({
    ramo: 'Retiro',
    concepto: 'Cuota (2.00%)',
    base: sbcAjustado * diasPeriodo,
    tasaObrero: 0,
    tasaPatronal: TASAS_IMSS.retiro.patronal,
    importeObrero: 0,
    importePatronal: redondear(retiroPatronal),
  });

  // ─── Cesantía y Vejez ───
  const cvObrero = sbcAjustado * diasPeriodo * TASAS_IMSS.cesantiaVejez.obrero;
  const cvPatronal = sbcAjustado * diasPeriodo * TASAS_IMSS.cesantiaVejez.patronal;
  renglones.push({
    ramo: 'Cesantía y Vejez',
    concepto: 'Cuota (tasa 2025 de referencia)',
    base: sbcAjustado * diasPeriodo,
    tasaObrero: TASAS_IMSS.cesantiaVejez.obrero,
    tasaPatronal: TASAS_IMSS.cesantiaVejez.patronal,
    importeObrero: redondear(cvObrero),
    importePatronal: redondear(cvPatronal),
  });

  // ─── Guarderías y Prestaciones Sociales ───
  const gpsPatronal =
    sbcAjustado * diasPeriodo * TASAS_IMSS.guarderiasPrestaciones.patronal;
  renglones.push({
    ramo: 'Guarderías y Prestaciones Sociales',
    concepto: 'Cuota (1.00%)',
    base: sbcAjustado * diasPeriodo,
    tasaObrero: 0,
    tasaPatronal: TASAS_IMSS.guarderiasPrestaciones.patronal,
    importeObrero: 0,
    importePatronal: redondear(gpsPatronal),
  });

  // ─── Riesgos de Trabajo ───
  const rtPatronal = sbcAjustado * diasPeriodo * primaRiesgo;
  renglones.push({
    ramo: 'Riesgos de Trabajo',
    concepto: `Prima ${(primaRiesgo * 100).toFixed(3)}%`,
    base: sbcAjustado * diasPeriodo,
    tasaObrero: 0,
    tasaPatronal: primaRiesgo,
    importeObrero: 0,
    importePatronal: redondear(rtPatronal),
  });

  // ─── INFONAVIT ───
  const infonavitPatronal = sbcAjustado * diasPeriodo * TASAS_IMSS.infonavit.patronal;
  renglones.push({
    ramo: 'INFONAVIT',
    concepto: 'Aportación (5.00%)',
    base: sbcAjustado * diasPeriodo,
    tasaObrero: 0,
    tasaPatronal: TASAS_IMSS.infonavit.patronal,
    importeObrero: 0,
    importePatronal: redondear(infonavitPatronal),
  });

  const totalObrero = redondear(
    renglones.reduce((s, r) => s + r.importeObrero, 0),
  );
  const totalPatronal = redondear(
    renglones.reduce((s, r) => s + r.importePatronal, 0),
  );

  return {
    sbc,
    sbcAjustado,
    umaDiaria,
    excedente3UMA,
    diasPeriodo,
    renglones,
    totalObrero,
    totalPatronal,
    totalObreroPatronal: redondear(totalObrero + totalPatronal),
    fuente: fuente.descripcion,
  };
}

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}