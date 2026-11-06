import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  Share2,
  FileText,
  AlertTriangle,
  Receipt,
  User,
  ShieldCheck,
} from 'lucide-react';
import { BillItem, ExtractedTicketData } from '../types/veterinary';
import {
  computeBillSummary,
  formatBRL,
  generateWhatsAppReceipt,
} from '../utils/billingCalculator';

interface ReportSummaryProps {
  ticketData: ExtractedTicketData;
  items: BillItem[];
  onPrint: () => void;
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({
  ticketData,
  items,
  onPrint,
}) => {
  const [copied, setCopied] = useState(false);
  const summary = computeBillSummary(items);
  const activeItems = items.filter((i) => i.isChecked);

  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppReceipt(ticketData, items);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <span>Relatório Resumido de Atendimento & Faturamento</span>
          </h2>
          <p className="text-xs text-slate-500">
            Fatura calculada pronta para conferência, impressão ou envio ao tutor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copiado com Sucesso!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Copiar para WhatsApp</span>
              </>
            )}
          </button>

          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ficha / Relatório</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Report Container */}
      <div
        id="printable-report"
        className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 max-w-4xl mx-auto space-y-6 print:p-0 print:border-none print:shadow-none"
      >
        {/* Hospital Header */}
        <div className="border-b-2 border-slate-900 pb-5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-black text-2xl shadow-sm">
                HVA
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  HOSPITAL VETERINÁRIO ARAÚJO
                </h1>
                <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold">
                  Controle de Atendimento do Paciente & Extrato Financeiro
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Atendimento Clínico • Cirurgias • Internação • Exames Complementares
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded inline-block mb-1">
                OT: {ticketData.header.ot || '04128'}
              </div>
              <p className="text-slate-500">
                Via: <span className="font-semibold">{ticketData.header.via || '1ª VIA'}</span>
              </p>
              <p className="text-slate-500">
                Data:{' '}
                <span className="font-semibold">
                  {ticketData.header.date || new Date().toLocaleDateString('pt-BR')}
                </span>{' '}
                {ticketData.header.horCheg ? `às ${ticketData.header.horCheg}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Patient / Tutor Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Tutor:</span>
            <span className="font-bold text-slate-900 text-sm">
              {ticketData.patient.tutorName || 'Não Informado'}
            </span>
            {ticketData.patient.tutorCode && (
              <span className="text-slate-400 block text-[10px]">
                Cód: {ticketData.patient.tutorCode}
              </span>
            )}
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">Paciente (Pet):</span>
            <span className="font-bold text-slate-900 text-sm">
              {ticketData.patient.patientName || 'Não Informado'}
            </span>
            {ticketData.patient.weightKg && (
              <span className="text-slate-600 block text-[11px]">
                Peso: <strong>{ticketData.patient.weightKg} kg</strong>
              </span>
            )}
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">Veterinário Responsável:</span>
            <span className="font-bold text-slate-900 text-sm">
              {ticketData.header.vet || 'Equipe HVA'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">Situação do Paciente:</span>
            <span className="font-bold text-slate-800 text-sm">
              {ticketData.protocol?.patientStatus || 'Estável'}
            </span>
          </div>
        </div>

        {/* Line Items Table */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            Discriminação dos Serviços & Aplicações
          </h3>
          <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Item / Procedimento</th>
                <th className="py-2.5 px-2">Categoria</th>
                <th className="py-2.5 px-2 text-center">Qtd</th>
                <th className="py-2.5 px-2 text-right">Valor Unitário</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeItems.map((item, idx) => {
                const totalItem = item.quantity * item.unitPrice;
                return (
                  <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-900">{item.description}</div>
                      {item.hasDifference && (
                        <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                          * Valor manuscrito pelo veterinário: {formatBRL(item.handwrittenPrice)} (Tabela HVA: {formatBRL(item.tablePrice)})
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-slate-500">{item.categoryLabel}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-700">
                      {formatBRL(item.unitPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatBRL(totalItem)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Subtotals by Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          {Object.values(summary.categorySubtotals).map((cat) => (
            <div
              key={cat.label}
              className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex justify-between items-center"
            >
              <span className="text-slate-600 font-medium">{cat.label}:</span>
              <span className="font-bold text-slate-900 font-mono">
                {formatBRL(cat.total)}
              </span>
            </div>
          ))}
        </div>

        {/* Divergence Notification Box (REQUIRED BY USER) */}
        {summary.divergences.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Observação de Divergência de Valores (Regra HVA Aplicada):</span>
            </div>
            <p className="text-amber-900 leading-relaxed">
              Foram identificados <strong>{summary.divergences.length} item(ns)</strong> cujo valor anotado à mão difere da tabela de preços padrão do hospital. Conforme política do hospital, <strong>foram considerados e somados os valores manuscritos pelo veterinário responsável</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1 text-amber-900 font-medium pl-1">
              {summary.divergences.map((div) => (
                <li key={div.id}>
                  <strong>{div.itemDescription}</strong>: Tabela = {formatBRL(div.tablePrice)} | Manuscrito = {formatBRL(div.handwrittenPrice)} ({div.difference < 0 ? 'Desconto' : 'Acréscimo'} de {formatBRL(Math.abs(div.difference))})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Grand Total Box */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-100 block">
              Valor Total do Atendimento
            </span>
            <span className="text-xs text-emerald-100">
              {activeItems.length} itens incluídos na soma final
            </span>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black tracking-tight">
              {formatBRL(summary.grandTotal)}
            </span>
          </div>
        </div>

        {/* Signatures & Release Footer */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
          <div className="border-t border-slate-300 pt-2">
            <p className="font-semibold text-slate-800">
              {ticketData.patient.tutorName || 'Assinatura do Tutor / Responsável'}
            </p>
            <p className="text-[11px] text-slate-400">Declaro estar ciente dos serviços prestados</p>
          </div>
          <div className="border-t border-slate-300 pt-2">
            <p className="font-semibold text-slate-800">
              {ticketData.header.vet || 'Médico Veterinário'}
            </p>
            <p className="text-[11px] text-slate-400">CRMV / Hospital Veterinário Araújo</p>
          </div>
        </div>
      </div>
    </div>
  );
};
