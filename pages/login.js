import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('Processando...');
    const endpoint = isRegister ? '/api/register' : '/api/login';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
  const data = await res.json();

  // salva dados no localStorage
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('token', data.token);

  // redireciona para a home
  window.location.href = '/';
}
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f7f7f7' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 6px 24px rgba(0,0,0,0.15)', width: 340 }}>
        <h2 style={{ color: '#6a4f0c', textAlign: 'center', marginBottom: 20 }}>{isRegister ? 'Criar conta' : 'Entrar'}</h2>

        {isRegister && (
          <input
            type="text"
            placeholder="Nome completo"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />
        )}

        <input
          type="email"
          placeholder="E-mail"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Senha"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>{isRegister ? 'Registrar' : 'Entrar'}</button>

        <p style={{ textAlign: 'center', marginTop: 12 }}>
          {isRegister ? 'Já tem conta?' : 'Não tem conta?'}{' '}
          <span style={{ color: '#6a4f0c', cursor: 'pointer' }} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Entrar' : 'Cadastrar'}
          </span>
        </p>

        {message && <p style={{ textAlign: 'center', color: '#333', marginTop: 10 }}>{message}</p>}
      </form>
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  marginBottom: 14,
  padding: 10,
  borderRadius: 8,
  border: '1px solid #ccc',
};

const buttonStyle = {
  width: '100%',
  padding: 10,
  background: 'linear-gradient(90deg,#6a4f0c,#b68c3a)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};
