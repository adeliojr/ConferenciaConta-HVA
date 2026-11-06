import React, { useState } from 'react';
import {
  BillItem,
  ExtractedTicketData,
  PriceItem,
} from '../types/veterinary';
import {
  computeBillSummary,
  formatBRL,
  generateWhatsAppReceipt,
} from '../utils/billingCalculator';
import {
  Check,
  Copy,
  Printer,
  Plus,
  Trash2,
  AlertCircle,
  Calendar,
  User,
  HeartPulse,
  Edit2,
  RotateCw,
} from 'lucide-react';

interface CleanBillSummaryProps {
  ticketData: ExtractedTicketData;
  items: BillItem[];
  catalog: PriceItem[];
  onUpdateItem: (id: string, updates: Partial<BillItem>) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (newItem: BillItem) => void;
  onTogglePriceSource: (id: string) => void;
}

export const CleanBillSummary: React.FC<CleanBillSummaryProps> = ({
  ticketData,
  items,
  catalog,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onTogglePriceSource,
}) => {
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemPrice, setNewItemPrice] = useState<number>(0);
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const summary = computeBillSummary(items);
  const hasDivergences = summary.divergences.length > 0;

  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppReceipt(ticketData, items);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemDescription.trim() || newItemPrice <= 0) return;

    const matched = catalog.find((c) =>
      c.name.toLowerCase().includes(newItemDescription.toLowerCase())
    );

    const newItem: BillItem = {
      id: `manual-${Date.now()}`,
      category: matched?.category || 'OUTROS',
      categoryLabel: matched?.category || 'Item Avulso',
      description: newItemDescription.trim(),
      code: matched?.code,
      quantity: newItemQty || 1,
      unitPrice: newItemPrice,
      tablePrice: matched?.price ?? newItemPrice,
      handwrittenPrice: newItemPrice,
      hasDifference: matched ? Math.abs(matched.price - newItemPrice) > 0.01 : false,
      appliedPriceSource: 'custom',
      isChecked: true,
    };

    onAddItem(newItem);
    setNewItemDescription('');
    setNewItemPrice(0);
    setNewItemQty(1);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Resumo Principal: Total e Dados da Ficha */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Card Header com Total em Destaque */}
        <div className="p-6 sm:p-7 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 block mb-1">
              Total da Consulta & Procedimentos
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-baseline gap-2">
              <span>{formatBRL(summary.grandTotal)}</span>
              {hasDivergences && (
                <span className="text-xs font-normal text-slate-400">
                  (soma com base nos valores manuscritos)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {summary.itemCount} item(ns) faturados e conferidos com a tabela HVA
            </p>
          </div>

          {/* Quick Actions (WhatsApp & Imprimir) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copiado para WhatsApp!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar p/ WhatsApp</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        </div>

        {/* Informações do Atendimento em Linha Limpa */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Tutor</span>
              <strong className="text-slate-800 truncate block">
                {ticketData.patient.tutorName || 'Não identificado'}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Paciente</span>
              <strong className="text-slate-800 truncate block">
                {ticketData.patient.patientName || 'Não identificado'}{' '}
                {ticketData.patient.weightKg ? `(${ticketData.patient.weightKg} kg)` : ''}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Veterinário</span>
              <strong className="text-slate-800 truncate block">
                {ticketData.header.vet || 'Equipe HVA'}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Data / Hora</span>
              <strong className="text-slate-800 truncate block">
                {ticketData.header.date || 'Hoje'} {ticketData.header.horCheg ? `• ${ticketData.header.horCheg}` : ''}
              </strong>
            </div>
          </div>
        </div>

        {/* 2. Banner de Observação de Divergências (Regra HVA) */}
        {hasDivergences && (
          <div className="p-4 sm:p-5 bg-amber-50/90 border-b border-amber-200/80 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-semibold block mb-0.5">
                Observação de Conferência ({summary.divergences.length} diferença(s) identificada(s)):
              </strong>
              <span>
                Conforme a regra do hospital, em valores onde o que foi <strong>escrito à mão</strong> pelo veterinário for diferente da tabela oficial,{' '}
                <strong>o valor manuscrito foi levado em consideração na soma</strong>. Os itens divergentes estão destacados abaixo com a observação da diferença.
              </span>
            </div>
          </div>
        )}

        {/* 3. Tabela Limpa de Itens Faturados */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between pb-3 mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Itens Lançados na Ficha
            </h3>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar Item Avulso
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const isEditing = editingItemId === item.id;
              const hasDiff = item.hasDifference;
              const isHandwritten = item.appliedPriceSource === 'handwritten';

              return (
                <div
                  key={item.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2.5 transition-colors"
                >
                  {/* Left: Item Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 truncate">
                        {item.description}
                      </span>
                      {item.quantity > 1 && (
                        <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                          x{item.quantity}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="text-[11px] font-medium text-slate-400">
                        {item.categoryLabel}
                      </span>

                      {/* Handwritten vs Table Price Observation */}
                      {hasDiff && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-100/90 text-amber-900 border border-amber-200/80">
                            ✍️ Escrito: {formatBRL(item.handwrittenPrice)} • Tabela: {formatBRL(item.tablePrice)}
                          </span>

                          <button
                            type="button"
                            onClick={() => onTogglePriceSource(item.id)}
                            title={isHandwritten ? 'Alternar para preço de tabela' : 'Alternar para preço manuscrito'}
                            className="text-[10px] text-blue-600 hover:text-blue-800 underline font-medium flex items-center gap-0.5"
                          >
                            <RotateCw className="w-2.5 h-2.5" />
                            {isHandwritten ? 'Usar Tabela' : 'Usar Manuscrito'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Price & Quick Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    {/* Inline edit price */}
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={item.unitPrice}
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val) && val >= 0) {
                              onUpdateItem(item.id, { unitPrice: val });
                            }
                            setEditingItemId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          autoFocus
                          className="w-24 px-2 py-1 text-xs border border-emerald-500 rounded-md focus:outline-hidden"
                        />
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">
                          {formatBRL(item.unitPrice * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[11px] text-slate-400">
                            {formatBRL(item.unitPrice)} cada
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingItemId(isEditing ? null : item.id)}
                        title="Editar valor manualmente"
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        title="Remover item da conferência"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="py-10 text-center px-4">
              <p className="text-xs font-semibold text-slate-700">
                Nenhum procedimento ou medicamento foi identificado na foto enviada.
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
                Certifique-se de que a foto está bem iluminada e nítida, ou use o botão <strong>"+ Adicionar Item Avulso"</strong> acima para lançar os valores manualmente.
              </p>
            </div>
          )}
        </div>

        {/* Footer Subtotais Limpos */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {Object.values(summary.categorySubtotals).map((cat) => (
              <span key={cat.label} className="text-slate-500">
                {cat.label}: <strong className="text-slate-800">{formatBRL(cat.total)}</strong>
              </span>
            ))}
          </div>

          <div className="text-right">
            <span className="text-slate-500">Total Final da Ficha: </span>
            <strong className="text-sm font-extrabold text-emerald-700">
              {formatBRL(summary.grandTotal)}
            </strong>
          </div>
        </div>
      </div>

      {/* Modal Adicionar Item Avulso */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Adicionar Item Avulso
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Insira o nome do medicamento ou procedimento e o valor a ser cobrado.
            </p>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição do Item / Medicamento
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Curativo Especial, Vacina Gripe, etc."
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Valor Unitário (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={newItemPrice || ''}
                    onChange={(e) => setNewItemPrice(parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  Adicionar à Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
