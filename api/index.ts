export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const data = {
    status: 'online',
    system: 'Hospital Veterinário Araújo - API de Faturamento e OCR',
    timestamp: new Date().toISOString(),
  };
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(200).json(data);
  }
  res.statusCode = 200;
  res.end(JSON.stringify(data));
}
