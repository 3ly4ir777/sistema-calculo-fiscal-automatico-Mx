export interface ModuloTema {
  nombre: string;
  gradient: string;      // para el card del dashboard
  bg: string;            // fondo suave
  border: string;        // borde suave
  text: string;          // texto acento
  badge: string;         // para badges de estado
}

export const TEMAS: Record<string, ModuloTema> = {
  sueldos: {
    nombre: 'Sueldos',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
  },
  honorarios: {
    nombre: 'Honorarios',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-700',
  },
  arrendamiento: {
    nombre: 'Arrendamiento',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  'actividad-empresarial': {
    nombre: 'Actividad Empresarial',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
  },
  resico: {
    nombre: 'RESICO',
    gradient: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-700',
    badge: 'bg-pink-100 text-pink-700',
  },
  imss: {
    nombre: 'IMSS',
    gradient: 'from-cyan-500 to-sky-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    badge: 'bg-cyan-100 text-cyan-700',
  },
  fuentes: {
    nombre: 'Fuentes',
    gradient: 'from-slate-500 to-gray-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    badge: 'bg-slate-100 text-slate-700',
  },
};