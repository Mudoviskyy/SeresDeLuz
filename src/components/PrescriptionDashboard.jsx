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
  Search,
  Calculator,
  Save,
  BookOpen,
  X,
  Eraser,
  History,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { VET_DATA, PRESCRIPTION_TEMPLATES } from '../data/prescriptionTemplates';
import { VETSMART_DRUG_DATABASE, VETSMART_CLINICAL_PROTOCOLS } from '../data/vetsmartDatabase';

const SAVED_HISTORY_KEY = 'seres_saved_prescriptions';

function getTodayFormatted() {
  return new Date().toLocaleDateString('pt-BR');
}

function readLocalHistory() {
  try {
    const raw = localStorage.getItem(SAVED_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function PrescriptionDashboard({ setCurrentView }) {
  const [activeTemplateId, setActiveTemplateId] = useState(PRESCRIPTION_TEMPLATES[0].id);
  const activeTemplate = PRESCRIPTION_TEMPLATES.find((t) => t.id === activeTemplateId) || PRESCRIPTION_TEMPLATES[0];

  const [templateMode, setTemplateMode] = useState('filled');

  const createBlankData = (baseTemplate) => ({
    ...baseTemplate,
    emissionDate: getTodayFormatted(),
    showWatermark: true,
    watermarkOpacity: baseTemplate.isYellowNotification ? 0.04 : (baseTemplate.isBlueNotification ? 0.05 : 0.06),
    stampVisible: true,
    selectedVia: 'via1',
    patient: {
      name: '',
      species: 'Canina',
      breed: '',
      age: '',
      sex: 'Macho',
      weight: '',
      color: '',
      microchip: ''
    },
    tutor: {
      name: '',
      cpf: '',
      rg: '',
      phone: '',
      address: '',
      neighborhood: '',
      city: 'Lages',
      uf: 'SC',
      cep: ''
    },
    medications: [
      {
        id: Date.now(),
        name: '',
        presentation: '',
        route: 'Via Oral',
        quantity: '',
        dosage: '',
        schedule: ''
      }
    ],
    instructions: ''
  });

  const [prescriptionData, setPrescriptionData] = useState(() => ({
    ...activeTemplate,
    emissionDate: getTodayFormatted(),
    showWatermark: true,
    watermarkOpacity: 0.06,
    stampVisible: true,
    selectedVia: 'via1'
  }));

  const [feedbackNotice, setFeedbackNotice] = useState(null);
  const [bularioSearch, setBularioSearch] = useState('');
  const [bularioCategory, setBularioCategory] = useState('all');
  const [showBularioModal, setShowBularioModal] = useState(false);

  const [calcTargetMedId, setCalcTargetMedId] = useState(null);
  const [calcDoseMgKg, setCalcDoseMgKg] = useState('10');
  const [calcConcentration, setCalcConcentration] = useState('50');

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [savedPrescriptions, setSavedPrescriptions] = useState(() => readLocalHistory());

  const showNotice = (msg) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  // Sync history silently from local API if available, keeping local browser history working anywhere
  const loadPrescriptionsHistory = async () => {
    const localList = readLocalHistory();
    try {
      const res = await fetch('/api/prescriptions');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.prescriptions) && data.prescriptions.length > 0) {
          setSavedPrescriptions(data.prescriptions);
          return;
        }
      }
    } catch {
      // Running in static/cloud mode; use local browser history seamlessly
    }
    setSavedPrescriptions(localList);
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/prescriptions')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.success && Array.isArray(data.prescriptions) && data.prescriptions.length > 0) {
          setSavedPrescriptions(data.prescriptions);
        }
      })
      .catch(() => {
        // Static hosting mode uses local browser history
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleMode = (newMode) => {
    setTemplateMode(newMode);
    if (newMode === 'blank') {
      setPrescriptionData(createBlankData(activeTemplate));
      showNotice('Receita em branco pronta para preenchimento manual ou impressão.');
    } else {
      setPrescriptionData({
        ...activeTemplate,
        emissionDate: getTodayFormatted(),
        showWatermark: true,
        watermarkOpacity: activeTemplate.isYellowNotification ? 0.04 : (activeTemplate.isBlueNotification ? 0.05 : 0.06),
        stampVisible: true,
        selectedVia: 'via1'
      });
      showNotice('Exemplo clínico carregado.');
    }
  };

  const handleClearForm = () => {
    setTemplateMode('blank');
    setPrescriptionData(createBlankData(activeTemplate));
    showNotice('Campos limpos para nova receita.');
  };

  const handleSelectTemplate = (template) => {
    setActiveTemplateId(template.id);
    if (templateMode === 'blank') {
      setPrescriptionData(createBlankData(template));
      showNotice(`Modelo em branco: ${template.name}`);
    } else {
      setPrescriptionData({
        ...template,
        emissionDate: getTodayFormatted(),
        showWatermark: true,
        watermarkOpacity: template.isYellowNotification ? 0.04 : (template.isBlueNotification ? 0.05 : 0.06),
        stampVisible: true,
        selectedVia: 'via1'
      });
      showNotice(`Modelo selecionado: ${template.name}`);
    }
  };

  const handleAddMedication = () => {
    const newMed = {
      id: Date.now(),
      name: '',
      presentation: '',
      route: 'Via Oral',
      quantity: '',
      dosage: '',
      schedule: ''
    };
    setPrescriptionData((prev) => ({
      ...prev,
      medications: [...prev.medications, newMed]
    }));
  };

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
      quantity: '01 Unidade',
      dosage: calculatedDosage,
      schedule: drug.defaultFrequency,
      legalClassification: drug.rdcClassification
    };

    const isFirstEmpty = prescriptionData.medications.length === 1 && !prescriptionData.medications[0].name;

    setPrescriptionData((prev) => ({
      ...prev,
      medications: isFirstEmpty ? [newMed] : [...prev.medications, newMed]
    }));

    if (drug.rdcClassification && drug.rdcClassification !== activeTemplate.type) {
      const matchingTmpl = PRESCRIPTION_TEMPLATES.find((t) => t.type === drug.rdcClassification);
      if (matchingTmpl) {
        showNotice(`Atenção: ${drug.name} requer ${matchingTmpl.name} (RDC 1.000/2025).`);
      } else {
        showNotice(`Medicamento adicionado: ${drug.name}`);
      }
    } else {
      showNotice(`Medicamento adicionado com dose calculada para ${weightNum} kg.`);
    }

    setShowBularioModal(false);
  };

  const handleApplyProtocol = (proto) => {
    const recommendedTmpl = PRESCRIPTION_TEMPLATES.find((t) => t.id === proto.recommendedTemplateId) || activeTemplate;

    setActiveTemplateId(recommendedTmpl.id);
    setTemplateMode('filled');
    setPrescriptionData((prev) => ({
      ...recommendedTmpl,
      patient: prev.patient.name ? prev.patient : recommendedTmpl.patient,
      tutor: prev.tutor.name ? prev.tutor : recommendedTmpl.tutor,
      emissionDate: prev.emissionDate,
      showWatermark: prev.showWatermark,
      watermarkOpacity: prev.watermarkOpacity,
      stampVisible: prev.stampVisible,
      selectedVia: 'via1',
      medications: proto.medications.map((m, idx) => ({
        ...m,
        id: Date.now() + idx
      })),
      instructions: proto.instructions
    }));

    showNotice(`Protocolo "${proto.title}" aplicado.`);
  };

  const handleUpdateMed = (id, field, value) => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: prev.medications.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    }));
  };

  const handleRemoveMed = (id) => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m.id !== id)
    }));
  };

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
    showNotice(`Dose calculada (${totalMg} mg) inserida na posologia.`);
  };

  const handleAppendInstruction = (snippet) => {
    setPrescriptionData((prev) => {
      const current = (prev.instructions || '').trim();
      const next = current ? `${current}\n${snippet}` : snippet;
      return { ...prev, instructions: next };
    });
  };

  // Save prescription to history cleanly without technical terminology
  const handleSavePrescription = async () => {
    const id = `rx_${Date.now()}`;
    const payload = {
      id,
      templateId: activeTemplateId,
      patient: prescriptionData.patient,
      tutor: prescriptionData.tutor,
      medications: prescriptionData.medications,
      instructions: prescriptionData.instructions,
      emissionDate: prescriptionData.emissionDate,
      prescriptionData
    };

    const historyEntry = {
      id,
      template_id: activeTemplateId,
      patient_name: prescriptionData.patient.name || 'Não informado',
      species: prescriptionData.patient.species || 'Canina',
      tutor_name: prescriptionData.tutor.name || 'Não informado',
      prescription_data: JSON.stringify(payload),
      created_at: new Date().toISOString()
    };

    const updatedLocal = [historyEntry, ...readLocalHistory().filter((item) => item.id !== id)].slice(0, 50);
    localStorage.setItem(SAVED_HISTORY_KEY, JSON.stringify(updatedLocal));
    setSavedPrescriptions(updatedLocal);

    try {
      await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // Static mode already persisted locally
    }

    showNotice('Receita salva no histórico com sucesso!');
  };

  const handleLoadFromHistory = (item) => {
    try {
      const parsed = JSON.parse(item.prescription_data);
      if (parsed.prescriptionData) {
        setPrescriptionData(parsed.prescriptionData);
      } else {
        setPrescriptionData((prev) => ({
          ...prev,
          patient: parsed.patient || prev.patient,
          tutor: parsed.tutor || prev.tutor,
          medications: parsed.medications || prev.medications,
          instructions: parsed.instructions || prev.instructions
        }));
      }
      setShowHistoryModal(false);
      showNotice(`Receita de ${item.patient_name} carregada com sucesso.`);
    } catch {
      showNotice('Não foi possível abrir esta receita do histórico.');
    }
  };

  const handleDeleteHistoryItem = (id) => {
    const filtered = savedPrescriptions.filter((item) => item.id !== id);
    localStorage.setItem(SAVED_HISTORY_KEY, JSON.stringify(filtered));
    setSavedPrescriptions(filtered);
    showNotice('Item removido do histórico.');
  };

  const handlePrint = () => {
    window.print();
  };

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
${prescriptionData.medications.filter((m) => m.name).map((m, idx) => `${idx + 1}. *${m.name}*
   Forma: ${m.presentation} | Qtd: ${m.quantity} | Via: ${m.route}
   Posologia: ${m.dosage}`).join('\n\n')}

*Orientações ao Tutor:*
${prescriptionData.instructions || 'Seguir orientações repassadas em consulta.'}
----------------------------------------
*${prescriptionData.validityText}*`;

    navigator.clipboard.writeText(text);
    showNotice('Texto copiado! Cole diretamente no WhatsApp do tutor.');
  };

  const filteredBulario = useMemo(() => {
    return VETSMART_DRUG_DATABASE.filter((item) => {
      const q = bularioSearch.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.activeIngredient.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchesCat = bularioCategory === 'all' || item.rdcClassification === bularioCategory;
      return matchesSearch && matchesCat;
    });
  }, [bularioSearch, bularioCategory]);

  // Helper to render single prescription sheet (Full A4 optimized, print-faithful)
  const renderPrescriptionSheet = (viaLabel, viaTypeSubtitle) => {
    const hasValidMedications = prescriptionData.medications.some((m) => m.name && m.name.trim() !== '');

    return (
      <div
        className="prescription-sheet printable-prescription"
        style={{
          background: prescriptionData.paperBg || '#ffffff',
          border: prescriptionData.isYellowNotification ? '1.5px solid #f59e0b' : (prescriptionData.isBlueNotification ? '1.5px solid #0284c7' : '1px solid #d3e2e2'),
          borderRadius: '6px',
          boxShadow: '0 10px 30px rgba(15, 29, 36, 0.12)',
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
        {/* Subtle Watermark */}
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

        {/* TOP SECTION */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1.5px solid var(--tiffany-500)',
            paddingBottom: '6px',
            marginBottom: '6px'
          }}>
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

            <div style={{ textAlign: 'right', fontSize: '0.68rem', color: '#334155', lineHeight: 1.25 }}>
              <div>{VET_DATA.address} - Bairro {VET_DATA.neighborhood} • {VET_DATA.city} - {VET_DATA.state}</div>
              <div style={{ fontWeight: 700, color: 'var(--tiffany-700)' }}>WhatsApp: {VET_DATA.phone}</div>
            </div>
          </div>

          {/* Regulatory Bar */}
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

          {/* Patient & Tutor Summary */}
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

          {/* Medications */}
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
                {prescriptionData.medications.filter((item) => item.name).map((item, idx) => (
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

          {/* General Instructions */}
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

          {/* Responsibility Term */}
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

          {/* Pharmacy Fields */}
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

        {/* BOTTOM SIGNATURE & STAMP */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '4px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '0.68rem', color: '#475569' }}>
              <div>Lages - SC, <strong>{prescriptionData.emissionDate}</strong>.</div>
              <div style={{ color: '#089b97', fontWeight: 700, marginTop: '1px' }}>
                {prescriptionData.validityText}
              </div>
            </div>

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
    <div style={{ background: 'linear-gradient(180deg, #effaf9 0%, #f6fbfb 100%)', minHeight: 'calc(100vh - 120px)', padding: '22px 0 40px 0' }}>
      <div className="container">
        {/* Toast Feedback */}
        {feedbackNotice && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--slate-900)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 28px rgba(15, 23, 42, 0.25)',
            border: '1px solid rgba(10, 186, 181, 0.45)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            fontWeight: 500
          }}>
            <Sparkles size={16} color="var(--tiffany-400)" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        {/* ========================================================
            MODERN WORKSPACE HEADER BAR
           ======================================================== */}
        <div className="no-print" style={{
          background: '#ffffff',
          borderRadius: '18px',
          padding: '20px 24px',
          marginBottom: '18px',
          boxShadow: '0 4px 20px rgba(10, 186, 181, 0.08)',
          border: '1px solid var(--border-subtle)',
          borderTop: '4px solid var(--tiffany-500)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setCurrentView('landing')}
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '8px' }}
                >
                  <ArrowLeft size={13} /> Voltar ao Site
                </button>
                <span className="badge-pill badge-tiffany" style={{ fontSize: '0.73rem', padding: '3px 10px' }}>
                  <ShieldAlert size={12} /> RDC Anvisa nº 1.000/2025
                </span>
                <span style={{
                  fontSize: '0.73rem',
                  background: '#ecfdf5',
                  color: '#047857',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  border: '1px solid #a7f3d0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
                  Consultório Digital Ativo
                </span>
              </div>

              <h1 style={{ fontSize: '1.5rem', marginTop: '10px', color: 'var(--slate-900)', letterSpacing: '-0.3px' }}>
                Consultório Digital • Emissão de Receituário
              </h1>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.86rem', marginTop: '2px' }}>
                Dra. Nilcéia Silva • CRMV-SC 16442 • Prescrição em folha A4 com cálculo automático de doses por peso
              </p>
            </div>

            {/* Action Toolbar */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowBularioModal(true)}
                className="btn"
                style={{
                  background: 'var(--tiffany-50)',
                  color: 'var(--tiffany-800)',
                  border: '1px solid var(--tiffany-300)',
                  fontSize: '0.82rem',
                  padding: '8px 14px'
                }}
              >
                <Search size={14} />
                <span>Bulário Clínico</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loadPrescriptionsHistory();
                  setShowHistoryModal(true);
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem', padding: '8px 14px' }}
              >
                <History size={14} />
                <span>Histórico ({savedPrescriptions.length})</span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                title="Copiar texto formatado para enviar ao tutor"
              >
                <Copy size={14} />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleSavePrescription}
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem', padding: '8px 14px', borderColor: 'var(--tiffany-400)', color: 'var(--tiffany-800)' }}
              >
                <Save size={14} />
                <span>Salvar Receita</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="btn btn-primary"
                style={{ fontSize: '0.86rem', padding: '9px 18px' }}
              >
                <Printer size={15} />
                <span>Imprimir / PDF (A4)</span>
              </button>
            </div>
          </div>

          {/* TEMPLATE SELECTOR CARDS (COMPACT & MODERN) */}
          <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--slate-100)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tipo de Receituário
              </span>

              {/* Mode Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'inline-flex', background: 'var(--slate-100)', borderRadius: '8px', padding: '3px', gap: '2px' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleMode('filled')}
                    style={{
                      background: templateMode === 'filled' ? '#ffffff' : 'transparent',
                      color: templateMode === 'filled' ? 'var(--tiffany-800)' : 'var(--slate-600)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: templateMode === 'filled' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <FileText size={13} />
                    <span>Exemplo Preenchido</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleMode('blank')}
                    style={{
                      background: templateMode === 'blank' ? '#ffffff' : 'transparent',
                      color: templateMode === 'blank' ? 'var(--tiffany-800)' : 'var(--slate-600)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: templateMode === 'blank' ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Sparkles size={13} />
                    <span>Receita em Branco</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleClearForm}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--slate-200)',
                    borderRadius: '8px',
                    padding: '5px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--slate-600)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Eraser size={12} color="#ef4444" />
                  <span>Limpar</span>
                </button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
              gap: '8px'
            }}>
              {PRESCRIPTION_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === activeTemplateId;
                let badgeColor = '#089b97';
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
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: isSelected ? `2px solid ${tmpl.accentColor || 'var(--tiffany-500)'}` : '1px solid var(--slate-200)',
                      background: isSelected ? 'var(--tiffany-50)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(10, 186, 181, 0.12)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        color: badgeColor,
                        background: badgeBg,
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {tmpl.badge}
                      </span>
                      {isSelected && <CheckCircle2 size={14} color={tmpl.accentColor || 'var(--tiffany-600)'} />}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '6px', color: 'var(--slate-900)', lineHeight: 1.25 }}>
                      {tmpl.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Clinical Protocols */}
          <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px dashed var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--slate-700)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <BookOpen size={13} color="var(--tiffany-600)" />
              Protocolos Clínicos Prontos:
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {VETSMART_CLINICAL_PROTOCOLS.map((proto) => (
                <button
                  key={proto.id}
                  type="button"
                  onClick={() => handleApplyProtocol(proto)}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--slate-200)',
                    borderRadius: '999px',
                    padding: '4px 10px',
                    fontSize: '0.73rem',
                    fontWeight: 600,
                    color: 'var(--slate-700)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'border-color 0.15s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--tiffany-500)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--slate-200)'; }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: proto.badgeColor }} />
                  <span>{proto.title.split(':')[1] || proto.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================
            SPLIT WORKSPACE: MODERN EDITOR (LEFT) | LIVE A4 DESK (RIGHT)
           ======================================================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.05fr',
            gap: '22px',
            alignItems: 'start'
          }}
          className="split-view-container"
        >
          {/* LEFT COLUMN: MODERN SECTIONED EDITOR */}
          <div className="no-print dashboard-editor" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* CARD 1: PACIENTE */}
            <div style={editorCardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={cardIconStyle}><PawPrint size={15} /></div>
                  <div>
                    <h3 style={{ fontSize: '0.94rem', margin: 0 }}>Dados do Paciente</h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>O peso ajusta automaticamente as doses sugeridas</span>
                  </div>
                </div>

                {/* Quick Species Toggle */}
                <div style={{ display: 'inline-flex', background: 'var(--slate-100)', borderRadius: '8px', padding: '2px' }}>
                  {[
                    { value: 'Canina', label: '🐕 Cão' },
                    { value: 'Felina', label: '🐈 Gato' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPrescriptionData({
                        ...prescriptionData,
                        patient: { ...prescriptionData.patient, species: opt.value }
                      })}
                      style={{
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: prescriptionData.patient.species === opt.value ? 'var(--tiffany-600)' : 'transparent',
                        color: prescriptionData.patient.species === opt.value ? '#ffffff' : 'var(--slate-600)'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Nome do Pet</label>
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
                  <label style={labelStyle}>Raça</label>
                  <input
                    type="text"
                    placeholder="Ex: SRD, Poodle..."
                    value={prescriptionData.patient.breed}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      patient: { ...prescriptionData.patient, breed: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Peso (kg) <span style={{ color: 'var(--tiffany-600)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 5.4"
                    value={prescriptionData.patient.weight}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      patient: { ...prescriptionData.patient, weight: e.target.value }
                    })}
                    style={{ ...inputStyle, borderColor: 'var(--tiffany-400)', background: 'var(--tiffany-50)', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Idade</label>
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
                  <label style={labelStyle}>Sexo</label>
                  <input
                    type="text"
                    placeholder="Macho / Fêmea"
                    value={prescriptionData.patient.sex}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      patient: { ...prescriptionData.patient, sex: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Microchip (opcional)</label>
                  <input
                    type="text"
                    placeholder="Número de identificação"
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

            {/* CARD 2: TUTOR */}
            <div style={editorCardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={cardIconStyle}><User size={15} /></div>
                  <div>
                    <h3 style={{ fontSize: '0.94rem', margin: 0 }}>
                      Tutor Responsável {prescriptionData.requiresBuyerData && <span style={{ color: '#dc2626', fontSize: '0.76rem' }}>• Obrigatório (RDC 1.000/2025)</span>}
                    </h3>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--slate-600)' }}>
                  <Calendar size={13} color="var(--tiffany-600)" />
                  <input
                    type="text"
                    value={prescriptionData.emissionDate}
                    onChange={(e) => setPrescriptionData({ ...prescriptionData, emissionDate: e.target.value })}
                    style={{ ...inputStyle, width: '96px', padding: '4px 7px', fontSize: '0.75rem', textAlign: 'center' }}
                    title="Data de emissão"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Nome Completo do Tutor</label>
                  <input
                    type="text"
                    placeholder="Ex: Mariana Alcantara Duarte"
                    value={prescriptionData.tutor.name}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      tutor: { ...prescriptionData.tutor, name: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(49) 99955-5421"
                    value={prescriptionData.tutor.phone}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      tutor: { ...prescriptionData.tutor, phone: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>CPF</label>
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
                  <label style={labelStyle}>RG / Órgão</label>
                  <input
                    type="text"
                    placeholder="Ex: 4.981.332 SSP/SC"
                    value={prescriptionData.tutor.rg || ''}
                    onChange={(e) => setPrescriptionData({
                      ...prescriptionData,
                      tutor: { ...prescriptionData.tutor, rg: e.target.value }
                    })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Endereço</label>
                  <input
                    type="text"
                    placeholder="Rua, Número, Bairro"
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

            {/* CARD 3: MEDICAMENTOS & POSOLOGIA */}
            <div style={editorCardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={cardIconStyle}><Pill size={15} /></div>
                  <h3 style={{ fontSize: '0.94rem', margin: 0 }}>Prescrição &amp; Posologia</h3>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setShowBularioModal(true)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.74rem', padding: '5px 10px', background: 'var(--tiffany-50)', color: 'var(--tiffany-800)', borderColor: 'var(--tiffany-300)' }}
                  >
                    <Search size={12} /> Bulário Clínico
                  </button>

                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="btn btn-primary"
                    style={{ fontSize: '0.74rem', padding: '5px 10px', boxShadow: 'none' }}
                  >
                    <Plus size={12} /> Adicionar Item
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {prescriptionData.medications.map((med, index) => (
                  <div
                    key={med.id}
                    style={{
                      background: '#fafdfd',
                      border: '1px solid var(--tiffany-200)',
                      borderRadius: '10px',
                      padding: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <span style={{
                          background: 'var(--tiffany-600)',
                          color: '#fff',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}>
                          {index + 1}
                        </span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                          {med.name || 'Novo Medicamento'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setCalcTargetMedId(calcTargetMedId === med.id ? null : med.id)}
                          style={{
                            background: calcTargetMedId === med.id ? 'var(--tiffany-600)' : '#ffffff',
                            color: calcTargetMedId === med.id ? '#ffffff' : 'var(--tiffany-800)',
                            border: '1px solid var(--tiffany-300)',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '0.70rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Calculator size={11} />
                          <span>Calcular Dose</span>
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
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '0.72rem',
                              fontWeight: 600
                            }}
                          >
                            <Trash2 size={13} /> Remover
                          </button>
                        )}
                      </div>
                    </div>

                    {calcTargetMedId === med.id && (
                      <div style={{
                        background: '#ffffff',
                        border: '1px solid var(--tiffany-300)',
                        borderRadius: '8px',
                        padding: '10px',
                        marginBottom: '10px',
                        fontSize: '0.74rem'
                      }}>
                        <div style={{ fontWeight: 700, color: 'var(--tiffany-900)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calculator size={13} color="var(--tiffany-600)" />
                          Cálculo por Peso ({prescriptionData.patient.weight || 10} kg)
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '8px', alignItems: 'end' }}>
                          <div>
                            <label style={labelStyle}>Dose (mg/kg)</label>
                            <input
                              type="number"
                              value={calcDoseMgKg}
                              onChange={(e) => setCalcDoseMgKg(e.target.value)}
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Conc. (mg/unid)</label>
                            <input
                              type="number"
                              value={calcConcentration}
                              onChange={(e) => setCalcConcentration(e.target.value)}
                              style={inputStyle}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleApplyCalculatedDose}
                            className="btn btn-primary"
                            style={{ padding: '6px 10px', fontSize: '0.74rem', width: '100%', boxShadow: 'none' }}
                          >
                            Aplicar Posologia
                          </button>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <div>
                        <label style={labelStyle}>Medicamento</label>
                        <input
                          type="text"
                          placeholder="Ex: Clavulin Vet 250mg..."
                          value={med.name}
                          onChange={(e) => handleUpdateMed(med.id, 'name', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Apresentação</label>
                        <input
                          type="text"
                          placeholder="Ex: Caixa c/ 14 comp."
                          value={med.presentation}
                          onChange={(e) => handleUpdateMed(med.id, 'presentation', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Qtd. Total</label>
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
                      <label style={labelStyle}>Posologia &amp; Horários</label>
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

            {/* CARD 4: ORIENTAÇÕES & OPÇÕES DA FOLHA */}
            <div style={editorCardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={cardIconStyle}><FileText size={15} /></div>
                  <h3 style={{ fontSize: '0.94rem', margin: 0 }}>Orientações &amp; Acabamento da Folha</h3>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {[
                  '• Manter abundante oferta de água limpa e fresca.',
                  '• Retorno clínico agendado para reavaliação.',
                  '• Em caso de vômito ou apatia, entrar em contato.'
                ].map((tip) => (
                  <button
                    key={tip}
                    type="button"
                    onClick={() => handleAppendInstruction(tip)}
                    style={{
                      background: 'var(--tiffany-50)',
                      border: '1px solid var(--tiffany-200)',
                      borderRadius: '999px',
                      padding: '3px 9px',
                      fontSize: '0.70rem',
                      fontWeight: 600,
                      color: 'var(--tiffany-800)',
                      cursor: 'pointer'
                    }}
                  >
                    + {tip.replace('• ', '')}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                placeholder="Ex: Manter água fresca em abundância. Retorno em 10 dias..."
                value={prescriptionData.instructions}
                onChange={(e) => setPrescriptionData({ ...prescriptionData, instructions: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical', marginBottom: '12px' }}
              />

              {/* Paper & Copies Controls */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                paddingTop: '10px',
                borderTop: '1px solid var(--slate-100)',
                fontSize: '0.78rem',
                color: 'var(--slate-700)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={prescriptionData.showWatermark}
                      onChange={(e) => setPrescriptionData({ ...prescriptionData, showWatermark: e.target.checked })}
                      style={{ accentColor: 'var(--tiffany-500)' }}
                    />
                    Marca d&apos;água
                  </label>

                  {prescriptionData.showWatermark && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sliders size={12} color="var(--slate-400)" />
                      <input
                        type="range"
                        min="0.02"
                        max="0.20"
                        step="0.01"
                        value={prescriptionData.watermarkOpacity}
                        onChange={(e) => setPrescriptionData({ ...prescriptionData, watermarkOpacity: parseFloat(e.target.value) })}
                        style={{ width: '58px', accentColor: 'var(--tiffany-500)' }}
                        title="Intensidade da marca d'água"
                      />
                    </div>
                  )}

                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={prescriptionData.stampVisible}
                      onChange={(e) => setPrescriptionData({ ...prescriptionData, stampVisible: e.target.checked })}
                      style={{ accentColor: 'var(--tiffany-500)' }}
                    />
                    Carimbo Digital
                  </label>
                </div>

                {prescriptionData.copiesCount === 2 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Layers size={13} color="var(--tiffany-600)" />
                    {[
                      { id: 'via1', label: '1ª Via' },
                      { id: 'via2', label: '2ª Via' },
                      { id: 'both', label: 'Ambas' }
                    ].map((via) => (
                      <button
                        key={via.id}
                        type="button"
                        onClick={() => setPrescriptionData({ ...prescriptionData, selectedVia: via.id })}
                        style={{
                          background: prescriptionData.selectedVia === via.id ? 'var(--tiffany-600)' : '#ffffff',
                          color: prescriptionData.selectedVia === via.id ? '#ffffff' : 'var(--slate-700)',
                          border: '1px solid var(--tiffany-300)',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {via.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE A4 PREVIEW */}
          <div style={{ position: 'sticky', top: '86px' }} className="print-area-wrapper">
            <div
              className="preview-tray"
              style={{
                background: '#e5f2f1',
                borderRadius: '16px',
                padding: '14px',
                border: '1px solid var(--tiffany-200)'
              }}
            >
              <div
                className="no-print"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={14} color="var(--tiffany-700)" />
                  Visualização da Folha A4
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--tiffany-800)', background: '#ffffff', padding: '2px 9px', borderRadius: '999px', fontWeight: 700, border: '1px solid var(--tiffany-200)' }}>
                  {templateMode === 'blank' ? 'Em Branco' : 'Exemplo Clínico'}
                </span>
              </div>

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
      </div>

      {/* ========================================================
          MODAL: BULÁRIO CLÍNICO VETERINÁRIO
         ======================================================== */}
      {showBularioModal && (
        <div style={modalBackdropStyle}>
          <div style={{ ...modalContainerStyle, maxWidth: '850px', maxHeight: '85vh' }}>
            <div style={modalHeaderStyle}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <Search size={17} color="var(--tiffany-600)" />
                  Bulário Clínico Veterinário
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: '2px 0 0 0' }}>
                  Cálculo automático de dose por peso para {prescriptionData.patient.name || 'Paciente'} ({prescriptionData.patient.weight || 10} kg).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowBularioModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', background: '#ffffff' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={15} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                  <input
                    type="text"
                    placeholder="Buscar por fármaco, princípio ativo ou indicação..."
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
                  <option value="notificacao-a">Notificação &ldquo;A&rdquo; Amarela (Opioides)</option>
                  <option value="notificacao-b">Notificação &ldquo;B&rdquo; Azul (Benzodiazepínicos)</option>
                  <option value="notificacao-especial-branca">Notificação Especial Branca (Retinoides)</option>
                  <option value="simples">Receituário Clínico Comum</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '14px 18px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredBulario.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--slate-400)' }}>
                  <Pill size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
                  Nenhum medicamento encontrado para &ldquo;{bularioSearch}&rdquo;.
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
                        borderRadius: '8px',
                        padding: '10px 14px',
                        background: '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1, marginRight: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '0.88rem', color: 'var(--slate-900)' }}>
                            {drug.name}
                          </strong>
                          <span style={{ fontSize: '0.68rem', background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: '4px' }}>
                            {drug.activeIngredient}
                          </span>
                          <span style={{ fontSize: '0.66rem', background: 'var(--tiffany-50)', color: 'var(--tiffany-800)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            {drug.legalCategoryName}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.73rem', color: 'var(--slate-600)', marginTop: '3px' }}>
                          {drug.presentation} • Via: <strong>{drug.route}</strong> • Freq: {drug.defaultFrequency}
                        </div>

                        <div style={{ fontSize: '0.72rem', color: 'var(--tiffany-700)', marginTop: '2px', fontWeight: 600 }}>
                          Dose calculada ({weightNum} kg): ~{calculatedDose} mg ({drug.defaultDoseMgKg} mg/kg)
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleInsertFromBulario(drug)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.76rem', padding: '6px 12px', whiteSpace: 'nowrap', boxShadow: 'none' }}
                      >
                        <Plus size={13} /> Inserir
                      </button>
                    </div>
                  );
                })
              )}
            </div>

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
              <span>Conforme parâmetros da RDC Anvisa nº 1.000/2025</span>
              <button
                type="button"
                onClick={() => setShowBularioModal(false)}
                className="btn btn-secondary"
                style={{ fontSize: '0.74rem', padding: '4px 12px' }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: HISTÓRICO DE RECEITAS EMITIDAS
         ======================================================== */}
      {showHistoryModal && (
        <div style={modalBackdropStyle}>
          <div style={{ ...modalContainerStyle, maxWidth: '650px', maxHeight: '80vh' }}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <History size={17} color="var(--tiffany-600)" />
                Histórico de Receitas Emitidas
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
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-400)' }}>
                  Nenhuma receita salva até o momento. Clique em &ldquo;Salvar Receita&rdquo; para guardar seus atendimentos aqui.
                </div>
              ) : (
                savedPrescriptions.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--slate-900)' }}>
                        Pet: {item.patient_name} ({item.species})
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)' }}>
                        Tutor: {item.tutor_name} • Emitida em: {new Date(item.created_at).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleLoadFromHistory(item)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.74rem', padding: '5px 12px' }}
                      >
                        Abrir
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteHistoryItem(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--slate-400)',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Remover do histórico"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border-subtle)', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="btn btn-secondary"
                style={{ fontSize: '0.74rem', padding: '5px 12px' }}
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

const editorCardStyle = {
  background: '#ffffff',
  borderRadius: '14px',
  padding: '18px',
  border: '1px solid var(--border-subtle)',
  boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
};

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '10px',
  marginBottom: '12px',
  paddingBottom: '10px',
  borderBottom: '1px solid var(--slate-100)'
};

const cardIconStyle = {
  width: '30px',
  height: '30px',
  borderRadius: '8px',
  background: 'var(--tiffany-100)',
  color: 'var(--tiffany-700)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const labelStyle = {
  fontSize: '0.72rem',
  fontWeight: 600,
  color: 'var(--slate-600)',
  display: 'block',
  marginBottom: '3px'
};

const inputStyle = {
  width: '100%',
  padding: '7px 9px',
  borderRadius: '7px',
  border: '1px solid #cbd5e1',
  fontSize: '0.80rem',
  background: '#ffffff',
  outline: 'none',
  transition: 'border-color 0.2s',
  color: '#0f172a'
};

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(15, 23, 42, 0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
  padding: '20px'
};

const modalContainerStyle = {
  background: '#ffffff',
  borderRadius: '14px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.28)',
  overflow: 'hidden'
};

const modalHeaderStyle = {
  padding: '14px 18px',
  borderBottom: '1px solid var(--border-subtle)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#fafcfc'
};
