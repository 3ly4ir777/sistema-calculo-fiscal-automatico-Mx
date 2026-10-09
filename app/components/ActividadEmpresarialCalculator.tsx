'use client';

import { useState } from 'react';
import {
  calcularActividadEmpresarial,
  MESES,
  Mes,
  ResultadoActividadEmpresarial,
} from '@/lib/fiscal/regimenes/actividad-empresarial';

export default function ActividadEmpresarialCalculator() {
  const [mes, setMes] = useState<Mes>(1);
  const [ingresosAcumulados, setIngresosAcumulados] = useState<number>(30000);
  const [deduccionesAcumuladas, setDeduccionesAcumuladas] = useState<number>(0);
  const [pagosPrevios, setPagosPrevios] = useState<number>(0);

  const [resultado, setResultado] =
    useState<ResultadoActividadEmpresarial | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calcular = () => {
    setError(null);
    try {
      setResultado(
        calcularActividadEmpresarial({
          mes,
          ingresosAcumulados,
          deduccionesAcumuladas,
          pagosProvisionalesPrevios: pagosPrevios,
        }),
      );
    } catch (e: any) {
      setError(e.message);
      setResultado(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Actividad Empresarial
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Persona Física · Pagos provisionales acumulados de ISR
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mes de la declaración
            </label>
            <select
              value={mes}
              onChange={(e) => setMes(Number(e.target.value) as Mes)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {MESES.map((nombre, i) => (
                <option key={i} value={i + 1}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pagos provisionales previos ($)
            </label>
            <input
              type="number"
              value={pagosPrevios}
              onChange={(e) => setPagosPrevios(parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingresos acumulados del ejercicio
            </label>
            <input
              type="number"
              value={ingresosAcumulados}
              onChange={(e) =>
                setIngresosAcumulados(parseFloat(e.target.value) || 0)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deducciones acumuladas
            </label>
            <input
              type="number"
              value={deduccionesAcumuladas}
              onChange={(e) =>
                setDeduccionesAcumuladas(parseFloat(e.target.value) || 0)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={calcular}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Calcular pago provisional
        </button>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {resultado && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Declaración de {resultado.mesNombre}
            </h2>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
              Tarifa × {resultado.factorEscala}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <Row label="Ingresos acumulados" value={resultado.ingresosAcumulados} />
            <Row
              label="Deducciones acumuladas"
              value={-resultado.deduccionesAcumuladas}
              color="text-red-600"
            />
            <Row label="Base gravable" value={resultado.baseGravable} bold />

            <hr className="border-gray-200 my-3" />

            <Row
              label="Límite inferior aplicable"
              value={resultado.renglonAplicado.limiteInferior}
            />
            <Row label="Excedente" value={resultado.excedente} />
            <Row
              label="Tasa aplicable"
              value={`${(resultado.renglonAplicado.tasa * 100).toFixed(2)}%`}
              raw
            />
            <Row label="Impuesto marginal" value={resultado.impuestoMarginal} />
            <Row label="Cuota fija" value={resultado.cuotaFija} />

            <hr className="border-gray-200 my-3" />

            <Row
              label="ISR acumulado del ejercicio"
              value={resultado.isrAcumulado}
              bold
            />
            <Row
              label="Pagos provisionales previos"
              value={-resultado.pagosProvisionalesPrevios}
              color="text-red-600"
            />

            <hr className="border-gray-200 my-3" />

            <div className="flex justify-between text-lg font-bold text-blue-700">
              <span>ISR del mes a pagar</span>
              <span className="font-mono">
                ${resultado.isrDelMes.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-200 text-xs text-gray-500">
            <p className="font-semibold mb-1">Fuente oficial:</p>
            <p>{resultado.fuente}</p>
            <p className="mt-1">
              Versión de regla: <code>{resultado.versionRegla}</code>
            </p>
          </div>

          <div className="mt-5 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-900">
            <p className="font-semibold mb-1">💡 ¿Por qué la tarifa crece cada mes?</p>
            <p>
              El SAT acumula los ingresos del ejercicio. En {resultado.mesNombre}{' '}
              se aplica la tarifa mensual multiplicada por {resultado.factorEscala},
              porque representa {resultado.factorEscala}{' '}
              {resultado.factorEscala === 1 ? 'mes' : 'meses'} de ingreso.
            </p>
          </div>
        </div>
      )}
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
  const display = typeof value === 'number' ? `$${value.toFixed(2)}` : value;
  return (
    <div
      className={`flex justify-between ${bold ? 'font-semibold' : ''} ${
        color ?? ''
      }`}
    >
      <span className="text-gray-600">{label}</span>
      <span className="font-mono">{raw ? display : display}</span>
    </div>
  );
}