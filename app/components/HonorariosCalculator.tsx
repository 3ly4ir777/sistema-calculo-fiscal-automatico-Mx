'use client';

import { useState } from 'react';
import { calcularHonorarios } from '@/lib/fiscal/honorarios/calcular';
import { ResultadoHonorarios } from '@/lib/fiscal/honorarios/tipos';

export default function HonorariosCalculator() {
  const [subtotal, setSubtotal] = useState<number>(10000);
  const [aplicaRetencionISR, setAplicaRetencionISR] = useState(true);
  const [aplicaRetencionIVA, setAplicaRetencionIVA] = useState(true);
  const [resultado, setResultado] = useState<ResultadoHonorarios | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calcular = () => {
    setError(null);
    try {
      setResultado(
        calcularHonorarios({
          subtotal,
          aplicaRetencionISR,
          aplicaRetencionIVA,
          tasaIVA: 0.16,
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
          Honorarios
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Persona Física con actividad profesional · Retenciones ISR e IVA
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtotal honorarios ($ sin IVA)
            </label>
            <input
              type="number"
              value={subtotal}
              onChange={(e) => setSubtotal(parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={aplicaRetencionISR}
              onChange={(e) => setAplicaRetencionISR(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">
              El cliente retiene ISR (10%) — normalmente sí si es persona moral
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={aplicaRetencionIVA}
              onChange={(e) => setAplicaRetencionIVA(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">
              El cliente retiene IVA (2/3 del IVA trasladado) — solo personas morales
            </span>
          </label>
        </div>

        <button
          onClick={calcular}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700"
        >
          Calcular honorarios
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
            <Row label="Subtotal" value={resultado.subtotal} />
            <Row label="IVA trasladado (16%)" value={resultado.iva} />
            <hr className="my-2" />
            <Row label="Retención ISR (10%)" value={-resultado.retencionISR} color="text-red-600" />
            <Row label="Retención IVA (2/3)" value={-resultado.retencionIVA} color="text-red-600" />
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold text-blue-700 pt-2">
              <span>Total a cobrar</span>
              <span className="font-mono">${resultado.totalACobrar.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 pt-1">
              <span>IVA neto a enterar</span>
              <span className="font-mono">${resultado.ivaNeto.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t text-xs text-gray-500">
            <p className="font-semibold">Fundamento:</p>
            <p>{resultado.fuente}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className={`flex justify-between ${color ?? ''}`}>
      <span className="text-gray-600">{label}</span>
      <span className="font-mono">${value.toFixed(2)}</span>
    </div>
  );
}