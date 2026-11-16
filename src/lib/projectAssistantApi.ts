import { auth } from './firebase';

export interface AssistantChatMessage {
  role: 'user' | 'model';
  text: string;
}

export async function enviarMensagemAssistenteProjeto(
  messages: AssistantChatMessage[],
  projectContext: Record<string, unknown>
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Entre com uma conta autorizada para usar o assistente.');

  const token = await user.getIdToken();
  const response = await fetch('/api/ai/assistente-projeto', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, projectContext }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result?.error || 'Não foi possível consultar o assistente de projetos.');
  }
  if (typeof result?.texto !== 'string' || !result.texto.trim()) {
    throw new Error('O assistente não retornou uma resposta válida.');
  }
  return result.texto.trim();
}
