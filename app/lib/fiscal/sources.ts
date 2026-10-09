export interface FuenteCatalogo {
  id: string;
  tipo: 'DOF' | 'SAT' | 'IMSS' | 'INEGI' | 'LISR' | 'LIVA' | 'LSS';
  titulo: string;
  descripcion: string;
  url: string;
  fechaPublicacion: string;
  modulosAfectados: string[];
}

export const CATALOGO_FUENTES: FuenteCatalogo[] = [
  {
    id: 'anexo-8-rmf-2026',
    tipo: 'SAT',
    titulo: 'Anexo 8 de la RMF 2026',
    descripcion:
      'Tarifas de retención de ISR por sueldos y salarios para distintos periodos (diaria, semanal, decenal, quincenal, mensual, anual).',
    url: 'https://www.sat.gob.mx/normatividad/',
    fechaPublicacion: '2025-12-28',
    modulosAfectados: ['Sueldos y Salarios'],
  },
  {
    id: 'lisr-art-96',
    tipo: 'LISR',
    titulo: 'Ley del ISR, Art. 96',
    descripcion:
      'Obligación de retener ISR por sueldos y salarios y reglas generales de cálculo.',
    url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf',
    fechaPublicacion: '2024-11-15',
    modulosAfectados: ['Sueldos y Salarios', 'Honorarios'],
  },
  {
    id: 'lisr-art-106',
    tipo: 'LISR',
    titulo: 'Ley del ISR, Art. 106',
    descripcion:
      'Retención del 10% por honorarios a personas físicas con actividad profesional.',
    url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf',
    fechaPublicacion: '2024-11-15',
    modulosAfectados: ['Honorarios'],
  },
  {
    id: 'liva-art-1a',
    tipo: 'LIVA',
    titulo: 'Ley del IVA, Art. 1-A',
    descripcion:
      'Retención de 2/3 del IVA cuando el pagador es persona moral.',
    url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LIVA.pdf',
    fechaPublicacion: '2024-11-15',
    modulosAfectados: ['Honorarios'],
  },
  {
    id: 'lss-vigente',
    tipo: 'LSS',
    titulo: 'Ley del Seguro Social',
    descripcion:
      'Bases, tasas y ramos de aseguramiento para el cálculo de cuotas obrero-patronales.',
    url: 'https://www.imss.gob.mx/sites/all/statics/pdf/leyes/LSS.pdf',
    fechaPublicacion: '2024-05-01',
    modulosAfectados: ['IMSS'],
  },
  {
    id: 'uma-inegi',
    tipo: 'INEGI',
    titulo: 'Valor de la UMA vigente',
    descripcion:
      'Unidad de Medida y Actualización publicada anualmente por INEGI. Base para topes de IMSS.',
    url: 'https://www.inegi.org.mx/temas/uma/',
    fechaPublicacion: '2025-02-01',
    modulosAfectados: ['IMSS'],
  },
  {
    id: 'subsidio-empleo',
    tipo: 'DOF',
    titulo: 'Decreto de Subsidio para el Empleo',
    descripcion:
      'Montos y tablas de subsidio al empleo aplicables a retenciones de ISR.',
    url: 'https://www.dof.gob.mx/',
    fechaPublicacion: '2024-12-31',
    modulosAfectados: ['Sueldos y Salarios'],
  },
  {
    id: 'resico-pf',
    tipo: 'SAT',
    titulo: 'RESICO Personas Físicas — Tasa mensual',
    descripcion:
      'Tabla de tasas aplicables al Régimen Simplificado de Confianza para personas físicas sobre ingresos cobrados.',
    url: 'https://www.sat.gob.mx/consultas/76973/conoce-el-esquema-de-los-contribuyentes-en-el-resico',
    fechaPublicacion: '2025-01-01',
    modulosAfectados: ['RESICO'],
  },
];