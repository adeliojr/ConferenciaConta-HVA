import React, { useState, useEffect } from 'react';
import { CleanHeader } from './components/CleanHeader';
import { CleanPhotoCapture } from './components/CleanPhotoCapture';
import { CleanBillSummary } from './components/CleanBillSummary';
import { PriceAdminModal } from './components/PriceAdminModal';
import { DEFAULT_HVA_PRICES } from './data/defaultPrices';
import { SAMPLE_TICKETS } from './data/sampleTickets';
import {
  BillItem,
  ExtractedTicketData,
  PriceItem,
} from './types/veterinary';
import {
  buildBillItemsFromTicket,
  computeBillSummary,
} from './utils/billingCalculator';
import { AlertCircle, X } from 'lucide-react';

const EMPTY_TICKET: ExtractedTicketData = {
  header: {
    via: '1ª VIA',
    vet: '',
    date: new Date().toLocaleDateString('pt-BR'),
    horCheg: '',
  },
  patient: {
    tutorName: '',
    patientName: '',
  },
  exams: [],
  vaccines: [],
  surgeriesAndProcedures: [],
  applicationsAndProducts: [],
};

export default function App() {
  const [catalog, setCatalog] = useState<PriceItem[]>(DEFAULT_HVA_PRICES);
  const [isPriceAdminOpen, setIsPriceAdminOpen] = useState(false);

  // Photos: Frente, Verso e Requisição CEAVET
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [labImage, setLabImage] = useState<string | null>(null);

  // Active extracted ticket data
  const [ticketData, setTicketData] = useState<ExtractedTicketData>(EMPTY_TICKET);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(false);

  // 1. Load custom prices from server on startup
  useEffect(() => {
    fetch('/api/prices')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.prices) && data.prices.length > 0) {
          setCatalog(data.prices);
        }
      })
      .catch((err) => {
        console.warn('Usando catálogo padrão HVA:', err);
      });
  }, []);

  // 2. Recompute bill items whenever ticketData or catalog changes
  useEffect(() => {
    if (ticketData) {
      const items = buildBillItemsFromTicket(ticketData, catalog);
      setBillItems(items);
    }
  }, [ticketData, catalog]);

  // Handler: Analyze photos (Frente, Verso e Requisição Laboratório)
  const handleAnalyzeSheet = async () => {
    if (!frontImage && !backImage && !labImage) {
      setErrorMessage('Por favor, tire ao menos uma foto (frente, verso ou requisição laboratorial).');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analyze-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontImage: frontImage || undefined,
          backImage: backImage || undefined,
          labImage: labImage || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erro ao processar as fotos da ficha.');
      }

      setTicketData(data.extractedData);
      setHasScanned(true);
    } catch (err: any) {
      console.error('Falha na análise da ficha:', err);
      setErrorMessage(
        err.message || 'Não foi possível ler as fotos da ficha. Tente novamente ou use uma foto mais nítida.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler: Load preset sample ticket
  const handleLoadSample = () => {
    const sample = SAMPLE_TICKETS[0];
    setFrontImage(sample.imagePath || '/assets/aistudio/IMG_20261106_095610_8cc31c55.jpg');
    setBackImage(null);
    setTicketData(sample.data);
    setHasScanned(true);
    setErrorMessage(null);
  };

  // Handler: Load preset CEAVET sample
  const handleLoadLabSample = () => {
    setLabImage('/assets/aistudio/IMG_20261106_110447_b3b16d92.jpg');
    setErrorMessage(null);
  };

  // Handler: Start a fresh blank ticket
  const handleNewTicket = () => {
    setFrontImage(null);
    setBackImage(null);
    setLabImage(null);
    setTicketData({
      header: {
        via: '1ª VIA',
        vet: '',
        date: new Date().toLocaleDateString('pt-BR'),
        horCheg: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
      patient: {
        tutorName: '',
        patientName: '',
      },
      exams: [],
      vaccines: [],
      surgeriesAndProcedures: [],
      applicationsAndProducts: [],
    });
    setBillItems([]);
    setHasScanned(false);
    setErrorMessage(null);
  };

  // Handler: Update a single item
  const handleUpdateItem = (id: string, updates: Partial<BillItem>) => {
    setBillItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Handler: Delete an item
  const handleDeleteItem = (id: string) => {
    setBillItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Handler: Add a manual item
  const handleAddItem = (newItem: BillItem) => {
    setBillItems((prev) => [newItem, ...prev]);
  };

  // Handler: Toggle between handwritten and table price
  const handleTogglePriceSource = (itemId: string) => {
    setBillItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const currentSource = item.appliedPriceSource;
        const newSource = currentSource === 'handwritten' ? 'table' : 'handwritten';
        const targetPrice =
          newSource === 'table'
            ? item.tablePrice ?? item.unitPrice
            : item.handwrittenPrice ?? item.unitPrice;

        return {
          ...item,
          appliedPriceSource: newSource,
          unitPrice: targetPrice,
        };
      })
    );
  };

  // Handler: Save modified prices catalog
  const handleSaveCatalog = async (updated: PriceItem[]) => {
    setCatalog(updated);
    await fetch('/api/prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prices: updated }),
    });
  };

  // Handler: Reset catalog to factory defaults
  const handleResetCatalog = async () => {
    const res = await fetch('/api/prices/reset', { method: 'POST' });
    const data = await res.json();
    if (data.success && data.prices) {
      setCatalog(data.prices);
    } else {
      setCatalog(DEFAULT_HVA_PRICES);
    }
  };

  const summary = computeBillSummary(billItems);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans antialiased flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Clean Minimalist Header */}
      <CleanHeader
        onOpenPriceAdmin={() => setIsPriceAdminOpen(true)}
        onNewTicket={handleNewTicket}
        grandTotal={summary.grandTotal}
        itemCount={billItems.length}
      />

      {/* Main Centered Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Error notification if any */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200/90 rounded-2xl text-xs sm:text-sm text-rose-800 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 1: Capture Photos (Frente, Verso e Requisição CEAVET) */}
        <CleanPhotoCapture
          frontImage={frontImage}
          backImage={backImage}
          labImage={labImage}
          onFrontChange={setFrontImage}
          onBackChange={setBackImage}
          onLabChange={setLabImage}
          onAnalyze={handleAnalyzeSheet}
          isAnalyzing={isAnalyzing}
          onLoadSample={handleLoadSample}
          onLoadLabSample={handleLoadLabSample}
        />

        {/* Step 2: Clean Results Card & Sum */}
        {hasScanned && (
          <CleanBillSummary
            ticketData={ticketData}
            items={billItems}
            catalog={catalog}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onAddItem={handleAddItem}
            onTogglePriceSource={handleTogglePriceSource}
          />
        )}
      </main>

      {/* Modal de Administração de Preços */}
      <PriceAdminModal
        isOpen={isPriceAdminOpen}
        onClose={() => setIsPriceAdminOpen(false)}
        catalog={catalog}
        onSaveCatalog={handleSaveCatalog}
        onResetCatalog={handleResetCatalog}
      />

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 print:hidden">
        Hospital Veterinário Araújo • Sistema de Faturamento & Conferência de Fichas
      </footer>
    </div>
  );
}
