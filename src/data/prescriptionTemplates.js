// Banco de Modelos Profissionais de Receituários Veterinários
// Personalizado para Dra. Nilcéia Silva (CRMV-SC 16442)
// Rigorosamente atualizado e normatizado conforme:
// - RDC Anvisa nº 1.000/2025 (Novo Marco Regulatório de Medicamentos Controlados)
// - RDC Anvisa nº 471/2021 (Antimicrobianos e Retenção de Receita)
// - Portaria SVS/MS nº 344/1998 e atualizações
// - Instruções Normativas do CFMV e CRMV-SC para Cães e Gatos

export const VET_DATA = {
  name: "Dra. Nilcéia Silva",
  title: "Médica Veterinária",
  crmv: "CRMV-SC 16442",
  specialty: "Medicina Veterinária • Cães e Gatos",
  clinicName: "Dra. Nilcéia Silva",
  tagline: "Medicina Veterinária Humanizada e Acolhedora",
  address: "Rua Nilo Peçanha, 492",
  neighborhood: "Coral",
  city: "Lages",
  state: "SC",
  cep: "88508-500",
  phone: "(49) 99955-5421",
  whatsapp: "(49) 99955-5421",
  email: "contato@seresdeluzvet.com.br",
  hours: "Segunda a Sexta: 08:30 às 19:00 | Sábados: 09:00 às 13:00"
};

export const PRESCRIPTION_TEMPLATES = [
  // =========================================================================
  // MODELO 1: RECEITA SUJEITA À RETENÇÃO (ANTIMICROBIANOS - BRANCA EM 2 VIAS)
  // Conforme RDC 471/21 e RDC Anvisa nº 1.000/2025: Antimicrobianos e agonistas do GLP-1
  // =========================================================================
  {
    id: "modelo-retencao-antimicrobianos",
    type: "antimicrobianos",
    legalCategory: "Receita sujeita à retenção (Branca em 2 vias)",
    badge: "RDC 471/21 & RDC 1.000/2025 (2 Vias)",
    accentColor: "#089b97",
    paperBg: "#ffffff",
    docHeaderType: "RECEITA SUJEITA À RETENÇÃO (ANTIMICROBIANOS)",
    docSubtitle: "1ª VIA: Retenção da Farmácia • 2ª VIA: Orientação do Tutor/Paciente",
    validityText: "Validade: 10 (dez) dias em todo o território nacional.",
    legalBasis: "", // Removido parágrafo longo conforme solicitado
    name: "Receita sujeita à retenção (Branca em 2 vias)",
    category: "Antimicrobianos & Agonistas do GLP-1",
    description: "Aplicada a antimicrobianos e agonistas do GLP-1 (RDC 471/21). 1ª via retida na farmácia e 2ª via orientação ao tutor.",
    isControlled: false,
    requiresBuyerData: true,
    requiresPharmacyFields: true,
    copiesCount: 2,
    patient: {
      name: "Mel",
      species: "Canina",
      breed: "Golden Retriever",
      age: "4 anos",
      sex: "Fêmea",
      weight: "28.5",
      color: "Dourada",
      microchip: "981098102938192"
    },
    tutor: {
      name: "Mariana Alcantara Duarte",
      cpf: "048.912.839-44",
      rg: "5.109.844 SSP/SC",
      phone: "(49) 99955-5421",
      address: "Av. Marechal Floriano, 810, Centro, Lages - SC",
      neighborhood: "Centro",
      city: "Lages",
      uf: "SC",
      cep: "88501-000"
    },
    medications: [
      {
        id: 1,
        name: "Clavulin Vet (Amoxicilina + Clavulanato) 250 mg",
        presentation: "Caixa com 14 comprimidos palatáveis",
        route: "Via Oral",
        quantity: "02 (duas) Caixas",
        dosage: "Administrar 1 comprimido e meio (375 mg) por via oral a cada 12 horas, junto a uma pequena refeição, por 10 dias ininterruptos.",
        schedule: "08:00h e 20:00h"
      },
      {
        id: 2,
        name: "Probiótico Veterinário Pasta Oral 14g",
        presentation: "Seringa graduada com 14 gramas",
        route: "Via Oral",
        quantity: "01 Seringa",
        dosage: "Administrar 2 gramas por via oral uma vez ao dia, 2 horas após o antibiótico, para manutenção da microbiota intestinal.",
        schedule: "14:00h"
      }
    ],
    instructions: "• Não interromper o antibiótico antes de 10 dias para evitar resistência bacteriana.\n• Manter abundante oferta de água limpa e fresca.\n• Retorno clínico agendado para o 10º dia com a Dra. Nilcéia Silva."
  },

  // =========================================================================
  // MODELO 2: RECEITA DE CONTROLE ESPECIAL (BRANCA EM 2 VIAS)
  // Conforme RDC Anvisa nº 1.000/2025: Antidepressivos, anticonvulsivantes, antipsicóticos e anabolizantes (Lista C1 e C5)
  // =========================================================================
  {
    id: "modelo-controle-especial-c1",
    type: "controle-especial",
    legalCategory: "Receita de Controle Especial (Branca em 2 vias)",
    badge: "RDC 1.000/2025: Lista C1 & C5 (2 Vias)",
    accentColor: "#0ABAB5", // Tiffany
    paperBg: "#ffffff",
    docHeaderType: "RECEITA DE CONTROLE ESPECIAL",
    docSubtitle: "1ª VIA: Retenção da Farmácia • 2ª VIA: Orientação do Tutor/Paciente",
    validityText: "Validade geral: 30 (trinta) dias em todo o território nacional.",
    legalBasis: "", // Removido conforme solicitado
    name: "Receita de Controle Especial (Branca em 2 vias)",
    category: "Antidepressivos, Anticonvulsivantes, Antipsicóticos e Anabolizantes",
    description: "Utilizada para antidepressivos, anticonvulsivantes e anabolizantes (Lista C1 e outras). 1ª via retida na farmácia e 2ª via orientação ao tutor.",
    isControlled: true,
    requiresBuyerData: true,
    requiresPharmacyFields: true,
    copiesCount: 2,
    patient: {
      name: "Oliver",
      species: "Felina",
      breed: "SRD (Gato Doméstico)",
      age: "5 anos",
      sex: "Macho (Castrado)",
      weight: "4.8",
      color: "Frajola (Preto e Branco)",
      microchip: "982000412891230"
    },
    tutor: {
      name: "Carlos Eduardo Schmidt",
      cpf: "031.547.899-12",
      rg: "4.981.332 SSP/SC",
      phone: "(49) 99955-5421",
      address: "Rua Correia Pinto, 340, Apto 402, Centro, Lages - SC",
      neighborhood: "Centro",
      city: "Lages",
      uf: "SC",
      cep: "88502-000"
    },
    medications: [
      {
        id: 1,
        name: "Gardenal (Fenobarbital) 50 mg",
        presentation: "Caixa com 30 comprimidos sulcados",
        route: "Via Oral",
        quantity: "02 (duas) Caixas",
        dosage: "Administrar 1/4 de comprimido a cada 12 horas nos mesmos horários (08:00h e 20:00h). Uso contínuo ininterrupto.",
        schedule: "08:00h e 20:00h"
      },
      {
        id: 2,
        name: "Gabapentina 50 mg/mL - Solução Oral Veterinária",
        presentation: "Frasco com 60 mL + seringa graduada",
        route: "Via Oral",
        quantity: "01 (um) Frasco",
        dosage: "Administrar 0,5 mL por via oral a cada 12 horas para controle de dor neuropática e estresse felino.",
        schedule: "08:00h e 20:00h"
      }
    ],
    instructions: "• Não interromper o fenobarbital abruptamente pelo risco de convulsões graves (Status Epilepticus).\n• Dosagem sérica e enzimas hepáticas a cada 6 meses com a Dra. Nilcéia Silva."
  },

  // =========================================================================
  // MODELO 3: NOTIFICAÇÃO DE RECEITA "A" (AMARELA)
  // Conforme RDC Anvisa nº 1.000/2025: Entorpecentes e psicotrópicos (Listas A1, A2 e A3)
  // =========================================================================
  {
    id: "modelo-notificacao-a-amarela",
    type: "notificacao-a",
    legalCategory: "Notificação de Receita 'A' (Amarela)",
    badge: "RDC 1.000/2025: Listas A1, A2 e A3 (Amarela)",
    accentColor: "#d97706",
    paperBg: "#fffdf0",
    headerBg: "#fef3c7",
    docHeaderType: "NOTIFICAÇÃO DE RECEITA 'A' (AMARELA)",
    docSubtitle: "Entorpecentes e Psicotrópicos - Listas A1, A2 e A3 • Retenção Obrigatória",
    validityText: "Validade: 30 (trinta) dias em todo o território nacional.",
    legalBasis: "",
    name: "Notificação de Receita 'A' (Amarela)",
    category: "Entorpecentes & Psicotrópicos (Morfina, Metadona, Fentanil)",
    description: "Utilizada para entorpecentes e psicotrópicos (Listas A1, A2 e A3). Exige retenção da via e tem validade de 30 dias em todo o território nacional.",
    isControlled: true,
    requiresBuyerData: true,
    requiresPharmacyFields: true,
    isYellowNotification: true,
    copiesCount: 1,
    prescriptionNumber: "SC-A 2026/001842",
    patient: {
      name: "Thor",
      species: "Canina",
      breed: "Rottweiler",
      age: "9 anos",
      sex: "Macho (Castrado)",
      weight: "42.5",
      color: "Preto e Canela",
      microchip: "985141002341209"
    },
    tutor: {
      name: "Ricardo Mendes Guimarães",
      cpf: "022.614.939-01",
      rg: "3.441.902 SSP/SC",
      phone: "(49) 99955-5421",
      address: "Rua Frei Rogério, 500, Centro, Lages - SC",
      neighborhood: "Centro",
      city: "Lages",
      uf: "SC",
      cep: "88502-160"
    },
    medications: [
      {
        id: 1,
        name: "Dimorf (Sulfato de Morfina) 10 mg",
        presentation: "Caixa com 20 comprimidos de liberação imediata",
        route: "Via Oral",
        quantity: "01 (uma) Caixa - 20 comprimidos",
        dosage: "Administrar 1/2 comprimido (5 mg) por via oral a cada 8 horas (06:00h, 14:00h e 22:00h) para controle multimodal de dor severa.",
        schedule: "06:00h, 14:00h e 22:00h"
      }
    ],
    instructions: "• Medicamento sujeito a controle rigoroso (RDC 1.000/2025). Guardar sob chave.\n• Monitorar frequência cardiorrespiratória e sedação.\n• Retorno mandatório em 15 dias com a Dra. Nilcéia Silva."
  },

  // =========================================================================
  // MODELO 4: NOTIFICAÇÃO DE RECEITA "B" E "B2" (AZUL)
  // Conforme RDC Anvisa nº 1.000/2025: Psicotrópicos (Lista B1) e Anorexígenos (Lista B2)
  // =========================================================================
  {
    id: "modelo-notificacao-b-azul",
    type: "notificacao-b",
    legalCategory: "Notificação de Receita 'B' e 'B2' (Azul)",
    badge: "RDC 1.000/2025: Listas B1 e B2 (Azul)",
    accentColor: "#0284c7",
    paperBg: "#f0f9ff",
    headerBg: "#e0f2fe",
    docHeaderType: "NOTIFICAÇÃO DE RECEITA 'B' E 'B2' (AZUL)",
    docSubtitle: "Psicotrópicos (Lista B1 - Benzodiazepínicos) • Retenção Obrigatória",
    validityText: "Validade: 30 (trinta) dias no Estado de Santa Catarina.",
    legalBasis: "",
    name: "Notificação de Receita 'B' e 'B2' (Azul)",
    category: "Psicotrópicos & Benzodiazepínicos (Diazepam, Clonazepam)",
    description: "Utilizada para psicotrópicos (Lista B1, como benzodiazepínicos) e substâncias anorexígenas (Lista B2). Possui validade de 30 dias.",
    isControlled: true,
    requiresBuyerData: true,
    requiresPharmacyFields: true,
    isBlueNotification: true,
    copiesCount: 1,
    prescriptionNumber: "SC-B 2026/004921",
    patient: {
      name: "Toby",
      species: "Canina",
      breed: "Beagle",
      age: "6 anos",
      sex: "Macho",
      weight: "14.2",
      color: "Tricolor",
      microchip: "981029381928371"
    },
    tutor: {
      name: "Juliana Peixoto de Camargo",
      cpf: "071.328.919-88",
      rg: "4.819.330 SSP/SC",
      phone: "(49) 99955-5421",
      address: "Rua James Robert Amos, 120, Guarujá, Lages - SC",
      neighborhood: "Guarujá",
      city: "Lages",
      uf: "SC",
      cep: "88521-100"
    },
    medications: [
      {
        id: 1,
        name: "Diazepam 5 mg - Comprimidos Sulcados",
        presentation: "Caixa com 20 comprimidos",
        route: "Via Oral",
        quantity: "01 (uma) Caixa",
        dosage: "Administrar 1 comprimido (5 mg) por via oral 1 hora antes de eventos com comprovado estresse fóbico extremo ou em caso de aura convulsiva.",
        schedule: "Uso emergencial pontual"
      }
    ],
    instructions: "• Não associar a outros depressores do SNC sem autorização médica.\n• Observar sedação transitória esperada."
  },

  // =========================================================================
  // MODELO 5: NOTIFICAÇÃO DE RECEITA ESPECIAL (BRANCA)
  // Conforme RDC Anvisa nº 1.000/2025: Retinoides de uso sistêmico e talidomida
  // =========================================================================
  {
    id: "modelo-notificacao-especial-retinoides",
    type: "notificacao-especial-branca",
    legalCategory: "Notificação de Receita Especial (Branca)",
    badge: "RDC 1.000/2025: Retinoides & Talidomida",
    accentColor: "#0f766e",
    paperBg: "#ffffff",
    headerBg: "#f1f5f9",
    docHeaderType: "NOTIFICAÇÃO DE RECEITA ESPECIAL (BRANCA)",
    docSubtitle: "Retinoides Sistêmicos (Lista C2) • Acompanha Termo de Responsabilidade",
    validityText: "Validade: 30 (trinta) dias no Estado de Santa Catarina.",
    legalBasis: "",
    name: "Notificação de Receita Especial (Branca)",
    category: "Retinoides Sistêmicos (Isotretinoína) + Termo de Responsabilidade",
    description: "Utilizada para retinoides de uso sistêmico e talidomida, devendo vir acompanhada de termo de responsabilidade específico.",
    isControlled: true,
    requiresBuyerData: true,
    requiresPharmacyFields: true,
    requiresResponsibilityTerm: true,
    copiesCount: 2,
    prescriptionNumber: "SC-ESP 2026/000732",
    patient: {
      name: "Bob",
      species: "Canina",
      breed: "Cocker Spaniel Inglês",
      age: "5 anos",
      sex: "Macho (Castrado)",
      weight: "13.8",
      color: "Dourado",
      microchip: "982000109283741"
    },
    tutor: {
      name: "Patrícia Helena Silveira",
      cpf: "049.281.749-33",
      rg: "4.120.985 SSP/SC",
      phone: "(49) 99955-5421",
      address: "Rua Benjamin Constant, 210, São Cristóvão, Lages - SC",
      neighborhood: "São Cristóvão",
      city: "Lages",
      uf: "SC",
      cep: "88509-200"
    },
    medications: [
      {
        id: 1,
        name: "Isotretinoína (Roacutan) 10 mg",
        presentation: "Caixa com 30 cápsulas gelatinosas moles",
        route: "Via Oral",
        quantity: "02 (duas) Caixas",
        dosage: "Administrar 1 cápsula (10 mg) a cada 24 horas junto com refeição rica em gordura por 60 dias para seborreia grave / adenite sebácea.",
        schedule: "12:00h (Almoço)"
      }
    ],
    instructions: "• ALERTA TERATOGÊNICO OBRIGATÓRIO (RDC 1.000/2025): Fêmeas caninas ou felinas não podem reproduzir durante o tratamento e até 6 meses após.\n• Monitorar triglicerídeos e enzimas hepáticas mensalmente com a Dra. Nilcéia Silva.",
    responsibilityTermText: "Declaro ter sido expressamente orientado(a) pela Médica Veterinária Dra. Nilcéia Silva (CRMV-SC 16442) quanto aos riscos de teratogenia, toxicidade hepática e cuidados inerentes ao retinoide prescrito, comprometendo-me a não repassar a medicação."
  },

  // =========================================================================
  // MODELO 6: RECEITUÁRIO CLÍNICO GERAL & MAGISTRAL (RECEITA BRANCA SIMPLES)
  // =========================================================================
  {
    id: "modelo-simples-magistral",
    type: "simples",
    legalCategory: "Receituário Veterinário Clínico & Magistral (Receita Branca)",
    badge: "Uso Geral & Manipulação Veterinária",
    accentColor: "#0ABAB5",
    paperBg: "#ffffff",
    docHeaderType: "RECEITUÁRIO MÉDICO VETERINÁRIO",
    docSubtitle: "Medicina Veterinária de Cães e Gatos • Prescrição Ambulatorial",
    validityText: "Validade: 30 (trinta) dias para medicamentos contínuos.",
    legalBasis: "",
    name: "Receituário Clínico & Magistral (Branca Simples)",
    category: "Anti-inflamatórios, Analgésicos, Dermato & Manipulação",
    description: "Prescrição ambulatorial padrão para analgésicos, anti-inflamatórios, protetores, formulações tópicas auriculares e dermocosméticos de rotina.",
    isControlled: false,
    requiresBuyerData: false,
    requiresPharmacyFields: false,
    copiesCount: 1,
    patient: {
      name: "Luna",
      species: "Felina",
      breed: "Siamês",
      age: "7 anos",
      sex: "Fêmea",
      weight: "3.4",
      color: "Seal Point",
      microchip: "981000781290111"
    },
    tutor: {
      name: "Fabiana de Sousa Ribeiro",
      cpf: "062.812.399-51",
      phone: "(49) 99955-5421",
      address: "Rua Caetano Vieira da Costa, 150, Coral, Lages - SC",
      neighborhood: "Coral",
      city: "Lages",
      uf: "SC",
      cep: "88508-300"
    },
    medications: [
      {
        id: 1,
        name: "Maxicam (Meloxicam) 0,5 mg",
        presentation: "Caixa com 10 comprimidos palatáveis",
        route: "Via Oral",
        quantity: "01 Caixa",
        dosage: "Administrar 1/2 comprimido (0,25 mg) por via oral a cada 24 horas, junto ao alimento úmido, por 4 dias seguidos.",
        schedule: "12:00h (Almoço)"
      },
      {
        id: 2,
        name: "Fórmula Magistral: Ômega 3 250mg + Vitamina E 20 UI em Gel Transdérmico",
        presentation: "Caneta Dosadora com 30 doses (0,1 mL/dose)",
        route: "Via Tópica Auricular",
        quantity: "01 Caneta Dosadora",
        dosage: "Aplicar 1 dose na face interna da concha da orelha limpa a cada 24 horas, alternando orelhas diariamente.",
        schedule: "20:00h"
      }
    ],
    instructions: "• Oferecer ração úmida para auxiliar na hidratação da paciente felina.\n• Retorno clínico agendado para reavaliação física em 15 dias com a Dra. Nilcéia Silva."
  }
];
