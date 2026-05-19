import { useEffect, useState } from 'react';

interface ToastMessage {
  id: number;
  text: string;
}

let nextId = 0;
const listeners = new Set<(m: ToastMessage) => void>();

export function pushToast(text: string) {
  const msg: ToastMessage = { id: nextId++, text };
  listeners.forEach((fn) => fn(msg));
}

export function ToastContainer() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (m: ToastMessage) => {
      setMessages((prev) => [...prev, m]);
      setTimeout(() => {
        setMessages((prev) => prev.filter((x) => x.id !== m.id));
      }, 4000);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  if (!messages.length) return null;

  return (
    <div className="toast-container">
      {messages.map((m) => (
        <div key={m.id} className="toast-msg">{m.text}</div>
      ))}
    </div>
  );
}
