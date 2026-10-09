'use client';

import { useState } from 'react';
import {
  calcularArrendamiento,
  ResultadoArrendamiento,
} from '@/lib/fiscal/regimenes/arrendamiento';

export default function ArrendamientoCalculator() {
  const [ingresos, setIngresos] = useState<number>(20000);
  const [resultado, setResultado] = useState<ResultadoArrendamiento | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const calcular = () => {
    setError(null);
    try {
      setResultado(calcularArrendamiento(ingresos));
    } catch (e: any) {
      setError(e.message);
      setResultado(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Arrendamiento
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Persona Física · Pagos provisionales mensuales de ISR
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingresos mensuales por arrendamiento
          </label>
          <input
            type="number"
            value={ingresos}
            onChange={(e) => setIngresos(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={calcular}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700"
        >
          Calcular ISR
        </button>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {resultado && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Desglose</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ingresos</span>
              <span className="font-mono">
                ${resultado.ingresos.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Límite inferior</span>
              <span className="font-mono">
                ${resultado.renglonAplicado.limiteInferior.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Excedente</span>
              <span className="font-mono">
                ${resultado.excedente.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tasa</span>
              <span className="font-mono">
                {(resultado.renglonAplicado.tasa * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Impuesto marginal</span>
              <span className="font-mono">
                ${resultado.impuestoMarginal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cuota fija</span>
              <span className="font-mono">
                ${resultado.renglonAplicado.cuotaFija.toFixed(2)}
              </span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-bold text-blue-700">
              <span>ISR del periodo</span>
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