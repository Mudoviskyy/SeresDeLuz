import React, { useState, useMemo, useEffect } from 'react';
import { 
  Printer, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  User, 
  PawPrint, 
  Pill, 
  Eye, 
  Copy, 
  ShieldAlert, 
  Layers, 
  Sliders, 
  Sparkles, 
  Info, 
  Check, 
  Search, 
  Calculator, 
  Save, 
  BookOpen, 
  AlertTriangle, 
  X, 
  Clock, 
  Zap, 
  RotateCcw, 
  FileEdit, 
  Eraser, 
  Database, 
  ArrowLeft
} from 'lucide-react';
import { VET_DATA, PRESCRIPTION_TEMPLATES } from '../data/prescriptionTemplates';
import { VETSMART_DRUG_DATABASE, VETSMART_CLINICAL_PROTOCOLS } from '../data/vetsmartDatabase';

export default function PrescriptionDashboard({ setCurrentView, currentUser }) {
  // Current active template
  const [activeTemplateId, setActiveTemplateId] = useState(PRESCRIPTION_TEMPLATES[0].id);
  const activeTemplate = PRESCRIPTION_TEMPLATES.find(t => t.id === activeTemplateId) || PRESCRIPTION_TEMPLATES[0];

  // Mode: 'filled' (Modelo Preenchido de Exemplo) or 'blank' (Modelo em Branco / Limpo)
  const [templateMode, setTemplateMode] = useState('filled');

  // Blank template initial factory
  const createBlankData = (baseTemplate) => ({
    ...baseTemplate,
    emissionDate: new Date().toLocaleDateString('pt-BR'),
    showWatermark: true,
    watermarkOpacity: baseTemplate.isYellowNotification ? 0.04 : (baseTemplate.isBlueNotification ? 0.05 : 0.06),
    stampVisible: true,
    selectedVia: 'via1',
    patient: {
      name: "",
      species: "Canina",
      breed: "",
      age: "",
      sex: "Macho",
      weight: "",
      color: "",
      microchip: ""
    },
    tutor: {
      name: "",
      cpf: "",
      rg: "",
      phone: "",
      address: "",
      neighborhood: "",
      city: "Lages",
      uf: "SC",
      cep: ""
    },
    medications: [
      {
        id: Date.now(),
        name: "",
        presentation: "",
        route: "Via Oral",
        quantity: "",
        dosage: "",
        schedule: ""
      }
    ],
    instructions: ""
  });

  // Dynamic editable form state
  const [prescriptionData, setPrescriptionData] = useState(() => ({
    ...activeTemplate,
    emissionDate: new Date().toLocaleDateString('pt-BR'),
    showWatermark: true,
    watermarkOpacity: 0.06,
    stampVisible: true,
    selectedVia: 'via1' // 'via1', 'via2', 'both'
  }));

  // Toast / notification feedback
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  // Bulário search & filter state (VetSmart feature)
  const [bularioSearch, setBularioSearch] = useState('');
  const [bularioCategory, setBularioCategory] = useState('all');
  const [showBularioModal, setShowBularioModal] = useState(false);

  // Dose calculator state (VetSmart feature)
  const [calcTargetMedId, setCalcTargetMedId] = useState(null);
  const [calcDoseMgKg, setCalcDoseMgKg] = useState('10');
  const [calcConcentration, setCalcConcentration] = useState('50');

  // SQLite Saved Prescriptions History Modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [savedPrescriptions, setSavedPrescriptions] = useState([]);

  // Trigger notice helper
  const showNotice = (msg) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  // Fetch prescriptions history from SQLite
  const fetchPrescriptionsHistory = async () => {
    try {
      const res = await fetch('/api/prescriptions');
      const data = await res.json();
      if (data.success && data.prescriptions) {
        setSavedPrescriptions(data.prescriptions);
      }
    } catch {
      // Ignore in offline mode
    }
  };

  useEffect(() => {
    fetchPrescriptionsHistory();
  }, []);

  // Switch between Filled (Preenchido) and Blank (Em Branco) modes
  const handleToggleMode = (newMode) => {
    setTemplateMode(newMode);
    if (newMode === 'blank') {
      setPrescriptionData(createBlankData(activeTemplate));
      showNotice('Modelo em Branco ativado: pronto para preencher do zero ou imprimir em branco!');
    } else {
      setPrescriptionData({
        ...activeTemplate,
        emissionDate: new Date().toLocaleDateString('pt-BR'),
        showWatermark: true,
        watermarkOpacity: activeTemplate.isYellowNotification ? 0.04 : (activeTemplate.isBlueNotification ? 0.05 : 0.06),
        stampVisible: true,
        selectedVia: 'via1'
      });
      showNotice('Modelo Preenchido ativado: exemplo clínico carregado com sucesso!');
    }
  };

  // Clear current form fields (Reset to blank)
  const handleClearForm = () => {
    setTemplateMode('blank');
    setPrescriptionData(createBlankData(activeTemplate));
    showNotice('Formulário limpo com sucesso!');
  };

  // Switch template
  const handleSelectTemplate = (template) => {
    setActiveTemplateId(template.id);
    if (templateMode === 'blank') {
      setPrescriptionData(createBlankData(template));
      showNotice(`Modelo em branco: ${template.name}`);
    } else {
      setPrescriptionData({
        ...template,
        emissionDate: new Date().toLocaleDateString('pt-BR'),
        showWatermark: true,
        watermarkOpacity: template.isYellowNotification ? 0.04 : (template.isBlueNotification ? 0.05 : 0.06),
        stampVisible: true,
        selectedVia: 'via1'
      });
      showNotice(`Modelo preenchido: ${template.name}`);
    }
  };

  // Add blank medication
  const handleAddMedication = () => {
    const newMed = {
      id: Date.now(),
      name: "",
      presentation: "",
      route: "Via Oral",
      quantity: "",
      dosage: "",
      schedule: ""
    };
    setPrescriptionData(prev => ({
      ...prev,
      medications: [...prev.medications, newMed]
    }));
  };

  // Insert medication from VetSmart Bulário
  const handleInsertFromBulario = (drug) => {
    const weightNum = parseFloat(prescriptionData.patient.weight) || 10;
    const doseTotalMg = (weightNum * drug.defaultDoseMgKg).toFixed(1);
    
    let calculatedUnits = '';
    if (drug.concentration > 0) {
      const units = (doseTotalMg / drug.concentration).toFixed(1);
      calculatedUnits = ` (aprox. ${units} ${drug.unit})`;
    }

    const calculatedDosage = `Administrar ${doseTotalMg} mg${calculatedUnits} por ${drug.route.toLowerCase()} ${drug.defaultFrequency} ${drug.defaultDuration}. ${drug.instructions}`;

    const newMed = {
      id: Date.now(),
      name: drug.name,
      activeIngredient: drug.activeIngredient,
      presentation: drug.presentation,
      route: drug.route,
      quantity: "01 Unidade",
      dosage: calculatedDosage,
      schedule: drug.defaultFrequency,
      legalClassification: drug.rdcClassification
    };

    // If there is only 1 blank medication in list, replace it instead of appending
    const isFirstEmpty = prescriptionData.medications.length === 1 && !prescriptionData.medications[0].name;

    setPrescriptionData(prev => ({
      ...prev,
      medications: isFirstEmpty ? [newMed] : [...prev.medications, newMed]
    }));

    // Check if the drug requires a specific regulatory template under RDC 1000/2025
    if (drug.rdcClassification && drug.rdcClassification !== activeTemplate.type) {
      const matchingTmpl = PRESCRIPTION_TEMPLATES.find(t => t.type === drug.rdcClassification);
      if (matchingTmpl) {
        showNotice(`⚠️ Atenção: ${drug.name} requer ${matchingTmpl.name} (RDC 1.000/2025).`);
      } else {
        showNotice(`Medicamento adicionado: ${drug.name}`);
      }
    } else {
      showNotice(`Medicamento adicionado com dose calculada para ${weightNum}kg!`);
    }

    setShowBularioModal(false);
  };

  // Load VetSmart Clinical Protocol (1-Click)
  const handleApplyProtocol = (proto) => {
    const recommendedTmpl = PRESCRIPTION_TEMPLATES.find(t => t.id === proto.recommendedTemplateId) || activeTemplate;
    
    setActiveTemplateId(recommendedTmpl.id);
    setTemplateMode('filled');
    setPrescriptionData(prev => ({
      ...recommendedTmpl,
      patient: prev.patient.name ? prev.patient : recommendedTmpl.patient,
      tutor: prev.tutor.name ? prev.tutor : recommendedTmpl.tutor,
      emissionDate: prev.emissionDate,
      showWatermark: prev.showWatermark,
      watermarkOpacity: prev.watermarkOpacity,
      stampVisible: prev.stampVisible,
      selectedVia: recommendedTmpl.copiesCount === 2 ? 'via1' : 'via1',
      medications: proto.medications.map((m, idx) => ({
        ...m,
        id: Date.now() + idx
      })),
      instructions: proto.instructions
    }));

    showNotice(`Protocolo VetSmart "${proto.title}" aplicado!`);
  };

  // Update medication
  const handleUpdateMed = (id, field, value) => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: prev.medications.map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  // Remove medication
  const handleRemoveMed = (id) => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m.id !== id)
    }));
  };

  // Calculate and apply dose using interactive calculator
  const handleApplyCalculatedDose = () => {
    if (!calcTargetMedId) return;
    const weightNum = parseFloat(prescriptionData.patient.weight) || 10;
    const doseMgKgNum = parseFloat(calcDoseMgKg) || 1;
    const concentrationNum = parseFloat(calcConcentration) || 50;

    const totalMg = (weightNum * doseMgKgNum).toFixed(1);
    const volumeOrPills = (totalMg / concentrationNum).toFixed(2);

    const generatedDosage = `Administrar ${totalMg} mg (aprox. ${volumeOrPills} comp/mL) por via oral a cada 12 horas conforme prescrição da Dra. Nilcéia Silva.`;

    handleUpdateMed(calcTargetMedId, 'dosage', generatedDosage);
    setCalcTargetMedId(null);
    showNotice(`Dose calculada (${totalMg} mg) inserida na posologia!`);
  };

  // Save to SQLite Database + LocalStorage
  const handleSavePrescription = async () => {
    try {
      const payload = {
        id: `rx_${Date.now()}`,
        templateId: activeTemplateId,
        patient: prescriptionData.patient,
        tutor: prescriptionData.tutor,
        medications: prescriptionData.medications,
        instructions: prescriptionData.instructions,
        emissionDate: prescriptionData.emissionDate,
        prescriptionData
      };

      // Save to SQLite
      await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Also save to LocalStorage
      localStorage.setItem('seres_de_luz_prescription_draft', JSON.stringify({
        data: prescriptionData,
        mode: templateMode,
        activeTemplateId
      }));

      fetchPrescriptionsHistory();
      showNotice('Receita salva no banco SQLite local com sucesso!');
    } catch {
      showNotice('Salvo localmente no navegador.');
    }
  };

  // Load from LocalStorage (Draft)
  const handleLoadDraft = () => {
    try {
      const saved = localStorage.getItem('seres_de_luz_prescription_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) {
          setPrescriptionData(parsed.data);
          setTemplateMode(parsed.mode || 'filled');
          setActiveTemplateId(parsed.activeTemplateId || parsed.data.id);
        } else {
          setPrescriptionData(parsed);
        }
        showNotice('Rascunho recuperado com sucesso!');
      } else {
        showNotice('Nenhum rascunho salvo encontrado.');
      }
    } catch {
      showNotice('Erro ao carregar rascunho.');
    }
  };

  // Load saved prescription from SQLite history
  const handleLoadFromHistory = (item) => {
    try {
      const parsed = JSON.parse(item.prescription_data);
      if (parsed.prescriptionData) {
        setPrescriptionData(parsed.prescriptionData);
      } else {
        setPrescriptionData(prev => ({
          ...prev,
          patient: parsed.patient || prev.patient,
          tutor: parsed.tutor || prev.tutor,
          medications: parsed.medications || prev.medications,
          instructions: parsed.instructions || prev.instructions
        }));
      }
      setShowHistoryModal(false);
      showNotice(`Receita de ${item.patient_name} carregada do SQLite!`);
    } catch (e) {
      console.error(e);
      showNotice('Erro ao abrir receita do histórico.');
    }
  };

  // Print action
  const handlePrint = () => {
    window.print();
  };

  // Copy prescription text for WhatsApp
  const handleCopyText = () => {
    const text = `🐾 *RECEITUÁRIO MÉDICO VETERINÁRIO*
*Dra. Nilcéia Silva - CRMV-SC 16442*
Rua Nilo Peçanha, 492 - Bairro Coral, Lages - SC (CEP 88508-500)
WhatsApp: ${VET_DATA.whatsapp}
----------------------------------------
*Documento:* ${prescriptionData.legalCategory}
*Paciente:* ${prescriptionData.patient.name || 'Nome do Pet'} (${prescriptionData.patient.species} - ${prescriptionData.patient.breed || 'SRD'}, ${prescriptionData.patient.weight || '0'}kg)
*Tutor:* ${prescriptionData.tutor.name || 'Nome do Tutor'} (Tel: ${prescriptionData.tutor.phone || ''})
*Data de Emissão:* ${prescriptionData.emissionDate}
----------------------------------------
*PRESCRIÇÃO & POSOLOGIA:*
${prescriptionData.medications.filter(m => m.name).map((m, idx) => `${idx + 1}. *${m.name}*
   Forma: ${m.presentation} | Qtd: ${m.quantity} | Via: ${m.route}
   Posologia: ${m.dosage}`).join('\n\n')}

*Orientações ao Tutor:*
${prescriptionData.instructions || 'Seguir orientações repassadas em consulta.'}
----------------------------------------
*${prescriptionData.validityText}*`;

    navigator.clipboard.writeText(text);
    showNotice('Texto copiado! Cole diretamente no WhatsApp do tutor.');
  };

  // Filtered bulário list
  const filteredBulario = useMemo(() => {
    return VETSMART_DRUG_DATABASE.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(bularioSearch.toLowerCase()) ||
                            item.activeIngredient.toLowerCase().includes(bularioSearch.toLowerCase()) ||
                            item.category.toLowerCase().includes(bularioSearch.toLowerCase());
      const matchesCat = bularioCategory === 'all' || item.rdcClassification === bularioCategory;
      return matchesSearch && matchesCat;
    });
  }, [bularioSearch, bularioCategory]);

  // Helper to render single prescription sheet (Full A4 optimized, compact typography, 1-line regulatory bar)
  const renderPrescriptionSheet = (viaLabel, viaTypeSubtitle) => {
    const hasValidMedications = prescriptionData.medications.some(m => m.name && m.name.trim() !== "");

    return (
      <div 
        className="prescription-sheet printable-prescription"
        style={{
          background: prescriptionData.paperBg || '#ffffff',
          border: prescriptionData.isYellowNotification ? '1.5px solid #f59e0b' : (prescriptionData.isBlueNotification ? '1.5px solid #0284c7' : '1px solid #d3e2e2'),
          borderRadius: '4px',
          boxShadow: '0 8px 30px rgba(15, 29, 36, 0.12)',
          padding: '16px 20px',
          minHeight: '820px',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'var(--font-sans)',
          color: '#1a202c',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginBottom: prescriptionData.selectedVia === 'both' ? '30px' : '0',
          boxSizing: 'border-box'
        }}
      >
        {/* Subtle Elegant Watermark (Marca d'água no fundo) */}
        {prescriptionData.showWatermark && (
          <div 
            className="watermark-overlay"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-25deg)',
              pointerEvents: 'none',
              zIndex: 0,
              opacity: prescriptionData.watermarkOpacity,
              textAlign: 'center',
              userSelect: 'none',
              width: '380px'
            }}
          >
            <svg viewBox="0 0 100 100" width="180" height="180" style={{ margin: '0 auto', display: 'block', fill: '#0ABAB5' }}>
              <path d="M50 5 C55 20, 80 25, 80 50 C80 75, 50 95, 50 95 C50 95, 20 75, 20 50 C20 25, 45 20, 50 5 Z" fillOpacity="0.25" />
              <rect x="42" y="30" width="16" height="40" rx="3" fill="#0ABAB5" />
              <rect x="30" y="42" width="40" height="16" rx="3" fill="#0ABAB5" />
              <circle cx="36" cy="24" r="5" fill="#0ABAB5" />
              <circle cx="64" cy="24" r="5" fill="#0ABAB5" />
              <circle cx="48" cy="18" r="5" fill="#0ABAB5" />
            </svg>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.9rem',
              fontWeight: 800,
              color: '#0ABAB5',
              letterSpacing: '2px',
              marginTop: '4px'
            }}>
              DRA. NILCÉIA SILVA
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
              MÉDICA VETERINÁRIA • CRMV-SC 16442
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Lages - SC • (49) 99955-5421
            </div>
          </div>
        )}

        {/* TOP SECTION: CABEÇALHO COMPACTO + REGULATÓRIO 1 LINHA + PACIENTE/TUTOR */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          
          {/* 1. CABEÇALHO COMPACTO DA MÉDICA (REDUZIDO DE TAMANHO CONFORME SOLICITADO) */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1.5px solid var(--tiffany-500)',
            paddingBottom: '6px',
            marginBottom: '6px'
          }}>
            {/* Logo compacta e identificação da médica */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #0ABAB5 0%, #07807d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 2px 6px rgba(10, 186, 181, 0.3)'
              }}>
                <PawPrint size={16} fill="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.02rem', color: 'var(--slate-900)', fontWeight: 800, letterSpacing: '-0.2px', margin: 0, lineHeight: 1.1 }}>
                  {VET_DATA.name}
                </h2>
                <p style={{ fontSize: '0.66rem', color: '#089b97', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  {VET_DATA.crmv} • Medicina Veterinária de Cães e Gatos
                </p>
              </div>
            </div>

            {/* Endereço e Contato em Lages - SC */}
            <div style={{ textAlign: 'right', fontSize: '0.68rem', color: '#334155', lineHeight: 1.25 }}>
              <div>{VET_DATA.address} - Bairro {VET_DATA.neighborhood} • {VET_DATA.city} - {VET_DATA.state}</div>
              <div style={{ fontWeight: 700, color: 'var(--tiffany-700)' }}>WhatsApp: {VET_DATA.phone}</div>
            </div>
          </div>

          {/* 2. REGULATÓRIO SLIM EM UMA ÚNICA LINHA (CONFORME SOLICITADO) */}
          <div style={{
            background: prescriptionData.isYellowNotification ? '#fef08a' : (prescriptionData.isBlueNotification ? '#bae6fd' : '#effbfb'),
            border: `1px solid ${prescriptionData.accentColor}`,
            borderRadius: '4px',
            padding: '3px 8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontSize: '0.68rem',
            lineHeight: 1.2
          }}>
            <span style={{
              fontWeight: 800,
              color: prescriptionData.isYellowNotification ? '#78350f' : (prescriptionData.isBlueNotification ? '#075985' : 'var(--slate-900)')
            }}>
              {prescriptionData.docHeaderType}
            </span>

            <span style={{
              fontWeight: 600,
              color: prescriptionData.isYellowNotification ? '#92400e' : (prescriptionData.isBlueNotification ? '#0369a1' : 'var(--tiffany-800)'),
              fontSize: '0.64rem'
            }}>
              {viaTypeSubtitle || prescriptionData.docSubtitle}
            </span>

            {prescriptionData.prescriptionNumber && (
              <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#dc2626' }}>
                Nº: {prescriptionData.prescriptionNumber}
              </span>
            )}
          </div>

          {/* 3. DADOS DO PACIENTE E DO TUTOR (COMPACTO) */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #d8e8e7',
            borderRadius: '4px',
            padding: '5px 8px',
            marginBottom: '8px',
            fontSize: '0.68rem',
            lineHeight: 1.35
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', borderBottom: '1px dashed #dceeed', paddingBottom: '4px', marginBottom: '4px' }}>
              <div>
                <strong>Paciente:</strong> {prescriptionData.patient.name || '_________________________'} &nbsp;•&nbsp; 
                <strong>Espécie:</strong> {prescriptionData.patient.species || 'Canina / Felina'} &nbsp;•&nbsp; 
                <strong>Raça:</strong> {prescriptionData.patient.breed || '____________________'}
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>Idade:</strong> {prescriptionData.patient.age || '_______'} &nbsp;•&nbsp; 
                <strong>Sexo:</strong> {prescriptionData.patient.sex || '_______'} &nbsp;•&nbsp; 
                <strong>Peso:</strong> <span style={{ color: '#089b97', fontWeight: 800 }}>{prescriptionData.patient.weight ? `${prescriptionData.patient.weight} kg` : '_______ kg'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4px' }}>
              <div>
                <strong>Tutor(a):</strong> {prescriptionData.tutor.name || '________________________________________________'}
                <span> (CPF: {prescriptionData.tutor.cpf || '________________________'})</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>Telefone:</strong> {prescriptionData.tutor.phone || '____________________'}
              </div>
            </div>

            {prescriptionData.requiresBuyerData && (
              <div style={{ marginTop: '2px', fontSize: '0.64rem', color: '#475569' }}>
                <strong>Endereço do Tutor:</strong> {prescriptionData.tutor.address || '__________________________________________________________________'}
              </div>
            )}
          </div>

          {/* 4. PRESCRIÇÃO E POSOLOGIA (CORE MEDICAL SECTION - TIPOGRAFIA COMPACTA) */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: 'var(--slate-800)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              marginBottom: '6px'
            }}>
              Uso Veterinário Orientado
            </div>

            {!hasValidMedications ? (
              // Linhas em branco para preenchimento manual ou receita limpa
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '6px 0' }}>
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} style={{ fontSize: '0.74rem', lineHeight: 1.5, borderBottom: '1px dotted #cbd5e1', paddingBottom: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>{num}. __________________________________________________</span>
                      <span style={{ color: '#089b97', fontWeight: 600 }}>[ Qtd: _________ ]</span>
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.66rem', marginLeft: '12px', marginTop: '2px' }}>
                      Via: ___________________ • Horários: ___________________
                    </div>
                    <div style={{ color: '#334155', fontSize: '0.70rem', marginLeft: '12px', marginTop: '2px' }}>
                      Posologia: _____________________________________________________________________________
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {prescriptionData.medications.filter(item => item.name).map((item, idx) => (
                  <div key={item.id} style={{ fontSize: '0.74rem', lineHeight: 1.35 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>
                        {idx + 1}. {item.name}
                      </span>
                      <span style={{ fontWeight: 700, color: '#089b97', fontSize: '0.70rem' }}>
                        [ {item.quantity || '01 Unidade'} ]
                      </span>
                    </div>

                    <div style={{ color: '#475569', fontSize: '0.65rem', marginLeft: '10px' }}>
                      <em>{item.presentation} • Via: <strong>{item.route}</strong></em>
                    </div>

                    <div style={{
                      background: '#f8fbfb',
                      padding: '3px 8px',
                      borderRadius: '3px',
                      borderLeft: '2.5px solid var(--tiffany-500)',
                      marginLeft: '10px',
                      marginTop: '2px',
                      color: '#1e293b',
                      fontSize: '0.68rem'
                    }}>
                      <strong>Posologia:</strong> {item.dosage || 'Conforme orientação médica.'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. ORIENTAÇÕES / CUIDADOS GERAIS */}
          <div style={{
            background: '#fafcfc',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            padding: '5px 8px',
            fontSize: '0.66rem',
            color: '#334155',
            marginBottom: '6px'
          }}>
            <strong style={{ color: 'var(--slate-800)', display: 'block', marginBottom: '1px' }}>
              Recomendações Clínicas ao Tutor:
            </strong>
            <div style={{ whiteSpace: 'pre-line', lineHeight: 1.3 }}>
              {prescriptionData.instructions || '• Seguir rigorosamente os horários e doses prescritos.\n• Manter água fresca e alimentação balanceada.\n• Dúvidas: contatar Dra. Nilcéia Silva pelo WhatsApp (49) 99955-5421.'}
            </div>
          </div>

          {/* 6. TERMO DE RESPONSABILIDADE ESPECÍFICO (RETINOIDES SISTÊMICOS) */}
          {prescriptionData.requiresResponsibilityTerm && (
            <div style={{
              border: '1px solid #0f766e',
              borderRadius: '4px',
              padding: '5px 8px',
              background: '#f0fdfa',
              marginBottom: '6px',
              fontSize: '0.64rem'
            }}>
              <div style={{ fontWeight: 800, color: '#134e4a', textTransform: 'uppercase', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldAlert size={12} color="#0f766e" />
                Termo de Responsabilidade e Esclarecimento Específico (RDC Anvisa nº 1.000/2025)
              </div>
              <div style={{ color: '#0f766e', lineHeight: 1.25 }}>
                {prescriptionData.responsibilityTermText || 'Declaro ter sido orientado(a) pela Dra. Nilcéia Silva (CRMV-SC 16442) quanto aos riscos de teratogenia e cuidados com o retinoide prescrito.'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '6px', paddingTop: '4px' }}>
                <div style={{ textAlign: 'center', borderTop: '1px solid #0f766e', paddingTop: '2px' }}>
                  <span style={{ fontSize: '0.60rem', color: '#134e4a', fontWeight: 700 }}>Assinatura do(a) Tutor(a)</span>
                </div>
                <div style={{ textAlign: 'center', borderTop: '1px solid #0f766e', paddingTop: '2px' }}>
                  <span style={{ fontSize: '0.60rem', color: '#134e4a', fontWeight: 700 }}>Dra. Nilcéia Silva • CRMV-SC 16442</span>
                </div>
              </div>
            </div>
          )}

          {/* 7. CAMPOS DE DISPENSAÇÃO FARMACÊUTICA */}
          {prescriptionData.requiresPharmacyFields && (
            <div style={{
              border: '1px dashed #94a3b8',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '0.62rem',
              color: '#475569',
              marginBottom: '6px',
              background: '#fafafa'
            }}>
              <div style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px', color: '#1e293b' }}>
                Identificação do Fornecedor / Farmácia (Dispensação)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '6px' }}>
                <div>Razão Social: ____________________________</div>
                <div>Farmacêutico (CRF): ____________________</div>
                <div>Data: ___/___/2026</div>
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM SECTION: DATA, VALIDADE & CARIMBO/ASSINATURA (PARÁGRAFO LONGO REMOVIDO CONFORME SOLICITADO) */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '4px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {/* Data e Validade Legal */}
            <div style={{ fontSize: '0.68rem', color: '#475569' }}>
              <div>Lages - SC, <strong>{prescriptionData.emissionDate}</strong>.</div>
              <div style={{ color: '#089b97', fontWeight: 700, marginTop: '1px' }}>
                {prescriptionData.validityText}
              </div>
            </div>

            {/* Linha de Assinatura e Carimbo Virtual */}
            <div style={{ textAlign: 'center', width: '190px' }}>
              {prescriptionData.stampVisible && (
                <div style={{
                  border: '1.5px solid #089b97',
                  borderRadius: '4px',
                  padding: '3px 6px',
                  marginBottom: '3px',
                  background: 'rgba(10, 186, 181, 0.05)',
                  transform: 'rotate(-1.5deg)'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0f172a' }}>
                    {VET_DATA.name}
                  </div>
                  <div style={{ fontSize: '0.64rem', fontWeight: 700, color: '#089b97' }}>
                    {VET_DATA.crmv}
                  </div>
                  <div style={{ fontSize: '0.55rem', color: '#64748b' }}>
                    Médica Veterinária • Cães e Gatos
                  </div>
                </div>
              )}
              <div style={{ borderTop: '1px solid #0f172a', width: '100%', margin: '3px 0' }} />
              <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#0f172a' }}>
                Assinatura da Médica Veterinária
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div style={{ background: '#f4faf9', minHeight: 'calc(100vh - 120px)', padding: '20px 0' }}>
      <div className="container">
        
        {/* Dynamic Toast Feedback Notification */}
        {feedbackNotice && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--slate-900)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            animation: 'fadeIn 0.2s ease-in'
          }}>
            <Sparkles size={16} color="var(--tiffany-400)" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        {/* ========================================================
            TOP CONTROL BAR: RDC 1.000/2025, MODE SWITCHER & VETSMART
           ======================================================== */}
        <div className="no-print" style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 22px',
          marginBottom: '18px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setCurrentView('landing')}
                  className="btn btn-secondary"
                  style={{ padding: '3px 8px', fontSize: '0.74rem', height: '26px' }}
                >
                  <ArrowLeft size={12} /> Voltar ao Site
                </button>
                <span className="badge-pill badge-tiffany" style={{ fontSize: '0.74rem', padding: '2px 8px' }}>
                  <ShieldAlert size={12} /> RDC Anvisa nº 1.000/2025
                </span>
                <span style={{ fontSize: '0.74rem', background: '#f0fdf4', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Database size={11} /> Conectado ao SQLite Local
                </span>
              </div>
              <h1 style={{ fontSize: '1.4rem', marginTop: '6px', color: 'var(--slate-900)' }}>
                Emissão de Receituário Veterinário Especializado
              </h1>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.84rem', marginTop: '2px' }}>
                Dra. Nilcéia Silva (CRMV-SC 16442) • Layout A4 completo, cálculo de dose mg/kg e banco SQLite.
              </p>
            </div>

            {/* Quick Actions (Print, WhatsApp, Drafts, Bulário, History) */}
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button 
                onClick={() => setShowBularioModal(true)} 
                className="btn" 
                style={{
                  background: 'var(--tiffany-600)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  padding: '7px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title="Abrir Bulário de Medicamentos Veterinários estilo VetSmart"
              >
                <Search size={14} />
                <span>Bulário VetSmart</span>
              </button>

              <button 
                onClick={handleSavePrescription} 
                className="btn btn-secondary" 
                style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                title="Salvar receita no banco SQLite local"
              >
                <Save size={14} />
                <span>Salvar no SQLite</span>
              </button>

              <button 
                onClick={() => { fetchPrescriptionsHistory(); setShowHistoryModal(true); }} 
                className="btn btn-secondary" 
                style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                title="Ver receitas salvas no histórico"
              >
                <Database size={14} />
                <span>Histórico ({savedPrescriptions.length})</span>
              </button>

              <button 
                onClick={handleCopyText} 
                className="btn btn-secondary" 
                style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                title="Copiar texto formatado para enviar no WhatsApp do tutor"
              >
                <Copy size={14} />
                <span>WhatsApp</span>
              </button>

              <button 
                onClick={handlePrint} 
                className="btn btn-primary" 
                style={{ fontSize: '0.86rem', padding: '8px 16px' }}
              >
                <Printer size={15} />
                <span>Imprimir / Salvar PDF (A4)</span>
              </button>
            </div>
          </div>

          {/* MODE SELECTOR: MODELO PREENCHIDO VS. MODELO EM BRANCO */}
          <div style={{
            marginTop: '14px',
            padding: '10px 14px',
            background: 'linear-gradient(90deg, #f0fbfb 0%, #ffffff 100%)',
            border: '1.5px solid var(--tiffany-300)',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.80rem', fontWeight: 800, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FileEdit size={15} color="var(--tiffany-600)" />
                Formato da Receita:
              </span>

              <div style={{ display: 'flex', background: '#dcefed', borderRadius: '6px', padding: '2px', gap: '2px' }}>
                <button
                  type="button"
                  onClick={() => handleToggleMode('filled')}
                  style={{
                    background: templateMode === 'filled' ? 'var(--tiffany-600)' : 'transparent',
                    color: templateMode === 'filled' ? '#ffffff' : 'var(--tiffany-950)',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <FileText size={13} />
                  <span>Modelo Preenchido (Exemplo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleMode('blank')}
                  style={{
                    background: templateMode === 'blank' ? 'var(--tiffany-600)' : 'transparent',
                    color: templateMode === 'blank' ? '#ffffff' : 'var(--tiffany-950)',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sparkles size={13} />
                  <span>Modelo em Branco (Limpo / Novo)</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearForm}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '5px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                color: 'var(--slate-700)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Limpar todos os campos para iniciar receita do zero"
            >
              <Eraser size={12} color="#dc2626" />
              <span>Limpar Todos os Campos</span>
            </button>
          </div>

          {/* VETSMART CLINICAL PROTOCOLS QUICK-BAR */}
          <div style={{
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px dashed var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BookOpen size={13} color="var(--tiffany-600)" />
              Protocolos VetSmart Prontos:
            </span>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {VETSMART_CLINICAL_PROTOCOLS.map((proto) => (
                <button
                  key={proto.id}
                  type="button"
                  onClick={() => handleApplyProtocol(proto)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--tiffany-200)',
                    borderRadius: '5px',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    color: 'var(--slate-800)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--tiffany-500)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--tiffany-200)'}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: proto.badgeColor }} />
                  <strong>{proto.badge}:</strong> {proto.title.split(':')[1] || proto.title}
                </button>
              ))}
            </div>
          </div>

          {/* Regulatory Templates Selector Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '8px',
            marginTop: '12px'
          }}>
            {PRESCRIPTION_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === activeTemplateId;
              let badgeColor = '#0ABAB5';
              let badgeBg = '#e6f8f7';
              if (tmpl.isYellowNotification) {
                badgeColor = '#b45309';
                badgeBg = '#fef3c7';
              } else if (tmpl.isBlueNotification) {
                badgeColor = '#0369a1';
                badgeBg = '#e0f2fe';
              } else if (tmpl.requiresResponsibilityTerm) {
                badgeColor = '#0f766e';
                badgeBg = '#ccfbf1';
              }

              return (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? `2px solid ${tmpl.accentColor || 'var(--tiffany-500)'}` : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--tiffany-50)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 10px rgba(10, 186, 181, 0.15)' : 'none',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      color: badgeColor,
                      background: badgeBg,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {tmpl.badge}
                    </span>
                    {isSelected && <CheckCircle2 size={15} color={tmpl.accentColor || "var(--tiffany-600)"} />}
                  </div>

                  <h4 style={{ fontSize: '0.84rem', marginTop: '5px', color: 'var(--slate-900)' }}>
                    {tmpl.name}
                  </h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--slate-600)', marginTop: '2px', lineHeight: 1.3 }}>
                    {tmpl.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            SPLIT SCREEN CONTAINER (LEFT: EDITOR, RIGHT: LIVE A4)
           ======================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.05fr',
          gap: '20px',
          alignItems: 'start'
        }} className="split-view-container">

          {/* ========================================================
              LEFT COLUMN: DYNAMIC FORM EDITOR (NO-PRINT)
             ======================================================== */}
          <div className="no-print dashboard-editor" style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} color="var(--tiffany-600)" />
                <h3 style={{ fontSize: '1.05rem' }}>Personalizar Receita em Tempo Real</h3>
              </div>

              {/* Watermark and Stamp Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.76rem', color: 'var(--slate-600)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={prescriptionData.showWatermark}
                    onChange={(e) => setPrescriptionData({ ...prescriptionData, showWatermark: e.target.checked })}
                    style={{ accentColor: 'var(--tiffany-500)' }}
                  />
                  Marca d'água
                </label>

                {prescriptionData.showWatermark && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Sliders size={11} color="var(--slate-400)" />
                    <input 
                      type="range" 
                      min="0.02" 
                      max="0.20" 
                      step="0.01" 
                      value={prescriptionData.watermarkOpacity}
                      onChange={(e) => setPrescriptionData({ ...prescriptionData, watermarkOpacity: parseFloat(e.target.value) })}
                      style={{ width: '50px', accentColor: 'var(--tiffany-500)' }}
                      title="Intensidade da marca d'água"
                    />
                  </div>
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={prescriptionData.stampVisible}
                    onChange={(e) => setPrescriptionData({ ...prescriptionData, stampVisible: e.target.checked })}
                    style={{ accentColor: 'var(--tiffany-500)' }}
                  />
                  Carimbo Virtual
                </label>
              </div>
            </div>

            {/* If 2 Vias model: Selector for 1ª Via, 2ª Via or Both */}
            {prescriptionData.copiesCount === 2 && (
              <div style={{
                background: 'var(--tiffany-50)',
                border: '1px solid var(--tiffany-200)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--tiffany-900)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Layers size={13} color="var(--tiffany-600)" />
                  Controle de Vias Obrigatório (RDC 1.000/2025):
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setPrescriptionData({ ...prescriptionData, selectedVia: 'via1' })}
                    style={{
                      background: prescriptionData.selectedVia === 'via1' ? 'var(--tiffany-600)' : '#ffffff',
                      color: prescriptionData.selectedVia === 'via1' ? '#ffffff' : 'var(--slate-700)',
                      border: '1px solid var(--tiffany-300)',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    1ª Via (Farmácia)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrescriptionData({ ...prescriptionData, selectedVia: 'via2' })}
                    style={{
                      background: prescriptionData.selectedVia === 'via2' ? 'var(--tiffany-600)' : '#ffffff',
                      color: prescriptionData.selectedVia === 'via2' ? '#ffffff' : 'var(--slate-700)',
                      border: '1px solid var(--tiffany-300)',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    2ª Via (Tutor)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrescriptionData({ ...prescriptionData, selectedVia: 'both' })}
                    style={{
                      background: prescriptionData.selectedVia === 'both' ? 'var(--tiffany-600)' : '#ffffff',
                      color: prescriptionData.selectedVia === 'both' ? '#ffffff' : 'var(--slate-700)',
                      border: '1px solid var(--tiffany-300)',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Ambas as Vias
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 1: DADOS DO PACIENTE */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <PawPrint size={15} color="var(--tiffany-600)" />
                  <h4 style={{ fontSize: '0.86rem', color: 'var(--slate-800)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Dados do Paciente (Cão / Gato)
                  </h4>
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--tiffany-700)', background: 'var(--tiffany-50)', padding: '2px 6px', borderRadius: '4px' }}>
                  Peso atualiza cálculos em mg/kg
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.74rem', color: 'var(--slate-600)', display: 'block', marginBottom: '2px' }}>Nome do Pet</label>
                  <input
                    type="text"
                    placeholder="Ex: Mel, Thor, Oliver..."
                    value={prescriptionData.patient.name}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      patient: { ...prescriptionData.patient, name: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--slate-600)', display: 'block', marginBottom: '2px' }}>Espécie</label>
                  <select
                    value={prescriptionData.patient.species}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      patient: { ...prescriptionData.patient, species: e.target.value }
                    })}
                    style={inputStyle}
                  >
                    <option value="Canina">Canina (Cão)</option>
                    <option value="Felina">Felina (Gato)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--slate-600)', display: 'block', marginBottom: '2px' }}>
                    Peso (kg) <span style={{ color: 'var(--tiffany-600)', fontWeight: 700 }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 5.4"
                    value={prescriptionData.patient.weight}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      patient: { ...prescriptionData.patient, weight: e.target.value }
                    })}
                    style={{ ...inputStyle, borderColor: 'var(--tiffany-400)', fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--slate-600)', display: 'block', marginBottom: '2px' }}>Raça</label>
                  <input
                    type="text"
                    placeholder="Ex: SRD, Poodle, Siamês..."
                    value={prescriptionData.patient.breed}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      patient: { ...prescriptionData.patient, breed: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--slate-600)', display: 'block', marginBottom: '2px' }}>Idade</label>
                  <input
                    type="text"
                    placeholder="Ex: 3 anos"
                    value={prescriptionData.patient.age}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      patient: { ...prescriptionData.patient, age: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--slate-600)', display: 'block', marginBottom: '2px' }}>Sexo</label>
                  <input
                    type="text"
                    placeholder="Ex: Macho (Castrado)"
                    value={prescriptionData.patient.sex}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      patient: { ...prescriptionData.patient, sex: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--slate-600)', display: 'block', marginBottom: '2px' }}>Microchip (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: 981000..."
                    value={prescriptionData.patient.microchip || ''}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      patient: { ...prescriptionData.patient, microchip: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: DADOS DO TUTOR / COMPRADOR */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                <User size={15} color="var(--tiffany-600)" />
                <h4 style={{ fontSize: '0.86rem', color: 'var(--slate-800)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Dados do Tutor {prescriptionData.requiresBuyerData && <span style={{ color: '#dc2626' }}>* (RDC 1.000/2025)</span>}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.74rem', color: 'var(--slate-600)', display: 'block', marginBottom: '2px' }}>Nome do Tutor</label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos Eduardo Schmidt"
                    value={prescriptionData.tutor.name}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      tutor: { ...prescriptionData.tutor, name: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--slate-600)', display: 'block', marginBottom: '2px' }}>Telefone</label>
                  <input
                    type="text"
                    placeholder="Ex: (49) 99955-5421"
                    value={prescriptionData.tutor.phone}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      tutor: { ...prescriptionData.tutor, phone: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--slate-600)', display: 'block', marginBottom: '2px' }}>CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={prescriptionData.tutor.cpf}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      tutor: { ...prescriptionData.tutor, cpf: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--slate-600)', display: 'block', marginBottom: '2px' }}>RG / Órgão</label>
                  <input
                    type="text"
                    value={prescriptionData.tutor.rg || ''}
                    placeholder="Ex: 4.981.332 SSP/SC"
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      tutor: { ...prescriptionData.tutor, rg: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--slate-600)', display: 'block', marginBottom: '2px' }}>Data de Emissão</label>
                  <input
                    type="text"
                    value={prescriptionData.emissionDate}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      emissionDate: e.target.value
                    })}
                    style={inputStyle}
                  />
                </div>

                <div style={{ gridColumn: 'span 3' }}>
                  <label style={{ fontSize: '0.74rem', color: 'var(--slate-600)', display: 'block', marginBottom: '2px' }}>Endereço Completo do Tutor</label>
                  <input
                    type="text"
                    placeholder="Rua, Número, Bairro, Lages - SC"
                    value={prescriptionData.tutor.address}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      tutor: { ...prescriptionData.tutor, address: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: LISTA DINÂMICA DE MEDICAMENTOS */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Pill size={15} color="var(--tiffany-600)" />
                  <h4 style={{ fontSize: '0.86rem', color: 'var(--slate-800)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Prescrição de Medicamentos & Posologia
                  </h4>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setShowBularioModal(true)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'var(--tiffany-50)', color: 'var(--tiffany-800)', borderColor: 'var(--tiffany-300)' }}
                  >
                    <Search size={12} /> Bulário VetSmart
                  </button>

                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                  >
                    <Plus size={12} /> Adicionar
                  </button>
                </div>
              </div>

              {/* Medication Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {prescriptionData.medications.map((med, index) => (
                  <div 
                    key={med.id} 
                    style={{
                      background: '#fcfefe',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          background: 'var(--tiffany-500)',
                          color: '#fff',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.70rem',
                          fontWeight: 700
                        }}>
                          {index + 1}
                        </span>

                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                          {med.name || 'Novo Medicamento'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Dose Calculator Trigger */}
                        <button
                          type="button"
                          onClick={() => setCalcTargetMedId(calcTargetMedId === med.id ? null : med.id)}
                          style={{
                            background: calcTargetMedId === med.id ? 'var(--tiffany-500)' : 'var(--tiffany-50)',
                            color: calcTargetMedId === med.id ? '#ffffff' : 'var(--tiffany-800)',
                            border: '1px solid var(--tiffany-300)',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '0.68rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Calculator size={11} />
                          <span>Calculadora mg/kg</span>
                        </button>

                        {prescriptionData.medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMed(med.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '0.70rem'
                            }}
                          >
                            <Trash2 size={13} /> Remover
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Mini Dose Calculator Panel (VetSmart style) */}
                    {calcTargetMedId === med.id && (
                      <div style={{
                        background: '#f0fbfb',
                        border: '1px solid var(--tiffany-300)',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        marginBottom: '8px',
                        fontSize: '0.72rem'
                      }}>
                        <div style={{ fontWeight: 700, color: 'var(--tiffany-900)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calculator size={13} color="var(--tiffany-600)" />
                          Calculadora de Dose (mg/kg) • Peso: {prescriptionData.patient.weight || 10} kg
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '6px', alignItems: 'end' }}>
                          <div>
                            <label style={{ display: 'block', color: 'var(--slate-600)', marginBottom: '1px' }}>Dose (mg/kg):</label>
                            <input
                              type="number"
                              value={calcDoseMgKg}
                              onChange={(e) => setCalcDoseMgKg(e.target.value)}
                              style={{ ...inputStyle, padding: '3px 6px', fontSize: '0.74rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', color: 'var(--slate-600)', marginBottom: '1px' }}>Conc. (mg/unid):</label>
                            <input
                              type="number"
                              value={calcConcentration}
                              onChange={(e) => setCalcConcentration(e.target.value)}
                              style={{ ...inputStyle, padding: '3px 6px', fontSize: '0.74rem' }}
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={handleApplyCalculatedDose}
                              style={{
                                background: 'var(--tiffany-600)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '5px 10px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                width: '100%'
                              }}
                            >
                              Aplicar à Posologia
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr', gap: '6px', marginBottom: '6px' }}>
                      <div>
                        <label style={{ fontSize: '0.70rem', color: 'var(--slate-500)' }}>Nome do Fármaco</label>
                        <input
                          type="text"
                          placeholder="Ex: Clavulin Vet 250mg, Meloxicam..."
                          value={med.name}
                          onChange={(e) => handleUpdateMed(med.id, 'name', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.70rem', color: 'var(--slate-500)' }}>Apresentação</label>
                        <input
                          type="text"
                          placeholder="Ex: Caixa com 14 comp."
                          value={med.presentation}
                          onChange={(e) => handleUpdateMed(med.id, 'presentation', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.70rem', color: 'var(--slate-500)' }}>Qtd. Total</label>
                        <input
                          type="text"
                          placeholder="Ex: 01 Caixa"
                          value={med.quantity}
                          onChange={(e) => handleUpdateMed(med.id, 'quantity', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.70rem', color: 'var(--slate-500)' }}>Posologia Detalhada & Horários</label>
                      <textarea
                        rows={2}
                        placeholder="Administrar 1 comprimido por via oral a cada 12 horas durante 10 dias..."
                        value={med.dosage}
                        onChange={(e) => handleUpdateMed(med.id, 'dosage', e.target.value)}
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: INSTRUÇÕES E OBSERVAÇÕES CLÍNICAS */}
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--slate-700)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>
                Orientações Gerais, Dieta e Retorno Médico
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Manter água fresca em abundância. Retorno em 15 dias..."
                value={prescriptionData.instructions}
                onChange={(e) => setPrescriptionData({ ...prescriptionData, instructions: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          </div>


          {/* ========================================================
              RIGHT COLUMN: REAL-TIME A4 PREVIEW (EXACT PRINT REPLICA)
             ======================================================== */}
          <div style={{ position: 'sticky', top: '80px' }} className="print-area-wrapper">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }} className="no-print">
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-600)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Eye size={14} color="var(--tiffany-600)" />
                Visualização em Tempo Real (Folha Padrão A4 Completa)
              </span>

              <span style={{ fontSize: '0.72rem', color: 'var(--tiffany-700)', background: 'var(--tiffany-100)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                {templateMode === 'blank' ? 'Modelo em Branco' : 'Modelo Preenchido'}
              </span>
            </div>

            {/* RENDER THE SHEET(S) */}
            {prescriptionData.selectedVia === 'both' && prescriptionData.copiesCount === 2 ? (
              <>
                {renderPrescriptionSheet('1ª VIA', '1ª VIA: Retenção da Farmácia')}
                <div style={{ height: '16px' }} className="no-print" />
                {renderPrescriptionSheet('2ª VIA', '2ª VIA: Orientação do Tutor')}
              </>
            ) : (
              renderPrescriptionSheet(
                prescriptionData.selectedVia === 'via2' ? '2ª VIA' : '1ª VIA',
                prescriptionData.copiesCount === 2 
                  ? (prescriptionData.selectedVia === 'via2' ? '2ª VIA: Orientação do Tutor' : '1ª VIA: Retenção da Farmácia')
                  : null
              )
            )}
          </div>

        </div>
      </div>

      {/* ========================================================
          VETSMART BULÁRIO SEARCH MODAL
         ======================================================== */}
      {showBularioModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '850px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#fafcfc'
            }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <Search size={17} color="var(--tiffany-600)" />
                  Bulário Veterinário Inteligente (Padrão VetSmart)
                </h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
                  Cálculo automático de dose mg/kg com base no peso de {prescriptionData.patient.name || 'Paciente'} ({prescriptionData.patient.weight || 10} kg).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowBularioModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--slate-400)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Search & Filter Inputs */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', background: '#ffffff' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={15} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                  <input
                    type="text"
                    placeholder="Buscar por fármaco, princípio ativo ou indicação (ex: Amoxicilina, Apoquel, Meloxicam, Gardenal)..."
                    value={bularioSearch}
                    onChange={(e) => setBularioSearch(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: '34px', fontSize: '0.84rem' }}
                    autoFocus
                  />
                </div>

                <select
                  value={bularioCategory}
                  onChange={(e) => setBularioCategory(e.target.value)}
                  style={inputStyle}
                >
                  <option value="all">Todas as Classificações</option>
                  <option value="retencao-antimicrobianos">Antimicrobianos (RDC 471/21)</option>
                  <option value="controle-especial">Controle Especial C1 (RDC 1000/25)</option>
                  <option value="notificacao-a">Notificação "A" Amarela (Opioides)</option>
                  <option value="notificacao-b">Notificação "B" Azul (Benzodiazepínicos)</option>
                  <option value="notificacao-especial-branca">Notificação Especial Branca (Retinoides)</option>
                  <option value="simples">Receituário Clínico Comum</option>
                </select>
              </div>
            </div>

            {/* Modal Drug List */}
            <div style={{ padding: '14px 18px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredBulario.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--slate-400)' }}>
                  <Pill size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
                  Nenhum medicamento encontrado para "{bularioSearch}".
                </div>
              ) : (
                filteredBulario.map((drug) => {
                  const weightNum = parseFloat(prescriptionData.patient.weight) || 10;
                  const calculatedDose = (weightNum * drug.defaultDoseMgKg).toFixed(1);

                  return (
                    <div
                      key={drug.id}
                      style={{
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        background: '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--tiffany-400)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                    >
                      <div style={{ flex: 1, marginRight: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '0.88rem', color: 'var(--slate-900)' }}>
                            {drug.name}
                          </strong>
                          <span style={{ fontSize: '0.68rem', background: '#f1f5f9', color: '#475569', padding: '1px 5px', borderRadius: '4px' }}>
                            {drug.activeIngredient}
                          </span>
                          <span style={{ fontSize: '0.66rem', background: 'var(--tiffany-50)', color: 'var(--tiffany-800)', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
                            {drug.legalCategoryName}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                          {drug.presentation} • Via: <strong>{drug.route}</strong> • Freq: {drug.defaultFrequency}
                        </div>

                        <div style={{ fontSize: '0.70rem', color: 'var(--tiffany-700)', marginTop: '2px', fontWeight: 600 }}>
                          Dose calculada ({weightNum}kg): ~{calculatedDose} mg ({drug.defaultDoseMgKg} mg/kg)
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleInsertFromBulario(drug)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.76rem', padding: '5px 12px', whiteSpace: 'nowrap' }}
                      >
                        <Plus size={13} /> Inserir
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '10px 18px',
              borderTop: '1px solid var(--border-subtle)',
              background: '#f8fbfb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.74rem',
              color: 'var(--slate-500)'
            }}>
              <span>Conforme parâmetros de segurança da RDC Anvisa nº 1.000/2025</span>
              <button
                type="button"
                onClick={() => setShowBularioModal(false)}
                className="btn btn-secondary"
                style={{ fontSize: '0.74rem', padding: '4px 10px' }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SQLITE SAVED PRESCRIPTIONS HISTORY MODAL
         ======================================================== */}
      {showHistoryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#fafcfc'
            }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Database size={16} color="var(--tiffany-600)" />
                Histórico de Receitas Salvas no SQLite
              </h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '14px 18px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {savedPrescriptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--slate-400)' }}>
                  Nenhuma receita salva encontrada no banco SQLite ainda.
                </div>
              ) : (
                savedPrescriptions.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.86rem', color: 'var(--slate-900)' }}>
                        Pet: {item.patient_name} ({item.species})
                      </strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)' }}>
                        Tutor: {item.tutor_name} • Salvo em: {new Date(item.created_at).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLoadFromHistory(item)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                    >
                      Carregar
                    </button>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border-subtle)', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="btn btn-secondary"
                style={{ fontSize: '0.74rem', padding: '4px 10px' }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '6px 8px',
  borderRadius: '5px',
  border: '1px solid #cbd5e1',
  fontSize: '0.80rem',
  background: '#ffffff',
  outline: 'none',
  transition: 'border-color 0.2s',
  color: '#0f172a'
};
