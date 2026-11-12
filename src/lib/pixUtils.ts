import QRCode from 'qrcode';

export const CHAVE_PIX_PADRAO = '10287093409';
export const CHAVE_PIX_FORMATADA_PADRAO = '102.870.934-09';
export const TITULAR_PIX_PADRAO = 'VITOR LEONARDO CORDEIRO L';
export const CIDADE_PIX_PADRAO = 'RECIFE';
export const QR_CODE_PIX_PADRAO_BASE64 = '/qrcode-pix.png';

function formatEMVField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Calcula o CRC16-CCITT-FALSE (polinômio 0x1021, valor inicial 0xFFFF)
 * sobre a string fornecida (incluindo o prefixo '6304').
 */
export function calcularCrc16CcittFalse(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Valida se um payload PIX possui CRC16 íntegro conforme BACEN / EMV
 */
export function validarCrcPix(payload: string): boolean {
  if (!payload || payload.length < 8) return false;
  const idx = payload.lastIndexOf('6304');
  if (idx === -1 || idx !== payload.length - 8) return false;
  const parteComPrefixo = payload.slice(0, idx + 4);
  const crcInformado = payload.slice(idx + 4).toUpperCase();
  const crcCalculado = calcularCrc16CcittFalse(parteComPrefixo);
  return crcInformado === crcCalculado;
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
  
  // Normalizar nome (máx. 25 caracteres) e cidade para caracteres ASCII e limites do padrão BACEN
  const nome = (nomeRecebedor || TITULAR_PIX_PADRAO)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .slice(0, 25)
    .toUpperCase();
    
  const cidade = (cidadeRecebedor || CIDADE_PIX_PADRAO)
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
    formatEMVField('59', nome) + // Merchant Name (máx 25)
    formatEMVField('60', cidade) + // Merchant City
    formatEMVField('62', formatEMVField('05', txid || '***')) + // Additional Data Field Template
    '6304'; // CRC16 prefix

  const crcHex = calcularCrc16CcittFalse(payload);
  return payload + crcHex;
}

/**
 * Teste automático de conformidade do BR Code EMV exigido pelo sistema:
 * chave: 10287093409, titular: "VITOR LEONARDO CORDEIRO L", cidade: "RECIFE", sem valor.
 * Deve resultar em:
 * 00020126330014br.gov.bcb.pix0111102870934095204000053039865802BR5925VITOR LEONARDO CORDEIRO L6006RECIFE62070503***63043BD0
 */
export function testarConformidadeBrCodePix(): { sucesso: boolean; payload: string; esperado: string } {
  const esperado = '00020126330014br.gov.bcb.pix0111102870934095204000053039865802BR5925VITOR LEONARDO CORDEIRO L6006RECIFE62070503***63043BD0';
  const resultado = gerarPayloadPix({
    chave: '10287093409',
    nomeRecebedor: 'VITOR LEONARDO CORDEIRO L',
    cidadeRecebedor: 'RECIFE',
    valor: undefined,
    txid: '***'
  });
  return {
    sucesso: resultado === esperado && validarCrcPix(resultado),
    payload: resultado,
    esperado
  };
}

// Execução imediata para garantir integridade matemática
export const TESTE_BR_CODE_STATUS = testarConformidadeBrCodePix();

/**
 * Gera string XML em SVG do QRCode com zona de silêncio de 4 módulos (margin: 4)
 */
export async function gerarQrCodePixSvg(payload: string): Promise<string> {
  try {
    return await QRCode.toString(payload, {
      type: 'svg',
      margin: 4,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0B1E3D',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Erro ao gerar SVG do QRCode:', err);
    return '';
  }
}

/**
 * Gera DataURL do QRCode para qualquer chave/payload PIX informado com margem de 4 módulos
 */
export async function gerarQrCodePixDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      width: 280,
      margin: 4,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0B1E3D',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Erro ao gerar QRCode do PIX DataURL:', err);
    return '';
  }
}

