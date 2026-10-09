'use client';

import { useState } from 'react';
import { calcularISRSueldos } from '@/lib/fiscal/isr';
import {
  Periodicidad,
  PERIODICIDAD_LABEL,
  ResultadoISR,
} from '@/lib/fiscal/types';
import {
  generarReciboNominaPDF,
  DatosRecibo,
} from '@/lib/fiscal/pdf/generar-recibo';

// ─────────────────────────────────────────────────────────
// Tipos internos
// ─────────────────────────────────────────────────────────
interface DatosReciboForm {
  empresa: {
    nombre: string;
    registroPatronal: string;
    direccion: string;
  };
  trabajador: {
    numeroEmpleado: string;
    nombre: string;
    curp: string;
    rfc: string;
    nss: string;
    centroCosto: string;
    departamento: string;
    semana: string;
  };
  periodoInicio: string;
  periodoFin: string;
}

const HOY = new Date().toISOString().split('T')[0];

const DATOS_INICIALES: DatosReciboForm = {
  empresa: {
    nombre: 'Mi Empresa S.A. de C.V.',
    registroPatronal: 'A1234567890',
    direccion: 'Av. Reforma 123, Col. Centro, CDMX',
  },
  trabajador: {
    numeroEmpleado: 'EMP-001',
    nombre: 'Juan Pérez López',
    curp: 'PELJ900101HDFRRN01',
    rfc: 'PELJ900101ABC',
    nss: '12345678901',
    centroCosto: 'ADMIN',
    departamento: 'Contabilidad',
    semana: 'SEM-42',
  },
  periodoInicio: HOY,
  periodoFin: HOY,
};

export default function FiscalCalculator() {
  // Estado del cálculo
  const [sueldo, setSueldo] = useState<number>(9600);
  const [periodicidad, setPeriodicidad] = useState<Periodicidad>('quincenal');
  const [resultado, setResultado] = useState<ResultadoISR | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estado del recibo
  const [datos, setDatos] = useState<DatosReciboForm>(DATOS_INICIALES);
  const [mostrarFormRecibo, setMostrarFormRecibo] = useState(false);

  const handleCalcular = () => {
    setError(null);
    try {
      setResultado(calcularISRSueldos(sueldo, periodicidad));
    } catch (e: any) {
      setError(e.message);
      setResultado(null);
    }
  };

  const handleGenerarPDF = () => {
    if (!resultado) return;

    const hoy = new Date();
    const fechaPago = hoy.toLocaleDateString('es-MX');
    const folio = `NOM-${hoy.getFullYear()}${String(
      hoy.getMonth() + 1,
    ).padStart(2, '0')}-${datos.trabajador.numeroEmpleado || '001'}`;

    const datosPDF: DatosRecibo = {
      folio,
      fechaPago,
      periodoInicio: formatearFecha(datos.periodoInicio),
      periodoFin: formatearFecha(datos.periodoFin),
      periodicidad,
      empresa: datos.empresa,
      trabajador: datos.trabajador,
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

    const doc = generarReciboNominaPDF(datosPDF);
    doc.save(`recibo-${folio}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ─── Formulario de cálculo ─── */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          ISR Sueldos y Salarios
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Persona Física · Cálculo de retenciones periódicas 2026
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sueldo gravable
            </label>
            <input
              type="number"
              value={sueldo}
              onChange={(e) => setSueldo(parseFloat(e.target.value) || 0)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periodicidad
            </label>
            <select
              value={periodicidad}
              onChange={(e) => setPeriodicidad(e.target.value as Periodicidad)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Desglose del cálculo
            </h2>

            <div className="space-y-2 text-sm">
              <Row label="Sueldo gravable" value={resultado.baseGravable} />
              <Row
                label="Límite inferior"
                value={resultado.renglonAplicado.limiteInferior}
              />
              <Row label="Excedente" value={resultado.excedente} />
              <Row
                label="Tasa aplicable"
                value={`${(resultado.renglonAplicado.tasa * 100).toFixed(2)}%`}
                raw
              />
              <Row label="Impuesto marginal" value={resultado.impuestoMarginal} />
              <Row label="Cuota fija" value={resultado.renglonAplicado.cuotaFija} />

              <hr className="border-gray-200 my-3" />

              <Row
                label="ISR antes de subsidio"
                value={resultado.isrAntesSubsidio}
                bold
              />
              <Row
                label="Subsidio al empleo"
                value={`-$${resultado.subsidioEmpleo.toFixed(2)}`}
                raw
                color="text-green-600"
              />

              <hr className="border-gray-200 my-3" />

              <div className="flex justify-between text-lg font-bold text-blue-700">
                <span>ISR a retener</span>
                <span className="font-mono">
                  ${resultado.isrNeto.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200 text-xs text-gray-500">
              <p className="font-semibold mb-1">Fuente oficial:</p>
              <p>{resultado.fuente.descripcion}</p>
              <p className="mt-1">
                Versión de regla: <code>{resultado.versionRegla}</code>
              </p>
            </div>
          </div>

          {/* ─── Sección de recibo ─── */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() => setMostrarFormRecibo((v) => !v)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recibo de nómina
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Personaliza los datos antes de generar el PDF
                </p>
              </div>
              <span className="text-2xl text-gray-400">
                {mostrarFormRecibo ? '▾' : '▸'}
              </span>
            </button>

            {mostrarFormRecibo && (
              <div className="border-t border-gray-200 p-5 space-y-5">
                <Section title="Empresa">
                  <Field
                    label="Nombre"
                    value={datos.empresa.nombre}
                    onChange={(v) =>
                      setDatos({
                        ...datos,
                        empresa: { ...datos.empresa, nombre: v },
                      })
                    }
                  />
                  <Field
                    label="Registro patronal"
                    value={datos.empresa.registroPatronal}
                    onChange={(v) =>
                      setDatos({
                        ...datos,
                        empresa: { ...datos.empresa, registroPatronal: v },
                      })
                    }
                  />
                  <Field
                    label="Dirección"
                    value={datos.empresa.direccion}
                    onChange={(v) =>
                      setDatos({
                        ...datos,
                        empresa: { ...datos.empresa, direccion: v },
                      })
                    }
                    full
                  />
                </Section>

                <Section title="Trabajador">
                  <Field
                    label="No. empleado"
                    value={datos.trabajador.numeroEmpleado}
                    onChange={(v) =>
                      setDatos({
                        ...datos,
                        trabajador: { ...datos.trabajador, numeroEmpleado: v },
                      })
                    }
                  />
                  <Field
                    label="Nombre completo"
                    value={datos.trabajador.nombre}
                    onChange={(v) =>
                      setDatos({
                        ...datos,
                        trabajador: { ...datos.trabajador, nombre: v },
                      })
                    }
                  />
                  <Field
                    label="CURP"
                    value={datos.trabajador.curp}
                    onChange={(v) =>
                      setDatos({
                        ...datos,
                        trabajador: { ...datos.trabajador, curp: v },
                      })
                    }
                  />
                  <Field
                    label="RFC"
                    value={datos.trabajador.rfc}
                    onChange={(v) =>
                      setDatos({
                        ...datos,
                        trabajador: { ...datos.trabajador, rfc: v },
                      })
                    }
                  />
                  <Field
                    label="NSS"
                    value={datos.trabajador.nss}
                    onChange={(v) =>
                      setDatos({
                        ...datos,
                        trabajador: { ...datos.trabajador, nss: v },
                      })
                    }
                  />
                  <Field
                    label="Centro de costo"
                    value={datos.trabajador.centroCosto}
                    onChange={(v) =>
                      setDatos({
                        ...datos,
                        trabajador: { ...datos.trabajador, centroCosto: v },
                      })
                    }
                  />
                  <Field
                    label="Departamento"
                    value={datos.trabajador.departamento}
                    onChange={(v) =>
                      setDatos({
                        ...datos,
                        trabajador: { ...datos.trabajador, departamento: v },
                      })
                    }
                  />
                  <Field
                    label="Semana"
                    value={datos.trabajador.semana}
                    onChange={(v) =>
                      setDatos({
                        ...datos,
                        trabajador: { ...datos.trabajador, semana: v },
                      })
                    }
                  />
                </Section>

                <Section title="Periodo">
                  <Field
                    label="Inicio"
                    type="date"
                    value={datos.periodoInicio}
                    onChange={(v) => setDatos({ ...datos, periodoInicio: v })}
                  />
                  <Field
                    label="Fin"
                    type="date"
                    value={datos.periodoFin}
                    onChange={(v) => setDatos({ ...datos, periodoFin: v })}
                  />
                </Section>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerarPDF}
            className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            📄 Generar recibo de nómina PDF
          </button>
        </>
      )}

      {/* ─── Placeholder IMSS ─── */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-5 text-center text-gray-500">
        <p className="font-semibold text-sm">Módulo IMSS</p>
        <p className="text-xs">
          Cuotas obrero-patronales y SBC — ver módulo específico en el menú.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Helpers UI
// ─────────────────────────────────────────────────────────
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
        {title}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

function formatearFecha(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}