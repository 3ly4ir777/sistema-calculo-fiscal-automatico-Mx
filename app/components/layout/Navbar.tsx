'use client';

interface Props {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Abrir menú"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-lg">📊</span>
            <h1 className="font-semibold text-gray-800">
              Calculadora Fiscal México
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ejercicio 2026
          </span>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
            MX
          </div>
        </div>
      </div>
    </header>
  );
}