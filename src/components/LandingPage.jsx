import React, { useState } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Award, 
  Check, 
  Activity, 
  Syringe, 
  Eye, 
  FileText, 
  Thermometer, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { VET_DATA } from '../data/prescriptionTemplates';

export default function LandingPage({ setCurrentView, currentUser, setIsLoginOpen }) {
  const [activeSpeciesTab, setActiveSpeciesTab] = useState('both'); // 'both', 'dogs', 'cats'

  const whatsappGeneralUrl = `https://wa.me/55${VET_DATA.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20Dra.%20Nilc%C3%A9ia!%20Gostaria%20de%20agendar%20uma%20consulta%20para%20o%20meu%20pet.`;

  const handlePrescriptionClick = () => {
    if (currentUser) {
      setCurrentView('dashboard');
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="landing-page">
      
      {/* ========================================================
          1. HERO SECTION: PÁGINA PESSOAL DA DRA. NILCÉIA SILVA
         ======================================================== */}
      <section style={{
        background: 'linear-gradient(145deg, #f0fbfb 0%, #ffffff 40%, #e6f6f5 100%)',
        padding: '55px 0 70px 0',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-15%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10, 186, 181, 0.15) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '40px',
            alignItems: 'center'
          }} className="hero-grid">
            
            {/* Left Content */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span className="badge-pill badge-tiffany pulse-badge">
                  <Sparkles size={14} color="var(--tiffany-700)" />
                  Medicina Veterinária • Lages - SC
                </span>
                <span className="badge-pill badge-amber">
                  <ShieldCheck size={14} /> CRMV-SC 16442
                </span>
              </div>

              <h1 style={{
                fontSize: '2.5rem',
                lineHeight: 1.15,
                color: 'var(--slate-900)',
                marginBottom: '16px'
              }}>
                Cuidando de <span className="text-gradient">cães e gatos</span> com dedicação, ciência e carinho.
              </h1>

              <p style={{
                fontSize: '1.05rem',
                lineHeight: 1.6,
                color: 'var(--slate-700)',
                marginBottom: '26px',
                maxWidth: '560px'
              }}>
                Olá! Sou a <strong>Dra. Nilcéia Silva</strong>. Minha missão é oferecer um atendimento médico veterinário individualizado, calmo e humanizado, respeitando a sensibilidade única de cada cão e gato em Lages e região.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <a
                  href={whatsappGeneralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ padding: '12px 24px', fontSize: '1rem', boxShadow: '0 6px 20px rgba(37, 211, 102, 0.35)' }}
                >
                  <MessageCircle size={18} />
                  <span>Agendar Consulta no WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handlePrescriptionClick}
                  className="btn btn-secondary"
                  style={{ padding: '12px 20px', fontSize: '0.92rem' }}
                >
                  <Lock size={15} color="var(--tiffany-600)" />
                  <span>Área Médica: Receituário</span>
                </button>
              </div>

              {/* Highlights Micro-cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginTop: '36px',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--tiffany-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tiffany-700)' }}>
                    <Heart size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)', display: 'block' }}>Cat & Dog Friendly</strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate-600)' }}>Manejo sem medo</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--tiffany-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tiffany-700)' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)', display: 'block' }}>Prescrição Segura</strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate-600)' }}>RDC Anvisa 1.000/2025</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--tiffany-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tiffany-700)' }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)', display: 'block' }}>(49) 99955-5421</strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate-600)' }}>Atendimento e Dúvidas</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Card: Perfil da Médica Veterinária */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '28px',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-subtle)',
                position: 'relative'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--tiffany-400) 0%, var(--tiffany-700) 100%)',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(10, 186, 181, 0.35)'
                }}>
                  <Stethoscope size={48} strokeWidth={1.75} />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--slate-900)', margin: 0 }}>
                    {VET_DATA.name}
                  </h3>
                  <div style={{ color: 'var(--tiffany-700)', fontWeight: 700, fontSize: '0.9rem', marginTop: '4px' }}>
                    {VET_DATA.crmv}
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', marginTop: '8px', lineHeight: 1.5 }}>
                    Médica Veterinária dedicada com foco integral na saúde preventiva, clínica e bem-estar de cães e gatos.
                  </p>
                </div>

                <div style={{
                  background: 'var(--tiffany-50)',
                  borderRadius: '10px',
                  padding: '14px',
                  marginTop: '18px',
                  border: '1px solid var(--tiffany-200)',
                  fontSize: '0.82rem',
                  lineHeight: 1.5
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--tiffany-950)', fontWeight: 700 }}>
                    <MapPin size={15} color="var(--tiffany-600)" />
                    Atendimento em Lages - SC
                  </div>
                  <div style={{ color: 'var(--slate-700)' }}>
                    {VET_DATA.address} - Bairro {VET_DATA.neighborhood}
                  </div>
                  <div style={{ color: 'var(--slate-500)', fontSize: '0.76rem' }}>
                    CEP {VET_DATA.cep} • WhatsApp: {VET_DATA.phone}
                  </div>
                </div>

                <a
                  href={whatsappGeneralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '16px', justifyContent: 'center', padding: '10px' }}
                >
                  <Calendar size={16} /> Agendar com a Dra. Nilcéia
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          2. SOBRE A MÉDICA VETERINÁRIA
         ======================================================== */}
      <section id="sobre" style={{ padding: '70px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '45px' }}>
            <span className="badge-pill badge-tiffany">Trajetória e Vocação</span>
            <h2 style={{ fontSize: '2.1rem', marginTop: '10px', color: 'var(--slate-900)' }}>
              Sobre a Dra. Nilcéia Silva
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: 1.6, marginTop: '8px' }}>
              Uma prática médica veterinária pautada no respeito aos animais, na escuta atenta aos tutores e no rigor científico.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--tiffany-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tiffany-700)', marginBottom: '16px' }}>
                <Heart size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Medicina Humanizada</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                Cada animal é um membro amado da família. Priorizo consultas com tempo adequado, sem pressa, permitindo que cães e gatos se acostumem ao ambiente e sintam-se calmos e acolhidos.
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--tiffany-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tiffany-700)', marginBottom: '16px' }}>
                <Stethoscope size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Especial Atenção a Gatos</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                Manejo gentil voltado às particularidades do paciente felino: controle de ruídos, feromônios, toques delicados e condutas terapêuticas que respeitam o comportamento da espécie.
              </p>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--tiffany-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tiffany-700)', marginBottom: '16px' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Prescrição e Ética</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                Rigor absoluto na escolha dos tratamentos, com cálculos precisos por peso vivo (mg/kg), uso racional de antibióticos e conformidade rigorosa às normas da Anvisa e do CRMV-SC.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          3. ATENDIMENTO ESPECIALIZADO: CÃES & GATOS
         ======================================================== */}
      <section id="especialidades" style={{ padding: '70px 0', background: 'var(--slate-50)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge-pill badge-tiffany">Serviços Clínicos</span>
            <h2 style={{ fontSize: '2.1rem', marginTop: '10px', color: 'var(--slate-900)' }}>
              Áreas de Cuidado Veterinário
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
              Prevenção, diagnóstico e acompanhamento integral ao longo de todas as fases da vida do seu companheiro.
            </p>

            {/* Species Filter Tab */}
            <div style={{ display: 'inline-flex', background: '#ffffff', padding: '4px', borderRadius: '30px', boxShadow: 'var(--shadow-sm)', marginTop: '20px', border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => setActiveSpeciesTab('both')}
                style={{
                  background: activeSpeciesTab === 'both' ? 'var(--tiffany-500)' : 'transparent',
                  color: activeSpeciesTab === 'both' ? '#ffffff' : 'var(--slate-700)',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '7px 18px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Todos os Serviços
              </button>
              <button
                type="button"
                onClick={() => setActiveSpeciesTab('dogs')}
                style={{
                  background: activeSpeciesTab === 'dogs' ? 'var(--tiffany-500)' : 'transparent',
                  color: activeSpeciesTab === 'dogs' ? '#ffffff' : 'var(--slate-700)',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '7px 18px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🐕 Cães
              </button>
              <button
                type="button"
                onClick={() => setActiveSpeciesTab('cats')}
                style={{
                  background: activeSpeciesTab === 'cats' ? 'var(--tiffany-500)' : 'transparent',
                  color: activeSpeciesTab === 'cats' ? '#ffffff' : 'var(--slate-700)',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '7px 18px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🐈 Gatos
              </button>
            </div>
          </div>

          {/* Services Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            
            <div className="card" style={{ padding: '24px' }}>
              <Thermometer size={26} color="var(--tiffany-600)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Consulta Clínica e Preventiva</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.55 }}>
                Exame físico minucioso, aferição de parâmetros cardiorrespiratórios, temperatura e plano de saúde preventiva individual.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <Syringe size={26} color="var(--tiffany-600)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Vacinação Ética & Imunização</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.55 }}>
                Protocolos vacinais seguros para cães (V10, Antirrábica, Gripe) e gatos (Quíntuple Felina FelV, Quádrupla e Raiva).
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <Activity size={26} color="var(--tiffany-600)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Manejo de Dor e Artrose</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.55 }}>
                Analgesia multimodal para pacientes geriátricos, cães com displasia coxofemoral e gatos com osteoartrite crônica.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <Eye size={26} color="var(--tiffany-600)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Dermatologia & Alergias</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.55 }}>
                Diagnóstico de dermatite atópica, controle de prurido, otites recidivantes, escabiose e infecções bacterianas e fúngicas.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <Heart size={26} color="var(--tiffany-600)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Acompanhamento Geriátrico</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.55 }}>
                Cuidados continuados para animais idosos: monitoramento renal, hepático, cognitivo e manutenção da qualidade de vida.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <FileText size={26} color="var(--tiffany-600)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Prescrição Personalizada</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.55 }}>
                Emissão de receitas digitais e físicas em conformidade com as exigências da Anvisa (RDC 1000/2025) e formulações magistrais.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          4. LOCALIZAÇÃO E CONTATO EM LAGES - SC
         ======================================================== */}
      <section id="localizacao" style={{ padding: '70px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--slate-900) 0%, #0d282e 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '45px',
            color: '#ffffff',
            boxShadow: 'var(--shadow-xl)',
            border: '2px solid var(--tiffany-500)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '40px',
              alignItems: 'center'
            }} className="contact-grid">
              
              <div>
                <span className="badge-pill" style={{ background: 'rgba(10, 186, 181, 0.2)', color: 'var(--tiffany-300)', border: '1px solid var(--tiffany-400)' }}>
                  Localização em Lages - SC
                </span>
                
                <h2 style={{ fontSize: '2.1rem', color: '#ffffff', marginTop: '12px', marginBottom: '14px' }}>
                  Agende a consulta do seu pet
                </h2>

                <p style={{ color: '#cbd5e1', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  Atendimento com hora marcada para proporcionar total dedicação, tranquilidade e pontualidade ao seu cão ou gato.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin size={20} color="var(--tiffany-400)" />
                    <span><strong>{VET_DATA.address}</strong>, Bairro {VET_DATA.neighborhood} • Lages - SC (CEP {VET_DATA.cep})</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Phone size={20} color="var(--tiffany-400)" />
                    <span>Telefone e WhatsApp: <strong>{VET_DATA.phone}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Clock size={20} color="var(--tiffany-400)" />
                    <span>{VET_DATA.hours}</span>
                  </div>
                </div>

                <div style={{ marginTop: '28px' }}>
                  <a
                    href={whatsappGeneralUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{ padding: '12px 24px', fontSize: '0.98rem' }}
                  >
                    <MessageCircle size={18} />
                    <span>Falar no WhatsApp: (49) 99955-5421</span>
                  </a>
                </div>
              </div>

              {/* Card Direto com a Dra. */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(10, 186, 181, 0.3)',
                borderRadius: '16px',
                padding: '28px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--tiffany-500)',
                  margin: '0 auto 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <Heart size={32} />
                </div>

                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                  {VET_DATA.name}
                </h3>
                <div style={{ color: 'var(--tiffany-400)', fontWeight: 700, fontSize: '0.85rem', marginTop: '4px' }}>
                  {VET_DATA.crmv}
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '10px', lineHeight: 1.5 }}>
                  "O amor e o respeito pelos cães e gatos guiam cada diagnóstico e cada conduta terapêutica que realizo."
                </p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '18px', paddingTop: '16px' }}>
                  <button
                    type="button"
                    onClick={handlePrescriptionClick}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--tiffany-300)',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Lock size={13} /> Área Restrita para Emissão de Receitas <ArrowRight size={13} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
