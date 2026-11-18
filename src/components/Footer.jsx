import React from 'react';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  FileText, 
  MessageCircle, 
  ArrowUp,
  Lock
} from 'lucide-react';
import { VET_DATA } from '../data/prescriptionTemplates';

export default function Footer({ setCurrentView, currentUser, setIsLoginOpen }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/55${VET_DATA.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20Dra.%20Nilc%C3%A9ia!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20atendimento%20veterin%C3%A1rio.`;

  const handleDashboardClick = () => {
    if (currentUser) {
      setCurrentView('dashboard');
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <footer className="no-print" style={{
      background: 'var(--slate-900)',
      color: '#cbd5e1',
      paddingTop: '50px',
      paddingBottom: '25px',
      borderTop: '3px solid var(--tiffany-500)',
      position: 'relative'
    }}>
      <div className="container">
        
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          
          {/* Coluna 1: Sobre a Médica */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--tiffany-500) 0%, var(--tiffany-700) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 10px rgba(10, 186, 181, 0.35)'
              }}>
                <Heart size={20} fill="#fff" />
              </div>
              <div>
                <span style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.3px'
                }}>
                  Dra. Nilcéia Silva
                </span>
                <span style={{
                  display: 'block',
                  fontSize: '0.70rem',
                  color: 'var(--tiffany-400)',
                  fontWeight: 700,
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase'
                }}>
                  CRMV-SC 16442
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '16px' }}>
              Medicina veterinária dedicada com atendimento atencioso, calmo e humanizado para cães e gatos em Lages - SC.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(10, 186, 181, 0.1)', padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(10, 186, 181, 0.3)' }}>
              <ShieldCheck size={14} color="var(--tiffany-400)" />
              <span style={{ fontSize: '0.78rem', color: '#e2f4f3', fontWeight: 600 }}>
                {VET_DATA.name} • {VET_DATA.crmv}
              </span>
            </div>
          </div>

          {/* Coluna 2: Localização e Contato Único */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.96rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="var(--tiffany-400)" />
              Endereço & Contato
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ color: '#f1f5f9', display: 'block' }}>Consultório / Atendimento:</strong>
                <span>{VET_DATA.address}</span>
                <div style={{ color: '#94a3b8' }}>Bairro {VET_DATA.neighborhood} • {VET_DATA.city} - {VET_DATA.state}</div>
                <div style={{ color: 'var(--tiffany-400)', fontWeight: 600 }}>CEP {VET_DATA.cep}</div>
              </div>

              <div>
                <strong style={{ color: '#f1f5f9', display: 'block' }}>Telefone & WhatsApp:</strong>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tiffany-400)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <MessageCircle size={14} /> {VET_DATA.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Coluna 3: Horários */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.96rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="var(--tiffany-400)" />
              Horários de Atendimento
            </h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Segunda a Sexta:</span>
                <span style={{ color: '#f1f5f9', fontWeight: 600 }}>08:30 às 19:00</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Sábados:</span>
                <span style={{ color: '#f1f5f9', fontWeight: 600 }}>09:00 às 13:00</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                <span style={{ color: '#94a3b8' }}>Domingos:</span>
                <span style={{ color: 'var(--amber-400)', fontWeight: 600 }}>Plantão Sob Aviso</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Acesso Restrito da Médica */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.96rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="var(--tiffany-400)" />
              Área Restrita
            </h4>

            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '12px' }}>
              Acesso exclusivo para emissão e impressão de receituários veterinários normatizados.
            </p>

            <button
              onClick={handleDashboardClick}
              style={{
                background: 'rgba(10, 186, 181, 0.15)',
                border: '1px solid var(--tiffany-500)',
                color: 'var(--tiffany-300)',
                padding: '8px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {currentUser ? <FileText size={14} /> : <Lock size={14} />}
              <span>{currentUser ? 'Acessar Painel de Receituário' : 'Entrar na Área de Receituário'}</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          fontSize: '0.76rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} Dra. Nilcéia Silva • Médica Veterinária (CRMV-SC 16442). Todos os direitos reservados.
            <div style={{ marginTop: '2px', color: '#94a3b8' }}>
              {VET_DATA.address} - Bairro Coral, Lages - SC, CEP 88508-500 • Tel: {VET_DATA.phone}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span>Conforme Resoluções CFMV / CRMV-SC & RDC Anvisa nº 1.000/2025</span>
            <button
              onClick={scrollToTop}
              title="Voltar ao Topo"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
