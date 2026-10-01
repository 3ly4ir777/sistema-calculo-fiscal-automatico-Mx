import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Periodicidad, PERIODICIDAD_LABEL } from '@/lib/fiscal/types';

export interface DatosRecibo {
  folio: string;
  fechaPago: string;      // dd/mm/yyyy
  periodoInicio: string;
  periodoFin: string;
  periodicidad: Periodicidad;

  empresa: {
    nombre: string;
    registroPatronal: string;
    direccion: string;
  };

  trabajador: {
    numeroEmpleado: string;
    nombre: string;
    curp: string;
    rfc: string;
    nss: string;
    centroCosto: string;
    departamento: string;
    semana: string;
  };

  percepciones: Array<{ clave: string; concepto: string; unidades: number; valor: number }>;
  deducciones: Array<{ clave: string; concepto: string; saldo: number; valor: number }>;

  bonosDespensa?: number;
}

export function generarReciboNominaPDF(datos: DatosRecibo): jsPDF {
  const doc = new jsPDF({ format: 'letter', unit: 'mm' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 12;
  const contentWidth = pageWidth - marginX * 2;

  const AZUL = [30, 40, 100] as const;
  const AZUL_CLARO = [235, 238, 248] as const;
  const GRIS = [245, 245, 245] as const;

  let y = 12;

  // ─────────────────────────────────────────────
  // HEADER: Logo + título + folio/fecha
  // ─────────────────────────────────────────────
  doc.setDrawColor(...AZUL);
  doc.setLineWidth(0.4);
  doc.rect(marginX, y, 28, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...AZUL);
  doc.text('LOGO', marginX + 14, y + 11, { align: 'center' });

  doc.setFontSize(16);
  doc.text('RECIBO DE', pageWidth / 2, y + 8, { align: 'center' });
  doc.text('NÓMINA', pageWidth / 2, y + 15, { align: 'center' });

  // Folio / Fecha
  const boxX = pageWidth - marginX - 55;
  const boxW = 55;
  doc.setFillColor(...AZUL);
  doc.rect(boxX, y, boxW, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('FOLIO', boxX + boxW - 3, y + 4, { align: 'right' });

  doc.setFillColor(...GRIS);
  doc.rect(boxX, y + 6, boxW, 6, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text(datos.folio, boxX + boxW - 3, y + 10, { align: 'right' });

  doc.setFillColor(...AZUL);
  doc.rect(boxX, y + 12, boxW, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text('FECHA', boxX + boxW - 3, y + 15, { align: 'right' });

  doc.setFillColor(...GRIS);
  doc.rect(boxX, y + 16, boxW, 4, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.text(datos.fechaPago, boxX + boxW - 3, y + 19, { align: 'right' });

  y += 24;

  // ─────────────────────────────────────────────
  // DATOS DE LA EMPRESA
  // ─────────────────────────────────────────────
  doc.setFillColor(...AZUL);
  doc.rect(marginX, y, contentWidth, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DE LA EMPRESA', marginX + 2, y + 3.5);
  y += 5;

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 1.5, textColor: [0, 0, 0], lineColor: [200, 200, 200], lineWidth: 0.2 },
    body: [
      ['Empresa', datos.empresa.nombre, 'Reg. Pat.:', datos.empresa.registroPatronal],
      ['Dirección', { content: datos.empresa.direccion, colSpan: 3 }],
    ],
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 25, fillColor: [...AZUL_CLARO] },
      2: { fontStyle: 'bold', cellWidth: 25, fillColor: [...AZUL_CLARO] },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 3;

  // ─────────────────────────────────────────────
  // DATOS DEL TRABAJADOR
  // ─────────────────────────────────────────────
  doc.setFillColor(...AZUL);
  doc.rect(marginX, y, contentWidth, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('DATOS DEL TRABAJADOR', marginX + 2, y + 3.5);
  y += 5;

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 1.5, lineColor: [200, 200, 200], lineWidth: 0.2 },
    body: [
      ['No. empleado', datos.trabajador.numeroEmpleado, 'C. costo/depto.', `${datos.trabajador.centroCosto} / ${datos.trabajador.departamento}`],
      ['Nombre', { content: datos.trabajador.nombre, colSpan: 3 }],
      ['CURP', datos.trabajador.curp, 'RFC / NSS', `${datos.trabajador.rfc} / ${datos.trabajador.nss}`],
      ['Periodo', PERIODICIDAD_LABEL[datos.periodicidad], 'Semana', datos.trabajador.semana],
      ['Del', datos.periodoInicio, 'Al', datos.periodoFin],
    ],
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 28, fillColor: [...AZUL_CLARO] },
      2: { fontStyle: 'bold', cellWidth: 28, fillColor: [...AZUL_CLARO] },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 3;

  // ─────────────────────────────────────────────
  // PERCEPCIONES / DEDUCCIONES (dos columnas)
  // ─────────────────────────────────────────────
  const mitad = contentWidth / 2;
  const colWidth = mitad - 1;

  // Título Percepciones
  doc.setFillColor(...AZUL);
  doc.rect(marginX, y, colWidth, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('PERCEPCIONES', marginX + 2, y + 3.5);

  // Título Deducciones
  doc.rect(marginX + mitad + 2, y, colWidth, 5, 'F');
  doc.text('DEDUCCIONES', marginX + mitad + 4, y + 3.5);

  y += 5;

  // Convertir a filas para autoTable
  const perRows = datos.percepciones.map((p) => [p.clave, p.concepto, p.unidades.toFixed(2), `$${p.valor.toFixed(2)}`]);
  const dedRows = datos.deducciones.map((d) => [d.clave, d.concepto, d.saldo.toFixed(2), `$${d.valor.toFixed(2)}`]);

  // Rellenar filas vacías para que ambas columnas tengan la misma altura
  const maxRows = Math.max(perRows.length, dedRows.length, 5);
  while (perRows.length < maxRows) perRows.push(['', '', '', '']);
  while (dedRows.length < maxRows) dedRows.push(['', '', '', '']);

  const headers = [['CLAVE', 'CONCEPTO', 'UNID.', 'VALOR']];

  // Percepciones
  autoTable(doc, {
    startY: y,
    margin: { left: marginX },
    tableWidth: colWidth,
    theme: 'grid',
    headStyles: { fillColor: [...AZUL_CLARO], textColor: [0, 0, 0], fontSize: 7, fontStyle: 'bold', halign: 'center' },
    styles: { fontSize: 8, cellPadding: 1.5, lineColor: [200, 200, 200], lineWidth: 0.2, minCellHeight: 6 },
    head: headers,
    body: perRows,
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      2: { cellWidth: 14, halign: 'right' },
      3: { cellWidth: 22, halign: 'right' },
    },
  });

  // Deducciones
  autoTable(doc, {
    startY: y,
    margin: { left: marginX + mitad + 2 },
    tableWidth: colWidth,
    theme: 'grid',
    headStyles: { fillColor: [...AZUL_CLARO], textColor: [0, 0, 0], fontSize: 7, fontStyle: 'bold', halign: 'center' },
    styles: { fontSize: 8, cellPadding: 1.5, lineColor: [200, 200, 200], lineWidth: 0.2, minCellHeight: 6 },
    head: [['CLAVE', 'CONCEPTO', 'SALDO', 'VALOR']],
    body: dedRows,
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      2: { cellWidth: 14, halign: 'right' },
      3: { cellWidth: 22, halign: 'right' },
    },
  });

  y = Math.max(
    (doc as any).lastAutoTable.finalY,
    (doc as any).lastAutoTable.finalY,
  ) + 3;

  // ─────────────────────────────────────────────
  // TOTALES
  // ─────────────────────────────────────────────
  const totalPercepciones = datos.percepciones.reduce((s, p) => s + p.valor, 0);
  const totalDeducciones = datos.deducciones.reduce((s, d) => s + d.valor, 0);

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, lineColor: [200, 200, 200], lineWidth: 0.2 },
    body: [
      [
        { content: 'Percepciones:', styles: { fontStyle: 'bold', fillColor: [...AZUL_CLARO] } },
        { content: `$${totalPercepciones.toFixed(2)}`, styles: { halign: 'right' } },
        { content: 'Bonos de despensa:', styles: { fontStyle: 'bold', fillColor: [...AZUL_CLARO] } },
        { content: `$${(datos.bonosDespensa ?? 0).toFixed(2)}`, styles: { halign: 'right' } },
        { content: 'Total deducciones:', styles: { fontStyle: 'bold', fillColor: [...AZUL_CLARO] } },
        { content: `$${totalDeducciones.toFixed(2)}`, styles: { halign: 'right' } },
      ],
    ],
    columnStyles: {
      0: { cellWidth: 28 }, 1: { cellWidth: 25 },
      2: { cellWidth: 35 }, 3: { cellWidth: 25 },
      4: { cellWidth: 32 }, 5: { cellWidth: 25 },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 3;

  // ─────────────────────────────────────────────
  // NETO A PAGAR
  // ─────────────────────────────────────────────
  const neto = totalPercepciones - totalDeducciones + (datos.bonosDespensa ?? 0);

  doc.setFillColor(...AZUL);
  doc.rect(marginX, y, contentWidth, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('NETO A PAGAR', marginX + contentWidth / 2, y + 8, { align: 'center' });
  doc.text(`$${neto.toFixed(2)}`, marginX + contentWidth - 5, y + 8, { align: 'right' });

  y += 20;

  // ─────────────────────────────────────────────
  // FIRMA
  // ─────────────────────────────────────────────
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Firma de aceptación', marginX + contentWidth / 4, y + 5, { align: 'center' });

  doc.setDrawColor(0, 0, 0);
  doc.line(
    marginX + contentWidth / 4 - 30,
    y + 20,
    marginX + contentWidth / 4 + 30,
    y + 20,
  );

  return doc;
}