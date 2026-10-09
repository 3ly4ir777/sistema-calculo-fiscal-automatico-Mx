'use client';

import { useState } from 'react';
import {
  calcularRESICO,
  PeriodicidadResico,
  ResultadoResico,
} from '@/lib/fiscal/regimenes/resico';

export default function ResicoCalculator() {
  const [ingresos, setIngresos] = useState<number>(25000);
  const [periodicidad, setPeriodicidad] =
    useState<PeriodicidadResico>('mensual');
  const [resultado, setResultado] = useState<ResultadoResico | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calcular = () => {
    setError(null);
    try {
      setResultado(calcularRESICO(ingresos, periodicidad));
    } catch (e: any) {
      setError(e.message);
      setResultado(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          RESICO Personas Físicas
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Régimen Simplificado de Confianza · Cálculo sobre ingresos cobrados,
          sin deducciones
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingresos {periodicidad === 'mensual' ? 'del mes' : 'del año'}
            </label>
            <input
              type="number"
              value={ingresos}
              onChange={(e) => setIngresos(parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periodicidad
            </label>
            <select
              value={periodicidad}
              onChange={(e) =>
                setPeriodicidad(e.target.value as PeriodicidadResico)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>
          </div>
        </div>

        <button
          onClick={calcular}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700"
        >
          Calcular ISR RESICO
        </button>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {resultado && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Resultado</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ingresos cobrados</span>
              <span className="font-mono">
                ${resultado.ingresos.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasa aplicable</span>
              <span className="font-mono">
                {(resultado.tasaaplicable * 100).toFixed(2)}%
              </span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-bold text-blue-700">
              <span>ISR a pagar</span>
              <span className="font-mono">${resultado.isr.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t text-xs text-gray-500">
            <p className="font-semibold mb-1">Fuente:</p>
            <p>{resultado.fuente}</p>
            <p className="mt-1">
              Versión de regla: <code>{resultado.versionRegla}</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}