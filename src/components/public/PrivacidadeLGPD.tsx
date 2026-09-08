import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2, Mail } from 'lucide-react';

export const PrivacidadeLGPD: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#1565D8] hover:text-[#0b4fb8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a Página Principal</span>
          </Link>
        </div>

        {/* Document Card */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          
          <div className="border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1565D8] text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Conformidade com a Lei Federal nº 13.709/2018 (LGPD)</span>
            </div>
            <h1 className="text-3xl font-black text-[#0B1E3D] tracking-tight">
              Política de Privacidade e Proteção de Dados
            </h1>
            <p className="text-xs text-slate-500 mt-2 font-mono">
              Última atualização: Setembro de 2026 • VL Engenharia Mecânica (CREA-PE 1822299490)
            </p>
          </div>

          <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <h2 className="text-base font-bold text-[#0B1E3D] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1565D8]" />
              <span>1. Informações Gerais e Compromisso de Privacidade</span>
            </h2>
            <p>
              A <strong>VL Engenharia</strong>, representada pelo Engenheiro Mecânico Vitor Leonardo (CREA-PE 1822299490), tem o compromisso de resguardar a privacidade e proteger os dados pessoais de seus clientes, parceiros, colaboradores e visitantes desta plataforma web. Esta política esclarece a forma como coletamos, tratamos, armazenamos e protegemos as informações fornecidas voluntariamente no formulário de contato ou decorrentes da prestação de serviços de engenharia e emissão de laudos técnicos.
            </p>
          </section>

          <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <h2 className="text-base font-bold text-[#0B1E3D] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#1565D8]" />
              <span>2. Dados Coletados e Finalidade do Tratamento</span>
            </h2>
            <p>
              Tratamos apenas os dados estritamente necessários para a elaboração de propostas comerciais e execução de obrigações legais de engenharia:
            </p>
            <ul className="space-y-2 pl-4 list-disc">
              <li>
                <strong>Formulário de Contato e Orçamento:</strong> Nome completo, endereço de e-mail profissional, número de telefone com DDD, serviço de interesse e detalhes técnicos da demanda. A finalidade exclusiva é o atendimento pré-contratual e envio de propostas.
              </li>
              <li>
                <strong>Laudos e Vistorias Técnicas:</strong> Dados de empresas contratantes (Razão Social, CNPJ, endereços fabris/prediais) e identificação de representantes técnicos para a emissão formal da ART (Anotação de Responsabilidade Técnica) junto ao CREA-PE e elaboração dos memoriais.
              </li>
              <li>
                <strong>Cookies Técnicos:</strong> Utilizamos apenas dados essenciais de sessão e armazenamento local (localStorage / IndexedDB) para garantir a persistência segura de vistorias em campo e integridade das rotas.
              </li>
            </ul>
          </section>

          <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <h2 className="text-base font-bold text-[#0B1E3D] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1565D8]" />
              <span>3. Compartilhamento e Sigilo Profissional</span>
            </h2>
            <p>
              A VL Engenharia não comercializa, não aluga e não compartilha dados pessoais ou industriais confidenciais com terceiros para fins publicitários. O compartilhamento ocorre exclusivamente:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc">
              <li>Com o Conselho Regional de Engenharia e Agronomia (CREA-PE) para o protocolo obrigatório das ARTs emitidas.</li>
              <li>Com prestadores de serviços de infraestrutura de nuvem certificada (Google Cloud / Firebase Firestore), sob padrões internacionais de criptografia em trânsito (HTTPS/TLS) e em repouso.</li>
              <li>Em caso de determinação judicial ou requisição legal expressa de órgãos fiscalizadores competentes.</li>
            </ul>
          </section>

          <section className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <h2 className="text-base font-bold text-[#0B1E3D] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#1565D8]" />
              <span>4. Direitos do Titular de Dados e Encarregado (DPO)</span>
            </h2>
            <p>
              Em cumprimento ao Art. 18 da Lei 13.709/2018, você pode a qualquer momento solicitar:
            </p>
            <ul className="space-y-1 pl-4 list-disc">
              <li>Confirmação da existência de tratamento e acesso aos dados cadastrados.</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
              <li>Eliminação de dados tratados com base no consentimento (exceto os que devam ser mantidos por exigência do Código Civil ou Resoluções do CONFEA/CREA).</li>
            </ul>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-3">
              <p className="font-bold text-[#0B1E3D] text-xs uppercase">Canal Direto de Privacidade:</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta Política, contate diretamente o Responsável Técnico:
              </p>
              <p className="text-sm font-bold text-[#1565D8] mt-1">
                vitorleonardocl@gmail.com
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
