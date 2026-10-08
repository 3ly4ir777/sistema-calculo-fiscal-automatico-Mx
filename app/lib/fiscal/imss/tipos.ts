export interface ParametrosIMSS {
  ejercicio: number;
  umaDiaria: number;
  topeUMA: number;         // 25 UMAS para el SBC
  primaRiesgoMin: number;  // 0.5%
  primaRiesgoMax: number;  // 15%
  fuente: {
    descripcion: string;
    url: string;
    fechaPublicacion: string;
  };
}

export interface EntradaIMSS {
  sbc: number;              // Salario Base de Cotización diario
  diasPeriodo: number;      // 15 por quincena, 7 semanal, etc.
  primaRiesgo: number;      // Ej: 0.005 = 0.5%
}

export interface RenglonCuota {
  ramo: string;
  concepto: string;
  base: number;
  tasaObrero: number;
  tasaPatronal: number;
  importeObrero: number;
  importePatronal: number;
}

export interface ResultadoIMSS {
  sbc: number;
  sbcAjustado: number;      // SBC topado a 25 UMAS
  umaDiaria: number;
  excedente3UMA: number;
  diasPeriodo: number;
  renglones: RenglonCuota[];
  totalObrero: number;
  totalPatronal: number;
  totalObreroPatronal: number;
  fuente: string;
}