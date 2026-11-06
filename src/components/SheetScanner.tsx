import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Eye,
  FileSpreadsheet,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import { SAMPLE_TICKETS, SampleTicketPreset } from '../data/sampleTickets';
import { ExtractedTicketData } from '../types/veterinary';

interface SheetScannerProps {
  currentImage?: string;
  onImageChange: (image: string) => void;
  onAnalyzeStart: () => void;
  onAnalyzeSuccess: (data: ExtractedTicketData) => void;
  onAnalyzeError: (errorMsg: string) => void;
  isAnalyzing: boolean;
  onLoadPreset: (preset: SampleTicketPreset) => void;
  activePresetId?: string;
}

export const SheetScanner: React.FC<SheetScannerProps> = ({
  currentImage,
  onImageChange,
  onAnalyzeStart,
  onAnalyzeSuccess,
  onAnalyzeError,
  isAnalyzing,
  onLoadPreset,
  activePresetId,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImageChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendToGemini = async () => {
    if (!currentImage) return;

    onAnalyzeStart();
    try {
      const isBase64 = currentImage.startsWith('data:');
      const payload = isBase64
        ? { imageBase64: currentImage }
        : { imagePath: currentImage };

      const res = await fetch('/api/analyze-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Falha ao analisar a ficha');
      }

      onAnalyzeSuccess(json.extractedData);
    } catch (err: any) {
      console.error('OCR analysis error:', err);
      onAnalyzeError(
        err.message || 'Não foi possível ler a imagem. Tente carregar um dos casos de teste predefinidos.'
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-5">
      {/* Header and Quick Preset Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <span>Ficha de Atendimento & Leitor Manuscrito</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tire foto da ficha impressa do HVA ou selecione um caso de atendimento pré-carregado.
          </p>
        </div>

        {/* Upload Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50"
          >
            <Camera className="w-4 h-4 text-slate-600" />
            <span>Tirar Foto</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Carregar Imagem</span>
          </button>

          <button
            onClick={handleSendToGemini}
            disabled={!currentImage || isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Identificando Manuscrito...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Identificar por IA (Gemini)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Presets Bar */}
      <div>
        <label className="text-xs font-bold text-slate-700 block mb-2">
          Casos Rápidos Prontos para Teste & Demonstração:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_TICKETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onLoadPreset(preset)}
                className={`text-left p-3 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span className="line-clamp-1">{preset.title.split(':')[0]}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Image Preview & Controls */}
      <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-900/5 min-h-[380px] max-h-[520px] flex items-center justify-center">
        {currentImage ? (
          <div className="w-full h-full min-h-[380px] flex items-center justify-center overflow-auto p-4 relative">
            <img
              src={currentImage}
              alt="Ficha de Controle de Paciente HVA"
              className="max-h-[480px] object-contain transition-transform duration-200 shadow-md rounded-lg"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            />

            {/* Float Floating Zoom / Rotate Controls */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl shadow-md border border-slate-200/80">
              <button
                onClick={() => setZoom((prev) => Math.min(prev + 0.25, 3))}
                title="Aumentar Zoom"
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.5))}
                title="Diminuir Zoom"
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                title="Girar Imagem"
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setZoom(1);
                  setRotation(0);
                }}
                title="Resetar visualização"
                className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Reset
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Nenhuma ficha selecionada
              </p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Carregue uma imagem do seu celular, tire uma foto ou selecione um dos casos acima para iniciar a conferência.
              </p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-6 z-10">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/30 animate-pulse">
              <Sparkles className="w-7 h-7 animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-slate-900">
                Processando ficha com IA Gemini...
              </h4>
              <p className="text-xs text-slate-600 max-w-md">
                Lendo cabeçalho, caixas assinaladas, internamento, cirurgias e todas as anotações manuscritas na grade de aplicações.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
