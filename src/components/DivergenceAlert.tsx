import React from 'react';
import { AlertTriangle, CheckCircle2, ArrowRightLeft, Info } from 'lucide-react';
import { BillItem } from '../types/veterinary';
import { formatBRL } from '../utils/billingCalculator';

interface DivergenceAlertProps {
  items: BillItem[];
  onTogglePriceSource: (itemId: string) => void;
}

export const DivergenceAlert: React.FC<DivergenceAlertProps> = ({
  items,
  onTogglePriceSource,
}) => {
  const divergingItems = items.filter((i) => i.hasDifference && i.isChecked);

  if (divergingItems.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-emerald-900">
            Valores 100% em conformidade com a tabela HVA
          </h4>
          <p className="text-xs text-emerald-700 mt-0.5">
            Todos os itens identificados nesta ficha coincidem com os valores cadastrados na tabela oficial do hospital.
          </p>
        </div>
      </div>
    );
  }

  const netDifference = divergingItems.reduce((acc, curr) => {
    const hand = curr.handwrittenPrice ?? curr.unitPrice;
    const tab = curr.tablePrice ?? curr.unitPrice;
    return acc + (hand - tab) * curr.quantity;
  }, 0);

  return (
    <div className="bg-amber-50/90 border-2 border-amber-300/80 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Alert Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500 text-white rounded-lg shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <span>{divergingItems.length} Divergência(s) de Valor Detectada(s)</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">
                Regra HVA Ativa
              </span>
            </h3>
            <p className="text-xs text-amber-800 font-medium">
              Conforme instrução, <strong>os valores escritos à mão têm prevalência na soma</strong>, com observação registrada abaixo.
            </p>
          </div>
        </div>

        <div className="text-right bg-amber-100/90 px-3 py-1.5 rounded-lg border border-amber-200 self-start sm:self-auto">
          <span className="text-xs text-amber-800 font-medium block">
            Impacto líquido das alterações manuais:
          </span>
          <span
            className={`text-sm font-bold ${
              netDifference < 0 ? 'text-emerald-700' : 'text-amber-900'
            }`}
          >
            {netDifference < 0 ? 'Desconto concedido: ' : 'Acréscimo: '}
            {formatBRL(Math.abs(netDifference))}
          </span>
        </div>
      </div>

      {/* Diverging Items Grid / Table */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Detalhamento dos Itens com Valores Manuscritos Diferentes da Tabela:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {divergingItems.map((item) => {
            const hand = item.handwrittenPrice ?? item.unitPrice;
            const tab = item.tablePrice ?? item.unitPrice;
            const diff = hand - tab;
            const isUsingHandwritten = item.appliedPriceSource === 'handwritten';

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-3.5 border border-amber-200 shadow-xs flex flex-col justify-between gap-2.5 hover:border-amber-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-amber-800 uppercase tracking-wider text-[11px]">
                      {item.categoryLabel}
                    </span>
                    {item.code && (
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        Cód. {item.code}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                    {item.description}
                  </h4>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Tabela Oficial HVA:</span>
                    <span className="font-semibold text-slate-700 line-through">
                      {formatBRL(tab)}
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-900 font-medium block text-[11px]">
                      Escrito à Mão (Vet):
                    </span>
                    <span className="font-bold text-amber-900 text-sm">
                      {formatBRL(hand)}
                    </span>
                  </div>
                </div>

                {/* Status and Toggle */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        diff < 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {diff < 0 ? `Desconto de ${formatBRL(Math.abs(diff))}` : `+${formatBRL(diff)}`}
                    </span>
                    <span className="text-[11px] text-slate-600 font-medium">
                      {isUsingHandwritten ? '(Ativo na soma)' : '(Tabela aplicada)'}
                    </span>
                  </div>

                  <button
                    onClick={() => onTogglePriceSource(item.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
                    title="Alternar entre valor manuscrito e valor oficial da tabela"
                  >
                    <ArrowRightLeft className="w-3 h-3 text-slate-500" />
                    <span>{isUsingHandwritten ? 'Usar Tabela' : 'Usar Manuscrito'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Observation notice footer */}
      <div className="flex items-start gap-2 bg-amber-100/60 p-3 rounded-xl border border-amber-200/80 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Observação emitida para o relatório e faturamento:</strong> &ldquo;Os valores assinalados e manuscritos pela equipe veterinária prevaleceram sobre a tabela de referência, registrando a conformidade com as particularidades clínicas do atendimento.&rdquo;
        </p>
      </div>
    </div>
  );
};
