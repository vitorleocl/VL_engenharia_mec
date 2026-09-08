import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Cpu, 
  FileSpreadsheet, 
  Calendar, 
  Copy, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Home, 
  Bell,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser, logout, isOnline, loginDemo } = useAuth();
  const { usoIA, contatos } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If no user is logged in, redirect to login page
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const isMaster = currentUser.role === 'master';
  const isColaborador = currentUser.role === 'colaborador' || isMaster;
  const isCliente = currentUser.role === 'cliente';

  const menuItems = [
    {
      label: 'Visão Geral',
      path: '/admin',
      icon: LayoutDashboard,
      visible: true,
    },
    {
      label: 'Central de Laudos',
      path: '/admin/laudos',
      icon: FileText,
      visible: true,
      badge: '14 Módulos',
    },
    {
      label: 'Clientes',
      path: '/admin/clientes',
      icon: Users,
      visible: isColaborador,
    },
    {
      label: 'Ativos / Equipamentos',
      path: '/admin/ativos',
      icon: Cpu,
      visible: true,
    },
    {
      label: 'Orçamentos',
      path: '/admin/orcamentos',
      icon: FileSpreadsheet,
      visible: isColaborador,
    },
    {
      label: 'Agenda de Vistorias',
      path: '/admin/agenda',
      icon: Calendar,
      visible: true,
    },
    {
      label: 'Templates de Laudo',
      path: '/admin/templates',
      icon: Copy,
      visible: isColaborador,
    },
    {
      label: 'Logs de Auditoria',
      path: '/admin/auditoria',
      icon: ShieldCheck,
      visible: isMaster, // Strict Master-only
      badge: 'Master',
    },
    {
      label: 'Gestão de Acessos',
      path: '/admin/usuarios',
      icon: UserCheck,
      visible: isMaster, // Strict Master-only
    },
  ].filter(i => i.visible);

  const contatosNovos = contatos.filter(c => !c.respondido).length;
  const percIA = Math.min(100, Math.round((usoIA.totalChamadas / usoIA.limiteMensal) * 100));

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0B1E3D] text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Menu Lateral"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-tight text-white">
              VL <span className="text-[#1565D8]">ENGENHARIA</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900 text-blue-200 font-mono">
              PAINEL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
              <Wifi className="w-3 h-3" />
              <span>Online</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800 animate-pulse">
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </span>
          )}
        </div>
      </div>

      {/* Sidebar Desktop */}
      <aside className={`
        ${mobileSidebarOpen ? 'block' : 'hidden'} md:block
        fixed md:sticky top-0 left-0 z-30
        w-64 h-screen bg-[#0B1E3D] text-slate-300
        flex flex-col justify-between border-r border-slate-800 shrink-0
        shadow-xl md:shadow-none
      `}>
        
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <img src="/logo.svg" alt="VL" className="h-6 w-auto" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white tracking-tight block leading-tight">
                  VL ENGENHARIA
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  CREA-PE 1822299490
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                {currentUser.nome.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {currentUser.nome}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                    isMaster 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-600/40' 
                      : isColaborador 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-600/40' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-600/40'
                  }`}>
                    {currentUser.role.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
                    {currentUser.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`
                    flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all
                    ${active 
                      ? 'bg-[#1565D8] text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with AI Quota and Exit */}
        <div className="p-3 border-t border-slate-800 space-y-3">
          
          {/* AI Usage Tracker Widget */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-slate-300 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>IA Diagnósticos</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {usoIA.totalChamadas} / {usoIA.limiteMensal}
              </span>
            </div>
            
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  percIA > 90 ? 'bg-red-500' : percIA > 70 ? 'bg-amber-500' : 'bg-[#1565D8]'
                }`}
                style={{ width: `${percIA}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Análise técnica automatizada de fotos e conformidade legal.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              title="Ir para o site público"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Site Público</span>
            </Link>

            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              title="Encerrar Sessão"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>

        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Desktop Top Status Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
          <div>
            <h1 className="text-lg font-extrabold text-[#0B1E3D]">
              VL Engenharia — Gestão Técnica Operacional
            </h1>
            <p className="text-xs text-slate-500">
              Ambiente de laudos, ensaios de campo, apreciação HRN e emissão de ART CREA-PE
            </p>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Online/Offline status */}
            <div className="flex items-center gap-2">
              {isOnline ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Conectado à Nuvem</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold animate-pulse">
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>Modo Offline (IndexedDB)</span>
                </div>
              )}
            </div>

            {/* Notification on pending contact forms */}
            {contatosNovos > 0 && isColaborador && (
              <div 
                onClick={() => navigate('/admin')} 
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1565D8] border border-blue-200 text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors"
                title={`${contatosNovos} nova(s) mensagem(ns) no site`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{contatosNovos} Contato(s) novo(s)</span>
              </div>
            )}

            {/* Quick user role selector for test/demo mode */}
            <div className="text-xs font-medium text-slate-600 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-slate-400">Perfil:</span>
              <strong className="text-[#0B1E3D] capitalize">{currentUser.role}</strong>
            </div>

          </div>
        </header>

        {/* View Body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>

      </main>

    </div>
  );
};
