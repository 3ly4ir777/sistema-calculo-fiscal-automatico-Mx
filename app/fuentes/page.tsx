import { CATALOGO_FUENTES } from '@/lib/fiscal/sources';

export default function FuentesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Fuentes Oficiales
        </h1>
        <p className="text-gray-500 text-sm">
          Documentos oficiales de los que se derivan las tarifas y reglas
          implementadas en el sistema.
        </p>
      </div>

      <div className="space-y-3">
        {CATALOGO_FUENTES.map((f) => (
          <div
            key={f.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                  {f.tipo}
                </span>
                <h3 className="font-semibold text-gray-800">{f.titulo}</h3>
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {f.fechaPublicacion}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3">{f.descripcion}</p>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {f.modulosAfectados.map((m) => (
                <span
                  key={m}
                  className="px-2 py-0.5 rounded bg-gray-100 text-gray-600"
                >
                  {m}
                </span>
              ))}
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-blue-600 hover:underline font-medium"
              >
                Ver fuente oficial ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
        <p className="font-semibold mb-1">⚠️ Sobre la actualización automática</p>
        <p>
          En esta versión las reglas se cargan manualmente al código. La
          evolución planeada incluye un sistema que consulte estas URLs,
          detecte cambios y genere nuevas versiones de reglas pendientes de
          revisión antes de activarse.
        </p>
      </div>
    </div>
  );
}