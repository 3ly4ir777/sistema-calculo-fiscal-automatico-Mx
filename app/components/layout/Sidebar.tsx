'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface SidebarItem {
  href: string;
  label: string;
  icon: string;
  grupo: string;
  color: string; // clase de color para el estado activo
}

const ITEMS: SidebarItem[] = [
  { href: '/', label: 'Inicio', icon: '🏠', grupo: 'General', color: 'blue' },
  { href: '/fuentes', label: 'Fuentes Oficiales', icon: '📚', grupo: 'General', color: 'slate' },
  { href: '/sueldos', label: 'Sueldos y Salarios', icon: '💼', grupo: 'Personas Físicas', color: 'blue' },
  { href: '/honorarios', label: 'Honorarios', icon: '🧾', grupo: 'Personas Físicas', color: 'violet' },
  { href: '/arrendamiento', label: 'Arrendamiento', icon: '🏘️', grupo: 'Personas Físicas', color: 'emerald' },
  { href: '/actividad-empresarial', label: 'Actividad Empresarial', icon: '📊', grupo: 'Personas Físicas', color: 'amber' },
  { href: '/resico', label: 'RESICO PF', icon: '⚡', grupo: 'Personas Físicas', color: 'pink' },
  { href: '/imss', label: 'IMSS', icon: '🏥', grupo: 'Nómina', color: 'cyan' },
];

const COLORES: Record<string, { bg: string; text: string; bar: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', bar: 'bg-violet-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-700', bar: 'bg-pink-500' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', bar: 'bg-cyan-500' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-700', bar: 'bg-slate-500' },
};

interface Props {
  abierto: boolean;
  onCerrar: () => void;
}

export default function Sidebar({ abierto, onCerrar }: Props) {
  const pathname = usePathname();

  const grupos = ITEMS.reduce<Record<string, SidebarItem[]>>((acc, item) => {
    acc[item.grupo] = acc[item.grupo] || [];
    acc[item.grupo].push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Overlay para móvil */}
      {abierto && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={onCerrar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40
          transform transition-transform duration-200 ease-in-out
          ${abierto ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0
        `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
              🐧
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm leading-tight">
                Fiscal MX
              </p>
              <p className="text-[10px] text-gray-400 leading-tight">
                v0.1.0 · 2026
              </p>
            </div>
          </Link>
          <button
            onClick={onCerrar}
            className="lg:hidden text-gray-500 hover:text-gray-800 p-1"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <nav className="p-3 overflow-y-auto h-[calc(100%-61px)]">
          {Object.entries(grupos).map(([grupo, items]) => (
            <div key={grupo} className="mb-5">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 px-3 mb-2 font-semibold">
                {grupo}
              </p>
              <ul className="space-y-1">
                {items.map((item) => {
                  const activo = pathname === item.href;
                  const c = COLORES[item.color] ?? COLORES.blue;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onCerrar}
                        className={`
                          relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                          transition-all
                          ${
                            activo
                              ? `${c.bg} ${c.text} font-semibold`
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        {activo && (
                          <span
                            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full ${c.bar}`}
                          />
                        )}
                        <span className="text-base">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}