export function normalizarTelefoneWhatsApp(telefone?: string | null): string | null {
  const digitos = String(telefone || '').replace(/\D/g, '');
  if (!digitos) return null;
  if (digitos.startsWith('55') && (digitos.length === 12 || digitos.length === 13)) return digitos;
  if (digitos.length === 10 || digitos.length === 11) return `55${digitos}`;
  return null;
}

export function abrirWhatsApp(telefone: string | null | undefined, mensagem: string): boolean {
  const numero = normalizarTelefoneWhatsApp(telefone);
  if (!numero) return false;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

export function textoSemHtml(texto?: string | null): string {
  return String(texto || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
