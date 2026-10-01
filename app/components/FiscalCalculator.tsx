'use client';

import { useState } from 'react';
import { calcularISRSueldos } from '@/lib/fiscal/isr';
import {
  Periodicidad,
  PERIODICIDAD_LABEL,
  ResultadoISR,
} from '@/lib/fiscal/types';
import { generarReciboNominaPDF, DatosRecibo } from '@/lib/fiscal/pdf/generar-recibo';

export default function FiscalCalculator() {
  // ─── Estado del cálculo ───
  const [sueldo, setSueldo] = useState<number>(9600);
  const [periodicidad, setPeriodicidad] = useState<Periodicidad>('quincenal');
  const [resultado, setResultado] = useState<ResultadoISR | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Datos para el recibo ───
  const [empresa, setEmpresa] = useState({
    nombre: 'Mi Empresa S.A. de C.V.',
    registroPatronal: 'A1234567890',
    direccion: 'Av. Reforma 123, CDMX',
  });
  const [trabajador, setTrabajador] = useState({
    numeroEmpleado: 'EMP-001',
    nombre: 'Juan Pérez López',
    curp: 'PELJ900101HDFRRN01',
    rfc: 'PELJ900101ABC',
    nss: '12345678901',
    centroCosto: 'ADMIN',
    departamento: 'Contabilidad',
    semana: 'SEM-42',
  });

  const handleCalcular = () => {
    setError(null);
    try {
      const res = calcularISRSueldos(sueldo, periodicidad);
      setResultado(res);
    } catch (e: any) {
      setError(e.message);
      setResultado(null);
    }
  };

  const handleGenerarPDF = () => {
    if (!resultado) return;

    const hoy = new Date();
    const fechaPago = hoy.toLocaleDateString('es-MX');
    const folio = `NOM-${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, '0')}-${trabajador.numeroEmpleado}`;

    const datos: DatosRecibo = {
      folio,
      fechaPago,
      periodoInicio: '01/10/2026',
      periodoFin: '15/10/2026',
      periodicidad,
      empresa,
      trabajador,
      percepciones: [
        {
          clave: '001',
          concepto: 'Sueldo / percepción gravable',
          unidades: 1,
          valor: resultado.baseGravable,
        },
      ],
      deducciones: [
        {
          clave: '002',
          concepto: 'ISR',
          saldo: 0,
          valor: resultado.isrNeto,
        },
      ],
      bonosDespensa: 0,
    };

    const doc = generarReciboNominaPDF(datos);
    doc.save(`recibo-${folio}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ─── Formulario ─── */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Calculadora ISR 2026
        </h1>
        <p className="text-gray-500 mb-6">
          Persona Física · Sueldos y Salarios
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sueldo Gravable
            </label>
            <input
              type="number"
              value={sueldo}
              onChange={(e) => setSueldo(parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periodicidad
            </label>
            <select
              value={periodicidad}
              onChange={(e) => setPeriodicidad(e.target.value as Periodicidad)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              {Object.entries(PERIODICIDAD_LABEL).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCalcular}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Calcular ISR
        </button>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* ─── Resultados ─── */}
      {resultado && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Desglose del Cálculo
          </h2>

          <div className="space-y-2 text-sm">
            <Row label="Sueldo Gravable" value={resultado.baseGravable} />
            <Row label="Límite Inferior" value={resultado.renglonAplicado.limiteInferior} />
            <Row label="Excedente" value={resultado.excedente} />
            <Row
              label="Tasa Aplicable"
              value={`${(resultado.renglonAplicado.tasa * 100).toFixed(2)}%`}
              raw
            />
            <Row label="Impuesto Marginal" value={resultado.impuestoMarginal} />
            <Row label="Cuota Fija" value={resultado.renglonAplicado.cuotaFija} />

            <hr className="border-gray-300 my-2" />
            <Row
              label="ISR antes de Subsidio"
              value={resultado.isrAntesSubsidio}
              bold
            />
            <Row
              label="Subsidio al Empleo"
              value={`-$${resultado.subsidioEmpleo.toFixed(2)}`}
              raw
              color="text-green-600"
            />

            <hr className="border-gray-300 my-2" />
            <div className="flex justify-between text-lg font-bold text-blue-700">
              <span>ISR a Retener</span>
              <span className="font-mono">${resultado.isrNeto.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleGenerarPDF}
            className="mt-6 w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            📄 Generar Recibo de Nómina PDF
          </button>

          <div className="mt-6 pt-4 border-t border-gray-300 text-xs text-gray-500">
            <p className="font-semibold mb-1">Fuente Oficial:</p>
            <p>{resultado.fuente.descripcion}</p>
            <p className="mt-1">Versión de regla: {resultado.versionRegla}</p>
          </div>
        </div>
      )}

      {/* ─── Placeholder IMSS ─── */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-dashed border-2 border-gray-300 text-center text-gray-500">
        <p className="font-semibold">Módulo IMSS</p>
        <p className="text-sm">
          Próximamente: SBC, cuotas obrero-patronales, prima de riesgo.
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  raw,
  color,
}: {
  label: string;
  value: number | string;
  bold?: boolean;
  raw?: boolean;
  color?: string;
}) {
  const display =
    typeof value === 'number' ? `$${value.toFixed(2)}` : value;
  return (
    <div className={`flex justify-between ${bold ? 'font-semibold' : ''} ${color ?? ''}`}>
      <span className="text-gray-600">{label}:</span>
      <span className="font-mono">{raw ? display : display}</span>
    </div>
  );
}