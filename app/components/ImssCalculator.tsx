'use client';

import { useState } from 'react';
import { calcularCuotasIMSS } from '@/lib/fiscal/imss/calcular';
import { ResultadoIMSS } from '@/lib/fiscal/imss/tipos';
import { PERIODICIDAD_DIAS, Periodicidad, PERIODICIDAD_LABEL } from '@/lib/fiscal/types';

export default function ImssCalculator() {
  const [sbc, setSbc] = useState<number>(500);
  const [periodicidad, setPeriodicidad] = useState<Periodicidad>('quincenal');
  const [primaRiesgo, setPrimaRiesgo] = useState<number>(0.5); // en %
  const [resultado, setResultado] = useState<ResultadoIMSS | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calcular = () => {
    setError(null);
    try {
      const res = calcularCuotasIMSS({
        sbc,
        diasPeriodo: PERIODICIDAD_DIAS[periodicidad],
        primaRiesgo: primaRiesgo / 100,
      });
      setResultado(res);
    } catch (e: any) {
      setError(e.message);
      setResultado(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Cuotas IMSS
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Cálculo de cuotas obrero-patronales para un periodo
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SBC diario ($)
            </label>
            <input
              type="number"
              value={sbc}
              onChange={(e) => setSbc(parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periodicidad
            </label>
            <select
              value={periodicidad}
              onChange={(e) => setPeriodicidad(e.target.value as Periodicidad)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              {Object.entries(PERIODICIDAD_LABEL).map(([k, l]) => (
                <option key={k} value={k}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prima de riesgo (%)
            </label>
            <input
              type="number"
              step="0.001"
              value={primaRiesgo}
              onChange={(e) => setPrimaRiesgo(parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={calcular}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700"
        >
          Calcular cuotas IMSS
        </button>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {resultado && (
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Desglose de cuotas</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
            <Info label="SBC" valor={`$${resultado.sbc.toFixed(2)}`} />
            <Info label="SBC topado (25 UMA)" valor={`$${resultado.sbcAjustado.toFixed(2)}`} />
            <Info label="Excedente 3 UMA" valor={`$${resultado.excedente3UMA.toFixed(2)}`} />
            <Info label="UMA diaria" valor={`$${resultado.umaDiaria.toFixed(2)}`} />
          </div>

          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="text-left p-2 border">Ramo</th>
                <th className="text-left p-2 border">Concepto</th>
                <th className="text-right p-2 border">Base</th>
                <th className="text-right p-2 border">Obrero</th>
                <th className="text-right p-2 border">Patronal</th>
              </tr>
            </thead>
            <tbody>
              {resultado.renglones.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 border">{r.ramo}</td>
                  <td className="p-2 border">{r.concepto}</td>
                  <td className="p-2 border text-right font-mono">${r.base.toFixed(2)}</td>
                  <td className="p-2 border text-right font-mono">${r.importeObrero.toFixed(2)}</td>
                  <td className="p-2 border text-right font-mono">${r.importePatronal.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={3} className="p-2 border text-right">Totales</td>
                <td className="p-2 border text-right font-mono">${resultado.totalObrero.toFixed(2)}</td>
                <td className="p-2 border text-right font-mono">${resultado.totalPatronal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <TotalCard label="Cuota obrero" value={resultado.totalObrero} color="text-red-600" />
            <TotalCard label="Cuota patronal" value={resultado.totalPatronal} color="text-orange-600" />
            <TotalCard label="Total obrero-patronal" value={resultado.totalObreroPatronal} color="text-blue-700" />
          </div>

          <div className="mt-4 pt-4 border-t text-xs text-gray-500">
            <p className="font-semibold mb-1">⚠️ Advertencia:</p>
            <p>{resultado.fuente}</p>
            <p className="mt-1">
              Este cálculo usa tasas de referencia y no sustituye al SUA del IMSS.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-mono font-semibold">{valor}</p>
    </div>
  );
}

function TotalCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`font-mono font-bold text-lg ${color}`}>${value.toFixed(2)}</p>
    </div>
  );
}