import {
  BillItem,
  ExtractedTicketData,
  PriceDivergence,
  PriceItem,
} from '../types/veterinary';
import { CATEGORY_LABELS, findMatchingPrice } from '../data/defaultPrices';

export function formatBRL(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function parseBRL(value: string | number | undefined | null): number {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (!value) return 0;
  const cleaned = value
    .toString()
    .replace(/[R$\s.]/g, '')
    .replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function buildBillItemsFromTicket(
  ticket: ExtractedTicketData,
  catalog: PriceItem[]
): BillItem[] {
  const items: BillItem[] = [];
  let itemCounter = 1;

  const nextId = (prefix: string) => `${prefix}-${itemCounter++}`;

  // 1. Consultation
  if (ticket.consultationType) {
    const matched = findMatchingPrice(ticket.consultationType, 'CONSULTA', catalog);
    const tablePrice = ticket.consultationTablePrice ?? matched?.price ?? 198.00;
    const handwrittenPrice = ticket.consultationHandwrittenPrice;
    
    const hasDiff =
      handwrittenPrice !== undefined &&
      handwrittenPrice !== null &&
      Math.abs(handwrittenPrice - tablePrice) > 0.01;

    // RULE: Use handwritten price if available, but flag observation!
    const activePrice = handwrittenPrice !== undefined && handwrittenPrice !== null ? handwrittenPrice : tablePrice;

    items.push({
      id: nextId('bill-c'),
      category: 'CONSULTA',
      categoryLabel: CATEGORY_LABELS['CONSULTA'],
      description: ticket.consultationType,
      code: matched?.code || '1195',
      quantity: 1,
      unitPrice: activePrice,
      handwrittenPrice: handwrittenPrice ?? null,
      tablePrice: tablePrice,
      hasDifference: hasDiff,
      appliedPriceSource: handwrittenPrice !== undefined && handwrittenPrice !== null ? 'handwritten' : 'table',
      observation: hasDiff
        ? `Diferença detectada: Tabela = ${formatBRL(tablePrice)} | Escrito à mão = ${formatBRL(handwrittenPrice)} (adotado o valor manuscrito)`
        : undefined,
      isChecked: true,
    });
  }

  // 2. Hospitalization (Internação)
  if (ticket.hospitalization && ticket.hospitalization.selected) {
    const hosp = ticket.hospitalization;
    const bracket = hosp.weightBracket || 'Internação Até 20kg (diária)';
    const matched = findMatchingPrice(bracket, 'INTERNACAO', catalog);
    const days = hosp.days && hosp.days > 0 ? hosp.days : 1;
    const tableUnit = hosp.tablePrice ?? matched?.price ?? 498.00;
    const handwrittenUnit = hosp.handwrittenPrice;

    const hasDiff =
      handwrittenUnit !== undefined &&
      handwrittenUnit !== null &&
      Math.abs(handwrittenUnit - tableUnit) > 0.01;

    const activeUnit = handwrittenUnit !== undefined && handwrittenUnit !== null ? handwrittenUnit : tableUnit;

    items.push({
      id: nextId('bill-i'),
      category: 'INTERNACAO',
      categoryLabel: CATEGORY_LABELS['INTERNACAO'],
      description: `${bracket}${hosp.notes ? ` (${hosp.notes})` : ''}`,
      code: matched?.code || '1198',
      quantity: days,
      unitPrice: activeUnit,
      handwrittenPrice: handwrittenUnit ?? null,
      tablePrice: tableUnit,
      hasDifference: hasDiff,
      appliedPriceSource: handwrittenUnit !== undefined && handwrittenUnit !== null ? 'handwritten' : 'table',
      observation: hasDiff
        ? `Diária com divergência: Tabela = ${formatBRL(tableUnit)} | Escrito à mão = ${formatBRL(handwrittenUnit)}`
        : undefined,
      isChecked: true,
    });
  }

  // 3. Exams (Exames)
  if (ticket.exams && ticket.exams.length > 0) {
    for (const exam of ticket.exams) {
      const matched = findMatchingPrice(exam.name, 'EXAME', catalog);
      const tablePrice = exam.tablePrice ?? matched?.price ?? 0;
      const handwrittenPrice = exam.handwrittenPrice;

      const hasDiff =
        handwrittenPrice !== undefined &&
        handwrittenPrice !== null &&
        tablePrice > 0 &&
        Math.abs(handwrittenPrice - tablePrice) > 0.01;

      const activePrice =
        handwrittenPrice !== undefined && handwrittenPrice !== null
          ? handwrittenPrice
          : tablePrice;

      items.push({
        id: nextId('bill-e'),
        category: 'EXAME',
        categoryLabel: CATEGORY_LABELS['EXAME'],
        description: exam.vet ? `${exam.name} (Vet: ${exam.vet})` : exam.name,
        code: exam.code || matched?.code,
        quantity: 1,
        unitPrice: activePrice,
        handwrittenPrice: handwrittenPrice ?? null,
        tablePrice: tablePrice,
        hasDifference: hasDiff,
        appliedPriceSource: handwrittenPrice !== undefined && handwrittenPrice !== null ? 'handwritten' : 'table',
        observation: hasDiff
          ? `Tabela = ${formatBRL(tablePrice)} | Escrito à mão = ${formatBRL(handwrittenPrice)}`
          : undefined,
        isChecked: true,
      });
    }
  }

  // 3.1. External Lab Exams (Requisição CEAVET)
  if (ticket.labExams && ticket.labExams.length > 0) {
    for (const lab of ticket.labExams) {
      const matched =
        findMatchingPrice(lab.name, 'LABORATORIO_CEAVET', catalog) ||
        findMatchingPrice(lab.name, 'EXAME', catalog);

      const tablePrice = lab.tablePrice ?? matched?.price ?? 0;
      const handwrittenPrice = lab.handwrittenPrice;

      const hasDiff =
        handwrittenPrice !== undefined &&
        handwrittenPrice !== null &&
        tablePrice > 0 &&
        Math.abs(handwrittenPrice - tablePrice) > 0.01;

      const activePrice =
        handwrittenPrice !== undefined && handwrittenPrice !== null
          ? handwrittenPrice
          : tablePrice;

      const desc = lab.section
        ? `[CEAVET • ${lab.section}] ${lab.name}${lab.notes ? ` (${lab.notes})` : ''}`
        : `[CEAVET] ${lab.name}${lab.notes ? ` (${lab.notes})` : ''}`;

      items.push({
        id: nextId('bill-lab'),
        category: 'LABORATORIO_CEAVET',
        categoryLabel: CATEGORY_LABELS['LABORATORIO_CEAVET'] || 'Laboratório CEAVET',
        description: desc,
        code: lab.code || matched?.code || 'CEAVET',
        quantity: 1,
        unitPrice: activePrice,
        handwrittenPrice: handwrittenPrice ?? null,
        tablePrice: tablePrice,
        hasDifference: hasDiff,
        appliedPriceSource: handwrittenPrice !== undefined && handwrittenPrice !== null ? 'handwritten' : 'table',
        observation: hasDiff
          ? `Tabela CEAVET = ${formatBRL(tablePrice)} | Escrito à mão = ${formatBRL(handwrittenPrice)}`
          : undefined,
        isChecked: true,
      });
    }
  }

  // 4. Vaccines (Vacinas)
  if (ticket.vaccines && ticket.vaccines.length > 0) {
    for (const vac of ticket.vaccines) {
      const matched = findMatchingPrice(vac.name, 'VACINA', catalog);
      const tablePrice = vac.tablePrice ?? matched?.price ?? 139.00;
      const handwrittenPrice = vac.handwrittenPrice;

      const hasDiff =
        handwrittenPrice !== undefined &&
        handwrittenPrice !== null &&
        Math.abs(handwrittenPrice - tablePrice) > 0.01;

      const activePrice =
        handwrittenPrice !== undefined && handwrittenPrice !== null
          ? handwrittenPrice
          : tablePrice;

      items.push({
        id: nextId('bill-v'),
        category: 'VACINA',
        categoryLabel: CATEGORY_LABELS['VACINA'],
        description: vac.name,
        code: vac.code || matched?.code,
        quantity: 1,
        unitPrice: activePrice,
        handwrittenPrice: handwrittenPrice ?? null,
        tablePrice: tablePrice,
        hasDifference: hasDiff,
        appliedPriceSource: handwrittenPrice !== undefined && handwrittenPrice !== null ? 'handwritten' : 'table',
        observation: hasDiff
          ? `Tabela = ${formatBRL(tablePrice)} | Escrito à mão = ${formatBRL(handwrittenPrice)}`
          : undefined,
        isChecked: true,
      });
    }
  }

  // 5. Surgeries & Procedures (Cirurgias e Procedimentos)
  if (ticket.surgeriesAndProcedures && ticket.surgeriesAndProcedures.length > 0) {
    for (const proc of ticket.surgeriesAndProcedures) {
      const matched =
        findMatchingPrice(proc.name, 'CIRURGIA', catalog) ||
        findMatchingPrice(proc.name, 'PROCEDIMENTO', catalog) ||
        findMatchingPrice(proc.name, 'ANESTESIA', catalog) ||
        findMatchingPrice(proc.name, 'CASTRACAO', catalog) ||
        findMatchingPrice(proc.name, 'CIRURGIA_OFTALMICA', catalog);

      const tablePrice = proc.tablePrice ?? matched?.price ?? 0;
      const handwrittenPrice = proc.handwrittenPrice;

      const hasDiff =
        handwrittenPrice !== undefined &&
        handwrittenPrice !== null &&
        tablePrice > 0 &&
        Math.abs(handwrittenPrice - tablePrice) > 0.01;

      const activePrice =
        handwrittenPrice !== undefined && handwrittenPrice !== null
          ? handwrittenPrice
          : tablePrice;

      const category = matched?.category || 'CIRURGIA';

      items.push({
        id: nextId('bill-s'),
        category: category,
        categoryLabel: CATEGORY_LABELS[category] || 'Procedimento',
        description: proc.notes ? `${proc.name} - ${proc.notes}` : proc.name,
        code: proc.code || matched?.code,
        quantity: 1,
        unitPrice: activePrice,
        handwrittenPrice: handwrittenPrice ?? null,
        tablePrice: tablePrice,
        hasDifference: hasDiff,
        appliedPriceSource: handwrittenPrice !== undefined && handwrittenPrice !== null ? 'handwritten' : 'table',
        observation: hasDiff
          ? `Tabela = ${formatBRL(tablePrice)} | Escrito à mão = ${formatBRL(handwrittenPrice)} (adotado valor do cirurgião)`
          : undefined,
        isChecked: true,
      });
    }
  }

  // 6. Applications & Products (Aplicações / Produtos - Handwritten Box)
  if (ticket.applicationsAndProducts && ticket.applicationsAndProducts.length > 0) {
    for (const app of ticket.applicationsAndProducts) {
      const matched = findMatchingPrice(app.description, 'MEDICAMENTO_APLICACAO', catalog);
      const tablePrice = app.tablePrice ?? matched?.price ?? 0;
      const handwrittenPrice = app.handwrittenPrice;

      const hasDiff =
        handwrittenPrice !== undefined &&
        handwrittenPrice !== null &&
        tablePrice > 0 &&
        Math.abs(handwrittenPrice - tablePrice) > 0.01;

      const activePrice =
        handwrittenPrice !== undefined && handwrittenPrice !== null
          ? handwrittenPrice
          : tablePrice;

      const desc = app.dosage
        ? `${app.description} [${app.dosage}]`
        : app.description;

      items.push({
        id: nextId('bill-app'),
        category: 'MEDICAMENTO_APLICACAO',
        categoryLabel: CATEGORY_LABELS['MEDICAMENTO_APLICACAO'],
        description: desc,
        code: matched?.code,
        quantity: app.quantity || 1,
        unitPrice: activePrice,
        handwrittenPrice: handwrittenPrice ?? null,
        tablePrice: tablePrice,
        hasDifference: hasDiff,
        appliedPriceSource: handwrittenPrice !== undefined && handwrittenPrice !== null ? 'handwritten' : 'table',
        observation: hasDiff
          ? `Tabela = ${formatBRL(tablePrice)} | Escrito à mão = ${formatBRL(handwrittenPrice)}`
          : undefined,
        isChecked: true,
      });
    }
  }

  // 7. Special Items (Librela, Cytopoint, Intensivismo, Célula Tronco)
  if (ticket.specialItems) {
    const sp = ticket.specialItems;
    if (sp.librela && sp.librela.price) {
      const matched = findMatchingPrice('Librela', 'MEDICAMENTO_APLICACAO', catalog);
      const table = matched?.price ?? 340.00;
      const hand = sp.librela.price;
      const hasDiff = Math.abs(hand - table) > 0.01;
      items.push({
        id: nextId('bill-sp-lib'),
        category: 'MEDICAMENTO_APLICACAO',
        categoryLabel: CATEGORY_LABELS['MEDICAMENTO_APLICACAO'],
        description: `Librela ${sp.librela.mg || ''}${sp.librela.vet ? ` (Vet: ${sp.librela.vet})` : ''}`,
        code: 'LIB',
        quantity: 1,
        unitPrice: hand,
        handwrittenPrice: hand,
        tablePrice: table,
        hasDifference: hasDiff,
        appliedPriceSource: 'handwritten',
        observation: hasDiff ? `Tabela = ${formatBRL(table)} | Escrito à mão = ${formatBRL(hand)}` : undefined,
        isChecked: true,
      });
    }

    if (sp.cytopoint && sp.cytopoint.price) {
      const matched = findMatchingPrice('Cytopoint', 'MEDICAMENTO_APLICACAO', catalog);
      const table = matched?.price ?? 320.00;
      const hand = sp.cytopoint.price;
      const hasDiff = Math.abs(hand - table) > 0.01;
      items.push({
        id: nextId('bill-sp-cyto'),
        category: 'MEDICAMENTO_APLICACAO',
        categoryLabel: CATEGORY_LABELS['MEDICAMENTO_APLICACAO'],
        description: `Cytopoint ${sp.cytopoint.mg || ''}${sp.cytopoint.vet ? ` (Vet: ${sp.cytopoint.vet})` : ''}`,
        code: 'CYTO',
        quantity: 1,
        unitPrice: hand,
        handwrittenPrice: hand,
        tablePrice: table,
        hasDifference: hasDiff,
        appliedPriceSource: 'handwritten',
        observation: hasDiff ? `Tabela = ${formatBRL(table)} | Escrito à mão = ${formatBRL(hand)}` : undefined,
        isChecked: true,
      });
    }

    if (sp.intensivismo) {
      if (sp.intensivismo.intensive) {
        items.push({
          id: nextId('bill-sp-int'),
          category: 'PROCEDIMENTO',
          categoryLabel: CATEGORY_LABELS['PROCEDIMENTO'],
          description: `Cuidados Intensivos / Intensivismo (${sp.intensivismo.hours || 1}h)`,
          code: '7721',
          quantity: sp.intensivismo.hours || 1,
          unitPrice: 60.00,
          tablePrice: 60.00,
          handwrittenPrice: 60.00,
          hasDifference: false,
          appliedPriceSource: 'table',
          isChecked: true,
        });
      }
      if (sp.intensivismo.o2) {
        const hours = sp.intensivismo.hours || 1;
        const total = 78.00 + Math.max(0, hours - 1) * 49.00;
        items.push({
          id: nextId('bill-sp-o2'),
          category: 'PROCEDIMENTO',
          categoryLabel: CATEGORY_LABELS['PROCEDIMENTO'],
          description: `Oxigenioterapia (${hours}h)`,
          code: '1200',
          quantity: 1,
          unitPrice: total,
          tablePrice: total,
          handwrittenPrice: total,
          hasDifference: false,
          appliedPriceSource: 'table',
          isChecked: true,
        });
      }
    }

    if (sp.stemCell) {
      if (sp.stemCell.stemCellPrice) {
        items.push({
          id: nextId('bill-sp-sc'),
          category: 'PROCEDIMENTO',
          categoryLabel: CATEGORY_LABELS['PROCEDIMENTO'],
          description: 'Aplicação de Célula Tronco',
          quantity: 1,
          unitPrice: sp.stemCell.stemCellPrice,
          handwrittenPrice: sp.stemCell.stemCellPrice,
          tablePrice: sp.stemCell.stemCellPrice,
          hasDifference: false,
          appliedPriceSource: 'handwritten',
          isChecked: true,
        });
      }
      if (sp.stemCell.anesthesiologistPrice) {
        items.push({
          id: nextId('bill-sp-sc-an'),
          category: 'ANESTESIA',
          categoryLabel: CATEGORY_LABELS['ANESTESIA'],
          description: 'Honorários Anestesista (Célula Tronco)',
          quantity: 1,
          unitPrice: sp.stemCell.anesthesiologistPrice,
          handwrittenPrice: sp.stemCell.anesthesiologistPrice,
          tablePrice: sp.stemCell.anesthesiologistPrice,
          hasDifference: false,
          appliedPriceSource: 'handwritten',
          isChecked: true,
        });
      }
      if (sp.stemCell.transportPrice) {
        items.push({
          id: nextId('bill-sp-sc-tr'),
          category: 'OUTROS',
          categoryLabel: CATEGORY_LABELS['OUTROS'],
          description: 'Transporte Célula Tronco',
          quantity: 1,
          unitPrice: sp.stemCell.transportPrice,
          handwrittenPrice: sp.stemCell.transportPrice,
          tablePrice: sp.stemCell.transportPrice,
          hasDifference: false,
          appliedPriceSource: 'handwritten',
          isChecked: true,
        });
      }
    }
  }

  return items;
}

export function computeBillSummary(items: BillItem[]) {
  const activeItems = items.filter((i) => i.isChecked);

  const grandTotal = activeItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const tableGrandTotal = activeItems.reduce(
    (sum, item) => sum + item.quantity * (item.tablePrice ?? item.unitPrice),
    0
  );

  // Group by category
  const categorySubtotals: Record<string, { label: string; total: number; count: number }> = {};
  for (const item of activeItems) {
    if (!categorySubtotals[item.category]) {
      categorySubtotals[item.category] = {
        label: item.categoryLabel,
        total: 0,
        count: 0,
      };
    }
    categorySubtotals[item.category].total += item.quantity * item.unitPrice;
    categorySubtotals[item.category].count += item.quantity;
  }

  // Divergences list
  const divergences: PriceDivergence[] = [];
  for (const item of activeItems) {
    if (
      item.handwrittenPrice !== undefined &&
      item.handwrittenPrice !== null &&
      item.tablePrice !== undefined &&
      item.tablePrice !== null &&
      Math.abs(item.handwrittenPrice - item.tablePrice) > 0.01
    ) {
      const diff = item.handwrittenPrice - item.tablePrice;
      const pct = item.tablePrice > 0 ? (diff / item.tablePrice) * 100 : 0;
      divergences.push({
        id: item.id,
        itemDescription: item.description,
        categoryLabel: item.categoryLabel,
        tablePrice: item.tablePrice,
        handwrittenPrice: item.handwrittenPrice,
        difference: diff,
        differencePercent: pct,
        activePrice: item.unitPrice,
      });
    }
  }

  const netDivergence = grandTotal - tableGrandTotal;

  return {
    grandTotal,
    tableGrandTotal,
    netDivergence,
    divergences,
    categorySubtotals,
    itemCount: activeItems.length,
  };
}

export function generateWhatsAppReceipt(
  ticket: ExtractedTicketData,
  items: BillItem[]
): string {
  const summary = computeBillSummary(items);
  const now = new Date();
  const dateFormatted = ticket.header.date || now.toLocaleDateString('pt-BR');

  let text = `🐾 *HOSPITAL VETERINÁRIO ARAÚJO (HVA)*\n`;
  text += `📋 *RESUMO DE ATENDIMENTO & CONFERÊNCIA*\n`;
  text += `──────────────────────\n`;
  text += `📅 *Data:* ${dateFormatted} ${ticket.header.horCheg ? `às ${ticket.header.horCheg}` : ''}\n`;
  text += `👨‍⚕️ *Veterinário:* ${ticket.header.vet || 'Equipe HVA'}\n`;
  text += `👤 *Tutor:* ${ticket.patient.tutorName || 'Não informado'} ${ticket.patient.tutorCode ? `(#${ticket.patient.tutorCode})` : ''}\n`;
  text += `🐶 *Paciente:* ${ticket.patient.patientName || 'Não informado'}${ticket.patient.weightKg ? ` (${ticket.patient.weightKg} kg)` : ''}\n`;
  text += `──────────────────────\n\n`;

  text += `*ITENS LANÇADOS NA FICHA:*\n`;
  items.filter((i) => i.isChecked).forEach((item, idx) => {
    const itemTotal = item.quantity * item.unitPrice;
    text += `${idx + 1}. ${item.description} (x${item.quantity})\n`;
    text += `   ↳ ${formatBRL(itemTotal)}`;
    if (item.hasDifference && item.handwrittenPrice !== null && item.tablePrice !== null) {
      text += ` ⚠️ _(Anotado à mão: ${formatBRL(item.handwrittenPrice)} | Tabela: ${formatBRL(item.tablePrice)})_`;
    }
    text += `\n`;
  });

  text += `\n──────────────────────\n`;
  text += `*SUBTOTAIS POR CATEGORIA:*\n`;
  Object.values(summary.categorySubtotals).forEach((cat) => {
    text += `• ${cat.label}: ${formatBRL(cat.total)}\n`;
  });

  text += `──────────────────────\n`;
  if (summary.divergences.length > 0) {
    text += `⚠️ *OBSERVAÇÃO DE DIVERGÊNCIAS (REGRA HVA):*\n`;
    text += `Foram identificados ${summary.divergences.length} item(ns) com valores manuscritos diferentes da tabela.\n`;
    text += `Conforme orientação do HVA, *foram considerados os valores escritos à mão* pelo veterinário.\n`;
    const diffSign = summary.netDivergence < 0 ? 'Desconto/Ajuste total de' : 'Acréscimo total de';
    text += `Diferença total: ${diffSign} ${formatBRL(Math.abs(summary.netDivergence))}\n`;
    text += `──────────────────────\n`;
  }

  text += `💰 *TOTAL A PAGAR: ${formatBRL(summary.grandTotal)}*\n`;
  text += `──────────────────────\n`;
  text += `_Hospital Veterinário Araújo - Cuidando com excelência e transparência._`;

  return text;
}
