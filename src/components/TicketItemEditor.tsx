import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Check,
  Search,
  User,
  Calendar,
  Clock,
  ArrowRightLeft,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { BillItem, ExtractedTicketData, PriceCategory, PriceItem } from '../types/veterinary';
import { formatBRL, parseBRL } from '../utils/billingCalculator';
import { CATEGORY_LABELS } from '../data/defaultPrices';

interface TicketItemEditorProps {
  ticketData: ExtractedTicketData;
  onUpdateTicketInfo: (updated: Partial<ExtractedTicketData>) => void;
  items: BillItem[];
  onUpdateItem: (id: string, updates: Partial<BillItem>) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (newItem: BillItem) => void;
  onTogglePriceSource: (id: string) => void;
  priceCatalog: PriceItem[];
}

export const TicketItemEditor: React.FC<TicketItemEditorProps> = ({
  ticketData,
  onUpdateTicketInfo,
  items,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onTogglePriceSource,
  priceCatalog,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // New custom item fields
  const [customDesc, setCustomDesc] = useState('');
  const [customCategory, setCustomCategory] = useState<PriceCategory>('MEDICAMENTO_APLICACAO');
  const [customPrice, setCustomPrice] = useState<string>('');
  const [customQty, setCustomQty] = useState<number>(1);

  // Group items by category
  const groupedCategories = Array.from(new Set(items.map((i) => i.category)));

  const handleSelectCatalogItem = (catItem: PriceItem) => {
    const newItem: BillItem = {
      id: `manual-${Date.now()}`,
      category: catItem.category,
      categoryLabel: CATEGORY_LABELS[catItem.category] || catItem.category,
      description: catItem.name,
      code: catItem.code,
      quantity: 1,
      unitPrice: catItem.price,
      tablePrice: catItem.price,
      handwrittenPrice: catItem.price,
      hasDifference: false,
      appliedPriceSource: 'table',
      isChecked: true,
    };
    onAddItem(newItem);
    setShowAddModal(false);
    setSearchTerm('');
  };

  const handleCreateCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDesc.trim()) return;

    const priceNum = parseBRL(customPrice);
    const newItem: BillItem = {
      id: `custom-${Date.now()}`,
      category: customCategory,
      categoryLabel: CATEGORY_LABELS[customCategory],
      description: customDesc.trim(),
      quantity: customQty > 0 ? customQty : 1,
      unitPrice: priceNum,
      tablePrice: priceNum,
      handwrittenPrice: priceNum,
      hasDifference: false,
      appliedPriceSource: 'custom',
      isChecked: true,
    };

    onAddItem(newItem);
    setCustomDesc('');
    setCustomPrice('');
    setCustomQty(1);
    setShowAddModal(false);
  };

  const filteredCatalog = priceCatalog.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-5">
      {/* Patient & Attendance Information Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Dados do Atendimento & Paciente
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Via: {ticketData.header.via || '1ª VIA'}
            </span>
            {ticketData.header.ot && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                OT: {ticketData.header.ot}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-500 font-medium block mb-1">Tutor:</label>
            <input
              type="text"
              value={ticketData.patient.tutorName || ''}
              onChange={(e) =>
                onUpdateTicketInfo({
                  patient: { ...ticketData.patient, tutorName: e.target.value },
                })
              }
              placeholder="Nome do tutor"
              className="w-full font-semibold text-slate-900 px-2.5 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-500 font-medium block mb-1">Paciente / Pet:</label>
            <input
              type="text"
              value={ticketData.patient.patientName || ''}
              onChange={(e) =>
                onUpdateTicketInfo({
                  patient: { ...ticketData.patient, patientName: e.target.value },
                })
              }
              placeholder="Nome do paciente"
              className="w-full font-semibold text-slate-900 px-2.5 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-500 font-medium block mb-1">Peso (kg):</label>
            <input
              type="number"
              step="0.1"
              value={ticketData.patient.weightKg ?? ''}
              onChange={(e) =>
                onUpdateTicketInfo({
                  patient: {
                    ...ticketData.patient,
                    weightKg: parseFloat(e.target.value) || undefined,
                  },
                })
              }
              placeholder="Ex: 14.5"
              className="w-full font-semibold text-slate-900 px-2.5 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-500 font-medium block mb-1">Médico Veterinário:</label>
            <input
              type="text"
              value={ticketData.header.vet || ''}
              onChange={(e) =>
                onUpdateTicketInfo({
                  header: { ...ticketData.header, vet: e.target.value },
                })
              }
              placeholder="Ex: Dr. Adélio"
              className="w-full font-semibold text-slate-900 px-2.5 py-1.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Data: </span>
            <input
              type="text"
              value={ticketData.header.date || ''}
              onChange={(e) =>
                onUpdateTicketInfo({
                  header: { ...ticketData.header, date: e.target.value },
                })
              }
              placeholder="DD/MM/AAAA"
              className="font-medium text-slate-800 px-2 py-0.5 border border-slate-200 rounded w-28"
            />
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Horário: </span>
            <input
              type="text"
              value={ticketData.header.horCheg || ''}
              onChange={(e) =>
                onUpdateTicketInfo({
                  header: { ...ticketData.header, horCheg: e.target.value },
                })
              }
              placeholder="HH:MM"
              className="font-medium text-slate-800 px-2 py-0.5 border border-slate-200 rounded w-20"
            />
          </div>

          <div className="text-slate-600 truncate">
            <span>Obs: </span>
            <input
              type="text"
              value={ticketData.header.obs || ''}
              onChange={(e) =>
                onUpdateTicketInfo({
                  header: { ...ticketData.header, obs: e.target.value },
                })
              }
              placeholder="Observações da ficha"
              className="font-medium text-slate-800 px-2 py-0.5 border border-slate-200 rounded w-full max-w-xs"
            />
          </div>
        </div>
      </div>

      {/* Items Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Itens Identificados na Ficha ({items.length})
          </h3>
          <p className="text-xs text-slate-500">
            Marque, desmarque ou ajuste os valores para o cálculo final.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Item Avulso</span>
        </button>
      </div>

      {/* Items Table / Cards by Category */}
      {groupedCategories.map((category) => {
        const catItems = items.filter((i) => i.category === category);
        const catLabel = CATEGORY_LABELS[category as PriceCategory] || category;

        return (
          <div
            key={category}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
          >
            <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {catLabel} ({catItems.length})
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Subtotal:{' '}
                {formatBRL(
                  catItems
                    .filter((i) => i.isChecked)
                    .reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
                )}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {catItems.map((item) => {
                const itemTotal = item.quantity * item.unitPrice;
                const isHandwrittenActive = item.appliedPriceSource === 'handwritten';

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      !item.isChecked ? 'opacity-40 bg-slate-50/50' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Checkbox and Description */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={(e) =>
                          onUpdateItem(item.id, { isChecked: e.target.checked })
                        }
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-slate-900">
                            {item.description}
                          </h4>
                          {item.code && (
                            <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                              Cód. {item.code}
                            </span>
                          )}
                        </div>

                        {/* Divergence Tag if any */}
                        {item.hasDifference && (
                          <div className="mt-1 flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                              ⚠️ Manuscrito: {formatBRL(item.handwrittenPrice)} | Tabela: {formatBRL(item.tablePrice)}
                            </span>
                            <button
                              onClick={() => onTogglePriceSource(item.id)}
                              className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline flex items-center gap-0.5"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>
                                {isHandwrittenActive ? 'Aplicar Tabela' : 'Aplicar Manuscrito'}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity, Unit Price and Subtotal Controls */}
                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      {/* Quantity */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">Qtd:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            onUpdateItem(item.id, {
                              quantity: Math.max(1, parseInt(e.target.value) || 1),
                            })
                          }
                          className="w-14 text-center font-bold text-xs text-slate-800 px-1 py-1 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Unit Price Input */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">Unit:</span>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            onUpdateItem(item.id, {
                              unitPrice: parseFloat(e.target.value) || 0,
                              appliedPriceSource: 'custom',
                            })
                          }
                          className="w-22 text-right font-bold text-xs text-slate-800 px-2 py-1 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Total */}
                      <div className="w-24 text-right">
                        <span className="text-xs font-extrabold text-slate-900 block">
                          {formatBRL(itemTotal)}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remover item da fatura"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Adicionar Item ao Atendimento
                </h3>
                <p className="text-xs text-slate-500">
                  Escolha da tabela oficial HVA ou cadastre um item avulso personalizado.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Catalog Search & Category Filter */}
            <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou código do procedimento HVA..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
                    selectedCategory === 'ALL'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Todos
                </button>
                {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
                  <button
                    key={catKey}
                    onClick={() => setSelectedCategory(catKey)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
                      selectedCategory === catKey
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-64">
              {filteredCatalog.slice(0, 40).map((catItem) => (
                <div
                  key={catItem.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">
                        {catItem.name}
                      </span>
                      {catItem.code && (
                        <span className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-600">
                          {catItem.code}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {CATEGORY_LABELS[catItem.category]}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs text-emerald-600">
                      {formatBRL(catItem.price)}
                    </span>
                    <button
                      onClick={() => handleSelectCatalogItem(catItem)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      Inserir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Item Form */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Ou criar um item avulso personalizado:
              </span>
              <form onSubmit={handleCreateCustomItem} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Descrição do item / medicamento"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="sm:col-span-2 text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Valor R$"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                />
                <button
                  type="submit"
                  className="text-xs font-bold py-1.5 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Adicionar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
