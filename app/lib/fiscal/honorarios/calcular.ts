import { EntradaHonorarios, ResultadoHonorarios } from './tipos';

const TASA_RETENCION_ISR_HONORARIOS = 0.10;
const FACTOR_RETENCION_IVA = 2 / 3; // 66.6667% del IVA

export function calcularHonorarios(
  entrada: EntradaHonorarios,
): ResultadoHonorarios {
  const { subtotal, aplicaRetencionISR, aplicaRetencionIVA, tasaIVA } = entrada;

  if (subtotal <= 0) throw new Error('El subtotal debe ser mayor a cero.');

  // 1. IVA trasladado
  const iva = subtotal * tasaIVA;

  // 2. Retención de ISR (10% del subtotal, NO del total con IVA)
  const retencionISR = aplicaRetencionISR
    ? subtotal * TASA_RETENCION_ISR_HONORARIOS
    : 0;

  // 3. Retención de IVA (2/3 del IVA, solo si el pagador es PM)
  const retencionIVA = aplicaRetencionIVA ? iva * FACTOR_RETENCION_IVA : 0;

  // 4. IVA neto (lo que efectivamente se entera al SAT por el prestador)
  const ivaNeto = iva - retencionIVA;

  // 5. Total factura = subtotal + IVA - retenciones
  const totalFactura = subtotal + iva - retencionISR - retencionIVA;

  return {
    subtotal,
    iva,
    ivaTrasladado: iva,
    retencionISR,
    retencionIVA,
    ivaNeto,
    totalFactura,
    totalACobrar: totalFactura,
    fuente:
      'Art. 106 LISR (retención 10%) y Art. 1-A LIVA (retención 2/3 del IVA).',
  };
}