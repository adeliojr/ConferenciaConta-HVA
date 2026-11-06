import React from 'react';
import { Stethoscope, FileText, Settings, AlertTriangle, Printer, RotateCcw } from 'lucide-react';
import { formatBRL } from '../utils/billingCalculator';

interface HeaderProps {
  activeTab: 'auditor' | 'report' | 'admin';
  setActiveTab: (tab: 'auditor' | 'report' | 'admin') => void;
  divergenceCount: number;
  grandTotal: number;
  patientName?: string;
  onNewTicket: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  divergenceCount,
  grandTotal,
  patientName,
  onNewTicket,
  onPrint,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Hospital Name */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-md shadow-red-500/20">
              <span className="font-black text-lg tracking-wider">HVA</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  Hospital Veterinário Araújo
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Faturamento & Auditoria
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Conferência de Fichas de Atendimento e Identificação por IA
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center p-1 bg-slate-100 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab('auditor')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'auditor'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Conferência da Ficha</span>
              {divergenceCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {divergenceCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'report'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Relatório & Fechamento</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Administração de Preços</span>
            </button>
          </nav>

          {/* Action & Total Card */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-500 font-medium block">
                {patientName ? `Paciente: ${patientName}` : 'Total da Ficha'}
              </span>
              <span className="text-lg font-extrabold text-emerald-600 tracking-tight">
                {formatBRL(grandTotal)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onPrint}
                title="Imprimir Resumo"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onNewTicket}
                title="Nova Ficha"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Nova Ficha</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
