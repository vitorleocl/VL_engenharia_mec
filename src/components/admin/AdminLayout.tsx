import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  ClipboardCheck, 
  Users, 
  Cpu, 
  FileSpreadsheet, 
  ShieldCheck, 
  LogOut, 
  ExternalLink,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useAdminTheme } from '../../context/ThemeContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const { laudos, clientes, ativos, orcamentos, usoIA } = useData();
  const { theme, toggleTheme } = useAdminTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const VITOR_PHOTO_DEFAULT = 'https://www.vlengenhariamecanica.com.br/assets/image-Ca17hHDt.png';
  const [vitorPhoto, setVitorPhoto] = useState<string>(VITOR_PHOTO_DEFAULT);

  useEffect(() => {
    try {
      const p = localStorage.getItem('vl-p');
      if (p) setVitorPhoto(p);
      else setVitorPhoto(VITOR_PHOTO_DEFAULT);
    } catch {
      setVitorPhoto(VITOR_PHOTO_DEFAULT);
    }
  }, []);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isMaster = currentUser.role === 'master';
  const isColaborador = currentUser.role === 'colaborador' || isMaster;

  const navItems = [
    {
      id: 'visao-geral',
      label: 'Visão geral',
      path: '/admin',
      icon: LayoutDashboard,
      badge: '',
      visible: true
    },
    {
      id: 'central-laudos',
      label: 'Central de laudos',
      path: '/admin/laudos',
      icon: FileText,
      badge: String(laudos.length),
      visible: true
    },
    {
      id: 'novo-laudo',
      label: 'Novo laudo',
      path: '/admin/laudos?novo=1',
      icon: PlusCircle,
      badge: '',
      visible: true
    },
    {
      id: 'checklist',
      label: 'Checklist de campo',
      path: '/admin/checklists-campo',
      icon: ClipboardCheck,
      badge: '',
      visible: true
    },
    {
      id: 'clientes',
      label: 'Clientes',
      path: '/admin/clientes',
      icon: Users,
      badge: String(clientes.length),
      visible: isColaborador
    },
    {
      id: 'equipamentos',
      label: 'Equipamentos',
      path: '/admin/ativos',
      icon: Cpu,
      badge: String(ativos.length),
      visible: true
    },
    {
      id: 'orcamentos',
      label: 'Orçamentos',
      path: '/admin/orcamentos',
      icon: FileSpreadsheet,
      badge: String(orcamentos.length),
      visible: isColaborador
    },
    {
      id: 'auditoria',
      label: 'Auditoria e acessos',
      path: '/admin/auditoria',
      icon: ShieldCheck,
      badge: 'Master',
      visible: isMaster
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col">
      {/* Top Mobile / Global Quick Bar */}
      <header className="sticky top-0 z-40 bg-[var(--card)] border-b border-[var(--line)] px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-decoration-none group">
            <svg width="28" height="28" viewBox="0 0 38 38" aria-hidden="true">
              <rect width="38" height="38" rx="8" fill="#1E5BD8" />
              <path
                d="M8 10l7 18 4-10 4 10 7-18"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-[family-name:var(--d)] font-extrabold text-[16px] text-[var(--ink)]">
              VL Engenharia
            </span>
          </Link>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--navy)] text-[#E7EEF7] font-semibold hidden sm:inline-block">
            Painel Técnico
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="btn-tech sm text-xs px-2.5 py-1.5 flex items-center gap-1.5"
            title="Ver o site público"
          >
            <span>Ver site</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] cursor-pointer"
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            aria-label="Alternar tema claro/escuro"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="p-1.5 rounded-lg border border-[var(--line)] text-[var(--bad)] hover:bg-[var(--paper)] cursor-pointer"
            title="Sair do painel"
            aria-label="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navy Sidebar */}
        <aside 
          className="w-full md:w-[250px] bg-[#0B2447] text-[#E7EEF7] p-3 flex md:flex-col gap-1 md:sticky md:top-14 md:self-start md:h-[calc(100vh-56px)] overflow-x-auto md:overflow-y-auto flex-none z-30"
          aria-label="Menu do painel"
        >
          <nav className="flex md:flex-col gap-1 flex-1 min-w-0" aria-label="Navegação interna">
            {navItems
              .filter(item => item.visible)
              .map((item) => {
                const isActive = 
                  item.path === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(item.path.split('?')[0]);

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-[14.5px] font-[family-name:var(--b)] font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-[#1E5BD8] text-white shadow-xs'
                        : 'text-[#B5C5DA] hover:text-white hover:bg-[#163660]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 flex-none opacity-80" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[11px] px-1.5 py-0.2 rounded font-normal ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#1D3A63] text-[#B5C5DA]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
          </nav>

          {/* User profile & discrete Gemini Quota Footer */}
          <div className="hidden md:flex flex-col gap-3 pt-3 border-t border-[#1D3A63] mt-auto">
            {/* User info with Vitor Photo */}
            <div className="flex items-center gap-2.5 text-[13.5px] text-[#B5C5DA]">
              <div 
                className="w-9 h-9 rounded-full bg-[#1E5BD8] bg-cover bg-center flex items-center justify-center font-bold text-white flex-none overflow-hidden border border-white/20"
                style={vitorPhoto ? { backgroundImage: `url(${vitorPhoto})` } : undefined}
              >
                {!vitorPhoto && (currentUser?.nome ? currentUser.nome.charAt(0).toUpperCase() : 'V')}
              </div>
              <div className="min-w-0 leading-tight">
                <span className="block font-bold text-white truncate text-[14px]">
                  {currentUser?.nome || 'Vitor Leonardo'}
                </span>
                <span className="text-[12px] text-[#92A5BC]">
                  {currentUser?.role === 'master' ? 'Perfil Master' : 'Técnico de Campo'}
                </span>
              </div>
            </div>

            {/* Discrete Gemini Quota indicator */}
            <div className="p-2 rounded-md bg-[#081B36] border border-[#163660] text-[11.5px] text-[#92A5BC] space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold text-[#B5C5DA]">
                  <Sparkles className="w-3 h-3 text-[#6BA2FA]" />
                  <span>IA Gemini</span>
                </span>
                <span>{usoIA?.totalChamadas || 0} / {usoIA?.limiteMensal || 150}</span>
              </div>
              <div className="h-1 bg-[#163660] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1E5BD8] rounded-full"
                  style={{ width: `${Math.min(100, Math.round(((usoIA?.totalChamadas || 0) / (usoIA?.limiteMensal || 150)) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {children}
        </main>

      </div>
    </div>
  );
};
