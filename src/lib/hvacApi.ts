import { auth } from './firebase';

export type HvacFileName =
  | 'planta_hvac.dxf'
  | 'modelo_hvac.ifc'
  | 'memorial.html'
  | 'memorial.md'
  | 'resultado.json';

async function requestHvac<T>(url: string, init: RequestInit = {}): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error('Entre com uma conta autorizada para usar os projetos HVAC.');
  const token = await user.getIdToken();
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = Array.isArray(json?.fieldErrors)
      ? json.fieldErrors.map((item: any) => [item.field, item.message].filter(Boolean).join(': ')).filter(Boolean).join('\n')
      : typeof json?.detail === 'string'
      ? json.detail
      : '';
    throw new Error(details || json?.error || 'Não foi possível comunicar com o serviço HVAC.');
  }
  return json as T;
}

export async function verificarServicoHvac() {
  return requestHvac<{ status: string }>('/api/hvac/health');
}

export async function carregarCidadesHvac() {
  return requestHvac<{ aviso?: string; cidades: Record<string, { tbs: number; tbu: number; altitude_m: number }> }>(
    '/api/hvac/cities'
  );
}

export async function calcularProjetoHvac(payload: Record<string, any>) {
  return requestHvac<Record<string, any>>('/api/hvac/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function gerarPacoteHvac(payload: Record<string, any>) {
  return requestHvac<Record<string, any>>('/api/hvac/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function gerarAnaliseHvac(resultado: Record<string, any>) {
  return requestHvac<{ analysis: string }>('/api/hvac/analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ result: resultado }),
  });
}

export async function importarAmbientesDxf(file: File, layer: string, unitToM: number) {
  const data = new FormData();
  data.append('file', file);
  data.append('layer', layer);
  data.append('unit_to_m', String(unitToM));
  return requestHvac<Record<string, any>>('/api/hvac/rooms-from-dxf', {
    method: 'POST',
    body: data,
  });
}

export async function baixarArquivoHvac(jobId: string, fileName: HvacFileName | 'pacote_hvac.zip') {
  const user = auth.currentUser;
  if (!user) throw new Error('Entre com uma conta autorizada para baixar os arquivos do projeto.');
  const token = await user.getIdToken();
  const route = fileName === 'pacote_hvac.zip'
    ? `/api/hvac/jobs/${encodeURIComponent(jobId)}/bundle`
    : `/api/hvac/jobs/${encodeURIComponent(jobId)}/files/${encodeURIComponent(fileName)}`;
  const response = await fetch(route, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(json?.error || 'O arquivo expirou ou está indisponível. Gere novamente o pacote do projeto.');
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
