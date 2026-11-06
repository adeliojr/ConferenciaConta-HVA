import { DEFAULT_HVA_PRICES } from '../src/data/defaultPrices.ts';
import { PriceItem } from '../src/types/veterinary.ts';
import fs from 'fs';
import path from 'path';

const isVercel = !!process.env.VERCEL;
const dataDir = isVercel ? path.resolve('/tmp', 'data') : path.resolve(process.cwd(), 'data');

if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch {
    // Ignore in read-only / restricted environments
  }
}

const pricesFilePath = path.join(dataDir, 'custom_prices.json');

function getStoredPrices(): PriceItem[] {
  try {
    if (fs.existsSync(pricesFilePath)) {
      const data = fs.readFileSync(pricesFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
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

export default async function handler(req: any, res: any) {
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

  // GET: Obter tabela de preços
  if (req.method === 'GET') {
    const prices = getStoredPrices();
    return sendJson(res, 200, {
      success: true,
      count: prices.length,
      prices,
    });
  }

  // POST: Atualizar ou restaurar tabela de preços
  if (req.method === 'POST') {
    const url = req.url || '';
    const body = await getRequestBody(req);

    // Reset se solicitado na query ou body
    if (url.includes('reset=true') || body?.reset === true || url.endsWith('/reset')) {
      try {
        if (fs.existsSync(pricesFilePath)) {
          fs.unlinkSync(pricesFilePath);
        }
      } catch {
        // ignore
      }
      return sendJson(res, 200, {
        success: true,
        message: 'Tabela restaurada para os valores originais do HVA e CEAVET.',
        prices: DEFAULT_HVA_PRICES,
      });
    }

    if (Array.isArray(body?.prices)) {
      saveStoredPrices(body.prices);
      return sendJson(res, 200, {
        success: true,
        message: 'Tabela de preços salva com sucesso.',
        count: body.prices.length,
      });
    }

    return sendJson(res, 400, {
      success: false,
      message: 'Formato inválido de preços.',
    });
  }

  return sendJson(res, 405, {
    success: false,
    message: 'Método não permitido.',
  });
}
