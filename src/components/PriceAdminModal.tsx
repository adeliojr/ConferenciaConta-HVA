import React, { useState, useMemo } from 'react';
import { PriceCategory, PriceItem } from '../types/veterinary';
import { CATEGORY_LABELS } from '../data/defaultPrices';
import { formatBRL } from '../utils/billingCalculator';
import { Search, X, Check, RotateCcw, Save } from 'lucide-react';

interface PriceAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: PriceItem[];
  onSaveCatalog: (updated: PriceItem[]) => Promise<void>;
  onResetCatalog: () => Promise<void>;
}

export const PriceAdminModal: React.FC<PriceAdminModalProps> = ({
  isOpen,
  onClose,
  catalog,
  onSaveCatalog,
  onResetCatalog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [localCatalog, setLocalCatalog] = useState<PriceItem[]>(catalog);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync if catalog prop changes
  React.useEffect(() => {
    setLocalCatalog(catalog);
  }, [catalog]);

  const categories = useMemo(() => {
    const list: { key: string; label: string }[] = [{ key: 'ALL', label: 'Todas as Categorias' }];
    Object.entries(CATEGORY_LABELS).forEach(([catKey, label]) => {
      list.push({ key: catKey, label });
    });
    return list;
  }, []);

  const filteredItems = useMemo(() => {
    return localCatalog.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [localCatalog, searchTerm, selectedCategory]);

  const handlePriceChange = (id: string, newPrice: number) => {
    setLocalCatalog((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    );
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveCatalog(localCatalog);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Tem certeza que deseja restaurar todos os preços originais do HVA e CEAVET?')) {
      await onResetCatalog();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Administração de Preços: HVA & CEAVET Laboratório
            </h2>
            <p className="text-xs text-slate-500">
              Gerencie e altere os valores oficiais do hospital e dos exames terceirizados CEAVET ({localCatalog.length} itens).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome ou código (ex: Vacina, Ultrassom, Internação, Ceftriaxona...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:border-emerald-500 focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Exibindo <strong>{filteredItems.length}</strong> de {localCatalog.length} itens
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Restaurar Valores Padrão do Hospital
            </button>
          </div>
        </div>

        {/* Table List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 px-4 sm:px-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 px-2 rounded-lg transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    #{item.code}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    {item.name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {CATEGORY_LABELS[item.category as PriceCategory] || item.category}
                  {item.notes ? ` • ${item.notes}` : ''}
                </span>
              </div>

              {/* Price input */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <span className="text-xs text-slate-500 font-medium">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.price}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      handlePriceChange(item.id, val);
                    }
                  }}
                  className="w-24 sm:w-28 px-2.5 py-1 text-xs font-bold text-slate-900 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-hidden text-right bg-white"
                />
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              Nenhum item encontrado com o termo pesquisado.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Alterações salvas no banco com sucesso!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded-xl"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
