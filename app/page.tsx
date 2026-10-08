import Link from 'next/link';

const MODULOS = [
  {
    href: '/sueldos',
    titulo: 'Sueldos y Salarios',
    desc: 'ISR de retenciones periódicas para personas físicas.',
    icon: '💼',
    estado: 'Disponible',
  },
  {
    href: '/honorarios',
    titulo: 'Honorarios',
    desc: 'Retenciones de ISR e IVA para actividad profesional.',
    icon: '🧾',
    estado: 'Disponible',
  },
  {
    href: '/imss',
    titulo: 'IMSS',
    desc: 'Cuotas obrero-patronales por periodo.',
    icon: '🏥',
    estado: 'Beta',
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Calculadora Fiscal México
        </h1>
        <p className="text-gray-500">
          Sistema modular para cálculo fiscal · Ejercicio 2026
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODULOS.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all"
          >
            <div className="text-4xl mb-3">{m.icon}</div>
            <h3 className="font-semibold text-gray-800 text-lg mb-1">
              {m.titulo}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{m.desc}</p>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
              {m.estado}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-6">
        <p className="text-sm text-gray-500">
          <strong className="text-gray-700">Roadmap:</strong> Nómina completa ·
          recibo PDF · RESICO · arrendamiento · IVA/IEPS · personas morales ·
          versionado de reglas.
        </p>
      </div>
    </div>
  );
}