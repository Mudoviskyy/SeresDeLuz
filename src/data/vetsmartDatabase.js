// =========================================================================
// BULÁRIO E BANCO DE DADOS FARMACOLÓGICO VETERINÁRIO (PADRÃO VETSMART)
// Adaptado para Clínica Seres de Luz • Dra. Nilcéia Silva (CRMV-SC 16442)
// Normatizado com a RDC Anvisa nº 1.000/2025 e RDC nº 471/2021
// =========================================================================

export const VETSMART_DRUG_DATABASE = [
  // -----------------------------------------------------------------------
  // ANTIMICROBIANOS (RDC 471/21 & RDC 1000/2025 - RECEITA EM 2 VIAS)
  // -----------------------------------------------------------------------
  {
    id: "clavulin-vet",
    name: "Clavulin Vet (Amoxicilina + Clavulanato)",
    activeIngredient: "Amoxicilina + Clavulanato de Potássio",
    category: "Antimicrobiano",
    species: ["Canina", "Felina"],
    presentation: "Comprimidos Palatáveis 250 mg (ou suspensão 50mg/mL)",
    route: "Uso Oral",
    defaultDoseMgKg: 15, // mg/kg
    concentration: 250, // mg por comprimido
    unit: "comprimido(s)",
    defaultFrequency: "a cada 12 horas",
    defaultDuration: "durante 10 dias consecutivos",
    rdcClassification: "retencao-antimicrobianos",
    legalCategoryName: "Receita sujeita à retenção (Branca em 2 vias)",
    requiresTwoCopies: true,
    warning: "Obrigatória retenção da 1ª via (RDC 471/21). Não suspender antes de 10 dias.",
    instructions: "Administrar junto a uma pequena porção de comida para evitar desconforto gástrico. Manter água fresca abundante."
  },
  {
    id: "enrofloxacino-baytril",
    name: "Baytril Flavour (Enrofloxacino)",
    activeIngredient: "Enrofloxacino 50 mg / 150 mg",
    category: "Antimicrobiano",
    species: ["Canina", "Felina"],
    presentation: "Comprimidos sulcados 50 mg",
    route: "Uso Oral",
    defaultDoseMgKg: 5,
    concentration: 50,
    unit: "comprimido(s)",
    defaultFrequency: "a cada 24 horas",
    defaultDuration: "durante 7 a 14 dias",
    rdcClassification: "retencao-antimicrobianos",
    legalCategoryName: "Receita sujeita à retenção (Branca em 2 vias)",
    requiresTwoCopies: true,
    warning: "Fluroquinolona sob retenção de receita. Em felinos, não ultrapassar 5 mg/kg/dia para evitar retinopatia.",
    instructions: "Administrar preferencialmente no mesmo horário todos os dias. Contraindicado em animais jovens em fase de crescimento acelerado."
  },
  {
    id: "cefalexina-vet",
    name: "Cefalexina Veterinária (Cefa-Drops / Rilexine)",
    activeIngredient: "Cefalexina Monoidratada",
    category: "Antimicrobiano",
    species: ["Canina", "Felina"],
    presentation: "Comprimidos 300 mg / 600 mg palatáveis",
    route: "Uso Oral",
    defaultDoseMgKg: 25,
    concentration: 300,
    unit: "comprimido(s)",
    defaultFrequency: "a cada 12 horas",
    defaultDuration: "durante 14 a 21 dias (piodermites)",
    rdcClassification: "retencao-antimicrobianos",
    legalCategoryName: "Receita sujeita à retenção (Branca em 2 vias)",
    requiresTwoCopies: true,
    warning: "Cefalosporina de 1ª geração sujeita à retenção de receita (RDC 471/21).",
    instructions: "Uso estritamente sob horário regular. Ideal para afecções dermatológicas e piodermites bacterianas superficiais ou profundas."
  },
  {
    id: "doxiciclina-vet",
    name: "Doxitec / Doxiciclina 100 mg",
    activeIngredient: "Hiclato de Doxiciclina",
    category: "Antimicrobiano",
    species: ["Canina", "Felina"],
    presentation: "Comprimidos palatáveis 100 mg",
    route: "Uso Oral",
    defaultDoseMgKg: 10,
    concentration: 100,
    unit: "comprimido(s)",
    defaultFrequency: "a cada 24 horas (ou 5mg/kg a cada 12h)",
    defaultDuration: "durante 28 dias consecutivos",
    rdcClassification: "retencao-antimicrobianos",
    legalCategoryName: "Receita sujeita à retenção (Branca em 2 vias)",
    requiresTwoCopies: true,
    warning: "Fármaco de escolha para hemoparasitoses (Erliquiose, Anaplasmose, Micoplasmose felina).",
    instructions: "ALERTA FELINO: Sempre administrar acompanhado de 5mL de água ou alimento úmido para evitar estenose esofágica medicamentosa em gatos."
  },

  // -----------------------------------------------------------------------
  // CONTROLE ESPECIAL - LISTA C1 (ANTICONVULSIVANTES, ANTIDEPRESSIVOS, OPIOIDES FRACOS)
  // -----------------------------------------------------------------------
  {
    id: "fenobarbital-gardenal",
    name: "Gardenal (Fenobarbital)",
    activeIngredient: "Fenobarbital 50 mg ou 100 mg",
    category: "Anticonvulsivante / Sedativo",
    species: ["Canina", "Felina"],
    presentation: "Comprimidos sulcados 50 mg",
    route: "Uso Oral",
    defaultDoseMgKg: 2.5,
    concentration: 50,
    unit: "comprimido(s)",
    defaultFrequency: "a cada 12 horas rigorosamente",
    defaultDuration: "uso contínuo (reavaliação semestral)",
    rdcClassification: "controle-especial",
    legalCategoryName: "Receita de Controle Especial (Branca em 2 vias)",
    requiresTwoCopies: true,
    warning: "Medicamento sob Controle Especial - Lista C1 (RDC 1.000/2025). 1ª via retida na farmácia.",
    instructions: "NUNCA interromper de forma abrupta sob risco iminente de convulsão refratária (Status Epilepticus). Realizar dosagem sérica a cada 6 meses com a Dra. Nilcéia."
  },
  {
    id: "gabapentina-vet",
    name: "Gabapentina Veterinária",
    activeIngredient: "Gabapentina 50 mg/mL ou cápsulas 100 mg",
    category: "Anticonvulsivante / Analgésico Neuropático",
    species: ["Canina", "Felina"],
    presentation: "Suspensão oral 50 mg/mL sem xilitol ou cápsulas 100 mg",
    route: "Uso Oral",
    defaultDoseMgKg: 10,
    concentration: 50,
    unit: "mL ou cápsula",
    defaultFrequency: "a cada 12 horas (ou a cada 8h se dor intensa)",
    defaultDuration: "durante 15 a 30 dias ou uso contínuo",
    rdcClassification: "controle-especial",
    legalCategoryName: "Receita de Controle Especial (Branca em 2 vias)",
    requiresTwoCopies: true,
    warning: "Controle Especial (Lista C1 - RDC 1.000/2025). Formulações humanas não devem conter xilitol (tóxico para cães).",
    instructions: "Excelente eficácia para analgesia de dor neuropática crônica, osteoartrite e redução de estresse pré-consulta em felinos (Cat Friendly)."
  },
  {
    id: "tramadol-cronidor",
    name: "Cronidor / Cloridrato de Tramadol",
    activeIngredient: "Cloridrato de Tramadol 12 mg / 50 mg",
    category: "Analgésico Opioide",
    species: ["Canina", "Felina"],
    presentation: "Comprimidos sulcados palatáveis 50 mg (ou gotas)",
    route: "Uso Oral",
    defaultDoseMgKg: 3,
    concentration: 50,
    unit: "comprimido(s)",
    defaultFrequency: "a cada 8 horas",
    defaultDuration: "durante 3 a 5 dias pós-cirúrgico",
    rdcClassification: "controle-especial",
    legalCategoryName: "Receita de Controle Especial (Branca em 2 vias)",
    requiresTwoCopies: true,
    warning: "Opioide sob Lista C1 / A2 conforme concentração. Retenção de 1ª via obrigatória.",
    instructions: "Administrar para controle de dor pós-operatória moderada a intensa. Pode causar sedação leve ou salivação em gatos."
  },
  {
    id: "fluoxetina-vet",
    name: "Cloridrato de Fluoxetina",
    activeIngredient: "Fluoxetina 10 mg / 20 mg",
    category: "Antidepressivo / Modulador Comportamental",
    species: ["Canina", "Felina"],
    presentation: "Cápsulas palatáveis ou pasta transdérmica auricular",
    route: "Uso Oral ou Tópico Auricular",
    defaultDoseMgKg: 1,
    concentration: 10,
    unit: "cápsula / dose",
    defaultFrequency: "a cada 24 horas pela manhã",
    defaultDuration: "durante 60 a 90 dias com reavaliação comportamental",
    rdcClassification: "controle-especial",
    legalCategoryName: "Receita de Controle Especial (Branca em 2 vias)",
    requiresTwoCopies: true,
    warning: "Lista C1 (Antidepressivos). Efeito terapêutico pleno observado a partir da 3ª a 4ª semana.",
    instructions: "Indicado para ansiedade de separação, lambedura psicogênica acral e agressividade por medo em cães e gatos."
  },

  // -----------------------------------------------------------------------
  // NOTIFICAÇÃO DE RECEITA "A" (AMARELA - ENTORPECENTES LISTAS A1, A2, A3)
  // -----------------------------------------------------------------------
  {
    id: "dimorf-morfina",
    name: "Dimorf (Sulfato de Morfina)",
    activeIngredient: "Sulfato de Morfina 10 mg",
    category: "Entorpecente / Opioide Potente",
    species: ["Canina", "Felina"],
    presentation: "Comprimidos 10 mg de liberação rápida",
    route: "Uso Oral",
    defaultDoseMgKg: 0.25,
    concentration: 10,
    unit: "comprimido(s)",
    defaultFrequency: "a cada 8 horas pontualmente",
    defaultDuration: "durante 5 a 10 dias conforme indicação oncológica",
    rdcClassification: "notificacao-a",
    legalCategoryName: "Notificação de Receita 'A' (Amarela)",
    requiresTwoCopies: false,
    warning: "EXCLUSIVO NOTIFICAÇÃO AMARELA (RDC 1.000/2025). Exige número de talonário oficial da Vigilância Sanitária e retenção estrita.",
    instructions: "Indicado para analgesia oncológica avançada e politraumatismos. Manter guardado sob chave e protegido de terceiros."
  },
  {
    id: "metadona-vet",
    name: "Metadona Cloridrato",
    activeIngredient: "Cloridrato de Metadona 5 mg / 10 mg",
    category: "Entorpecente / Opioide Potente",
    species: ["Canina", "Felina"],
    presentation: "Solução oral ou ampolas injetáveis",
    route: "Uso Oral / Injetável",
    defaultDoseMgKg: 0.2,
    concentration: 5,
    unit: "mL / comprimido",
    defaultFrequency: "a cada 8 a 12 horas",
    defaultDuration: "conforme protocolo de internação / domiciliar",
    rdcClassification: "notificacao-a",
    legalCategoryName: "Notificação de Receita 'A' (Amarela)",
    requiresTwoCopies: false,
    warning: "Substância da Lista A1 (Entorpecentes). Validade de 30 dias em todo o território nacional.",
    instructions: "Agonista opioide puro com ação receptora NMDA. Monitorar reflexos e respiração."
  },

  // -----------------------------------------------------------------------
  // NOTIFICAÇÃO DE RECEITA "B" E "B2" (AZUL - PSICOTRÓPICOS E BENZODIAZEPÍNICOS)
  // -----------------------------------------------------------------------
  {
    id: "diazepam-vet",
    name: "Diazepam 5 mg / 10 mg",
    activeIngredient: "Diazepam",
    category: "Psicotrópico / Benzodiazepínico",
    species: ["Canina", "Felina"],
    presentation: "Comprimidos sulcados 5 mg ou bisnaga retal",
    route: "Uso Oral ou Retal",
    defaultDoseMgKg: 0.5,
    concentration: 5,
    unit: "comprimido(s)",
    defaultFrequency: "uso pontual conforme emergência",
    defaultDuration: "dose única ou repetida em 30 min se persistir aura",
    rdcClassification: "notificacao-b",
    legalCategoryName: "Notificação de Receita 'B' e 'B2' (Azul)",
    requiresTwoCopies: false,
    warning: "EXCLUSIVO NOTIFICAÇÃO AZUL - Lista B1 (RDC 1.000/2025). Retenção da via obrigatória. Validade 30 dias.",
    instructions: "Para interrupção de crises convulsivas agudas e eventos de pânico fóbico extremo a trovões/fogos. Em gatos, evitar uso oral crônico por risco de necrose hepática idiopática."
  },
  {
    id: "midazolam-vet",
    name: "Dormonid / Midazolam",
    activeIngredient: "Maleato de Midazolam 15 mg",
    category: "Psicotrópico / Benzodiazepínico",
    species: ["Canina", "Felina"],
    presentation: "Comprimidos ou solução injetável/intranasal",
    route: "Uso Oral / Intranasal",
    defaultDoseMgKg: 0.2,
    concentration: 15,
    unit: "comprimido(s) / mL",
    defaultFrequency: "uso emergencial pré-procedimento",
    defaultDuration: "dose única",
    rdcClassification: "notificacao-b",
    legalCategoryName: "Notificação de Receita 'B' e 'B2' (Azul)",
    requiresTwoCopies: false,
    warning: "Substância Psicotrópica Lista B1. Notificação Azul obrigatória.",
    instructions: "Excelente para sedação leve e relaxamento muscular sem analgesia."
  },

  // -----------------------------------------------------------------------
  // NOTIFICAÇÃO DE RECEITA ESPECIAL (BRANCA - RETINOIDES SISTÊMICOS E TALIDOMIDA)
  // -----------------------------------------------------------------------
  {
    id: "isotretinoina-roacutan",
    name: "Isotretinoína (Roacutan)",
    activeIngredient: "Isotretinoína 10 mg ou 20 mg",
    category: "Retinoide Sistêmico (Lista C2)",
    species: ["Canina", "Felina"],
    presentation: "Cápsulas moles 10 mg",
    route: "Uso Oral",
    defaultDoseMgKg: 1,
    concentration: 10,
    unit: "cápsula(s)",
    defaultFrequency: "a cada 24 horas com refeição rica em gordura",
    defaultDuration: "durante 60 a 90 dias com monitoramento hepático",
    rdcClassification: "notificacao-especial-branca",
    legalCategoryName: "Notificação de Receita Especial (Branca)",
    requiresTwoCopies: true,
    warning: "OBRIGATÓRIO TERMO DE RESPONSABILIDADE ESPECÍFICO (RDC 1.000/2025). Alto potencial teratogênico.",
    instructions: "Indicado para dermatite seborreica idiopática refratária de cães e adenite sebácea. Fêmeas não podem acasalar durante o tratamento nem nos 6 meses subsequentes."
  },

  // -----------------------------------------------------------------------
  // MEDICAMENTOS CLÍNICOS GERAIS (RECEITUÁRIO BRANCA COMUM)
  // -----------------------------------------------------------------------
  {
    id: "meloxicam-maxicam",
    name: "Maxicam / Meloxicam Vet",
    activeIngredient: "Meloxicam 0,5 mg / 2 mg",
    category: "Anti-inflamatório Não Esteroidal (AINE)",
    species: ["Canina", "Felina"],
    presentation: "Comprimidos mastigáveis palatáveis 0,5 mg ou 2 mg",
    route: "Uso Oral",
    defaultDoseMgKg: 0.1, // 0,1 mg/kg no D1, depois 0,05 mg/kg
    concentration: 0.5,
    unit: "comprimido(s)",
    defaultFrequency: "a cada 24 horas",
    defaultDuration: "durante 4 a 5 dias",
    rdcClassification: "simples",
    legalCategoryName: "Receituário Clínico Veterinário (Receita Branca)",
    requiresTwoCopies: false,
    warning: "AINE preferencial COX-2 seletivo. Contraindicado em animais desidratados, hipotensos ou com insuficiência renal avançada.",
    instructions: "Administrar 0,1 mg/kg no 1º dia e metade da dose nos dias subsequentes, sempre junto à refeição para proteger a mucosa gástrica."
  },
  {
    id: "dipirona-gotas",
    name: "Dipirona Sódica Gotas 500 mg/mL",
    activeIngredient: "Dipirona Sódica Monoidratada",
    category: "Analgésico e Antipirético",
    species: ["Canina", "Felina"],
    presentation: "Frasco conta-gotas 20 mL",
    route: "Uso Oral",
    defaultDoseMgKg: 25,
    concentration: 25, // aprox 25mg por gota (500mg/mL = 20 gotas/mL)
    unit: "gota(s)",
    defaultFrequency: "a cada 8 horas se dor ou febre",
    defaultDuration: "durante 3 dias ou conforme necessidade",
    rdcClassification: "simples",
    legalCategoryName: "Receituário Clínico Veterinário (Receita Branca)",
    requiresTwoCopies: false,
    warning: "Analgésico e antitérmico seguro. Em felinos, utilizar doses calculadas rigorosamente e por curto período.",
    instructions: "Calcular 1 gota por quilograma de peso vivo (ex: cão de 10kg = 10 gotas a cada 8h)."
  },
  {
    id: "apoquel-oclacitinib",
    name: "Apoquel (Oclacitinib)",
    activeIngredient: "Maleato de Oclacitinib 3.6 mg / 5.4 mg / 16 mg",
    category: "Antipruriginoso / Dermatológico Inibidor JAK",
    species: ["Canina"],
    presentation: "Comprimidos revestidos 5.4 mg ou 16 mg",
    route: "Uso Oral",
    defaultDoseMgKg: 0.5,
    concentration: 5.4,
    unit: "comprimido(s)",
    defaultFrequency: "a cada 12 horas por 14 dias, após a cada 24 horas de manutenção",
    defaultDuration: "durante 30 dias com reavaliação clínica",
    rdcClassification: "simples",
    legalCategoryName: "Receituário Clínico Veterinário (Receita Branca)",
    requiresTwoCopies: false,
    warning: "Inibidor seletivo de JAK-1. Alívio rápido da coceira em dermatite atópica canina.",
    instructions: "Pode ser administrado com ou sem alimentos. Não indicado para cães com infecções graves ativas ou sarna demodécica."
  },
  {
    id: "cerenia-maropitant",
    name: "Cerenia (Citrato de Maropitant)",
    activeIngredient: "Citrato de Maropitant 16 mg / 24 mg / 60 mg",
    category: "Antiemético Antagonista NK-1",
    species: ["Canina", "Felina"],
    presentation: "Comprimidos mastigáveis 24 mg ou 60 mg",
    route: "Uso Oral",
    defaultDoseMgKg: 2, // 2 mg/kg para vômitos agudos, 8 mg/kg cinetose
    concentration: 24,
    unit: "comprimido(s)",
    defaultFrequency: "a cada 24 horas",
    defaultDuration: "durante até 5 dias consecutivos",
    rdcClassification: "simples",
    legalCategoryName: "Receituário Clínico Veterinário (Receita Branca)",
    requiresTwoCopies: false,
    warning: "Antiemético de alta potência para emese de origem periférica ou central.",
    instructions: "Para enjoo de movimento (cinetose em viagens), administrar 2 horas antes da viagem com pequeno lanche sem jejum prolongado."
  },
  {
    id: "omeprazol-gaviz",
    name: "Gaviz V / Omeprazol Veterinário",
    activeIngredient: "Omeprazol 10 mg / 20 mg",
    category: "Protetor Gástrico / Inibidor da Bomba de Prótons",
    species: ["Canina", "Felina"],
    presentation: "Comprimidos com microgrânulos gastrorresistentes",
    route: "Uso Oral",
    defaultDoseMgKg: 1,
    concentration: 10,
    unit: "comprimido(s)",
    defaultFrequency: "a cada 24 horas em jejum matinal",
    defaultDuration: "durante 14 a 21 dias",
    rdcClassification: "simples",
    legalCategoryName: "Receituário Clínico Veterinário (Receita Branca)",
    requiresTwoCopies: false,
    warning: "Inibe a secreção ácida gástrica. Não esmagar os microgrânulos.",
    instructions: "Administrar pela manhã pelo menos 30 a 45 minutos antes da primeira refeição."
  },
  {
    id: "simparic-nexgard",
    name: "Simparic / NexGard Spectra",
    activeIngredient: "Sarolaner / Afoxolaner + Milbemicina",
    category: "Antiparasitário Completo (Ecto e Endoparasitas)",
    species: ["Canina"],
    presentation: "Tablete mastigável altamente palatável sabor carne",
    route: "Uso Oral",
    defaultDoseMgKg: 2,
    concentration: 1,
    unit: "tablete",
    defaultFrequency: "a cada 30 a 35 dias",
    defaultDuration: "uso preventivo mensal contínuo",
    rdcClassification: "simples",
    legalCategoryName: "Receituário Clínico Veterinário (Receita Branca)",
    requiresTwoCopies: false,
    warning: "Proteção completa contra pulgas, carrapatos, sarnas e vermes intestinais.",
    instructions: "Administrar o tablete inteiro diretamente na boca ou misturado ao alimento. Garantir a ingestão completa."
  },
  {
    id: "otodem-plus",
    name: "Otodem Plus / Posatex Suspensão Otológica",
    activeIngredient: "Tiabendazol + Neomicina + Dexametasona",
    category: "Otológico Terapêutico",
    species: ["Canina", "Felina"],
    presentation: "Frasco dosador 20 mL",
    route: "Uso Otológico",
    defaultDoseMgKg: 0,
    concentration: 0,
    unit: "gotas",
    defaultFrequency: "a cada 12 horas",
    defaultDuration: "durante 7 a 10 dias",
    rdcClassification: "simples",
    legalCategoryName: "Receituário Clínico Veterinário (Receita Branca)",
    requiresTwoCopies: false,
    warning: "Avaliar integridade da membrana timpânica antes do início do tratamento.",
    instructions: "Limpar previamente o conduto auditivo. Pingar 4 a 6 gotas em cada orelha e massagear suavemente a base por 30 segundos."
  },
  {
    id: "prednisolona-vet",
    name: "Prediderm / Prednisolona 5 mg / 20 mg",
    activeIngredient: "Prednisolona",
    category: "Corticoide Anti-inflamatório / Imunossupressor",
    species: ["Canina", "Felina"],
    presentation: "Comprimidos sulcados 5 mg ou 20 mg",
    route: "Uso Oral",
    defaultDoseMgKg: 0.5,
    concentration: 5,
    unit: "comprimido(s)",
    defaultFrequency: "a cada 24 horas pela manhã",
    defaultDuration: "durante 5 dias (dose plena) seguido de desmame gradual em dias alternados",
    rdcClassification: "simples",
    legalCategoryName: "Receituário Clínico Veterinário (Receita Branca)",
    requiresTwoCopies: false,
    warning: "Nunca suspender abruptamente após mais de 7 dias de uso para evitar insuficiência adrenal secundária.",
    instructions: "Administrar sempre após o desjejum matinal. Aumento de apetite e sede (poliúria e polidipsia) são efeitos transitórios esperados."
  }
];

// =========================================================================
// PROTOCOLOS CLÍNICOS PRONTOS DE 1 CLIQUE (PADRÃO VETSMART)
// Permitem montar receitas completas e fundamentadas instantaneamente
// =========================================================================

export const VETSMART_CLINICAL_PROTOCOLS = [
  {
    id: "proto-pos-operatorio",
    title: "Pós-Operatório Geral (Castração / Tecidos Moles)",
    subtitle: "Analgesia Multimodal + Antibiótico Preventivo + Cuidados",
    targetSpecies: "Canina e Felina",
    badge: "Cirúrgico",
    badgeColor: "#0284c7",
    recommendedTemplateId: "modelo-retencao-antimicrobianos",
    medications: [
      {
        name: "Clavulin Vet (Amoxicilina + Clavulanato) 250 mg",
        presentation: "Caixa com 14 comprimidos palatáveis",
        route: "Via Oral",
        quantity: "01 Caixa",
        dosage: "Administrar a dose recomendada a cada 12 horas junto ao alimento durante 7 a 10 dias consecutivos sem interrupções.",
        schedule: "08:00h e 20:00h"
      },
      {
        name: "Maxicam (Meloxicam) 0,5 mg / 2 mg",
        presentation: "Caixa com 10 comprimidos",
        route: "Via Oral",
        quantity: "01 Caixa",
        dosage: "Administrar a cada 24 horas junto a uma refeição por 4 dias seguidos para controle inflamatório e dor cirúrgica.",
        schedule: "12:00h (Almoço)"
      },
      {
        name: "Dipirona Gotas 500 mg/mL",
        presentation: "Frasco com 20 mL",
        route: "Via Oral",
        quantity: "01 Frasco",
        dosage: "Administrar 1 gota por kg de peso vivo a cada 8 horas se dor ou febre (máximo 3 dias).",
        schedule: "A cada 8 horas (se dor)"
      }
    ],
    instructions: "• Manter o animal em repouso absoluto, sem pular ou correr, durante 10 dias.\n• Uso obrigatório de colar elizabetano ou roupa cirúrgica protetora para evitar lambedura dos pontos.\n• Higienizar a ferida cirúrgica 2 vezes ao dia com gaze embebida em soro fisiológico morno.\n• Retorno agendado para o 10º dia para retirada de pontos com a Dra. Nilcéia Silva na Clínica Seres de Luz."
  },

  {
    id: "proto-gastroenterite",
    title: "Gastroenterite Aguda (Vômito e Diarreia)",
    subtitle: "Antiemético Potente + Protetor Gástrico + Reposição de Flora",
    targetSpecies: "Canina e Felina",
    badge: "Clínico Geral",
    badgeColor: "#0ABAB5",
    recommendedTemplateId: "modelo-simples-magistral",
    medications: [
      {
        name: "Cerenia (Maropitant) 24 mg / 60 mg",
        presentation: "Comprimidos mastigáveis palatáveis",
        route: "Via Oral",
        quantity: "01 Caixa",
        dosage: "Administrar a cada 24 horas com pequeno pedaço de alimento (sem jejum prolongado) por 4 dias consecutivos.",
        schedule: "09:00h"
      },
      {
        name: "Gaviz V (Omeprazol) 10 mg / 20 mg",
        presentation: "Comprimidos gastrorresistentes",
        route: "Via Oral",
        quantity: "01 Caixa",
        dosage: "Administrar 1 comprimido pela manhã em jejum, 30 minutos antes da primeira refeição, por 14 dias.",
        schedule: "08:00h (Em jejum)"
      },
      {
        name: "Probiótico Veterinário Pasta Oral 14g",
        presentation: "Seringa graduada com 14g",
        route: "Via Oral",
        quantity: "01 Seringa",
        dosage: "Administrar 2 gramas por via oral uma vez ao dia durante 7 dias para reequilíbrio da microbiota intestinal.",
        schedule: "15:00h"
      }
    ],
    instructions: "• Dieta leve e altamente digestível: frango desfiado cozido em água com arroz branco ou ração gastroenterite prescrita, em pequenas porções várias vezes ao dia.\n• Estimular ingestão de água limpa ou soro caseiro para evitar desidratação.\n• Se os vômitos persistirem com sangue ou prostração intensa, retornar imediatamente à clínica."
  },

  {
    id: "proto-epilepsia-crises",
    title: "Neurológico: Controle de Convulsões & Epilepsia",
    subtitle: "Fenobarbital Contínuo (Lista C1) + Gabapentina + Protocolo Emergência",
    targetSpecies: "Canina e Felina",
    badge: "Controle Especial C1",
    badgeColor: "#d97706",
    recommendedTemplateId: "modelo-controle-especial-c1",
    medications: [
      {
        name: "Gardenal (Fenobarbital) 50 mg / 100 mg",
        presentation: "Caixa com 30 comprimidos sulcados",
        route: "Via Oral",
        quantity: "02 Caixas",
        dosage: "Administrar a dose calculada rigorosamente a cada 12 horas (08:00h e 20:00h) nos mesmos horários. Uso contínuo ininterrupto.",
        schedule: "08:00h e 20:00h britânico"
      },
      {
        name: "Gabapentina 50 mg/mL - Solução Oral sem Xilitol",
        presentation: "Frasco com 60 mL acompanhado de seringa dosadora",
        route: "Via Oral",
        quantity: "01 Frasco",
        dosage: "Administrar por via oral a cada 12 horas junto ao fenobarbital para potencialização sinérgica anticonvulsivante.",
        schedule: "08:00h e 20:00h"
      }
    ],
    instructions: "• ATENÇÃO VITAL: Jamais interrompa o fenobarbital por conta própria, pois pode levar o paciente a coma epiléptico refratário.\n• Em caso de crise aguda que dure mais de 2 minutos, manter o pet afastado de móveis e quinas, proteger a cabeça com almofada e contatar o plantão da Clínica Seres de Luz.\n• Dosagem de nível sérico de fenobarbital e perfil hepático a cada 6 meses com a Dra. Nilcéia Silva."
  },

  {
    id: "proto-dermatite-alergica",
    title: "Dermatologia: Prurido Severo & Dermatite Atópica",
    subtitle: "Inibidor JAK (Apoquel) ou Corticosteroide + Shampooterapia Terapêutica",
    targetSpecies: "Canina",
    badge: "Dermatologia",
    badgeColor: "#8b5cf6",
    recommendedTemplateId: "modelo-simples-magistral",
    medications: [
      {
        name: "Apoquel (Oclacitinib) 5.4 mg / 16 mg",
        presentation: "Caixa com 20 comprimidos revestidos",
        route: "Via Oral",
        quantity: "01 Caixa",
        dosage: "Administrar 1 comprimido a cada 12 horas por 14 dias seguidos; após esse período, reduzir para 1 comprimido a cada 24 horas de manutenção.",
        schedule: "08:00h e 20:00h (depois apenas 08:00h)"
      },
      {
        name: "Shampoo Clorexidina 3% + Ceramidas e Fitoesfingosina",
        presentation: "Frasco com 250 mL",
        route: "Via Tópica",
        quantity: "01 Frasco",
        dosage: "Banhos terapêuticos 2 vezes por semana com água morna. Deixar a espuma agir em contato com a pele por 10 a 15 minutos antes do enxágue completo.",
        schedule: "Quartas e Sábados"
      },
      {
        name: "Ômega 3 Vet (EPA 300mg + DHA 200mg)",
        presentation: "Frasco com 30 cápsulas gelatinosas",
        route: "Via Oral",
        quantity: "01 Frasco",
        dosage: "Administrar 1 cápsula por via oral uma vez ao dia misturada à comida para reforço da barreira lipídica epidérmica.",
        schedule: "Junto ao jantar"
      }
    ],
    instructions: "• Evitar alimentos ultraprocessados ou fontes alérgenas não recomendadas.\n• Manter o ambiente limpo sem acúmulo de poeira e ácaros.\n• Retorno clínico para avaliação da curva de coceira e integridade cutânea em 21 dias."
  },

  {
    id: "proto-otite-mista",
    title: "Otologia: Otite Externa Bacteriana e Fúngica",
    subtitle: "Higienização Auricular + Suspensão Otológica Tríplice Ação",
    targetSpecies: "Canina e Felina",
    badge: "Otologia",
    badgeColor: "#ec4899",
    recommendedTemplateId: "modelo-simples-magistral",
    medications: [
      {
        name: "Solução Ceruminolítica e Higienizante Otológica (com Clorexidina)",
        presentation: "Frasco com 100 mL com bico flexível",
        route: "Via Otológica",
        quantity: "01 Frasco",
        dosage: "Aplicar quantidade suficiente no conduto auditivo afetado, massagear a base por 30 segundos e secar com algodão seco 15 min antes da medicação.",
        schedule: "Antes das gotas medicamentosas"
      },
      {
        name: "Otodem Plus / Posatex Suspensão Otológica",
        presentation: "Frasco com 20 mL com cânula anatômica",
        route: "Via Otológica",
        quantity: "01 Frasco",
        dosage: "Pingar 5 a 6 gotas no conduto auditivo limpo a cada 12 horas durante 10 dias seguidos.",
        schedule: "08:00h e 20:00h"
      }
    ],
    instructions: "• Não usar hastes flexíveis (cotonetes) profundamente dentro do ouvido do animal.\n• Proteger os ouvidos durante os banhos com algodão hidrófobo para não entrar água.\n• Retorno para otoscopia de controle ao término dos 10 dias com a Dra. Nilcéia."
  },

  {
    id: "proto-dor-osteoartrite",
    title: "Ortopedia / Geriatria: Dor Crônica & Osteoartrite",
    subtitle: "Gabapentina + AINE de Resgate + Condroprotetor Articular",
    targetSpecies: "Cães e Gatos Idosos",
    badge: "Dor Crônica",
    badgeColor: "#059669",
    recommendedTemplateId: "modelo-controle-especial-c1",
    medications: [
      {
        name: "Gabapentina Veterinária 50 mg/mL ou cápsulas 100 mg",
        presentation: "Frasco com 60 mL ou cápsulas palatáveis",
        route: "Via Oral",
        quantity: "01 Frasco",
        dosage: "Administrar a dose recomendada a cada 12 horas para controle contínuo da dor neuropática e central da artrose.",
        schedule: "08:00h e 20:00h"
      },
      {
        name: "Condroton Plus / Cosequin (Condroitina + Glucosamina + Colágeno II)",
        presentation: "Pote com 60 tabletes mastigáveis",
        route: "Via Oral",
        quantity: "01 Pote",
        dosage: "Administrar 1 tablete uma vez ao dia continuamente para proteção da cartilagem e lubrificação articular.",
        schedule: "Pela manhã"
      }
    ],
    instructions: "• Proporcionar piso antiderrapante em casa (tapetes de borracha) para evitar escorregões.\n• Manter o pet em peso corporal magro para não sobrecarregar as articulações.\n• Caminhadas curtas, regulares e em terreno plano são recomendadas."
  }
];
