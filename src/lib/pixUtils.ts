import QRCode from 'qrcode';

export const CHAVE_PIX_PADRAO = '10287093409';
export const CHAVE_PIX_FORMATADA_PADRAO = '102.870.934-09';
export const TITULAR_PIX_PADRAO = 'Vitor Leonardo Cordeiro Linhares';
export const CIDADE_PIX_PADRAO = 'RECIFE';

function formatEMVField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Gera a string padrão BR Code (EMV) para pagamento via PIX
 */
export function gerarPayloadPix({
  chave = CHAVE_PIX_PADRAO,
  nomeRecebedor = TITULAR_PIX_PADRAO,
  cidadeRecebedor = CIDADE_PIX_PADRAO,
  valor,
  txid = '***'
}: {
  chave?: string;
  nomeRecebedor?: string;
  cidadeRecebedor?: string;
  valor?: number;
  txid?: string;
} = {}): string {
  const chaveLimpa = chave.replace(/[^\d]/g, '').length === 11 ? chave.replace(/[^\d]/g, '') : chave;
  const merchantAccountInfo = formatEMVField('00', 'br.gov.bcb.pix') + formatEMVField('01', chaveLimpa);
  
  // Normalizar nome e cidade para caracteres ASCII e limites do padrão BACEN
  const nome = nomeRecebedor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .slice(0, 25)
    .toUpperCase();
    
  const cidade = cidadeRecebedor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .slice(0, 15)
    .toUpperCase();

  let payload =
    formatEMVField('00', '01') + // Payload Format Indicator
    formatEMVField('26', merchantAccountInfo) + // Merchant Account Information
    formatEMVField('52', '0000') + // Merchant Category Code
    formatEMVField('53', '986') + // Transaction Currency (986 = BRL)
    (valor && valor > 0 ? formatEMVField('54', valor.toFixed(2)) : '') +
    formatEMVField('58', 'BR') + // Country Code
    formatEMVField('59', nome) + // Merchant Name
    formatEMVField('60', cidade) + // Merchant City
    formatEMVField('62', formatEMVField('05', txid || '***')) + // Additional Data Field Template
    '6304'; // CRC16 prefix

  // Cálculo CRC16-CCITT
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }

  const crcHex = crc.toString(16).toUpperCase().padStart(4, '0');
  return payload + crcHex;
}

/**
 * Caminho padrão para o arquivo da imagem do QR Code do PIX oficial
 */
export const QR_CODE_PIX_PADRAO_BASE64 = '/qrcode-pix.png';

/**
 * Gera DataURL do QRCode para qualquer chave/payload PIX informado
 */
export async function gerarQrCodePixDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      width: 280,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0B1E3D',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Erro ao gerar QRCode do PIX:', err);
    return QR_CODE_PIX_PADRAO_BASE64;
  }
}
