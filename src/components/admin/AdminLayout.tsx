import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardCheck, 
  Users, 
  Cpu, 
  FileSpreadsheet, 
  ShieldCheck, 
  LogOut, 
  ExternalLink,
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
  const { laudos, clientes, ativos, orcamentos } = useData();
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

  // Menu lateral ajustado conforme requisitos (removido o item redundante 'Novo laudo')
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

  const handleLogout = () => {
    if (window.confirm('Deseja sair do painel?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--adm-bg,#0b1a30)] text-[var(--adm-text,#f4f7fc)] font-['Poppins',system-ui,sans-serif] flex flex-col antialiased">
      
      {/* 1. Header do Painel com Logo Oficial e Ações Rápidas */}
      <header className="sticky top-0 z-40 bg-[var(--adm-top,#0a1628)] border-b border-[var(--adm-line,rgba(159,176,200,0.16))] px-4 sm:px-7 h-[68px] flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link 
            to="/admin" 
            className="flex items-center text-decoration-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff] focus-visible:outline-offset-2 rounded-sm"
            aria-label="VL Engenharia, início do painel"
          >
            <img 
              src={theme === 'dark' ? '/vl-logo-compacto-escuro.svg' : '/vl-logo-compacto.svg'} 
              alt="VL Engenharia" 
              className="h-[38px] w-auto block select-none" 
            />
          </Link>
          <span className="text-[0.78rem] font-medium py-1 px-3 rounded-full border border-[var(--adm-line,rgba(159,176,200,0.16))] text-[var(--adm-mut,#a9b8cf)] hidden sm:inline-block">
            Painel técnico
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            to="/"
            className="h-10 px-3.5 rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] bg-transparent text-[var(--adm-text,#f4f7fc)] text-[0.88rem] font-medium inline-flex items-center gap-2 hover:border-[#6ea1ff] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff] focus-visible:outline-offset-2"
            title="Ver o site institucional"
          >
            <span>Ver site</span>
            <ExternalLink className="w-4 h-4 opacity-75" />
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] bg-transparent text-[var(--adm-text,#f4f7fc)] flex items-center justify-center hover:border-[#6ea1ff] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff] focus-visible:outline-offset-2"
            aria-label="Alternar tema"
            title="Alternar tema"
          >
            {theme === 'dark' ? <Sun className="w-[18px] h-[18px] text-[#fbbf24]" /> : <Moon className="w-[18px] h-[18px] text-[var(--adm-text)]" />}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-10 h-10 rounded-lg border border-[var(--adm-line,rgba(159,176,200,0.16))] bg-transparent text-[var(--adm-text,#f4f7fc)] hover:text-[#ff8a8a] hover:border-[#ff8a8a] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#ff8a8a] focus-visible:outline-offset-2"
            aria-label="Sair"
            title="Sair"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </header>

      {/* 2. Container Principal com Barra Lateral e Conteúdo */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* Barra Lateral (Navy Sidebar) */}
        <aside 
          className="w-full md:w-[280px] bg-[var(--adm-side,#0e2347)] border-r border-[var(--adm-line,rgba(159,176,200,0.16))] p-4 flex md:flex-col gap-1 md:sticky md:top-[68px] md:self-start md:h-[calc(100vh-68px)] overflow-x-auto md:overflow-y-auto flex-none z-30"
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
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-[0.92rem] font-medium whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#6ea1ff] focus-visible:outline-offset-2 ${
                      isActive
                        ? 'bg-[var(--adm-blue,#2160db)] text-white shadow-xs'
                        : 'text-[var(--adm-text,#f4f7fc)] hover:bg-[rgba(110,161,255,0.1)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-[18px] h-[18px] flex-none opacity-85" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[0.72rem] min-w-[22px] text-center px-1.5 py-0.5 rounded font-medium ${
                        isActive ? 'bg-white/25 text-white' : 'bg-[rgba(110,161,255,0.18)] text-[var(--adm-text)]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
          </nav>

          {/* 3. Rodapé da Lateral com Perfil do Usuário (Gemini Removido) */}
          <div className="hidden md:flex items-center gap-3 pt-4 pb-1 border-t border-[var(--adm-line,rgba(159,176,200,0.16))] mt-auto">
            <div 
              className="w-11 h-11 rounded-full bg-[var(--adm-blue,#2160db)] bg-cover bg-center flex items-center justify-center font-semibold text-white flex-none overflow-hidden text-[0.9rem]"
              style={vitorPhoto ? { backgroundImage: `url(${vitorPhoto})` } : undefined}
              aria-hidden="true"
            >
              {!vitorPhoto && (currentUser?.nome ? currentUser.nome.charAt(0).toUpperCase() : 'V')}
            </div>
            <div className="min-w-0 leading-tight">
              <b className="block font-semibold text-[var(--adm-text,#f4f7fc)] truncate text-[0.92rem]">
                {currentUser?.nome || 'Vitor Leonardo'}
              </b>
              <span className="text-[0.8rem] text-[var(--adm-mut,#a9b8cf)]">
                {isMaster ? 'Perfil Master' : 'Técnico Homologado'}
              </span>
            </div>
          </div>
        </aside>

        {/* Conteúdo da Visão Atual */}
        <main className="flex-1 p-5 sm:p-9 lg:p-10 min-w-0 overflow-x-hidden">
          {children}
        </main>

      </div>
    </div>
  );
};
