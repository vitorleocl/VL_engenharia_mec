import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { OfflineBanner } from './components/common/OfflineBanner';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { EngineeringBackgroundTheme } from './components/common/EngineeringBackgroundTheme';

// Public Views
import { LandingPage } from './components/public/LandingPage';
import { PrivacidadeLGPD } from './components/public/PrivacidadeLGPD';

// Admin Views
import { LoginView } from './components/admin/LoginView';
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardView } from './components/admin/DashboardView';
import { ClientesView } from './components/admin/ClientesView';
import { AtivosView } from './components/admin/AtivosView';
import { OrcamentosView } from './components/admin/OrcamentosView';
import { OrcamentoEditorView } from './components/admin/OrcamentoEditorView';
import { AgendaView } from './components/admin/AgendaView';
import { LaudosCentralView } from './components/admin/LaudosCentralView';
import { LaudoEditorView } from './components/admin/LaudoEditorView';
import { ChecklistCampoView } from './components/admin/ChecklistCampoView';
import { GestaoView } from './components/admin/GestaoView';

function FloatingContactHelper() {
  const location = useLocation();
  // Don't show WhatsApp floating badge inside operations admin panel or login routes
  if (
    location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/acesso-restrito' ||
    location.pathname === '/restrito'
  ) {
    return null;
  }
  return <WhatsAppButton />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] selection:bg-[#1E5BD8] selection:text-white relative">
            
            {/* Engineering Mechanical Blueprint Theme across the whole site */}
            <EngineeringBackgroundTheme />

            {/* Global Offline Status Banner */}
            <OfflineBanner />

            {/* Global Floating WhatsApp Contact for Public Customers */}
            <FloatingContactHelper />

            <Routes>
              {/* Public Website Routes */}
              <Route
                path="/"
                element={
                  <>
                    <Header />
                    <main className="flex-1">
                      <LandingPage />
                    </main>
                    <Footer />
                  </>
                }
              />
              <Route
                path="/privacidade"
                element={
                  <>
                    <Header />
                    <main className="flex-1">
                      <PrivacidadeLGPD />
                    </main>
                    <Footer />
                  </>
                }
              />

              {/* Login Routes */}
              <Route path="/login" element={<LoginView />} />
              <Route path="/admin/login" element={<LoginView />} />
              <Route path="/acesso-restrito" element={<LoginView />} />
              <Route path="/restrito" element={<LoginView />} />

              {/* Admin Panel Routes */}
              <Route
                path="/admin"
                element={
                  <AdminLayout>
                    <DashboardView />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/clientes"
                element={
                  <AdminLayout>
                    <ClientesView />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/ativos"
                element={
                  <AdminLayout>
                    <AtivosView />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/orcamentos"
                element={
                  <AdminLayout>
                    <OrcamentosView />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/orcamentos/:id"
                element={
                  <AdminLayout>
                    <OrcamentoEditorView />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/orcamentos/:id/editar"
                element={
                  <AdminLayout>
                    <OrcamentoEditorView />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/agenda"
                element={
                  <AdminLayout>
                    <AgendaView />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/laudos"
                element={
                  <AdminLayout>
                    <LaudosCentralView />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/laudos/:id"
                element={
                  <AdminLayout>
                    <LaudoEditorView />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/checklists-campo"
                element={
                  <AdminLayout>
                    <ChecklistCampoView />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/banco-checklists"
                element={<Navigate to="/admin/checklists-campo" replace />}
              />
              <Route
                path="/admin/templates"
                element={
                  <AdminLayout>
                    <LaudosCentralView />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/auditoria"
                element={
                  <AdminLayout>
                    <GestaoView />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/usuarios"
                element={
                  <AdminLayout>
                    <GestaoView />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/gestao"
                element={
                  <AdminLayout>
                    <GestaoView />
                  </AdminLayout>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
    </BrowserRouter>
  );
}
