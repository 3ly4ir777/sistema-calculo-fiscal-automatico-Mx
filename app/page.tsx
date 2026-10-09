import Link from 'next/link';
import { TEMAS } from '@/lib/ui/theme';

const MODULOS = [
  {
    href: '/sueldos',
    titulo: 'Sueldos y Salarios',
    desc: 'ISR de retenciones periódicas para personas físicas.',
    icon: '💼',
    estado: 'Disponible',
    tema: 'sueldos',
  },
  {
    href: '/honorarios',
    titulo: 'Honorarios',
    desc: 'Retenciones de ISR e IVA para actividad profesional.',
    icon: '🧾',
    estado: 'Disponible',
    tema: 'honorarios',
  },
  {
    href: '/arrendamiento',
    titulo: 'Arrendamiento',
    desc: 'Pagos provisionales mensuales de ISR.',
    icon: '🏘️',
    estado: 'Disponible',
    tema: 'arrendamiento',
  },
  {
    href: '/actividad-empresarial',
    titulo: 'Actividad Empresarial',
    desc: 'Pagos provisionales acumulados del ejercicio.',
    icon: '📊',
    estado: 'Disponible',
    tema: 'actividad-empresarial',
  },
  {
    href: '/resico',
    titulo: 'RESICO PF',
    desc: 'Régimen Simplificado de Confianza para personas físicas.',
    icon: '⚡',
    estado: 'Disponible',
    tema: 'resico',
  },
  {
    href: '/imss',
    titulo: 'IMSS',
    desc: 'Cuotas obrero-patronales por periodo.',
    icon: '🏥',
    estado: 'Beta',
    tema: 'imss',
  },
] as const;

const STATS = [
  { label: 'Regímenes', valor: '5', icon: '📋' },
  { label: 'Periodicidades', valor: '5', icon: '📅' },
  { label: 'Fuentes oficiales', valor: '8', icon: '📚' },
  { label: 'Ejercicio', valor: '2026', icon: '🗓️' },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-8 sm:p-10 text-white shadow-xl">
        {/* Decoración de fondo */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🐧</span>
            <span className="text-xs uppercase tracking-widest text-white/80 font-semibold">
              Proyecto académico · Impuestos II
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Calculadora Fiscal México
          </h1>
          <p className="text-white/85 max-w-2xl text-sm sm:text-base">
            Sistema modular para cálculo fiscal del ejercicio 2026. Cada módulo
            consume un motor separado, con fuentes oficiales y versionado de
            reglas.
          </p>
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-lg font-bold text-gray-800">{s.valor}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Módulos ─── */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Módulos disponibles
          </h2>
          <span className="text-xs text-gray-400">
            {MODULOS.length} módulos activos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULOS.map((m) => {
            const tema = TEMAS[m.tema];
            return (
              <Link
                key={m.href}
                href={m.href}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                {/* Franja de color superior */}
                <div className={`h-1.5 bg-gradient-to-r ${tema.gradient}`} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tema.gradient} flex items-center justify-center text-2xl shadow-sm`}
                    >
                      {m.icon}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wide ${tema.badge}`}
                    >
                      {m.estado}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-800 text-base mb-1 group-hover:text-gray-900">
                    {m.titulo}
                  </h3>
                  <p className="text-sm text-gray-500 leading-snug mb-4">
                    {m.desc}
                  </p>

                  <span
                    className={`text-xs font-semibold ${tema.text} inline-flex items-center gap-1 group-hover:gap-2 transition-all`}
                  >
                    Abrir módulo <span>→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── Roadmap ─── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🚀</span>
          <h2 className="font-semibold text-gray-800">Roadmap</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { texto: 'Nómina completa', estado: 'soon' },
            { texto: 'Recibo PDF', estado: 'done' },
            { texto: 'Personas morales', estado: 'soon' },
            { texto: 'IVA / IEPS', estado: 'soon' },
            { texto: 'Versionado de reglas', estado: 'wip' },
            { texto: 'Actualización de fuentes', estado: 'wip' },
          ].map((item) => (
            <span
              key={item.texto}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border ${
                item.estado === 'done'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : item.estado === 'wip'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}
            >
              {item.estado === 'done' && '✓ '}
              {item.estado === 'wip' && '◐ '}
              {item.texto}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}