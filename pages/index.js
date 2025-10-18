import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { formatMoneyBRL } from '../utils/format';

// === PRODUTOS COM PLACEHOLDERS ===
const PRODUCTS = [
  { id: 'p1', name: 'Vestido Sonhador', price: 15000, image: 'https://placehold.co/400x400/e6c889/3e2b00?text=Vestido+Sonhador', tag: 'Nova' },
  { id: 'p2', name: 'Blusa Elegante', price: 8000, image: 'https://placehold.co/400x400/ddd/3e2b00?text=Blusa+Elegante', tag: '' },
  { id: 'p3', name: 'Saia Inspiração', price: 12000, image: 'https://placehold.co/400x400/f2e6c9/3e2b00?text=Saia+Inspiração', tag: 'Destaque' },
  { id: 'p4', name: 'Casaco Noturno', price: 22000, image: 'https://placehold.co/400x400/d9c4a0/3e2b00?text=Casaco+Noturno', tag: '' },
  { id: 'p5', name: 'Macacão Luxe', price: 18500, image: 'https://placehold.co/400x400/f0dfb3/3e2b00?text=Macacão+Luxe', tag: '' },
  { id: 'p6', name: 'Blazer Sutileza', price: 21000, image: 'https://placehold.co/400x400/eed6b4/3e2b00?text=Blazer+Sutileza', tag: '' },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // === Recupera usuário salvo ===
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // === Recupera carrinho salvo ===
  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('md_cart_v1');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // === Salva carrinho sempre que mudar ===
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('md_cart_v1', JSON.stringify(cart));
    }
  }, [cart]);

  // === Funções do carrinho ===
  function addToCart(product) {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id);
      if (found) return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
    setSidebarOpen(true);
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(p => p.id !== id));
  }

  function getTotal() {
    return cart.reduce((s, i) => s + i.price * i.qty, 0);
  }

  async function checkout() {
    if (cart.length === 0) return alert('Seu carrinho está vazio.');
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Erro ao iniciar checkout');
    }
  }

  // === JSX ===
  return (
    <>
      <Head>
        <title>Mendonça Dreams — Moda Feminina</title>
        <meta name="description" content="Mendonça Dreams — Coleção feminina premium." />
      </Head>

      {/* === NAVBAR === */}
      <header className="navbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a className="navbar-brand" href="#home" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/images/mendonca2.jpeg" alt="Logo Mendonça Dreams" className="logo-img" />
            <div>
              <div className="brand-text">Mendonça Dreams</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Moda feminina • Coleções selecionadas</div>
            </div>
          </a>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a className="nav-link" href="#colecao">Coleção</a>
            <a className="nav-link" href="#sobre">Sobre</a>
            <a className="nav-link" href="#contato">Contato</a>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>👋 Olá, {user.name}</span>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    window.location.reload();
                  }}
                >
                  Sair
                </button>
              </div>
            ) : (
              <a className="btn btn-ghost" href="/login">Entrar</a>
            )}

            <a href="/login" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.9rem' }}>
              Login
            </a>

            <button className="btn btn-ghost" onClick={() => setSidebarOpen(true)}>
              Carrinho <span className="badge">{cart.reduce((s, i) => s + i.qty, 0)}</span>
            </button>
          </div>
        </div>
      </header>

      {/* === HERO SECTION === */}
      <main>
        <section className="hero-section" id="home" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <div className="container text-center" style={{ maxWidth: 900, margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--accent-light)', marginBottom: 10 }}>
              Bem vindo a - Mendonça Dreams
            </h1>
            <p className="lead" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', marginBottom: 30 }}>
              Peças selecionadas com atenção aos detalhes. Conforto, corte e sofisticação.
            </p>

            <div style={{ marginTop: 10 }}>
              <img
                src="/images/mendonca3.jpeg"
                alt="Coleção Mendonça Dreams"
                style={{
                  width: '100%',
                  maxWidth: 420,
                  borderRadius: 16,
                  boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
                  opacity: 0.97,
                }}
              />
            </div>

            <div style={{ marginTop: 30 }}>
              <a href="#colecao" className="btn btn-primary" style={{ padding: '10px 26px' }}>
                Ver Coleção
              </a>
            </div>
          </div>
        </section>

        {/* === COLEÇÃO === */}
        <section id="colecao">
          <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2>Seleção Curada</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 20,
                marginTop: 12
              }}
            >
              {PRODUCTS.map(p => (
                <article key={p.id} className="product-card product-fashion">
                  <div className="product-media" style={{ position: 'relative', overflow: 'hidden', borderRadius: 10 }}>
                    <img src={p.image} alt={p.name} loading="lazy" style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }} />
                    <div className="overlay">
                      <button className="btn btn-primary" onClick={() => addToCart(p)}>Comprar</button>
                      <a href="#" className="nav-link" style={{ marginLeft: 12 }}>Ver detalhes</a>
                    </div>
                    {p.tag && <span className="product-tag">{p.tag}</span>}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <h3>{p.name}</h3>
                    <div className="price">{formatMoneyBRL(p.price / 100)}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* === SOBRE === */}
        <section id="sobre" style={{ paddingTop: 40, paddingBottom: 60 }}>
          <div className="container" style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 30, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h2>Sobre a marca</h2>
              <p style={{ color: 'var(--muted)' }}>
                A Mendonça Dreams nasceu do desejo de inspirar mulheres a acreditarem no próprio potencial.
                Nossas peças foram pensadas para transmitir poder e sofisticação em cada detalhe, para
                mulheres que não esperam o futuro acontecer — elas o constroem.
              </p>

              <div style={{ marginTop: 20 }}>
                <img
                  src="/images/mendonca.png"
                  alt="Logo Mendonça Dreams"
                  style={{
                    width: '140px',
                    height: 'auto',
                    opacity: 0.85,
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))',
                    borderRadius: '12px'
                  }}
                />
              </div>

              <a href="#colecao" className="btn btn-ghost" style={{ marginTop: 20 }}>
                Ver coleção completa
              </a>
            </div>
          </div>
        </section>

        {/* === CONTATO === */}
        <section id="contato">
          <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2>Contato</h2>
            <ContactForm />
          </div>
        </section>
      </main>

      {/* === CARRINHO === */}
      <aside className={`cart-sidebar ${sidebarOpen ? 'open' : ''}`} aria-hidden={!sidebarOpen}>
        <div className="cart-header">
          <h3>Carrinho</h3>
          <button className="btn btn-ghost" onClick={() => setSidebarOpen(false)}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 && <p className="text-muted">Seu carrinho está vazio.</p>}
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="meta">
                <h4>{item.name} <small style={{ color: 'var(--muted)' }}>x{item.qty}</small></h4>
                <p>{formatMoneyBRL(item.price / 100)}</p>
              </div>
              <div>
                <button className="btn btn-ghost" onClick={() => removeFromCart(item.id)}>Remover</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="cart-total" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Total</strong>
            <span>{formatMoneyBRL(getTotal() / 100)}</span>
          </div>
          <button className="btn btn-primary w-100" onClick={checkout} style={{ width: '100%', marginTop: 12 }}>
            Finalizar compra
          </button>
        </div>
      </aside>

      {/* === FOOTER === */}
      <footer>
        <div className="container text-center py-3">
          <p>&copy; {new Date().getFullYear()} Mendonça Dreams — Todos os direitos reservados</p>
        </div>
      </footer>
    </>
  );
}

// === FORMULÁRIO DE CONTATO ===
function ContactForm() {
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f)
    });

    if (res.ok) {
      setStatus('Mensagem enviada com sucesso!');
      e.target.reset();
    } else {
      setStatus('Erro ao enviar. Tente novamente.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form" style={{ marginTop: 12 }}>
      <label>Nome<input name="name" required /></label>
      <label>Email<input name="email" type="email" required /></label>
      <label>Mensagem<textarea name="message" rows="4" required /></label>
      <button type="submit" className="btn btn-primary">Enviar</button>
      <div style={{ marginTop: 12, color: 'var(--muted)' }}>{status}</div>
    </form>
  );
}
