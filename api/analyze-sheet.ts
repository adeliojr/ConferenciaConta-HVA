import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Helper to reliably parse request body in both Vercel Serverless and Node environments
async function getRequestBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk: any) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res: any, status: number, data: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json(data);
  }
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

export default async function handler(req: any, res: any) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (typeof res.status === 'function') {
      return res.status(200).end();
    }
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      success: false,
      message: 'Método não permitido. Utilize POST.',
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[HVA OCR] GEMINI_API_KEY não encontrada no process.env');
      return sendJson(res, 200, {
        success: false,
        message:
          'Chave GEMINI_API_KEY não encontrada nas variáveis de ambiente da Vercel. Por favor, acesse o painel da Vercel em Project Settings > Environment Variables, adicione a variável GEMINI_API_KEY e faça um novo Deploy.',
      });
    }

    const body = await getRequestBody(req);
    const { frontImage, backImage, labImage, imageBase64, imagePath } = body;

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

    // Helper for loading sample images from public directory
    const loadFromPath = (p: string) => {
      try {
        let cleanPath = p.startsWith('/') ? p.slice(1) : p;
        let fullPath = path.resolve(process.cwd(), cleanPath);
        if (!fs.existsSync(fullPath)) {
          fullPath = path.resolve(process.cwd(), 'public', cleanPath);
        }
        if (fs.existsSync(fullPath)) {
          const fileBuf = fs.readFileSync(fullPath);
          let mime = 'image/jpeg';
          if (fullPath.endsWith('.png')) mime = 'image/png';
          if (fullPath.endsWith('.webp')) mime = 'image/webp';
          return { mimeType: mime, data: fileBuf.toString('base64') };
        }
      } catch (e) {
        console.warn('Erro ao ler arquivo local:', e);
      }
      return null;
    };

    // 1. Frente da ficha HVA
    if (frontImage) {
      if (frontImage.startsWith('/assets/') || frontImage.startsWith('assets/')) {
        const loaded = loadFromPath(frontImage);
        if (loaded) imageParts.push(loaded);
      } else {
        const parsed = parseImageData(frontImage);
        if (parsed && parsed.base64) imageParts.push({ mimeType: parsed.mimeType, data: parsed.base64 });
      }
    }

    // 2. Verso da ficha HVA
    if (backImage) {
      if (backImage.startsWith('/assets/') || backImage.startsWith('assets/')) {
        const loaded = loadFromPath(backImage);
        if (loaded) imageParts.push(loaded);
      } else {
        const parsed = parseImageData(backImage);
        if (parsed && parsed.base64) imageParts.push({ mimeType: parsed.mimeType, data: parsed.base64 });
      }
    }

    // 3. Requisição de Exames CEAVET
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
      return sendJson(res, 200, {
        success: false,
        message: 'Nenhuma foto (frente, verso ou requisição laboratorial) foi recebida para análise.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

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

    // Use fast gemini-3.1-flash-lite as primary with gemini-3.8-flash as fallback
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let response: any = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[HVA OCR] Solicitando análise ao modelo ${modelName}...`);
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
          console.log(`[HVA OCR] Análise concluída com sucesso (${modelName})`);
          break;
        }
      } catch (err: any) {
        console.warn(`[HVA OCR] Falha no modelo ${modelName}:`, err.message || err);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      const errorMsg = lastError?.message || 'Falha ao comunicar com os modelos de IA.';
      return sendJson(res, 200, {
        success: false,
        message: `Não foi possível analisar as fotos no momento (${errorMsg}). Por favor, tente novamente.`,
      });
    }

    const rawText = response.text || '{}';
    let parsedData: any;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return sendJson(res, 200, {
      success: true,
      extractedData: parsedData,
    });
  } catch (err: any) {
    console.error('[HVA OCR] Erro fatal:', err);
    return sendJson(res, 200, {
      success: false,
      message: `Erro ao processar as fotos da ficha: ${err.message || 'Erro inesperado'}`,
    });
  }
}
