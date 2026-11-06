import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { DEFAULT_HVA_PRICES } from './src/data/defaultPrices.ts';
import { PriceItem } from './src/types/veterinary.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Increase payload limit for photos / camera uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for public directory
const publicDir = path.resolve(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// Ensure data directory exists for persistent prices (use /tmp on Vercel serverless)
const dataDir = process.env.VERCEL
  ? path.resolve('/tmp', 'data')
  : path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    console.warn('Could not create data dir:', e);
  }
}
const pricesFilePath = path.join(dataDir, 'custom_prices.json');

function getStoredPrices(): PriceItem[] {
  try {
    if (fs.existsSync(pricesFilePath)) {
      const data = fs.readFileSync(pricesFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge in any newly added default items (like CEAVET) that aren't in custom yet
        const existingIds = new Set(parsed.map((p: PriceItem) => p.id));
        const merged = [...parsed];
        for (const def of DEFAULT_HVA_PRICES) {
          if (!existingIds.has(def.id)) {
            merged.push(def);
          }
        }
        return merged;
      }
    }
  } catch (err) {
    console.error('Error reading custom prices:', err);
  }
  return DEFAULT_HVA_PRICES;
}

function saveStoredPrices(prices: PriceItem[]): void {
  try {
    fs.writeFileSync(pricesFilePath, JSON.stringify(prices, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving custom prices:', err);
  }
}

// Initialise GoogleGenAI
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// ================= API ROUTES =================

// GET /api/prices
app.get('/api/prices', (_req: Request, res: Response) => {
  const prices = getStoredPrices();
  res.json({ success: true, count: prices.length, prices });
});

// POST /api/prices (Update or add prices)
app.post('/api/prices', (req: Request, res: Response) => {
  try {
    const { prices } = req.body;
    if (!Array.isArray(prices)) {
      return res.status(400).json({ success: false, message: 'Formato inválido de preços.' });
    }
    saveStoredPrices(prices);
    res.json({ success: true, message: 'Tabela de preços salva com sucesso.', count: prices.length });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/prices/reset
app.post('/api/prices/reset', (_req: Request, res: Response) => {
  try {
    if (fs.existsSync(pricesFilePath)) {
      fs.unlinkSync(pricesFilePath);
    }
    res.json({ success: true, message: 'Tabela restaurada para os valores originais do HVA e CEAVET.', prices: DEFAULT_HVA_PRICES });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/analyze-sheet (Supports front, back, and lab requisition sheet photos)
app.post('/api/analyze-sheet', async (req: Request, res: Response) => {
  try {
    const { frontImage, backImage, labImage, imageBase64, imagePath } = req.body;

    const parseImageData = (raw: string | undefined): { mimeType: string; base64: string } | null => {
      if (!raw) return null;
      if (raw.startsWith('data:')) {
        const parts = raw.split(';base64,');
        return {
          mimeType: parts[0].replace('data:', '') || 'image/jpeg',
          base64: parts[1] || '',
        };
      }
      return { mimeType: 'image/jpeg', base64: raw };
    };

    const imageParts: { mimeType: string; data: string }[] = [];

    // Helper for server-side paths
    const loadFromPath = (p: string) => {
      let cleanPath = p.startsWith('/') ? p.slice(1) : p;
      let fullPath = path.resolve(__dirname, cleanPath);
      if (!fs.existsSync(fullPath)) {
        fullPath = path.resolve(__dirname, 'public', cleanPath);
      }
      if (fs.existsSync(fullPath)) {
        const fileBuf = fs.readFileSync(fullPath);
        let mime = 'image/jpeg';
        if (fullPath.endsWith('.png')) mime = 'image/png';
        if (fullPath.endsWith('.webp')) mime = 'image/webp';
        return { mimeType: mime, data: fileBuf.toString('base64') };
      }
      return null;
    };

    // 1. Front image (HVA Ficha Frente)
    if (frontImage) {
      if (frontImage.startsWith('/assets/') || frontImage.startsWith('assets/')) {
        const loaded = loadFromPath(frontImage);
        if (loaded) imageParts.push(loaded);
      } else {
        const parsed = parseImageData(frontImage);
        if (parsed && parsed.base64) imageParts.push({ mimeType: parsed.mimeType, data: parsed.base64 });
      }
    }

    // 2. Back image (HVA Ficha Verso)
    if (backImage) {
      if (backImage.startsWith('/assets/') || backImage.startsWith('assets/')) {
        const loaded = loadFromPath(backImage);
        if (loaded) imageParts.push(loaded);
      } else {
        const parsed = parseImageData(backImage);
        if (parsed && parsed.base64) imageParts.push({ mimeType: parsed.mimeType, data: parsed.base64 });
      }
    }

    // 3. Lab Requisition image (CEAVET Exames)
    if (labImage) {
      if (labImage.startsWith('/assets/') || labImage.startsWith('assets/')) {
        const loaded = loadFromPath(labImage);
        if (loaded) imageParts.push(loaded);
      } else {
        const parsed = parseImageData(labImage);
        if (parsed && parsed.base64) imageParts.push({ mimeType: parsed.mimeType, data: parsed.base64 });
      }
    }

    // 4. Fallback single image
    if (imageParts.length === 0) {
      if (imageBase64) {
        const parsed = parseImageData(imageBase64);
        if (parsed && parsed.base64) imageParts.push({ mimeType: parsed.mimeType, data: parsed.base64 });
      } else if (imagePath) {
        const loaded = loadFromPath(imagePath);
        if (loaded) imageParts.push(loaded);
      }
    }

    if (imageParts.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'Nenhuma foto (frente, verso ou requisição laboratorial) foi enviada para análise.',
      });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(200).json({
        success: false,
        message: 'Chave GEMINI_API_KEY não configurada. Por favor, adicione a variável de ambiente GEMINI_API_KEY no painel da Vercel (Project Settings > Environment Variables) para que a IA possa ler as fichas.',
      });
    }

    const systemPrompt = `Você é um auditor de faturamento veterinário do HOSPITAL VETERINÁRIO ARAÚJO (HVA) e do LABORATÓRIO CEAVET.
Você está analisando foto(s) de atendimento veterinário, que podem incluir:
- Ficha oficial 'Controle Paciente' do HVA (FRENTE e/ou VERSO)
- Ficha oficial 'CEAVET Laboratório Veterinário - SOLICITAÇÃO DE EXAMES INTERNOS' (Requisição de Exames)

Examine cuidadosamente todo o conteúdo impresso e ESCRITO À MÃO em todas as imagens fornecidas:

1. CABEÇALHO & IDENTIFICAÇÃO (HVA ou CEAVET):
   - Nome do Animal / Paciente, Espécie, Raça, Idade, Sexo, Peso em kg (se houver)
   - Nome do Proprietário / Tutor, Código Tutor
   - Veterinário solicitante / responsável (ex: Dr. Adélio, Dr. Giovani, Dr. Leonardo, Dra. Lorena, Dra. Kalinca, Dr. Marco, Dr. Vinicius, etc.)
   - Data e Horário

2. FICHA HVA (CONSULTA, INTERNAÇÃO, PROCEDIMENTOS, APLICAÇÕES):
   - Tipo de Consulta marcado
   - Internação e diárias marcadas
   - Cirurgias e procedimentos marcados
   - Aplicações de medicamentos e dosagens escritas à mão na tabela central ou no verso
   - Valores em R$ escritos à mão pelo veterinário

3. REQUISIÇÃO DE EXAMES CEAVET (SOLICITAÇÃO DE EXAMES INTERNOS):
   - Esta ficha contém seções com caixas de seleção (checkboxes) que podem ter sido marcadas com 'X' ou preenchimento:
     * HEMATOLOGIA: Aglutinação em salina, Contagem de Plaquetas, Hematócrito e PPT, Hemograma + Plaquetas, Reticulócitos, Teste de Compatibilidade Sanguínea
     * UROANÁLISE: Relação Proteína / Creatinina, Urinálise
     * PARASITOLOGIA: Parasitológico de Fezes, Perfil Dermatológico, Raspado de Pele
     * COMBOS BIOQUÍMICOS: Eletrólitos, Função Hepática, Função Hepática II, Função Hepática III, Função Renal
     * BIOQUÍMICOS: Albumina, ALT (TGP), AST, Bilirrubinas (Luz), Colesterol Total, Creatinina, Fosfatase Alcalina, Fósforo, GGT, Glicose, Lipase, Proteína Sérica Total, Triglicérides, Uréia, Vitamina B12 (Luz), Vitamina D (Luz)
     * MICROBIOLOGIA: Cult e ATB (Preventiva / Tecsa / Vetex), Cult Fungos
     * ANATOMIA PATOLÓGICA: CAAF (Citologia), Histopatológico
     * Coleta Laboratório marcada
     * OUTROS: quaisquer exames adicionais anotados à mão na linha 'OUTROS'
   - Extraia CADA exame marcado na requisição CEAVET no array 'labExams', especificando o nome exato do exame, a seção e qualquer valor escrito à mão se houver.

RESPONDA EXCLUSIVAMENTE COM UM OBJETO JSON VÁLIDO com a seguinte estrutura:
{
  "header": {
    "via": "string",
    "vet": "string",
    "ot": "string",
    "horCheg": "string",
    "date": "string",
    "obs": "string"
  },
  "patient": {
    "tutorCode": "string",
    "tutorName": "string",
    "patientCode": "string",
    "patientName": "string",
    "weightKg": number or null
  },
  "consultationType": "string",
  "consultationHandwrittenPrice": number or null,
  "consultationTablePrice": number or null,
  "hospitalization": {
    "selected": boolean,
    "weightBracket": "string",
    "days": number,
    "handwrittenPrice": number or null,
    "tablePrice": number or null,
    "notes": "string"
  },
  "exams": [
    {
      "name": "string",
      "code": "string",
      "handwrittenPrice": number or null,
      "tablePrice": number or null,
      "vet": "string"
    }
  ],
  "labExams": [
    {
      "name": "string",
      "section": "string",
      "code": "string",
      "handwrittenPrice": number or null,
      "tablePrice": number or null,
      "notes": "string"
    }
  ],
  "vaccines": [
    {
      "name": "string",
      "code": "string",
      "handwrittenPrice": number or null,
      "tablePrice": number or null
    }
  ],
  "surgeriesAndProcedures": [
    {
      "name": "string",
      "code": "string",
      "handwrittenPrice": number or null,
      "tablePrice": number or null,
      "notes": "string"
    }
  ],
  "applicationsAndProducts": [
    {
      "id": "string",
      "description": "string",
      "quantity": number,
      "dosage": "string",
      "handwrittenPrice": number or null,
      "tablePrice": number or null,
      "notes": "string"
    }
  ],
  "specialItems": {
    "intensivismo": { "intensive": boolean, "o2": boolean, "hours": number, "price": number },
    "stemCell": { "vet": "string", "anesthesiologistPrice": number, "stemCellPrice": number, "transportPrice": number },
    "librela": { "mg": "string", "price": number, "vet": "string" },
    "cytopoint": { "mg": "string", "price": number, "vet": "string" }
  }
}`;

    const parts: any[] = [];
    for (const img of imageParts) {
      parts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data,
        },
      });
    }
    parts.push({ text: systemPrompt });

    // Use gemini-3.1-flash-lite as primary (fast & reliable) with gemini-3.8-flash fallback
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let response: any = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[HVA OCR] Tentando modelo ${modelName}...`);
        response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts,
          },
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response && response.text) {
          console.log(`[HVA OCR] Sucesso com modelo ${modelName}!`);
          break;
        }
      } catch (err: any) {
        console.warn(`[HVA OCR] Falha com modelo ${modelName}:`, err.message || err);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('Não foi possível obter resposta dos modelos de IA.');
    }

    const rawText = response.text || '{}';
    let parsedData: any;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      // In case wrapped in markdown ```json
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({
      success: true,
      extractedData: parsedData,
    });
  } catch (err: any) {
    console.error('Sheet analysis error:', err);
    res.status(200).json({
      success: false,
      message: err.message || 'Erro ao processar imagem da ficha com a IA.',
    });
  }
});

// Vite dev server middleware mounting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HVA Hospital Veterinário Server running at http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
