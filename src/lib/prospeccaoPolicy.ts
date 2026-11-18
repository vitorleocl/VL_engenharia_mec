export interface SuppressionEntry {
  tipo: 'email' | 'telefone';
  chaveHash: string;
}

export function hashContato(value: string): Promise<string> {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(value.trim().toLowerCase()))
    .then((digest) => Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join(''));
}

export async function estaSuprimido(
  email: string,
  telefoneE164: string,
  supressoes: SuppressionEntry[],
): Promise<boolean> {
  const [emailHash, phoneHash] = await Promise.all([
    email ? hashContato(email) : Promise.resolve(''),
    telefoneE164 ? hashContato(telefoneE164) : Promise.resolve(''),
  ]);
  return supressoes.some((item) =>
    (item.tipo === 'email' && item.chaveHash === emailHash)
    || (item.tipo === 'telefone' && item.chaveHash === phoneHash),
  );
}

function partsInRecife(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Recife',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

export function dentroJanelaComercial(
  date: Date,
  config: { diasSemana?: number[]; janelaInicio?: string; janelaFim?: string },
): boolean {
  const parts = partsInRecife(date);
  const weekdays: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const day = weekdays[parts.weekday];
  const allowedDays = config.diasSemana || [1, 2, 3, 4, 5];
  const time = `${parts.hour}:${parts.minute}`;
  return allowedDays.includes(day)
    && time >= (config.janelaInicio || '08:00')
    && time <= (config.janelaFim || '17:00');
}

export function limiteDiarioAtingido(
  sends: Array<{ canal: string; status: string }>,
  canal: 'email' | 'whatsapp',
  limite: number,
): boolean {
  const used = sends.filter((send) =>
    send.canal === canal && ['enviado', 'simulado'].includes(send.status),
  ).length;
  return used >= limite;
}
