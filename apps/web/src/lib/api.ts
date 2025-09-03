export const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787';

export async function stt(audio: Blob) {
  const formData = new FormData();
  formData.append('audio', audio);
  const res = await fetch(`${API_URL}/stt`, { method: 'POST', body: formData });
  return res.json();
}

export async function parse(text: string) {
  const res = await fetch(`${API_URL}/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export async function gmailDraft(payload: { to: string; subject: string; body: string }) {
  const res = await fetch(`${API_URL}/gmail/draft`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-user-id': 'temp-user-id' // TODO: Get from auth context
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function gmailSend(payload: { to: string; subject: string; body: string; draftId?: string }) {
  const res = await fetch(`${API_URL}/gmail/send`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-user-id': 'temp-user-id' // TODO: Get from auth context
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function calendarCreate(payload: any) {
  const res = await fetch(`${API_URL}/calendar/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function checkAuthStatus() {
  const res = await fetch(`${API_URL}/auth/status`, {
    headers: { 'x-user-id': 'temp-user-id' }
  });
  return res.json();
}

export function startGoogleAuth() {
  window.location.href = `${API_URL}/auth/google`;
}
