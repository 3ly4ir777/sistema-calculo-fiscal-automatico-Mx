export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-lg">🐧</span>
            <div>
              <p className="font-semibold text-gray-700">
                Calculadora Fiscal MX
              </p>
              <p className="text-gray-500 mt-0.5 max-w-md">
                Proyecto académico · Impuestos II. Los cálculos son
                informativos y no sustituyen una declaración oficial.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {['DOF', 'SAT', 'IMSS', 'INEGI'].map((f) => (
              <span
                key={f}
                className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 font-medium"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-gray-400">
          <p>© 2026 · Versión 0.5.0 Demo</p>
          <p>
            Hecho con Next.js · TypeScript · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}