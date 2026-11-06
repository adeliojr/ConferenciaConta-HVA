import React, { useRef, useState } from 'react';
import {
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  PlusCircle,
  FlaskConical,
} from 'lucide-react';
import { compressImageFile } from '../utils/imageUtils';

interface CleanPhotoCaptureProps {
  frontImage: string | null;
  backImage: string | null;
  labImage: string | null;
  onFrontChange: (img: string | null) => void;
  onBackChange: (img: string | null) => void;
  onLabChange: (img: string | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onLoadSample: () => void;
  onLoadLabSample: () => void;
}

export const CleanPhotoCapture: React.FC<CleanPhotoCaptureProps> = ({
  frontImage,
  backImage,
  labImage,
  onFrontChange,
  onBackChange,
  onLabChange,
  onAnalyze,
  isAnalyzing,
  onLoadSample,
  onLoadLabSample,
}) => {
  const frontCameraInputRef = useRef<HTMLInputElement>(null);
  const frontFileInputRef = useRef<HTMLInputElement>(null);
  const backCameraInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);
  const labCameraInputRef = useRef<HTMLInputElement>(null);
  const labFileInputRef = useRef<HTMLInputElement>(null);

  const [isCompressingFront, setIsCompressingFront] = useState(false);
  const [isCompressingBack, setIsCompressingBack] = useState(false);
  const [isCompressingLab, setIsCompressingLab] = useState(false);

  const handleFile = async (file: File, target: 'front' | 'back' | 'lab') => {
    if (!file) return;

    if (target === 'front') {
      setIsCompressingFront(true);
      try {
        const compressed = await compressImageFile(file, 1920, 0.85);
        onFrontChange(compressed);
      } catch (err) {
        console.error('Erro na compressão:', err);
        const reader = new FileReader();
        reader.onload = (e) => onFrontChange(e.target?.result as string);
        reader.readAsDataURL(file);
      } finally {
        setIsCompressingFront(false);
      }
    } else if (target === 'back') {
      setIsCompressingBack(true);
      try {
        const compressed = await compressImageFile(file, 1920, 0.85);
        onBackChange(compressed);
      } catch (err) {
        console.error('Erro na compressão:', err);
        const reader = new FileReader();
        reader.onload = (e) => onBackChange(e.target?.result as string);
        reader.readAsDataURL(file);
      } finally {
        setIsCompressingBack(false);
      }
    } else {
      setIsCompressingLab(true);
      try {
        const compressed = await compressImageFile(file, 1920, 0.85);
        onLabChange(compressed);
      } catch (err) {
        console.error('Erro na compressão:', err);
        const reader = new FileReader();
        reader.onload = (e) => onLabChange(e.target?.result as string);
        reader.readAsDataURL(file);
      } finally {
        setIsCompressingLab(false);
      }
    }
  };

  const hasAtLeastOneImage = Boolean(frontImage || backImage || labImage);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7">
      {/* Header do Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            Fotos da Consulta & Exames
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tire a foto da <strong>Ficha HVA</strong> (frente/verso) e da <strong>Requisição CEAVET</strong> (laboratório terceirizado).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Ficha Modelo HVA
          </button>
          <button
            type="button"
            onClick={onLoadLabSample}
            className="text-xs text-indigo-700 hover:text-indigo-800 font-semibold bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
            Requisição CEAVET Modelo
          </button>
        </div>
      </div>

      {/* Hidden File Inputs com reset de value */}
      <input
        ref={frontCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 'front')}
      />
      <input
        ref={frontFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 'front')}
      />

      <input
        ref={backCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 'back')}
      />
      <input
        ref={backFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 'back')}
      />

      <input
        ref={labCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 'lab')}
      />
      <input
        ref={labFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 'lab')}
      />

      {/* 3 Slots Grid: Frente HVA, Verso HVA, Requisição CEAVET */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-5">
        {/* SLOT 1: FRENTE DA FICHA HVA */}
        <div className="flex flex-col border border-slate-200 rounded-xl p-3 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Frente da Ficha
              </span>
            </div>
            {frontImage && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Carregada
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mb-2.5">
            Tutor, animal, consulta, internação e cirurgia.
          </p>

          {isCompressingFront ? (
            <div className="h-44 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-xs text-slate-500 gap-2 border border-slate-200">
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
              <span>Otimizando...</span>
            </div>
          ) : frontImage ? (
            <div className="space-y-2">
              <div className="relative rounded-xl border border-slate-200 bg-black/5 overflow-hidden">
                <img
                  src={frontImage}
                  alt="Frente da Ficha"
                  className="w-full h-36 object-cover sm:h-44"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => frontCameraInputRef.current?.click()}
                  className="px-1.5 py-1.5 text-[11px] font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3 h-3 text-emerald-600" />
                  <span>Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => frontFileInputRef.current?.click()}
                  className="px-1.5 py-1.5 text-[11px] font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>Arquivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => onFrontChange(null)}
                  className="px-1.5 py-1.5 text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                  title="Remover"
                >
                  <Trash2 className="w-3 h-3 text-rose-600" />
                  <span>Remover</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center gap-2 p-3 bg-white border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl transition-all">
              <div className="text-center py-1">
                <PlusCircle className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-slate-700 block">
                  Foto da Frente
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => frontCameraInputRef.current?.click()}
                  className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Câmera</span>
                </button>
                <button
                  type="button"
                  onClick={() => frontFileInputRef.current?.click()}
                  className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Arquivo</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SLOT 2: VERSO DA FICHA HVA */}
        <div className="flex flex-col border border-slate-200 rounded-xl p-3 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Verso da Ficha
              </span>
            </div>
            {backImage && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Carregada
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mb-2.5">
            Medicamentos, doses, aplicações e curativos.
          </p>

          {isCompressingBack ? (
            <div className="h-44 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-xs text-slate-500 gap-2 border border-slate-200">
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
              <span>Otimizando...</span>
            </div>
          ) : backImage ? (
            <div className="space-y-2">
              <div className="relative rounded-xl border border-slate-200 bg-black/5 overflow-hidden">
                <img
                  src={backImage}
                  alt="Verso da Ficha"
                  className="w-full h-36 object-cover sm:h-44"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => backCameraInputRef.current?.click()}
                  className="px-1.5 py-1.5 text-[11px] font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3 h-3 text-emerald-600" />
                  <span>Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => backFileInputRef.current?.click()}
                  className="px-1.5 py-1.5 text-[11px] font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>Arquivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => onBackChange(null)}
                  className="px-1.5 py-1.5 text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                  title="Remover"
                >
                  <Trash2 className="w-3 h-3 text-rose-600" />
                  <span>Remover</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center gap-2 p-3 bg-white border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl transition-all">
              <div className="text-center py-1">
                <PlusCircle className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-slate-700 block">
                  Verso (Opcional)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => backCameraInputRef.current?.click()}
                  className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Câmera</span>
                </button>
                <button
                  type="button"
                  onClick={() => backFileInputRef.current?.click()}
                  className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Arquivo</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SLOT 3: REQUISIÇÃO DE EXAMES CEAVET */}
        <div className="flex flex-col border border-indigo-200/80 rounded-xl p-3 bg-indigo-50/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-800 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                Exames CEAVET
              </span>
            </div>
            {labImage && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Carregada
              </span>
            )}
          </div>
          <p className="text-[11px] text-indigo-700/80 mb-2.5">
            Requisição do laboratório terceirizado CEAVET.
          </p>

          {isCompressingLab ? (
            <div className="h-44 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-xs text-slate-500 gap-2 border border-slate-200">
              <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
              <span>Otimizando...</span>
            </div>
          ) : labImage ? (
            <div className="space-y-2">
              <div className="relative rounded-xl border border-indigo-200 bg-black/5 overflow-hidden">
                <img
                  src={labImage}
                  alt="Requisição CEAVET"
                  className="w-full h-36 object-cover sm:h-44"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => labCameraInputRef.current?.click()}
                  className="px-1.5 py-1.5 text-[11px] font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3 h-3 text-indigo-600" />
                  <span>Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => labFileInputRef.current?.click()}
                  className="px-1.5 py-1.5 text-[11px] font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>Arquivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => onLabChange(null)}
                  className="px-1.5 py-1.5 text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                  title="Remover"
                >
                  <Trash2 className="w-3 h-3 text-rose-600" />
                  <span>Remover</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center gap-2 p-3 bg-white border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-xl transition-all">
              <div className="text-center py-1">
                <FlaskConical className="w-6 h-6 text-indigo-300 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-indigo-900 block">
                  Requisição CEAVET
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => labCameraInputRef.current?.click()}
                  className="py-2 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Câmera</span>
                </button>
                <button
                  type="button"
                  onClick={() => labFileInputRef.current?.click()}
                  className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Arquivo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Ação Principal */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-600 text-center sm:text-left">
          {hasAtLeastOneImage ? (
            <span className="text-slate-800">
              Pronto para conferir:{' '}
              <strong className="text-emerald-700 font-semibold">
                {[
                  frontImage ? 'Frente HVA' : null,
                  backImage ? 'Verso HVA' : null,
                  labImage ? 'Requisição CEAVET' : null,
                ]
                  .filter(Boolean)
                  .join(' + ')}
              </strong>
            </span>
          ) : (
            <span className="text-slate-400">
              Tire a foto da ficha HVA ou da requisição CEAVET acima para somar e conferir.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={!hasAtLeastOneImage || isAnalyzing}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
            isAnalyzing
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : hasAtLeastOneImage
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-[0.99] shadow-emerald-600/25'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Lendo Fichas e Conferindo Valores HVA & CEAVET...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Conferir e Somar Valores</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
