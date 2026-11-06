import { PriceCategory, PriceItem } from '../types/veterinary';
import { DEFAULT_CEAVET_PRICES } from './ceavetPrices';

export const CATEGORY_LABELS: Record<PriceCategory, string> = {
  CONSULTA: 'Consultas',
  INTERNACAO: 'Internação',
  VACINA: 'Vacinas',
  EXAME: 'Exames & Diagnósticos HVA',
  LABORATORIO_CEAVET: 'Laboratório CEAVET (Exames Externos)',
  PROCEDIMENTO: 'Procedimentos & Cuidados',
  ANESTESIA: 'Anestesia & Sedação',
  CASTRACAO: 'Castração',
  CIRURGIA: 'Cirurgias Gerais & Especializadas',
  CIRURGIA_OFTALMICA: 'Cirurgias Oftálmicas',
  ELETROQUIMIOTERAPIA: 'Eletroquimioterapia',
  MEDICAMENTO_APLICACAO: 'Aplicações & Medicamentos',
  OUTROS: 'Outros Serviços',
};

export const DEFAULT_HVA_PRICES: PriceItem[] = [
  // =================== CONSULTAS ===================
  { id: 'c-1195', code: '1195', name: 'Consulta Geral / Ambulatorial', category: 'CONSULTA', price: 198.00 },
  { id: 'c-1197', code: '1197', name: 'Consulta Plantão', category: 'CONSULTA', price: 345.00 },
  { id: 'c-1819', code: '1819', name: 'Consulta Especialidade', category: 'CONSULTA', price: 290.00 },
  { id: 'c-9135', code: '9135', name: 'Consulta Acompanhamento', category: 'CONSULTA', price: 99.00 },
  { id: 'c-1196', code: '1196', name: 'Consulta Domicílio (sem deslocamento/carreto)', category: 'CONSULTA', price: 345.00 },
  { id: 'c-retorno', code: 'RET', name: 'Consulta Retorno', category: 'CONSULTA', price: 0.00, notes: 'Retorno até prazo estipulado' },
  { id: 'c-assumida', code: 'ASSUM', name: 'Consulta Assumida', category: 'CONSULTA', price: 0.00, notes: 'Troca de plantão' },

  // =================== INTERNAÇÃO ===================
  { id: 'i-1199', code: '1199', name: 'Internação Até 10kg (diária)', category: 'INTERNACAO', price: 398.00 },
  { id: 'i-1198', code: '1198', name: 'Internação Até 20kg (diária)', category: 'INTERNACAO', price: 498.00 },
  { id: 'i-1194', code: '1194', name: 'Internação Até 30kg (diária)', category: 'INTERNACAO', price: 498.00 },
  { id: 'i-5635', code: '5635', name: 'Internação Acima de 30kg (diária)', category: 'INTERNACAO', price: 589.00 },

  // =================== VACINAS ===================
  { id: 'v-1510', code: '1510', name: 'Bronchi Guard (Gripe Canina)', category: 'VACINA', price: 149.00 },
  { id: 'v-1002656', code: '1002656', name: 'Feline V4 (Tecbio)', category: 'VACINA', price: 149.00 },
  { id: 'v-1906', code: '1906', name: 'Felocell Quádrupla (Gato V4)', category: 'VACINA', price: 149.00 },
  { id: 'v-1002428', code: '1002428', name: 'Felocell FeLV 1 DS (Leucemia)', category: 'VACINA', price: 79.00 },
  { id: 'v-1509', code: '1509', name: 'Giardia Vax (Giárdia)', category: 'VACINA', price: 149.00 },
  { id: 'v-821', code: '821', name: 'Imunocan (Fungo)', category: 'VACINA', price: 188.00 },
  { id: 'v-1000099', code: '1000099', name: 'Múltipla Nobivac DHPPI (V7)', category: 'VACINA', price: 139.00 },
  { id: 'v-6882', code: '6882', name: 'Múltipla Nobivac Puppy (V3)', category: 'VACINA', price: 129.00 },
  { id: 'v-2813', code: '2813', name: 'Múltipla Recombitek V6 (Cão V6)', category: 'VACINA', price: 129.00 },
  { id: 'v-1712', code: '1712', name: 'Múltipla Vanguard Plus (Cão V10)', category: 'VACINA', price: 139.00 },
  { id: 'v-8216', code: '8216', name: 'Nobivac Feline (V5)', category: 'VACINA', price: 179.90 },
  { id: 'v-1000097', code: '1000097', name: 'Nobivac KC (Gripe Intranasal)', category: 'VACINA', price: 139.00 },
  { id: 'v-4686', code: '4686', name: 'Raiva Rabisin / Nobivac / Defensor', category: 'VACINA', price: 99.00 },
  { id: 'v-1000370', code: '1000370', name: 'Vanguard B Oral', category: 'VACINA', price: 149.00 },
  { id: 'v-1001649', code: '1001649', name: 'Vanguard I - III (Gripe)', category: 'VACINA', price: 149.00 },
  { id: 'v-3820', code: '3820', name: 'Microchip Veterinário', category: 'VACINA', price: 189.00 },

  // =================== EXAMES & DIAGNÓSTICOS ===================
  { id: 'e-1219', code: '1219', name: 'Ecocardiograma', category: 'EXAME', price: 420.00 },
  { id: 'e-1221', code: '1221', name: 'Avaliação Cardíaca (Pressão, Eletro e RX Tórax)', category: 'EXAME', price: 420.00 },
  { id: 'e-1220', code: '1220', name: 'Pressão Arterial', category: 'EXAME', price: 49.00 },
  { id: 'e-1218', code: '1218', name: 'Eletrocardiograma', category: 'EXAME', price: 215.00 },
  { id: 'e-3458-1', code: '3458', name: 'Endoscopia Retirada de Corpo Estranho', category: 'EXAME', price: 0.00, isQuotation: true, notes: 'Cotar com especialista' },
  { id: 'e-3458-2', code: '3458', name: 'Endoscopia com Diagnóstico (Dr. Marcela)', category: 'EXAME', price: 0.00, isQuotation: true, notes: 'Valor com Dr. Marcela' },
  { id: 'e-1212', code: '1212', name: 'Raio-X 1 Projeção', category: 'EXAME', price: 198.00 },
  { id: 'e-1214', code: '1214', name: 'Raio-X 2 Projeções', category: 'EXAME', price: 249.00 },
  { id: 'e-1215', code: '1215', name: 'Raio-X 3 Projeções', category: 'EXAME', price: 298.00 },
  { id: 'e-1216', code: '1216', name: 'Raio-X Contrastado', category: 'EXAME', price: 290.00, minPrice: 290.00, maxPrice: 590.00 },
  { id: 'e-5577', code: '5577', name: 'Raio-X (Displasia) sem Anestesia', category: 'EXAME', price: 280.00 },
  { id: 'e-3775', code: '3775', name: 'Teste Fluoresceína', category: 'EXAME', price: 49.00 },
  { id: 'e-2754', code: '2754', name: 'Teste Schirmer', category: 'EXAME', price: 79.00 },
  { id: 'e-1217', code: '1217', name: 'Ultrassom Abdominal', category: 'EXAME', price: 279.00 },
  { id: 'e-1234', code: '1234', name: 'Ultrassom Plantão', category: 'EXAME', price: 399.00 },
  { id: 'e-hemograma', code: 'HEMOG', name: 'Hemograma Completo', category: 'EXAME', price: 85.00 },
  { id: 'e-bioquimico', code: 'BIOQ', name: 'Perfil Bioquímico (Renal/Hepático)', category: 'EXAME', price: 140.00 },
  { id: 'e-acup-ozon', code: 'ACUP', name: 'Acupuntura / Ozonioterapia Sessão', category: 'EXAME', price: 150.00 },

  // =================== PROCEDIMENTOS & CUIDADOS ===================
  { id: 'p-3131', code: '3131', name: 'Bolsa de Sangue Cão', category: 'PROCEDIMENTO', price: 698.00 },
  { id: 'p-3132', code: '3132', name: 'Bolsa de Sangue Gato', category: 'PROCEDIMENTO', price: 698.00 },
  { id: 'p-9909', code: '9909', name: 'Transfusão Sanguínea Interna (além da internação)', category: 'PROCEDIMENTO', price: 165.00 },
  { id: 'p-asa1', code: 'C-ASA1', name: 'Corte de Asa (Primeira Vez - Cobrar Consulta)', category: 'PROCEDIMENTO', price: 198.00 },
  { id: 'p-3448', code: '3448', name: 'Corte de Asa (1 Corte)', category: 'PROCEDIMENTO', price: 98.00 },
  { id: 'p-3447', code: '3447', name: 'Corte de Unha na Clínica', category: 'PROCEDIMENTO', price: 98.00 },
  { id: 'p-2820', code: '2820', name: 'Curativo Grau 1', category: 'PROCEDIMENTO', price: 85.00 },
  { id: 'p-1249', code: '1249', name: 'Curativo Grau 2', category: 'PROCEDIMENTO', price: 95.00 },
  { id: 'p-1248', code: '1248', name: 'Curativo Grau 3', category: 'PROCEDIMENTO', price: 195.00 },
  { id: 'p-3427', code: '3427', name: 'Drenagem Abdominal Paracentese (1ª Vez)', category: 'PROCEDIMENTO', price: 320.00, minPrice: 320.00, maxPrice: 495.00 },
  { id: 'p-3428', code: '3428', name: 'Drenagem Abdominal Paracentese (2ª Vez+)', category: 'PROCEDIMENTO', price: 165.00, minPrice: 165.00, maxPrice: 275.00 },
  { id: 'p-3411', code: '3411', name: 'Drenagem Torácica / Toracocentese (1ª Vez)', category: 'PROCEDIMENTO', price: 430.00, minPrice: 430.00, maxPrice: 605.00 },
  { id: 'p-3412', code: '3412', name: 'Drenagem Torácica / Toracocentese (2ª Vez+)', category: 'PROCEDIMENTO', price: 210.00, minPrice: 210.00, maxPrice: 760.00 },
  { id: 'p-2713', code: '2713', name: 'Drenagem de Abscesso', category: 'PROCEDIMENTO', price: 109.00 },
  { id: 'p-7721', code: '7721', name: 'Enfermagem / Intensivismo', category: 'PROCEDIMENTO', price: 60.00 },
  { id: 'p-2393', code: '2393', name: 'UTI / Hora', category: 'PROCEDIMENTO', price: 60.00 },
  { id: 'p-2508', code: '2508', name: 'Eutanásia Grau 1', category: 'PROCEDIMENTO', price: 289.00 },
  { id: 'p-5640', code: '5640', name: 'Eutanásia Grau 2', category: 'PROCEDIMENTO', price: 398.00 },
  { id: 'p-5641', code: '5641', name: 'Eutanásia Grau 3', category: 'PROCEDIMENTO', price: 515.00 },
  { id: 'p-2510', code: '2510', name: 'Fluido (Soroterapia) Subcutâneo Grau 1', category: 'PROCEDIMENTO', price: 69.00 },
  { id: 'p-1344', code: '1344', name: 'Fluido (Soroterapia) Subcutâneo Grau 2', category: 'PROCEDIMENTO', price: 89.00 },
  { id: 'p-3168', code: '3168', name: 'Limpeza Dente Grau 1 (sem anestesia, +R$90/dente)', category: 'PROCEDIMENTO', price: 398.00 },
  { id: 'p-3169', code: '3169', name: 'Limpeza Dente Grau 2 (sem anestesia, +R$90/dente)', category: 'PROCEDIMENTO', price: 595.00 },
  { id: 'p-1343', code: '1343', name: 'Lavagem Intestinal Grau 1', category: 'PROCEDIMENTO', price: 275.00 },
  { id: 'p-1345', code: '1345', name: 'Lavagem Intestinal Grau 2', category: 'PROCEDIMENTO', price: 385.00 },
  { id: 'p-1250', code: '1250', name: 'Limpeza Auditiva', category: 'PROCEDIMENTO', price: 69.00, notes: 'Ou cotar com Dra. Camila' },
  { id: 'p-5435', code: '5435', name: 'Limpeza de Ferida', category: 'PROCEDIMENTO', price: 69.00 },
  { id: 'p-5264', code: '5264', name: 'Necropsia (Cotar)', category: 'PROCEDIMENTO', price: 0.01, isQuotation: true },
  { id: 'p-1200', code: '1200', name: 'Oxigênioterapia (Primeira Hora)', category: 'PROCEDIMENTO', price: 78.00 },
  { id: 'p-1202', code: '1202', name: 'Oxigênioterapia P/ Hora', category: 'PROCEDIMENTO', price: 49.00 },
  { id: 'p-2226', code: '2226', name: 'Quimioterapia (Cotar)', category: 'PROCEDIMENTO', price: 0.01, isQuotation: true },
  { id: 'p-5521', code: '5521', name: 'Retirada de Pontos', category: 'PROCEDIMENTO', price: 99.00 },
  { id: 'p-5575', code: '5575', name: 'Ressuscitação Cardio Pulmonar', category: 'PROCEDIMENTO', price: 175.00, minPrice: 175.00, maxPrice: 495.00 },
  { id: 'p-5598', code: '5598', name: 'Sondagem Esofágica (Sem Anestesia)', category: 'PROCEDIMENTO', price: 255.00, minPrice: 255.00, maxPrice: 495.00 },
  { id: 'p-2714', code: '2714', name: 'Sondagem Uretra', category: 'PROCEDIMENTO', price: 55.00, minPrice: 55.00, maxPrice: 100.00 },
  { id: 'p-2465', code: '2465', name: 'Sondagem Nasogástrica', category: 'PROCEDIMENTO', price: 98.00 },
  { id: 'p-1986', code: '1986', name: 'Aluguel Centro Cirúrgico (não utilizar nada HVA)', category: 'PROCEDIMENTO', price: 489.00 },

  // =================== ANESTESIA & SEDAÇÃO ===================
  { id: 'a-1226', code: '1226', name: 'Anestesia Geral Inalatória', category: 'ANESTESIA', price: 579.00 },
  { id: 'a-1229', code: '1229', name: 'Anestesia Geral Dissociativa P', category: 'ANESTESIA', price: 280.00 },
  { id: 'a-1230', code: '1230', name: 'Anestesia Geral Dissociativa M (Até 15kg)', category: 'ANESTESIA', price: 380.00 },
  { id: 'a-1231', code: '1231', name: 'Anestesia Geral Dissociativa G (Mais 15kg)', category: 'ANESTESIA', price: 450.00 },
  { id: 'a-5614', code: '5614', name: 'Sedação Leve Acepram - Outros', category: 'ANESTESIA', price: 98.00 },
  { id: 'a-1985', code: '1985', name: 'Anestesia + Centro Cirúrgico (Eletroquimio/Endoscopia)', category: 'ANESTESIA', price: 650.00, minPrice: 650.00, maxPrice: 1200.00 },

  // =================== CASTRAÇÃO (SEM ANESTESIA) ===================
  { id: 'cas-1241', code: '1241', name: 'Castração Canina Fêmea (Até 6kg)', category: 'CASTRACAO', price: 489.00 },
  { id: 'cas-1242', code: '1242', name: 'Castração Canina Fêmea (Até 15kg)', category: 'CASTRACAO', price: 689.00 },
  { id: 'cas-1243', code: '1243', name: 'Castração Canina Fêmea (Acima de 15kg)', category: 'CASTRACAO', price: 989.00 },
  { id: 'cas-1244', code: '1244', name: 'Castração Canina Macho P (Até 10kg)', category: 'CASTRACAO', price: 489.00 },
  { id: 'cas-1245', code: '1245', name: 'Castração Canina Macho M', category: 'CASTRACAO', price: 589.00 },
  { id: 'cas-1235', code: '1235', name: 'Castração Felina Fêmea', category: 'CASTRACAO', price: 489.00 },
  { id: 'cas-1239', code: '1239', name: 'Castração Felina Macho', category: 'CASTRACAO', price: 389.00 },
  { id: 'cas-1228', code: '1228', name: 'Castração Roedor / Coelha Fêmea', category: 'CASTRACAO', price: 489.00 },
  { id: 'cas-1697', code: '1697', name: 'Castração Roedor / Coelho Macho', category: 'CASTRACAO', price: 439.00 },

  // =================== CIRURGIAS (SEM ANESTESIA) ===================
  { id: 'cir-1251', code: '1251', name: 'Ablação do Conduto Auditivo Grau 1', category: 'CIRURGIA', price: 2280.00 },
  { id: 'cir-1252', code: '1252', name: 'Ablação do Conduto Auditivo Grau 2', category: 'CIRURGIA', price: 2890.00 },
  { id: 'cir-1253', code: '1253', name: 'Ablação do Conduto Auditivo Grau 3', category: 'CIRURGIA', price: 3380.00 },
  { id: 'cir-1171', code: '1171', name: 'Amputação de Falange Grau 1', category: 'CIRURGIA', price: 449.00 },
  { id: 'cir-1172', code: '1172', name: 'Amputação de Falange Grau 2', category: 'CIRURGIA', price: 980.00 },
  { id: 'cir-1174', code: '1174', name: 'Amputação Membro Anterior / Posterior Grau 1', category: 'CIRURGIA', price: 1589.00 },
  { id: 'cir-1175', code: '1175', name: 'Amputação Membro Anterior Grau 2', category: 'CIRURGIA', price: 1889.00 },
  { id: 'cir-1176', code: '1176', name: 'Amputação Membro Anterior Grau 3', category: 'CIRURGIA', price: 2769.00 },
  { id: 'cir-1179', code: '1179', name: 'Amputação Membro Posterior Grau 3', category: 'CIRURGIA', price: 2769.00 },
  { id: 'cir-3232', code: '3232', name: 'Bandagem Robert J. Grau 1 (Tala)', category: 'CIRURGIA', price: 299.00 },
  { id: 'cir-3233', code: '3233', name: 'Bandagem Robert J. Grau 2 (Tala)', category: 'CIRURGIA', price: 389.00 },
  { id: 'cir-3235', code: '3235', name: 'Bandagem Velpeau Grau 1 (Tala Pata Traseira)', category: 'CIRURGIA', price: 289.00 },
  { id: 'cir-3236', code: '3236', name: 'Bandagem Velpeau Grau 2 (Tala Pata Traseira)', category: 'CIRURGIA', price: 589.00 },
  { id: 'cir-5639', code: '5639', name: 'Cesária Assistência ao Filhote / Hora', category: 'CIRURGIA', price: 98.00, notes: 'Primeira hora = R$ 180,00' },
  { id: 'cir-3241', code: '3241', name: 'Cesária / Piometra Grau 1', category: 'CIRURGIA', price: 1290.00 },
  { id: 'cir-3242', code: '3242', name: 'Cesária / Piometra Grau 2', category: 'CIRURGIA', price: 1789.00 },
  { id: 'cir-3243', code: '3243', name: 'Cesária / Piometra Grau 3', category: 'CIRURGIA', price: 2489.00 },
  { id: 'cir-3247', code: '3247', name: 'Cistotomia Grau 1', category: 'CIRURGIA', price: 1490.00 },
  { id: 'cir-3248', code: '3248', name: 'Cistotomia Grau 2', category: 'CIRURGIA', price: 2290.00 },
  { id: 'cir-3445', code: '3445', name: 'Crioterapia Grau 1 (Cotar Nitrogênio)', category: 'CIRURGIA', price: 645.00 },
  { id: 'cir-3446', code: '3446', name: 'Crioterapia Grau 2 (Cotar Nitrogênio)', category: 'CIRURGIA', price: 1390.00 },
  { id: 'cir-4688', code: '4688', name: 'Colecistectomia (Vesícula Biliar) Grau 1', category: 'CIRURGIA', price: 1989.00 },
  { id: 'cir-4689', code: '4689', name: 'Colecistectomia (Vesícula Biliar) Grau 2', category: 'CIRURGIA', price: 3289.00 },
  { id: 'cir-3250', code: '3250', name: 'Desobstrução Uretral Grau 1', category: 'CIRURGIA', price: 369.00 },
  { id: 'cir-3251', code: '3251', name: 'Desobstrução Uretral Grau 2', category: 'CIRURGIA', price: 689.00 },
  { id: 'cir-1346', code: '1346', name: 'Enterotomia Grau 1', category: 'CIRURGIA', price: 1789.00 },
  { id: 'cir-1354', code: '1354', name: 'Enterotomia Grau 2', category: 'CIRURGIA', price: 3289.00 },
  { id: 'cir-1349', code: '1349', name: 'Esofagotomia Cervical', category: 'CIRURGIA', price: 2489.00 },
  { id: 'cir-1352', code: '1352', name: 'Esofagotomia Torácica Grau 1', category: 'CIRURGIA', price: 3489.00 },
  { id: 'cir-1353', code: '1353', name: 'Esofagotomia Torácica Grau 2', category: 'CIRURGIA', price: 4489.00 },
  { id: 'cir-5490', code: '5490', name: 'Espinho de Ouriço Grau 1', category: 'CIRURGIA', price: 329.00 },
  { id: 'cir-3421', code: '3421', name: 'Espinho de Ouriço Grau 2', category: 'CIRURGIA', price: 668.00 },
  { id: 'cir-3418', code: '3418', name: 'Esplenectomia Grau 1', category: 'CIRURGIA', price: 1840.00 },
  { id: 'cir-3419', code: '3419', name: 'Esplenectomia Grau 2', category: 'CIRURGIA', price: 2145.00 },
  { id: 'cir-3420', code: '3420', name: 'Esplenectomia Grau 3', category: 'CIRURGIA', price: 2640.00 },
  { id: 'cir-3184', code: '3184', name: 'Excisão da Cabeça do Fêmur Grau 1', category: 'CIRURGIA', price: 2189.00 },
  { id: 'cir-3185', code: '3185', name: 'Excisão da Cabeça do Fêmur Grau 2', category: 'CIRURGIA', price: 2789.00 },
  { id: 'cir-1393', code: '1393', name: 'Fenda Palatina Grau 1', category: 'CIRURGIA', price: 1689.00 },
  { id: 'cir-1394', code: '1394', name: 'Fenda Palatina Grau 2', category: 'CIRURGIA', price: 2789.00 },
  { id: 'cir-1253-fim', code: '1253', name: 'Fimose / Parafimose Grau 1', category: 'CIRURGIA', price: 1489.00 },
  { id: 'cir-1254-fim', code: '1254', name: 'Fimose / Parafimose Grau 2', category: 'CIRURGIA', price: 2689.00 },
  { id: 'cir-1358', code: '1358', name: 'Gastrectomia Parcial Grau 1', category: 'CIRURGIA', price: 2189.00 },
  { id: 'cir-1359', code: '1359', name: 'Gastrectomia Parcial Grau 2', category: 'CIRURGIA', price: 2789.00 },
  { id: 'cir-1360', code: '1360', name: 'Gastrectomia Parcial Grau 3', category: 'CIRURGIA', price: 3789.00 },
  { id: 'cir-1361', code: '1361', name: 'Gastrotomia Grau 1', category: 'CIRURGIA', price: 1689.00 },
  { id: 'cir-1362', code: '1362', name: 'Gastrotomia Grau 2', category: 'CIRURGIA', price: 2689.00 },
  { id: 'cir-1364', code: '1364', name: 'Glândulas Salivares Grau 1', category: 'CIRURGIA', price: 2259.00 },
  { id: 'cir-1365', code: '1365', name: 'Glândulas Salivares Grau 2', category: 'CIRURGIA', price: 2889.00 },
  { id: 'cir-1226-hemi', code: '1226', name: 'Hemilaminectomia Lateral Grau 1 (Sugestão)', category: 'CIRURGIA', price: 3850.00 },
  { id: 'cir-1289', code: '1289', name: 'Hérnia Diafragmática Cão Grau 1', category: 'CIRURGIA', price: 2289.00 },
  { id: 'cir-1290', code: '1290', name: 'Hérnia Diafragmática Cão Grau 2', category: 'CIRURGIA', price: 2989.00 },
  { id: 'cir-1288-diaf', code: '1288', name: 'Hérnia Diafragmática Gato', category: 'CIRURGIA', price: 1899.00, minPrice: 1899.00, maxPrice: 2489.00 },
  { id: 'cir-1301', code: '1301', name: 'Hérnia (Eventração) Evisceração Grau 1', category: 'CIRURGIA', price: 1489.00 },
  { id: 'cir-1302', code: '1302', name: 'Hérnia (Eventração) Evisceração Grau 2', category: 'CIRURGIA', price: 2989.00 },
  { id: 'cir-1291-h', code: '1291', name: 'Hérnia Inguinal Grau 1', category: 'CIRURGIA', price: 1389.00 },
  { id: 'cir-1292-h', code: '1292', name: 'Hérnia Inguinal Grau 2', category: 'CIRURGIA', price: 1889.00 },
  { id: 'cir-1294-h', code: '1294', name: 'Hérnia Perineal Grau 1', category: 'CIRURGIA', price: 1689.00 },
  { id: 'cir-1295-h', code: '1295', name: 'Hérnia Perineal Grau 2', category: 'CIRURGIA', price: 2689.00 },
  { id: 'cir-1298', code: '1298', name: 'Hérnia Umbilical Grau 1', category: 'CIRURGIA', price: 689.00 },
  { id: 'cir-1299', code: '1299', name: 'Hérnia Umbilical Grau 2', category: 'CIRURGIA', price: 1189.00 },
  { id: 'cir-1229-lam', code: '1229', name: 'Laminectomia (Cotar Sugestão)', category: 'CIRURGIA', price: 3850.00 },
  { id: 'cir-3424', code: '3424', name: 'Laparotomia Exploratória Grau 1', category: 'CIRURGIA', price: 989.00 },
  { id: 'cir-3425', code: '3425', name: 'Laparotomia Exploratória Grau 2', category: 'CIRURGIA', price: 1489.00 },
  { id: 'cir-7388', code: '7388', name: 'Lobectomia Hepática Grau 1', category: 'CIRURGIA', price: 1879.00 },
  { id: 'cir-7389', code: '7389', name: 'Lobectomia Hepática Grau 2', category: 'CIRURGIA', price: 2979.00 },
  { id: 'cir-3187', code: '3187', name: 'Ligamento Cruzado Grau 1', category: 'CIRURGIA', price: 2289.00 },
  { id: 'cir-3188', code: '3188', name: 'Ligamento Cruzado Grau 2 (TPLO - Cotar)', category: 'CIRURGIA', price: 2830.00 },
  { id: 'cir-3308', code: '3308', name: 'Lobectomia Pulmonar Grau 1', category: 'CIRURGIA', price: 2979.00 },
  { id: 'cir-3309', code: '3309', name: 'Lobectomia Pulmonar Grau 2', category: 'CIRURGIA', price: 4489.00 },
  { id: 'cir-3196', code: '3196', name: 'Luxação de Patela Grau 1', category: 'CIRURGIA', price: 2289.00 },
  { id: 'cir-3197', code: '3197', name: 'Luxação de Patela Grau 2', category: 'CIRURGIA', price: 3489.00 },
  { id: 'cir-3256', code: '3256', name: 'Mastectomia Total Unilateral Grau 1', category: 'CIRURGIA', price: 1490.00 },
  { id: 'cir-3257', code: '3257', name: 'Mastectomia Total Unilateral Grau 2', category: 'CIRURGIA', price: 1890.00 },
  { id: 'cir-3259', code: '3259', name: 'Mastectomia Total Unilateral Grau 3', category: 'CIRURGIA', price: 2189.00 },
  { id: 'cir-3261', code: '3261', name: 'Nefrectomia Grau 1', category: 'CIRURGIA', price: 1989.00 },
  { id: 'cir-3262', code: '3262', name: 'Nefrectomia Grau 2', category: 'CIRURGIA', price: 2789.00 },
  { id: 'cir-3199', code: '3199', name: 'Osteocondrite Dissecante Grau 1', category: 'CIRURGIA', price: 2189.00 },
  { id: 'cir-3200', code: '3200', name: 'Osteocondrite Dissecante Grau 2', category: 'CIRURGIA', price: 2789.00 },
  { id: 'cir-1397', code: '1397', name: 'Osteossíntese de Sínfise Mandibular Grau 1', category: 'CIRURGIA', price: 985.00 },
  { id: 'cir-1396', code: '1396', name: 'Osteossíntese de Sínfise Mandibular Grau 2', category: 'CIRURGIA', price: 1485.00 },
  { id: 'cir-3202', code: '3202', name: 'Osteossíntese Fêmur Placa Grau 1 (Externo Cotar)', category: 'CIRURGIA', price: 2789.00 },
  { id: 'cir-3203', code: '3203', name: 'Osteossíntese Fêmur Placa Grau 2 (Externo Cotar)', category: 'CIRURGIA', price: 3789.00 },
  { id: 'cir-3211', code: '3211', name: 'Osteossíntese Rádio Placa Grau 1 (Externo Cotar)', category: 'CIRURGIA', price: 2489.00 },
  { id: 'cir-3212', code: '3212', name: 'Osteossíntese Rádio Placa Grau 2 (Externo Cotar)', category: 'CIRURGIA', price: 3489.00 },
  { id: 'cir-590', code: '590', name: 'Osteossíntese Tíbia - Pino (Sugestão)', category: 'CIRURGIA', price: 1489.00 },
  { id: 'cir-3205', code: '3205', name: 'Osteossíntese Tíbia - Placa Grau 1 (Sugestão)', category: 'CIRURGIA', price: 2290.00 },
  { id: 'cir-3206', code: '3206', name: 'Osteossíntese Tíbia - Placa Grau 2 (Sugestão)', category: 'CIRURGIA', price: 3190.00 },
  { id: 'cir-3208', code: '3208', name: 'Osteossíntese Úmero Placa Grau 1 (Sugestão)', category: 'CIRURGIA', price: 2630.00 },
  { id: 'cir-3209', code: '3209', name: 'Osteossíntese Úmero Placa Grau 2 (Sugestão)', category: 'CIRURGIA', price: 3730.00 },
  { id: 'cir-1691', code: '1691', name: 'Osteossíntese Mandibular Placa Grau 1 (Sugestão)', category: 'CIRURGIA', price: 1640.00 },
  { id: 'cir-1692', code: '1692', name: 'Osteossíntese Mandibular Placa Grau 2 (Sugestão)', category: 'CIRURGIA', price: 3190.00 },
  { id: 'cir-1693', code: '1693', name: 'Osteossíntese Mandibular Fio', category: 'CIRURGIA', price: 890.00, minPrice: 890.00, maxPrice: 1790.00 },
  { id: 'cir-1254-oto', code: '1254', name: 'Otohematoma Unilateral Grau 1', category: 'CIRURGIA', price: 698.00 },
  { id: 'cir-1255-oto', code: '1255', name: 'Otohematoma Unilateral Grau 2', category: 'CIRURGIA', price: 1389.00 },
  { id: 'cir-3217', code: '3217', name: 'Pectineotomia', category: 'CIRURGIA', price: 1090.00, minPrice: 1090.00, maxPrice: 2489.00 },
  { id: 'cir-3264', code: '3264', name: 'Penectomia Grau 1', category: 'CIRURGIA', price: 1589.00 },
  { id: 'cir-3265', code: '3265', name: 'Penectomia Grau 2', category: 'CIRURGIA', price: 2289.00 },
  { id: 'cir-3405', code: '3405', name: 'Persistência de Arco Aórtico Direito (Cotar)', category: 'CIRURGIA', price: 3789.00 },
  { id: 'cir-3408', code: '3408', name: 'Persistência Ducto Arterioso (Cotar)', category: 'CIRURGIA', price: 3789.00 },
  { id: 'cir-3220', code: '3220', name: 'Processo Ancôneo (Cotar)', category: 'CIRURGIA', price: 3789.00 },
  { id: 'cir-1370', code: '1370', name: 'Prolapso de Reto - Amputação Grau 1', category: 'CIRURGIA', price: 1189.00 },
  { id: 'cir-1371', code: '1371', name: 'Prolapso de Reto - Amputação Grau 2', category: 'CIRURGIA', price: 2289.00 },
  { id: 'cir-1367', code: '1367', name: 'Prolapso de Reto - Redução Grau 1', category: 'CIRURGIA', price: 650.00 },
  { id: 'cir-1368', code: '1368', name: 'Prolapso de Reto - Redução Grau 2', category: 'CIRURGIA', price: 1489.00 },
  { id: 'cir-3277', code: '3277', name: 'Prolapso de Vagina (Amputação) Grau 1', category: 'CIRURGIA', price: 1489.00 },
  { id: 'cir-3279', code: '3279', name: 'Prolapso de Vagina (Amputação) Grau 2', category: 'CIRURGIA', price: 2289.00 },
  { id: 'cir-3272', code: '3272', name: 'Prolapso de Vagina (Redução) Grau 1', category: 'CIRURGIA', price: 650.00 },
  { id: 'cir-3273', code: '3273', name: 'Prolapso de Vagina (Redução) Grau 2', category: 'CIRURGIA', price: 1189.00 },
  { id: 'cir-3177', code: '3177', name: 'Retirada de Linfonodo Grau 1', category: 'CIRURGIA', price: 889.00 },
  { id: 'cir-3178', code: '3178', name: 'Retirada de Linfonodo Grau 2', category: 'CIRURGIA', price: 1689.00 },
  { id: 'cir-3430', code: '3430', name: 'Sacos Anais Grau 1', category: 'CIRURGIA', price: 1489.00 },
  { id: 'cir-3431', code: '3431', name: 'Sacos Anais Grau 2', category: 'CIRURGIA', price: 1989.00 },
  { id: 'cir-3433', code: '3433', name: 'Sutura Ferimentos Grau 1', category: 'CIRURGIA', price: 389.00 },
  { id: 'cir-3434', code: '3434', name: 'Sutura Ferimentos Grau 2', category: 'CIRURGIA', price: 889.00 },
  { id: 'cir-3435', code: '3435', name: 'Sutura Ferimentos Grau 3', category: 'CIRURGIA', price: 1489.00 },
  { id: 'cir-1373', code: '1373', name: 'Torção Dilatação Gástrica / Red. e Gastropexia Grau 1', category: 'CIRURGIA', price: 1989.00 },
  { id: 'cir-1374', code: '1374', name: 'Torção Dilatação Gástrica / Red. e Gastropexia Grau 2', category: 'CIRURGIA', price: 3289.00 },
  { id: 'cir-1376', code: '1376', name: 'Torção Dilatação Gástrica c/ Esplenectomia Grau 1', category: 'CIRURGIA', price: 2689.00 },
  { id: 'cir-1377', code: '1377', name: 'Torção Dilatação Gástrica c/ Esplenectomia Grau 2', category: 'CIRURGIA', price: 3689.00 },
  { id: 'cir-3414', code: '3414', name: 'Traqueostomia Grau 1', category: 'CIRURGIA', price: 889.00 },
  { id: 'cir-3415', code: '3415', name: 'Traqueostomia Grau 2', category: 'CIRURGIA', price: 1889.00 },
  { id: 'cir-3436', code: '3436', name: 'Tumores Superficiais Grau 1 (Nodulectomia)', category: 'CIRURGIA', price: 489.00 },
  { id: 'cir-3437', code: '3437', name: 'Tumores Superficiais Grau 2 (Nodulectomia)', category: 'CIRURGIA', price: 989.00 },
  { id: 'cir-3438', code: '3438', name: 'Tumores Superficiais Grau 3 (Nodulectomia)', category: 'CIRURGIA', price: 1689.00 },
  { id: 'cir-3284', code: '3284', name: 'Uretrostomia Grau 1', category: 'CIRURGIA', price: 1389.00 },
  { id: 'cir-3285', code: '3285', name: 'Uretrostomia Grau 2', category: 'CIRURGIA', price: 2489.00 },
  { id: 'cir-3440', code: '3440', name: 'Verrugas (Até 5)', category: 'CIRURGIA', price: 489.00 },
  { id: 'cir-3439', code: '3439', name: 'Verrugas (Acima de 5)', category: 'CIRURGIA', price: 789.00, minPrice: 789.00, maxPrice: 1689.00 },

  // =================== CIRURGIAS OFTÁLMICAS (SEM ANESTESIA) ===================
  { id: 'oft-1694', code: '1694', name: 'Blefaroplastia', category: 'CIRURGIA_OFTALMICA', price: 1489.00, minPrice: 1489.00, maxPrice: 2489.00 },
  { id: 'oft-1273', code: '1273', name: 'Catarata 2 Olhos (Consultar com Adélio)', category: 'CIRURGIA_OFTALMICA', price: 0.00, isQuotation: true },
  { id: 'oft-3158', code: '3158', name: 'Catarata com Faco (Consultar com Adélio)', category: 'CIRURGIA_OFTALMICA', price: 0.00, isQuotation: true },
  { id: 'oft-1272', code: '1272', name: 'Catarata por Olho (Consultar com Adélio)', category: 'CIRURGIA_OFTALMICA', price: 0.00, isQuotation: true },
  { id: 'oft-1275', code: '1275', name: 'Ceratectomia Superficial', category: 'CIRURGIA_OFTALMICA', price: 1189.00, minPrice: 1189.00, maxPrice: 1489.00 },
  { id: 'oft-1277', code: '1277', name: 'Entrópio ou Ectrópio 1 Olho', category: 'CIRURGIA_OFTALMICA', price: 1389.00 },
  { id: 'oft-1278', code: '1278', name: 'Entrópio ou Ectrópio 2 Olhos', category: 'CIRURGIA_OFTALMICA', price: 1989.00 },
  { id: 'oft-1269', code: '1269', name: 'Enucleação Grau 1', category: 'CIRURGIA_OFTALMICA', price: 1389.00 },
  { id: 'oft-1270', code: '1270', name: 'Enucleação Grau 2', category: 'CIRURGIA_OFTALMICA', price: 2289.00 },
  { id: 'oft-1284', code: '1284', name: 'Flap 3ª Pálpebra Grau 1', category: 'CIRURGIA_OFTALMICA', price: 689.00 },
  { id: 'oft-1285', code: '1285', name: 'Flap 3ª Pálpebra Grau 2', category: 'CIRURGIA_OFTALMICA', price: 1489.00 },
  { id: 'oft-1280', code: '1280', name: 'Flap Pediculado Conjuntival Grau 1', category: 'CIRURGIA_OFTALMICA', price: 1689.00 },
  { id: 'oft-1282', code: '1282', name: 'Flap Pediculado Conjuntival Grau 2', category: 'CIRURGIA_OFTALMICA', price: 2289.00 },
  { id: 'oft-1283', code: '1283', name: 'Flap Pediculado Conjuntival Grau 3', category: 'CIRURGIA_OFTALMICA', price: 2989.00 },
  { id: 'oft-4695', code: '4695', name: 'Flap Cômio Conjuntival', category: 'CIRURGIA_OFTALMICA', price: 2989.00 },
  { id: 'oft-1287', code: '1287', name: 'Hipertrofia Glândula 3ª Pálpebra (1 Olho)', category: 'CIRURGIA_OFTALMICA', price: 1789.00 },
  { id: 'oft-1288', code: '1288', name: 'Hipertrofia Glândula 3ª Pálpebra (2 Olhos)', category: 'CIRURGIA_OFTALMICA', price: 2489.00 },
  { id: 'oft-1290-p', code: '1290', name: 'Proptose do Globo Ocular Grau 1', category: 'CIRURGIA_OFTALMICA', price: 989.00 },
  { id: 'oft-1291-p', code: '1291', name: 'Proptose do Globo Ocular Grau 2', category: 'CIRURGIA_OFTALMICA', price: 1889.00 },
  { id: 'oft-4696', code: '4696', name: 'Retidectomia (Plástica)', category: 'CIRURGIA_OFTALMICA', price: 1989.00, minPrice: 1989.00, maxPrice: 2989.00 },
  { id: 'oft-1294', code: '1294', name: 'Vias Lacrimais (Cateterismo)', category: 'CIRURGIA_OFTALMICA', price: 489.00 },
  { id: 'oft-1295', code: '1295', name: 'Vias Lacrimais (Cirurgia - Cotar)', category: 'CIRURGIA_OFTALMICA', price: 0.00, isQuotation: true },

  // =================== ELETROQUIMIOTERAPIA ===================
  { id: 'eq-9046', code: '9046', name: 'Eletroporação (Cotar com Dr. Marco)', category: 'ELETROQUIMIOTERAPIA', price: 850.00 },
  { id: 'eq-1620', code: '1620', name: 'Bleomicina (Cotar com Dr. Marco)', category: 'ELETROQUIMIOTERAPIA', price: 460.00 },
  { id: 'eq-1985', code: '1985', name: 'Anestesia + Centro Cirúrgico (Eletroquimio/Endoscopia)', category: 'ELETROQUIMIOTERAPIA', price: 650.00, minPrice: 650.00, maxPrice: 1200.00 },

  // =================== APLICAÇÕES & MEDICAMENTOS FREQUENTES (FICHA HVA) ===================
  { id: 'med-librela', code: 'LIB', name: 'Librela (Anticorpo Monoclonal Osteoartrite)', category: 'MEDICAMENTO_APLICACAO', price: 340.00, notes: 'Lançado no cabeçalho ou nas aplicações' },
  { id: 'med-cytopoint', code: 'CYTO', name: 'Cytopoint (Dermatite Atópica)', category: 'MEDICAMENTO_APLICACAO', price: 320.00, notes: 'Lançado no cabeçalho ou nas aplicações' },
  { id: 'med-aplic-sc', code: 'APL-SC', name: 'Aplicação Subcutânea / Intramuscular', category: 'MEDICAMENTO_APLICACAO', price: 25.00 },
  { id: 'med-aplic-iv', code: 'APL-IV', name: 'Aplicação Intravenosa / Acesso Venoso', category: 'MEDICAMENTO_APLICACAO', price: 35.00 },
  { id: 'med-cateter', code: 'CATET', name: 'Colocação de Cateter IV / Escalpe', category: 'MEDICAMENTO_APLICACAO', price: 45.00 },
  { id: 'med-fluid-rl', code: 'FL-RL', name: 'Ringer Lactato 500ml', category: 'MEDICAMENTO_APLICACAO', price: 48.00 },
  { id: 'med-fluid-fisiol', code: 'FL-SF', name: 'Soro Fisiológico 0,9% 500ml', category: 'MEDICAMENTO_APLICACAO', price: 45.00 },
  { id: 'med-fluid-glico', code: 'FL-SGF', name: 'Soro Glicofisiológico 500ml', category: 'MEDICAMENTO_APLICACAO', price: 48.00 },
  { id: 'med-dipirona', code: 'MED-DIP', name: 'Dipirona Injetável (dose)', category: 'MEDICAMENTO_APLICACAO', price: 28.00 },
  { id: 'med-tramadol', code: 'MED-TRAM', name: 'Cloridrato de Tramadol Injetável (dose)', category: 'MEDICAMENTO_APLICACAO', price: 38.00 },
  { id: 'med-meloxicam', code: 'MED-MELOX', name: 'Meloxicam Injetável (dose)', category: 'MEDICAMENTO_APLICACAO', price: 35.00 },
  { id: 'med-cerenia', code: 'MED-CEREN', name: 'Maropitant (Cerenia) Injetável (dose)', category: 'MEDICAMENTO_APLICACAO', price: 85.00 },
  { id: 'med-ondansetrona', code: 'MED-OND', name: 'Ondansetrona Injetável (dose)', category: 'MEDICAMENTO_APLICACAO', price: 32.00 },
  { id: 'med-cefalotina', code: 'MED-CEF', name: 'Cefalotina Injetável (dose)', category: 'MEDICAMENTO_APLICACAO', price: 38.00 },
  { id: 'med-enrofloxacina', code: 'MED-ENRO', name: 'Enrofloxacina Injetável (dose)', category: 'MEDICAMENTO_APLICACAO', price: 35.00 },
  { id: 'med-amoxi-clav', code: 'MED-AMOX', name: 'Amoxicilina + Clavulanato Injetável (dose)', category: 'MEDICAMENTO_APLICACAO', price: 45.00 },
  { id: 'med-omeprazol', code: 'MED-OMEP', name: 'Omeprazol IV Injetável (dose)', category: 'MEDICAMENTO_APLICACAO', price: 38.00 },
  { id: 'med-dexametasona', code: 'MED-DEXA', name: 'Dexametasona Injetável (dose)', category: 'MEDICAMENTO_APLICACAO', price: 28.00 },
  { id: 'med-glicose', code: 'MED-GLIC', name: 'Glicose 50% Ampola', category: 'MEDICAMENTO_APLICACAO', price: 22.00 },
  { id: 'med-buprenorfina', code: 'MED-BUP', name: 'Buprenorfina Injetável', category: 'MEDICAMENTO_APLICACAO', price: 65.00 },
  { id: 'med-morfina', code: 'MED-MORF', name: 'Morfina Injetável', category: 'MEDICAMENTO_APLICACAO', price: 45.00 },
  { id: 'med-metronidazol', code: 'MED-METRO', name: 'Metronidazol Bolsa Infusão', category: 'MEDICAMENTO_APLICACAO', price: 55.00 },
  
  // =================== TABELA DE EXAMES CEAVET 2026 ===================
  ...DEFAULT_CEAVET_PRICES,
];

/**
 * Normalizes text for search matching (removes accents, lowercase, removes punctuation)
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Searches the catalog for the best matching item
 */
export function findMatchingPrice(
  description: string,
  category?: PriceCategory,
  catalog: PriceItem[] = DEFAULT_HVA_PRICES
): PriceItem | undefined {
  if (!description) return undefined;
  const normQuery = normalizeText(description);

  // Exact code match
  const byCode = catalog.find((i) => i.code.toLowerCase() === normQuery);
  if (byCode) return byCode;

  // Exact name normalized
  const byExactName = catalog.find((i) => normalizeText(i.name) === normQuery);
  if (byExactName) return byExactName;

  // Filter by category first if provided
  const candidates = category ? catalog.filter((i) => i.category === category) : catalog;

  // Try substring match on name
  const byIncludes = candidates.find((i) => {
    const normName = normalizeText(i.name);
    return normName.includes(normQuery) || normQuery.includes(normName);
  });
  if (byIncludes) return byIncludes;

  // If filtered by category didn't match, check entire catalog
  if (category) {
    const fallbackIncludes = catalog.find((i) => {
      const normName = normalizeText(i.name);
      return normName.includes(normQuery) || normQuery.includes(normName);
    });
    if (fallbackIncludes) return fallbackIncludes;
  }

  // Token matching: match if all query words exist in name or code
  const tokens = normQuery.split(' ').filter((t) => t.length > 2);
  if (tokens.length > 0) {
    const byTokens = candidates.find((i) => {
      const normName = normalizeText(i.name + ' ' + i.code);
      return tokens.every((token) => normName.includes(token));
    });
    if (byTokens) return byTokens;
  }

  return undefined;
}
