/**
 * Gerador de Payload e QR Code PIX no padrão oficial BR Code (EMV-QRCPS / Banco Central do Brasil)
 * Implementação matemática estrita de CRC16-CCITT-FALSE (polinômio 0x1021, seed 0xFFFF).
 */

function formatEmvField(id: string, value: string): string {
  const len = ('00' + value.length).slice(-2);
  return `${id}${len}${value}`;
}

/**
 * Calcula o CRC16-CCITT-FALSE sobre o payload sem o CRC final (incluindo o prefixo "6304")
 * Polinômio: 0x1021, Valor inicial: 0xFFFF, sem reflexão, sem XOR final.
 */
export function calcularCrc16CcittFalse(str: string): string {
  let crc = 0xffff;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return ('0000' + crc.toString(16).toUpperCase()).slice(-4);
}

export interface PixPayloadParams {
  chave?: string;
  chavePix?: string;
  titular: string; // máx 25 chars recomendados pelo Bacen
  cidade: string;  // máx 15 chars
  valor?: number | null;
  txid?: string;
  identificador?: string;
}

/**
 * Monta o payload BR Code completo
 */
export function gerarPixCopiaECola({
  chave,
  chavePix,
  titular,
  cidade,
  valor,
  txid,
  identificador
}: PixPayloadParams): string {
  // Limpar chave se for CPF/CNPJ ou telefone
  const chaveFinal = (chave || chavePix || '').trim();
  const txidFinal = (txid || identificador || '***').trim();
  const nomeFormatado = titular
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .slice(0, 25);
  const cidadeFormatada = cidade
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .slice(0, 15);

  // 00: Payload Format Indicator
  let payload = formatEmvField('00', '01');

  // 26: Merchant Account Information - Pix
  const gui = formatEmvField('00', 'br.gov.bcb.pix');
  const chaveEmv = formatEmvField('01', chaveFinal);
  payload += formatEmvField('26', gui + chaveEmv);

  // 52: Merchant Category Code (0000 = Geral)
  payload += formatEmvField('52', '0000');

  // 53: Transaction Currency (986 = BRL)
  payload += formatEmvField('53', '986');

  // 54: Transaction Amount (opcional)
  if (valor !== undefined && valor !== null && valor > 0) {
    const valorStr = valor.toFixed(2);
    payload += formatEmvField('54', valorStr);
  }

  // 58: Country Code (BR)
  payload += formatEmvField('58', 'BR');

  // 59: Merchant Name
  payload += formatEmvField('59', nomeFormatado);

  // 60: Merchant City
  payload += formatEmvField('60', cidadeFormatada);

  // 62: Additional Data Field Template (TXID)
  const txidEmv = formatEmvField('05', txidFinal || '***');
  payload += formatEmvField('62', txidEmv);

  // 63: CRC16 (prefixo "6304")
  const payloadCom6304 = payload + '6304';
  const crc = calcularCrc16CcittFalse(payloadCom6304);

  return payloadCom6304 + crc;
}

/**
 * Validador de CRC de um payload PIX
 */
export function validarPixCrc(payloadCompleto: string): boolean {
  if (!payloadCompleto || payloadCompleto.length < 10) return false;
  const idx6304 = payloadCompleto.lastIndexOf('6304');
  if (idx6304 === -1 || idx6304 + 8 !== payloadCompleto.length) return false;

  const base = payloadCompleto.slice(0, idx6304 + 4);
  const crcInformado = payloadCompleto.slice(idx6304 + 4);
  const crcCalculado = calcularCrc16CcittFalse(base);

  return crcInformado.toUpperCase() === crcCalculado.toUpperCase();
}

/**
 * Teste automatizado exigido no Passo 4:
 * chave 10287093409, nome "VITOR LEONARDO CORDEIRO L", cidade "RECIFE", sem valor
 * Deve bater exatamente:
 * 00020126330014br.gov.bcb.pix0111102870934095204000053039865802BR5925VITOR LEONARDO CORDEIRO L6006RECIFE62070503***63043BD0
 */
export function executarTesteOficialPixEmv(): { sucesso: boolean; payloadGerado: string; esperado: string } {
  const esperado = '00020126330014br.gov.bcb.pix0111102870934095204000053039865802BR5925VITOR LEONARDO CORDEIRO L6006RECIFE62070503***63043BD0';
  const payloadGerado = gerarPixCopiaECola({
    chave: '10287093409',
    titular: 'VITOR LEONARDO CORDEIRO L',
    cidade: 'RECIFE',
    valor: null,
    txid: '***'
  });

  return {
    sucesso: payloadGerado === esperado,
    payloadGerado,
    esperado
  };
}
