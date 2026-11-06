import React, { useState } from 'react';
import {
  Settings,
  Search,
  Plus,
  RotateCcw,
  Save,
  Check,
  Edit2,
  Trash2,
  Download,
  Upload,
  AlertCircle,
  X,
} from 'lucide-react';
import { PriceCategory, PriceItem } from '../types/veterinary';
import { CATEGORY_LABELS } from '../data/defaultPrices';
import { formatBRL, parseBRL } from '../utils/billingCalculator';

interface PriceAdminViewProps {
  catalog: PriceItem[];
  onSaveCatalog: (updated: PriceItem[]) => Promise<void>;
  onResetCatalog: () => Promise<void>;
}

export const PriceAdminView: React.FC<PriceAdminViewProps> = ({
  catalog,
  onSaveCatalog,
  onResetCatalog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // New item state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<PriceCategory>('CONSULTA');
  const [newPrice, setNewPrice] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleStartEdit = (item: PriceItem) => {
    setEditingId(item.id);
    setEditPriceValue(item.price.toFixed(2));
  };

  const handleSaveInlineEdit = async (item: PriceItem) => {
    const updatedPrice = parseBRL(editPriceValue);
    const updatedCatalog = catalog.map((i) =>
      i.id === item.id ? { ...i, price: updatedPrice } : i
    );
    setEditingId(null);
    setIsSaving(true);
    await onSaveCatalog(updatedCatalog);
    setIsSaving(false);
    flashSuccess('Preço atualizado com sucesso!');
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Deseja realmente remover este item da tabela de preços?')) return;
    const updatedCatalog = catalog.filter((i) => i.id !== id);
    setIsSaving(true);
    await onSaveCatalog(updatedCatalog);
    setIsSaving(false);
    flashSuccess('Item excluído da tabela.');
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const priceNum = parseBRL(newPrice);
    const newItem: PriceItem = {
      id: `custom-${Date.now()}`,
      code: newCode.trim() || 'NOVO',
      name: newName.trim(),
      category: newCategory,
      price: priceNum,
      notes: newNotes.trim() || undefined,
    };

    const updatedCatalog = [newItem, ...catalog];
    setIsSaving(true);
    await onSaveCatalog(updatedCatalog);
    setIsSaving(false);

    setNewCode('');
    setNewName('');
    setNewPrice('');
    setNewNotes('');
    setShowAddModal(false);
    flashSuccess('Novo procedimento cadastrado com sucesso!');
  };

  const handleReset = async () => {
    if (
      window.confirm(
        'Tem certeza que deseja restaurar a tabela oficial do HVA para os valores padrão originais? Todas as alterações manuais serão resetadas.'
      )
    ) {
      setIsSaving(true);
      await onResetCatalog();
      setIsSaving(false);
      flashSuccess('Tabela restaurada para os padrões originais do HVA.');
    }
  };

  const flashSuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const filtered = catalog.filter((item) => {
    const matchSearch =
      searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat =
      activeCategory === 'ALL' || item.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      {/* Admin Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span>Administração da Tabela de Preços (HVA)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Altere os valores base dos procedimentos, cadastre novos medicamentos e gerencie a tabela de faturamento.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Restaurar Padrão Oficial</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Procedimento</span>
            </button>
          </div>
        </div>

        {/* Feedback message banner */}
        {saveSuccessMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por nome do procedimento, código do sistema ou cirurgia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'ALL'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({catalog.length})
            </button>
            {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => {
              const count = catalog.filter((i) => i.category === catKey).length;
              return (
                <button
                  key={catKey}
                  onClick={() => setActiveCategory(catKey)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                    activeCategory === catKey
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-20">Código</th>
                <th className="py-3 px-4">Procedimento / Medicamento</th>
                <th className="py-3 px-4 w-44">Categoria</th>
                <th className="py-3 px-4 w-36 text-right">Valor Padrão (R$)</th>
                <th className="py-3 px-4 w-28 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-700">
                      {item.code || '-'}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      {item.notes && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {item.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            step="0.01"
                            value={editPriceValue}
                            onChange={(e) => setEditPriceValue(e.target.value)}
                            className="w-24 text-right font-bold text-xs px-2 py-1 border border-blue-500 rounded-md focus:outline-hidden"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveInlineEdit(item)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            title="Salvar valor"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleStartEdit(item)}
                          className="font-mono font-bold text-slate-900 hover:text-blue-600 cursor-pointer inline-flex items-center gap-1 group-hover:underline"
                          title="Clique para editar este valor"
                        >
                          <span>{formatBRL(item.price)}</span>
                          <Edit2 className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded"
                          title="Editar valor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Excluir item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Procedure Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Cadastrar Novo Procedimento / Preço
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-medium block mb-1">
                  Nome do Procedimento / Medicamento / Serviço *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Consulta Retorno Especialista"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">
                    Código do Sistema HVA
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 1195"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-600 font-medium block mb-1">
                    Categoria *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as PriceCategory)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
                      <option key={catKey} value={catKey}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">
                  Valor Padrão (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ex: 198.00"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">
                  Observações / Instruções
                </label>
                <input
                  type="text"
                  placeholder="Ex: Valor aplicável em horário comercial"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Salvar Procedimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
