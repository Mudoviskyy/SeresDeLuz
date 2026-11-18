import React, { useState, useEffect } from 'react';
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
  Activity,
  Syringe,
  Eye,
  FileText,
  Thermometer
} from 'lucide-react';
import { VET_DATA } from '../data/prescriptionTemplates';
import petHero1 from '../assets/pet-hero-1.jpg';
import petHero2 from '../assets/pet-hero-2.jpg';
import petHero3 from '../assets/pet-hero-3.jpg';

const HERO_PET_BACKDROPS = [
  { src: petHero1, alt: 'Cão e gato tranquilos em ambiente claro e acolhedor' },
  { src: petHero2, alt: 'Gato descansando confortavelmente durante cuidado felino' },
  { src: petHero3, alt: 'Cão saudável e sereno em ambiente de atendimento veterinário' }
];

const CLINICAL_SERVICES = [
  {
    id: 'consulta',
    species: ['dogs', 'cats'],
    icon: Thermometer,
    badgeBoth: 'Cães & Gatos',
    badgeDog: 'Atendimento Canino',
    badgeCat: 'Manejo Cat Friendly',
    titleBoth: 'Consulta Clínica e Preventiva',
    titleDog: 'Consulta Clínica para Cães',
    titleCat: 'Consulta Cat Friendly para Gatos',
    descBoth: 'Exame físico minucioso, aferição de parâmetros cardiorrespiratórios, temperatura e plano de saúde preventiva individual.',
    descDog: 'Avaliação completa de filhotes, adultos e cães idosos com foco em check-up anual, saúde cardíaca, bucal e nutricional.',
    descCat: 'Consulta silenciosa e sem estresse respeitando o comportamento felino, com avaliação de hidratação, peso e bem-estar.'
  },
  {
    id: 'vacinacao',
    species: ['dogs', 'cats'],
    icon: Syringe,
    badgeBoth: 'Imunização Segura',
    badgeDog: 'Protocolo Canino',
    badgeCat: 'Protocolo Felino',
    titleBoth: 'Vacinação Ética & Imunização',
    titleDog: 'Vacinação de Cães (V10, Raiva e Gripe)',
    titleCat: 'Vacinação de Gatos (FeLV, V4 e Raiva)',
    descBoth: 'Protocolos vacinais individualizados após exame clínico prévio, com carteirinha de vacinação completa e acompanhamento.',
    descDog: 'Esquema vacinal para filhotes e reforços anuais com V8/V10, Antirrábica, Traqueobronquite (Gripe) e prevenção regional.',
    descCat: 'Imunização com Quádrupla (V4), Quíntupla Felina (FeLV) após testagem e Antirrábica, adequadas ao estilo de vida do gato.'
  },
  {
    id: 'ortopedia-canina',
    species: ['dogs'],
    icon: Activity,
    badgeBoth: 'Ortopedia Canina',
    badgeDog: 'Ortopedia & Mobilidade',
    badgeCat: 'Mobilidade',
    titleBoth: 'Manejo de Dor e Displasia Canina',
    titleDog: 'Controle de Dor e Displasia em Cães',
    titleCat: 'Controle de Dor',
    descBoth: 'Analgesia multimodal e acompanhamento de displasia coxofemoral, artrose e mobilidade articular em cães.',
    descDog: 'Acompanhamento de displasia coxofemoral, doença articular degenerativa e dor lombar para manter o cão ativo.',
    descCat: ''
  },
  {
    id: 'renal-felina',
    species: ['cats'],
    icon: Heart,
    badgeBoth: 'Medicina Felina',
    badgeDog: 'Saúde Interna',
    badgeCat: 'Saúde Renal & Urinária',
    titleBoth: 'Saúde Renal e Urinária Felina',
    titleDog: 'Saúde Interna',
    titleCat: 'Cuidados Renais, Urinários e Sênior',
    descBoth: 'Prevenção e monitoramento precoce de doença renal crônica, cistite idiopática e conforto articular em gatos.',
    descDog: '',
    descCat: 'Monitoramento precoce de função renal, saúde do trato urinário, hipertireoidismo e osteoartrite felina.'
  },
  {
    id: 'dermato',
    species: ['dogs', 'cats'],
    icon: Eye,
    badgeBoth: 'Pele & Ouvidos',
    badgeDog: 'Alergias Caninas',
    badgeCat: 'Dermatologia Felina',
    titleBoth: 'Dermatologia & Alergias',
    titleDog: 'Dermatites, Otites e Alergias em Cães',
    titleCat: 'Cuidados Dermatológicos em Gatos',
    descBoth: 'Investigação de prurido, alergias alimentares e ambientais, otites recidivantes, infecções bacterianas e fúngicas.',
    descDog: 'Controle de dermatite atópica canina, lambedura de patas, otites crônicas e prevenção contínua contra pulgas e carrapatos.',
    descCat: 'Tratamento delicado de alopecias, alergias a picada de pulgas, dermatofitose e lesões cutâneas sem sobrecarga ao felino.'
  },
  {
    id: 'prescricao',
    species: ['dogs', 'cats'],
    icon: FileText,
    badgeBoth: 'Conformidade Anvisa',
    badgeDog: 'Dose Calculada (mg/kg)',
    badgeCat: 'Manipulação Segura',
    titleBoth: 'Prescrição Personalizada',
    titleDog: 'Receituário Calculado por Peso',
    titleCat: 'Formulações Seguras para Gatos',
    descBoth: 'Emissão de receitas em conformidade com a RDC Anvisa nº 1.000/2025, orientações detalhadas de horários e posologia.',
    descDog: 'Cálculo exato por peso vivo, escolha de comprimidos palatáveis ou manipulados e orientação clara ao tutor.',
    descCat: 'Seleção criteriosa de princípios ativos seguros para o metabolismo felino, evitando toxicidades e facilitando a administração.'
  }
];

export default function LandingPage() {
  const [activeSpeciesTab, setActiveSpeciesTab] = useState('both'); // 'both', 'dogs', 'cats'
  const [scrollProgress, setScrollProgress] = useState(0);

  const whatsappGeneralUrl = `https://wa.me/55${VET_DATA.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20Dra.%20Nilc%C3%A9ia!%20Gostaria%20de%20agendar%20uma%20consulta%20para%20o%20meu%20pet.`;

  // Track scroll progress so the 3 background pet photos transition behind the page content
  useEffect(() => {
    let frameId = null;

    const updateProgress = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(Math.min(1, Math.max(0, scrollTop / maxScroll)));
      frameId = null;
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  // Compute opacity and subtle parallax offset for each of the 3 pet backdrop images
  const getBackdropStyle = (index) => {
    let opacity = 0;
    if (index === 0) {
      opacity = scrollProgress < 0.35 ? 1 : Math.max(0, 1 - (scrollProgress - 0.35) / 0.2);
    } else if (index === 1) {
      if (scrollProgress >= 0.22 && scrollProgress <= 0.78) {
        const fadeIn = Math.min(1, (scrollProgress - 0.22) / 0.18);
        const fadeOut = scrollProgress > 0.62 ? Math.max(0, 1 - (scrollProgress - 0.62) / 0.16) : 1;
        opacity = Math.min(fadeIn, fadeOut);
      }
    } else if (index === 2) {
      opacity = scrollProgress > 0.56 ? Math.min(1, (scrollProgress - 0.56) / 0.2) : 0;
    }

    const translateY = (scrollProgress - index * 0.35) * -28;
    const scale = 1.04 + opacity * 0.03;

    return {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center center',
      opacity: opacity * 0.42,
      transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
      transition: 'opacity 0.25s ease-out',
      willChange: 'opacity, transform'
    };
  };

  const visibleServices = CLINICAL_SERVICES.filter(
    (service) => activeSpeciesTab === 'both' || service.species.includes(activeSpeciesTab)
  );

  return (
    <div className="landing-page" style={{ position: 'relative' }}>
      {/* ========================================================
          STICKY PET BACKDROP (3 IMAGENS QUE APARECEM ATRÁS AO ROLAR)
         ======================================================== */}
      <div
        aria-hidden="true"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          marginBottom: '-100vh',
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(155deg, #eefbfb 0%, #ffffff 55%, #e2f7f6 100%)'
        }}
      >
        {HERO_PET_BACKDROPS.map((pet, idx) => (
          <img
            key={pet.src}
            src={pet.src}
            alt=""
            style={getBackdropStyle(idx)}
          />
        ))}
        {/* Soft translucent Tiffany veil so foreground text stays crisp and legible */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(244, 252, 252, 0.52) 0%, rgba(255, 255, 255, 0.64) 55%, rgba(240, 251, 251, 0.72) 100%)'
        }} />
      </div>

      {/* ========================================================
          1. HERO SECTION: APRESENTAÇÃO & PERFIL DA DRA. NILCÉIA
         ======================================================== */}
      <section style={{
        padding: '62px 0 72px 0',
        position: 'relative',
        zIndex: 2,
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '40px',
            alignItems: 'center'
          }} className="hero-grid">
            {/* Left Content */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="badge-pill badge-tiffany">
                  <Sparkles size={14} color="var(--tiffany-700)" />
                  Medicina Veterinária • Lages - SC
                </span>
              </div>

              <h1 style={{
                fontSize: '2.55rem',
                lineHeight: 1.15,
                color: 'var(--slate-900)',
                marginBottom: '16px',
                textShadow: '0 1px 14px rgba(255, 255, 255, 0.85)'
              }}>
                Cuidando de <span className="text-gradient">cães e gatos</span> com dedicação, ciência e carinho.
              </h1>

              <p style={{
                fontSize: '1.06rem',
                lineHeight: 1.62,
                color: 'var(--slate-800)',
                marginBottom: '26px',
                maxWidth: '560px',
                background: 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'blur(6px)',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(10, 186, 181, 0.16)'
              }}>
                Olá! Sou a <strong>Dra. Nilcéia Silva</strong>. Minha missão é oferecer um atendimento médico veterinário individualizado, calmo e humanizado, respeitando a sensibilidade única de cada cão e gato em Lages e região.
              </p>

              {/* Highlights Micro-cards (sem duplicar telefone/endereço já exibidos no topo e card lateral) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '12px',
                borderTop: '1px solid rgba(10, 186, 181, 0.25)',
                paddingTop: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.82)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--tiffany-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tiffany-700)', flexShrink: 0 }}>
                    <Heart size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)', display: 'block' }}>Cat &amp; Dog Friendly</strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate-600)' }}>Manejo sem medo</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.82)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--tiffany-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tiffany-700)', flexShrink: 0 }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)', display: 'block' }}>Prescrição Segura</strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate-600)' }}>RDC Anvisa 1.000/2025</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.82)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--tiffany-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tiffany-700)', flexShrink: 0 }}>
                    <Syringe size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)', display: 'block' }}>Imunização Ética</strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate-600)' }}>Protocolos sob medida</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Perfil da Médica Veterinária com o botão de agendamento */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-subtle)',
                position: 'relative'
              }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--tiffany-400) 0%, var(--tiffany-700) 100%)',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(10, 186, 181, 0.35)'
                }}>
                  <Stethoscope size={46} strokeWidth={1.75} />
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
                  padding: '12px 14px',
                  marginTop: '18px',
                  border: '1px solid var(--tiffany-200)',
                  fontSize: '0.82rem',
                  lineHeight: 1.5
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: 'var(--tiffany-950)', fontWeight: 700 }}>
                    <MapPin size={15} color="var(--tiffany-600)" />
                    Atendimento com Hora Marcada
                  </div>
                  <div style={{ color: 'var(--slate-700)' }}>
                    {VET_DATA.address} - Bairro {VET_DATA.neighborhood}, {VET_DATA.city} - {VET_DATA.state}
                  </div>
                </div>

                <a
                  href={whatsappGeneralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '16px', justifyContent: 'center', padding: '11px' }}
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
      <section id="sobre" style={{
        padding: '70px 0',
        background: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(3px)',
        position: 'relative',
        zIndex: 2
      }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '45px' }}>
            <span className="badge-pill badge-tiffany">Trajetória e Vocação</span>
            <h2 style={{ fontSize: '2.1rem', marginTop: '10px', color: 'var(--slate-900)' }}>
              Sobre a Dra. Nilcéia Silva
            </h2>
            <p style={{ color: 'var(--slate-700)', fontSize: '1rem', lineHeight: 1.6, marginTop: '8px' }}>
              Uma prática médica veterinária pautada no respeito aos animais, na escuta atenta aos tutores e no rigor científico.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ padding: '28px', background: 'rgba(255, 255, 255, 0.94)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--tiffany-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tiffany-700)', marginBottom: '16px' }}>
                <Heart size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Medicina Humanizada</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                Cada animal é um membro amado da família. Priorizo consultas com tempo adequado, sem pressa, permitindo que cães e gatos se acostumem ao ambiente e sintam-se calmos e acolhidos.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', background: 'rgba(255, 255, 255, 0.94)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--tiffany-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tiffany-700)', marginBottom: '16px' }}>
                <Stethoscope size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Especial Atenção a Gatos</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                Manejo gentil voltado às particularidades do paciente felino: controle de ruídos, feromônios, toques delicados e condutas terapêuticas que respeitam o comportamento da espécie.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', background: 'rgba(255, 255, 255, 0.94)' }}>
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
      <section id="especialidades" style={{
        padding: '70px 0',
        background: 'rgba(248, 250, 252, 0.72)',
        backdropFilter: 'blur(3px)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        zIndex: 2
      }}>
        <div className="container">
          <div style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge-pill badge-tiffany">Serviços Clínicos</span>
            <h2 style={{ fontSize: '2.1rem', marginTop: '10px', color: 'var(--slate-900)' }}>
              Áreas de Cuidado Veterinário
            </h2>
            <p style={{ color: 'var(--slate-700)', fontSize: '0.95rem', marginTop: '6px' }}>
              Prevenção, diagnóstico e acompanhamento integral ao longo de todas as fases da vida do seu companheiro.
            </p>

            {/* Species Filter Tab */}
            <div style={{ display: 'inline-flex', background: '#ffffff', padding: '4px', borderRadius: '30px', boxShadow: 'var(--shadow-sm)', marginTop: '20px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setActiveSpeciesTab('both')}
                style={{
                  background: activeSpeciesTab === 'both' ? 'var(--tiffany-500)' : 'transparent',
                  color: activeSpeciesTab === 'both' ? '#ffffff' : 'var(--slate-700)',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '8px 18px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
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
                  padding: '8px 18px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
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
                  padding: '8px 18px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🐈 Gatos
              </button>
            </div>
          </div>

          {/* Services Grid dynamically adapted to activeSpeciesTab */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {visibleServices.map((service) => {
              const IconComponent = service.icon;
              const title = activeSpeciesTab === 'dogs'
                ? service.titleDog
                : activeSpeciesTab === 'cats'
                  ? service.titleCat
                  : service.titleBoth;
              const desc = activeSpeciesTab === 'dogs'
                ? service.descDog
                : activeSpeciesTab === 'cats'
                  ? service.descCat
                  : service.descBoth;
              const badge = activeSpeciesTab === 'dogs'
                ? service.badgeDog
                : activeSpeciesTab === 'cats'
                  ? service.badgeCat
                  : service.badgeBoth;

              return (
                <div
                  key={service.id}
                  className="card"
                  style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.95)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <IconComponent size={26} color="var(--tiffany-600)" />
                    <span style={{
                      fontSize: '0.70rem',
                      fontWeight: 700,
                      color: 'var(--tiffany-800)',
                      background: 'var(--tiffany-100)',
                      padding: '2px 8px',
                      borderRadius: '999px'
                    }}>
                      {badge}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{title}</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.55 }}>
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. LOCALIZAÇÃO E CONTATO EM LAGES - SC
         ======================================================== */}
      <section id="localizacao" style={{
        padding: '70px 0',
        background: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(3px)',
        position: 'relative',
        zIndex: 2
      }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--slate-900) 0%, #0d282e 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '42px',
            color: '#ffffff',
            boxShadow: 'var(--shadow-xl)',
            border: '2px solid var(--tiffany-500)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '36px',
              alignItems: 'center'
            }} className="contact-grid">
              <div>
                <span className="badge-pill" style={{ background: 'rgba(10, 186, 181, 0.2)', color: 'var(--tiffany-300)', border: '1px solid var(--tiffany-400)' }}>
                  Localização em Lages - SC
                </span>

                <h2 style={{ fontSize: '2.05rem', color: '#ffffff', marginTop: '12px', marginBottom: '12px' }}>
                  Onde nos encontrar
                </h2>

                <p style={{ color: '#cbd5e1', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '22px' }}>
                  Atendimento com hora marcada para proporcionar tranquilidade, pontualidade e cuidado exclusivo ao seu cão ou gato.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin size={20} color="var(--tiffany-400)" />
                    <span><strong>{VET_DATA.address}</strong>, Bairro {VET_DATA.neighborhood} • {VET_DATA.city} - {VET_DATA.state} (CEP {VET_DATA.cep})</span>
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
              </div>

              {/* Card resumo acolhedor sem duplicar CRMV/Área Restrita */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(10, 186, 181, 0.35)',
                borderRadius: '16px',
                padding: '28px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  background: 'var(--tiffany-500)',
                  margin: '0 auto 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <MessageCircle size={28} />
                </div>

                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>
                  Dúvidas ou Orientações?
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.84rem', marginTop: '10px', lineHeight: 1.55, marginBottom: '18px' }}>
                  &ldquo;O amor e o respeito pelos cães e gatos guiam cada diagnóstico e cada conduta terapêutica que realizo.&rdquo;
                </p>

                <a
                  href={whatsappGeneralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%', justifyContent: 'center', padding: '11px 18px', fontSize: '0.94rem' }}
                >
                  <MessageCircle size={17} />
                  <span>Falar pelo WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
