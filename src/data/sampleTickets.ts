import { ExtractedTicketData } from '../types/veterinary';

export interface SampleTicketPreset {
  id: string;
  title: string;
  description: string;
  imagePath?: string;
  data: ExtractedTicketData;
}

export const SAMPLE_TICKETS: SampleTicketPreset[] = [
  {
    id: 'sample-internacao-meds',
    title: 'Caso 1: Consulta + Internação (15kg) + Aplicações Manuscritas',
    description: 'Paciente internado com soroterapia, antibiótico, analgésico e Librela. Veterinário concedeu desconto manuscrito na consulta.',
    imagePath: '/assets/aistudio/IMG_20261106_095610_8cc31c55.jpg',
    data: {
      header: {
        via: '1ª VIA',
        vet: 'Dr. Adélio',
        ot: '04128',
        horCheg: '10:30',
        date: '06/11/2026',
        obs: 'Paciente desidratado, vômito e dor abdominal aguda',
      },
      patient: {
        tutorCode: 'T-9821',
        tutorName: 'Carlos Eduardo Silveira',
        patientCode: 'P-5542',
        patientName: 'Thor (Golden Retriever)',
        weightKg: 18.5,
      },
      consultationType: 'Consulta Geral / Ambulatorial',
      // Vet wrote R$ 180,00 by hand instead of official table R$ 198,00
      consultationHandwrittenPrice: 180.00,
      consultationTablePrice: 198.00,
      hospitalization: {
        selected: true,
        weightBracket: 'Internação Até 20kg (diária)',
        days: 2,
        handwrittenPrice: 498.00, // Matches table
        tablePrice: 498.00,
        notes: '2 diárias em observação com suporte intensivo',
      },
      exams: [
        {
          name: 'Ultrassom Abdominal',
          code: '1217',
          handwrittenPrice: 279.00,
          tablePrice: 279.00,
          vet: 'Dr. Vinicius',
        },
      ],
      labExams: [
        {
          name: 'Hemograma + Plaquetas',
          section: 'Hematologia',
          tablePrice: 43.00,
          handwrittenPrice: 43.00,
        },
        {
          name: 'Função Renal (Perfil Renal: Ureia e Creatinina)',
          section: 'Combos Bioquímicos',
          tablePrice: 39.00,
          handwrittenPrice: 39.00,
        },
        {
          name: 'Função Hepática I (Perfil Hepático 1: ALT, Albumina, FA, Colesterol, PT, GGT)',
          section: 'Combos Bioquímicos',
          tablePrice: 110.00,
          handwrittenPrice: 110.00,
        },
      ],
      vaccines: [],
      surgeriesAndProcedures: [
        {
          name: 'Fluido (Soroterapia) Subcutâneo Grau 2',
          code: '1344',
          handwrittenPrice: 89.00,
          tablePrice: 89.00,
          notes: 'Soroterapia contínua',
        },
        {
          name: 'Curativo Grau 1',
          code: '2820',
          handwrittenPrice: 70.00, // Vet wrote R$ 70,00 (Table is R$ 85,00)
          tablePrice: 85.00,
        },
      ],
      applicationsAndProducts: [
        {
          id: 'app-1',
          description: 'Ringer Lactato 500ml Bolsa IV',
          quantity: 2,
          dosage: '500ml',
          handwrittenPrice: 48.00,
          tablePrice: 48.00,
        },
        {
          id: 'app-2',
          description: 'Cerenia (Maropitant) 10mg/ml Injetável',
          quantity: 1,
          dosage: '1.8ml SC',
          handwrittenPrice: 85.00,
          tablePrice: 85.00,
        },
        {
          id: 'app-3',
          description: 'Tramadol 50mg/ml Injetável',
          quantity: 2,
          dosage: '1.5ml IV',
          handwrittenPrice: 35.00, // Vet wrote R$ 35,00 (Table is R$ 38,00)
          tablePrice: 38.00,
        },
        {
          id: 'app-4',
          description: 'Dipirona 500mg/ml Ampola',
          quantity: 2,
          dosage: '1.0ml IV',
          handwrittenPrice: 28.00,
          tablePrice: 28.00,
        },
        {
          id: 'app-5',
          description: 'Omeprazol IV Injetável 40mg',
          quantity: 1,
          dosage: '1 frasco',
          handwrittenPrice: 38.00,
          tablePrice: 38.00,
        },
      ],
      specialItems: {
        intensivismo: { intensive: true, o2: false, hours: 4, price: 60.00 },
        librela: { mg: '20mg', price: 340.00, vet: 'Dr. Adélio' },
      },
      protocol: {
        previousDebt: 'Não',
        dataConfirmed: 'Sim',
        patientStatus: 'Estável',
        receptionist: 'Mariana',
        dischargeTime: '17:45',
      },
    },
  },
  {
    id: 'sample-cirurgia-emergencia',
    title: 'Caso 2: Emergência Cirúrgica (Cesárea + Anestesia + Cuidados)',
    description: 'Atendimento de emergência noturno. Consulta plantão com cesárea, anestesia inalatória e assistência aos filhotes.',
    imagePath: '/assets/aistudio/IMG_20261106_095610_8cc31c55.jpg',
    data: {
      header: {
        via: '1ª VIA',
        vet: 'Dra. Kalinca',
        ot: '04130',
        horCheg: '22:15',
        date: '05/11/2026',
        obs: 'Distocia em cadela Bulldog Francês, bolsa rompida há 3h',
      },
      patient: {
        tutorCode: 'T-7410',
        tutorName: 'Beatriz Vasconcelos',
        patientCode: 'P-3291',
        patientName: 'Luna (Bulldog Francês)',
        weightKg: 12.0,
      },
      consultationType: 'Consulta Plantão',
      consultationHandwrittenPrice: 345.00,
      consultationTablePrice: 345.00,
      exams: [
        {
          name: 'Ultrassom Plantão',
          code: '1234',
          handwrittenPrice: 399.00,
          tablePrice: 399.00,
          vet: 'Dra. Kalinca',
        },
      ],
      vaccines: [],
      surgeriesAndProcedures: [
        {
          name: 'Cesária / Piometra Grau 1',
          code: '3241',
          handwrittenPrice: 1290.00,
          tablePrice: 1290.00,
          notes: 'Cesariana com 4 filhotes vivos',
        },
        {
          name: 'Cesária Assistência ao Filhote / Hora',
          code: '5639',
          handwrittenPrice: 180.00, // 1ª hora é 180
          tablePrice: 180.00,
        },
        {
          name: 'Anestesia Geral Inalatória',
          code: '1226',
          handwrittenPrice: 579.00,
          tablePrice: 579.00,
        },
        {
          name: 'Curativo Grau 2',
          code: '1249',
          handwrittenPrice: 95.00,
          tablePrice: 95.00,
        },
      ],
      applicationsAndProducts: [
        {
          id: 'app-c1',
          description: 'Cefalotina 1g Injetável IV',
          quantity: 1,
          dosage: '1 frasco',
          handwrittenPrice: 45.00, // Vet wrote R$ 45,00 (Table is R$ 38,00 - dose especial)
          tablePrice: 38.00,
        },
        {
          id: 'app-c2',
          description: 'Meloxicam Injetável 0,2%',
          quantity: 1,
          dosage: '0.6ml SC',
          handwrittenPrice: 35.00,
          tablePrice: 35.00,
        },
        {
          id: 'app-c3',
          description: 'Ocitocina Ampola',
          quantity: 2,
          dosage: '1ml SC',
          handwrittenPrice: 25.00,
          tablePrice: 25.00,
        },
        {
          id: 'app-c4',
          description: 'Soro Ringer Lactato 500ml',
          quantity: 1,
          handwrittenPrice: 48.00,
          tablePrice: 48.00,
        },
      ],
      specialItems: {
        intensivismo: { intensive: false, o2: true, hours: 2, price: 98.00 },
      },
      protocol: {
        previousDebt: 'Não',
        dataConfirmed: 'Sim',
        patientStatus: 'Emergência',
        receptionist: 'Plantonista',
      },
    },
  },
  {
    id: 'sample-oftalmo-cirurgia',
    title: 'Caso 3: Consulta Especializada + Cirurgia Oftálmica (Blefaroplastia)',
    description: 'Atendimento com especialista Dr. Marco / Dr. Leonardo, cirurgia de entrópio/blefaroplastia e vacina.',
    imagePath: '/assets/aistudio/IMG_20261106_095610_8cc31c55.jpg',
    data: {
      header: {
        via: '1ª VIA',
        vet: 'Dr. Leonardo',
        ot: '03889',
        horCheg: '14:00',
        date: '04/11/2026',
        obs: 'Entrópio bilateral e entrópio de pálpebra inferior',
      },
      patient: {
        tutorCode: 'T-1102',
        tutorName: 'Fernanda Rocha',
        patientCode: 'P-9087',
        patientName: 'Pipoca (Shar Pei)',
        weightKg: 21.0,
      },
      consultationType: 'Consulta Especialidade',
      consultationHandwrittenPrice: 290.00,
      consultationTablePrice: 290.00,
      exams: [
        {
          name: 'Teste Fluoresceína',
          code: '3775',
          handwrittenPrice: 49.00,
          tablePrice: 49.00,
        },
        {
          name: 'Teste Schirmer',
          code: '2754',
          handwrittenPrice: 79.00,
          tablePrice: 79.00,
        },
      ],
      vaccines: [
        {
          name: 'Múltipla Vanguard Plus (Cão V10)',
          code: '1712',
          handwrittenPrice: 130.00, // Vet gave promo R$ 130,00 (Table is R$ 139,00)
          tablePrice: 139.00,
        },
      ],
      surgeriesAndProcedures: [
        {
          name: 'Blefaroplastia',
          code: '1694',
          handwrittenPrice: 1600.00, // Vet quoted R$ 1.600,00 (Table range R$ 1.489 a 2.489)
          tablePrice: 1489.00,
          notes: 'Correção de pálpebra bilateral',
        },
        {
          name: 'Anestesia Geral Inalatória',
          code: '1226',
          handwrittenPrice: 579.00,
          tablePrice: 579.00,
        },
      ],
      applicationsAndProducts: [
        {
          id: 'app-of1',
          description: 'Colírio Tobramicina Frasco',
          quantity: 1,
          handwrittenPrice: 42.00,
          tablePrice: 42.00,
        },
        {
          id: 'app-of2',
          description: 'Colar Elizabetano Tam. 5',
          quantity: 1,
          handwrittenPrice: 55.00,
          tablePrice: 55.00,
        },
        {
          id: 'app-of3',
          description: 'Tramadol Injetável + Meloxicam Injetável',
          quantity: 1,
          handwrittenPrice: 65.00,
          tablePrice: 73.00, // Package discount written by vet
        },
      ],
      protocol: {
        previousDebt: 'Não',
        dataConfirmed: 'Sim',
        patientStatus: 'Estável',
        receptionist: 'Mariana',
      },
    },
  },
];
