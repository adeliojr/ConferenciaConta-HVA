export type PriceCategory =
  | 'CONSULTA'
  | 'INTERNACAO'
  | 'VACINA'
  | 'EXAME'
  | 'LABORATORIO_CEAVET'
  | 'PROCEDIMENTO'
  | 'ANESTESIA'
  | 'CASTRACAO'
  | 'CIRURGIA'
  | 'CIRURGIA_OFTALMICA'
  | 'ELETROQUIMIOTERAPIA'
  | 'MEDICAMENTO_APLICACAO'
  | 'OUTROS';

export interface PriceItem {
  id: string;
  code: string;
  name: string;
  category: PriceCategory;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  notes?: string;
  isQuotation?: boolean; // 'cotar'
  unit?: string;
}

export interface PatientTicketHeader {
  via: string;
  vet: string;
  ot?: string;
  horCheg?: string;
  date?: string;
  obs?: string;
}

export interface PatientTutorInfo {
  tutorCode?: string;
  tutorName: string;
  patientCode?: string;
  patientName: string;
  weightKg?: number;
}

export interface ExtractedApplicationItem {
  id: string;
  description: string;
  quantity: number;
  dosage?: string;
  handwrittenPrice?: number | null;
  tablePrice?: number | null;
  notes?: string;
}

export interface ExtractedTicketData {
  header: PatientTicketHeader;
  patient: PatientTutorInfo;
  consultationType?: string;
  consultationHandwrittenPrice?: number | null;
  consultationTablePrice?: number | null;
  
  hospitalization?: {
    selected: boolean;
    weightBracket?: string;
    days?: number;
    handwrittenPrice?: number | null;
    tablePrice?: number | null;
    notes?: string;
  };
  
  exams: Array<{
    name: string;
    code?: string;
    handwrittenPrice?: number | null;
    tablePrice?: number | null;
    vet?: string;
  }>;
  
  labExams?: Array<{
    name: string;
    section?: string;
    code?: string;
    handwrittenPrice?: number | null;
    tablePrice?: number | null;
    notes?: string;
  }>;
  
  vaccines: Array<{
    name: string;
    code?: string;
    handwrittenPrice?: number | null;
    tablePrice?: number | null;
  }>;
  
  surgeriesAndProcedures: Array<{
    name: string;
    code?: string;
    handwrittenPrice?: number | null;
    tablePrice?: number | null;
    notes?: string;
  }>;
  
  applicationsAndProducts: ExtractedApplicationItem[];
  
  specialItems?: {
    intensivismo?: { intensive: boolean; o2: boolean; hours?: number; price?: number };
    stemCell?: { vet?: string; anesthesiologistPrice?: number; stemCellPrice?: number; transportPrice?: number };
    librela?: { mg?: string; price?: number; vet?: string };
    cytopoint?: { mg?: string; price?: number; vet?: string };
    raioX?: { projections?: number; price?: number; vet?: string };
  };
  
  protocol?: {
    previousDebt?: string;
    dataConfirmed?: string;
    patientStatus?: string;
    receptionist?: string;
    dischargeTime?: string;
  };
}

export interface BillItem {
  id: string;
  category: PriceCategory;
  categoryLabel: string;
  description: string;
  code?: string;
  quantity: number;
  unitPrice: number; // currently applied price
  handwrittenPrice?: number | null;
  tablePrice?: number | null;
  hasDifference: boolean;
  appliedPriceSource: 'handwritten' | 'table' | 'custom';
  observation?: string;
  isChecked: boolean;
}

export interface PriceDivergence {
  id: string;
  itemDescription: string;
  categoryLabel: string;
  tablePrice: number;
  handwrittenPrice: number;
  difference: number; // handwritten - table
  differencePercent: number;
  activePrice: number;
}
