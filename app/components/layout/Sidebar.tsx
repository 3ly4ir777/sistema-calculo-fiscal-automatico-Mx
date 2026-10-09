'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface SidebarItem {
  href: string;
  label: string;
  icon: string;
  grupo: string;
}

const ITEMS: SidebarItem[] = [
  { href: '/', label: 'Inicio', icon: '🏠', grupo: 'General' },
  { href: '/fuentes', label: 'Fuentes Oficiales', icon: '📚', grupo: 'General' },
  { href: '/sueldos', label: 'Sueldos y Salarios', icon: '💼', grupo: 'Personas Físicas' },
  { href: '/honorarios', label: 'Honorarios', icon: '🧾', grupo: 'Personas Físicas' },
  { href: '/arrendamiento', label: 'Arrendamiento', icon: '🏠', grupo: 'Personas Físicas' },
  { href: '/resico', label: 'RESICO PF', icon: '⚡', grupo: 'Personas Físicas' },
  { href: '/imss', label: 'IMSS', icon: '🏥', grupo: 'Nómina' },
];

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
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
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
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐧</span>
            <span className="font-bold text-gray-800">Fiscal MX</span>
          </div>
          <button
            onClick={onCerrar}
            className="lg:hidden text-gray-500 hover:text-gray-800"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <nav className="p-3 overflow-y-auto h-[calc(100%-60px)]">
          {Object.entries(grupos).map(([grupo, items]) => (
            <div key={grupo} className="mb-4">
              <p className="text-xs uppercase tracking-wider text-gray-400 px-3 mb-2">
                {grupo}
              </p>
              <ul className="space-y-1">
                {items.map((item) => {
                  const activo = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onCerrar}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                          transition-colors
                          ${
                            activo
                              ? 'bg-blue-50 text-blue-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
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