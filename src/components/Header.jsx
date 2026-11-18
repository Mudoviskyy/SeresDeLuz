import React from 'react';
import { 
  Heart, 
  Phone, 
  MapPin, 
  Clock, 
  FileText, 
  MessageCircle, 
  Sparkles,
  ShieldCheck,
  Lock,
  LogOut,
  UserCheck
} from 'lucide-react';
import { VET_DATA } from '../data/prescriptionTemplates';

export default function Header({ currentView, setCurrentView, currentUser, setIsLoginOpen, handleLogout }) {
  const whatsappUrl = `https://wa.me/55${VET_DATA.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20Dra.%20Nilc%C3%A9ia!%20Gostaria%20de%20agendar%20uma%20consulta%20para%20o%20meu%20pet.`;

  const handleDashboardClick = () => {
    if (currentUser) {
      setCurrentView('dashboard');
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <header className="header-wrapper no-print" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* Top Bar de Localização & Contato Único */}
      <div style={{
        background: 'var(--slate-900)',
        color: '#e2f4f3',
        fontSize: '0.82rem',
        padding: '7px 0',
        borderBottom: '1px solid rgba(10, 186, 181, 0.25)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="var(--tiffany-400)" />
              <strong>{VET_DATA.address}</strong>, {VET_DATA.neighborhood} • {VET_DATA.city} - {VET_DATA.state} (CEP {VET_DATA.cep})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="var(--tiffany-400)" />
              {VET_DATA.hours}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span className="badge-pill badge-tiffany" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
              <ShieldCheck size={12} /> {VET_DATA.crmv}
            </span>
            <a 
              href={`tel:${VET_DATA.phone.replace(/\D/g, '')}`} 
              style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fff', fontWeight: 600 }}
            >
              <Phone size={13} color="var(--tiffany-400)" /> {VET_DATA.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '10px',
          paddingBottom: '10px',
          minHeight: '68px'
        }}>
          {/* Logo & Identificação Pessoal da Médica */}
          <div 
            onClick={() => setCurrentView('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--tiffany-500) 0%, var(--tiffany-700) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(10, 186, 181, 0.35)',
              position: 'relative'
            }}>
              <Heart size={20} fill="#ffffff" strokeWidth={1.5} />
              <Sparkles size={12} style={{ position: 'absolute', top: -2, right: -2, color: 'var(--amber-400)' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  letterSpacing: '-0.4px',
                  color: 'var(--slate-900)',
                  fontFamily: 'var(--font-display)'
                }}>
                  Dra. Nilcéia Silva
                </span>
                <span style={{
                  background: 'var(--tiffany-100)',
                  color: 'var(--tiffany-800)',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 700
                }}>
                  CRMV-SC 16442
                </span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)' }}>
                Medicina Veterinária • Cães e Gatos
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => setCurrentView('landing')}
              style={{
                background: 'none',
                border: 'none',
                fontWeight: currentView === 'landing' ? '700' : '500',
                color: currentView === 'landing' ? 'var(--tiffany-600)' : 'var(--slate-700)',
                fontSize: '0.92rem',
                cursor: 'pointer',
                padding: '6px 0',
                borderBottom: currentView === 'landing' ? '2px solid var(--tiffany-500)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Início / Sobre a Médica
            </button>

            {currentView === 'landing' && (
              <>
                <a href="#sobre" style={{ fontSize: '0.9rem', color: 'var(--slate-700)', fontWeight: 500 }}>
                  Trajetória
                </a>
                <a href="#especialidades" style={{ fontSize: '0.9rem', color: 'var(--slate-700)', fontWeight: 500 }}>
                  Cães & Gatos
                </a>
                <a href="#localizacao" style={{ fontSize: '0.9rem', color: 'var(--slate-700)', fontWeight: 500 }}>
                  Localização
                </a>
              </>
            )}

            {/* Switch to Prescription Tool (Dashboard / Login) */}
            <button
              onClick={handleDashboardClick}
              className="btn"
              style={{
                background: currentView === 'dashboard' ? 'var(--tiffany-500)' : 'var(--tiffany-50)',
                color: currentView === 'dashboard' ? '#ffffff' : 'var(--tiffany-800)',
                border: '1.5px solid var(--tiffany-300)',
                padding: '7px 14px',
                fontSize: '0.86rem'
              }}
            >
              {currentUser ? <UserCheck size={15} /> : <Lock size={14} />}
              <span>{currentUser ? 'Painel de Receituário' : 'Acesso Restrito: Receituário'}</span>
            </button>

            {/* If logged in: Logout button */}
            {currentUser && (
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '0.78rem',
                  color: 'var(--slate-600)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Sair do painel restrito"
              >
                <LogOut size={13} /> Sair
              </button>
            )}

            {/* WhatsApp Direct Appointment */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ padding: '7px 16px', fontSize: '0.86rem' }}
            >
              <MessageCircle size={15} />
              <span>(49) 99955-5421</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
