export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-700">
            🐧 Calculadora Fiscal MX
          </p>
          <p>
            Proyecto académico · Impuestos II · Los cálculos son informativos
            y no sustituyen una declaración oficial.
          </p>
        </div>
        <div className="sm:text-right">
          <p>
            Fuentes: DOF · SAT · IMSS
          </p>
          <p>Ejercicio fiscal 2026 · v0.1.0</p>
        </div>
      </div>
    </footer>
  );
}