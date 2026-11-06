import React from 'react';
import { SlidersHorizontal, Plus, ShieldCheck } from 'lucide-react';
import { formatBRL } from '../utils/billingCalculator';

interface CleanHeaderProps {
  onOpenPriceAdmin: () => void;
  onNewTicket: () => void;
  grandTotal: number;
  itemCount: number;
}

export const CleanHeader: React.FC<CleanHeaderProps> = ({
  onOpenPriceAdmin,
  onNewTicket,
  grandTotal,
  itemCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs tracking-tight">
              HVA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Hospital Veterinário Araújo
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Conferência Oficial
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Ficha HVA (frente/verso), Requisição CEAVET e conferência com banco de dados
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {itemCount > 0 && (
              <div className="hidden md:flex flex-col text-right mr-2">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  Total da Ficha
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {formatBRL(grandTotal)}
                </span>
              </div>
            )}

            {/* Price Admin Button */}
            <button
              type="button"
              onClick={onOpenPriceAdmin}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200/60 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Tabela de Preços</span>
            </button>

            {/* New Ticket */}
            <button
              type="button"
              onClick={onNewTicket}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 rounded-xl transition-colors flex items-center gap-1 border border-emerald-200/60 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Ficha</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
