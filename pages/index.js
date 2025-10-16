// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { formatMoneyBRL } from '../utils/format';

const PRODUCTS = [
  { id: 'p1', name: 'Vestido Sonhador', price: 15000, image: '/images/produto1.jpg', tag: 'Nova' },
  { id: 'p2', name: 'Blusa Elegante', price: 8000, image: '/images/produto2.jpg', tag: '' },
  { id: 'p3', name: 'Saia Inspiração', price: 12000, image: '/images/produto3.jpg', tag: 'Destaque' },
  { id: 'p4', name: 'Casaco Noturno', price: 22000, image: '/images/produto4.jpg', tag: '' },
  { id: 'p5', name: 'Macacão Luxe', price: 18500, image: '/images/produto5.jpg', tag: '' },
  { id: 'p6', name: 'Blazer Sutileza', price: 21000, image: '/images/produto6.jpg', tag: '' },
];

export default function Home(){
  const [cart, setCart] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(()=> {
    const saved = typeof window !== 'undefined' && localStorage.getItem('md_cart_v1');
    if(saved) setCart(JSON.parse(saved));
  },[]);

  useEffect(()=> {
    if(typeof window !== 'undefined') localStorage.setItem('md_cart_v1', JSON.stringify(cart));
  }, [cart]);

  function addToCart(product){
    setCart(prev => {
      const found = prev.find(p => p.id === product.id);
      if(found) return prev.map(p => p.id === product.id ? {...p, qty: p.qty + 1} : p);
      return [...prev, {...product, qty:1}];
    });
    setSidebarOpen(true);
  }

  function removeFromCart(id){
    setCart(prev => prev.filter(p=> p.id !== id));
  }

  function getTotal(){
    return cart.reduce((s,i) => s + i.price * i.qty, 0);
  }

  async function checkout(){
    if(cart.length === 0) return alert('Seu carrinho está vazio.');
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ items: cart })
    });
    const data = await res.json();
    if(data.url){
      window.location.href = data.url;
    } else {
      alert('Erro ao iniciar checkout');
    }
  }

  return (
    <>
      <Head>
        <title>Mendonça Dreams — Moda Feminina</title>
        <meta name="description" content="Mendonça Dreams — Coleção feminina premium." />
      </Head>

      <header className="navbar">
        <div className="container" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <a className="navbar-brand" href="#home" style={{display:'flex', alignItems:'center', gap:12}}>
            <img src="/images/mendonca2.jpeg" alt="Logo Mendonça Dreams" className="logo-img" />

            <div>
              <div className="brand-text">Mendonça Dreams</div>
              <div style={{fontSize:12, color:'var(--muted)'}}>Moda feminina • Coleções selecionadas</div>
            </div>
          </a>

          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <a className="nav-link" href="#colecao">Coleção</a>
            <a className="nav-link" href="#sobre">Sobre</a>
            <button className="btn btn-ghost" onClick={()=> setSidebarOpen(true)}>
              Carrinho <span className="badge">{cart.reduce((s,i)=> s+i.qty,0)}</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero-section" id="home" style={{paddingTop:40}}>
          <div className="container text-center" style={{maxWidth:1100, margin:'0 auto'}}>
            <h1>Nova Coleção — Elegância Atemporal</h1>
            <p className="lead">Peças selecionadas com atenção aos detalhes. Conforto, corte e sofisticação.</p>
            <div style={{position:'relative', marginTop:20}}>
              <img src="" alt="Campanha" className="hero-img" />
            </div>
          </div>
        </section>

        {/* COLLECTION GRID */}
        <section id="colecao">
          <div className="container" style={{maxWidth:1200, margin:'0 auto'}}>
            <h2>Seleção Curada</h2>
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))',
              gap:20,
              marginTop:12
            }}>
              {PRODUCTS.map(p => (
                <article key={p.id} className="product-card product-fashion">
                  <div className="product-media" style={{position:'relative', overflow:'hidden', borderRadius:10}}>
                    <img src={p.image} alt={p.name} loading="lazy" style={{width:'100%', height:'320px', objectFit:'cover', display:'block'}} />
                    <div className="overlay">
                      <button className="btn btn-primary" onClick={()=> addToCart(p)}>Comprar</button>
                      <a href="#" className="nav-link" style={{marginLeft:12}}>Ver detalhes</a>
                    </div>
                    {p.tag && <span className="product-tag">{p.tag}</span>}
                  </div>
                  <div style={{marginTop:12}}>
                    <h3>{p.name}</h3>
                    <div className="price">{formatMoneyBRL(p.price/100)}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT / BRAND STORY */}
        <section id="sobre" style={{paddingTop:40, paddingBottom:60}}>
          <div className="container" style={{maxWidth:1000, margin:'0 auto', display:'flex', gap:30, alignItems:'center'}}>
           <div style={{flex:1}}>
  <h2>Sobre a marca</h2>
  <p style={{color:'var(--muted)'}}>
    A Mendonça Dreams nasceu do desejo de inspirar mulheres a acreditarem no próprio potencial. Nossas peças foram pensadas para transmitir poder e sofisticação em cada detalhe, para mulheres que não esperam o futuro acontecer elas o constroem.

Vista-se com propósito. Vista-se de Mendonça Dreams.
  </p>

  {/* Logo adicionada aqui 👇 */}
  <div style={{marginTop:20}}>
    <img 
      src="/images/mendonca.png" 
      alt="Logo Mendonça Dreams" 
      style={{
        width:'140px',
        height:'auto',
        opacity:0.85,
        filter:'drop-shadow(0 4px 6px rgba(0,0,0,0.4))',
        borderRadius:'12px'
      }}
    />
  </div>

  <a href="#colecao" className="btn btn-ghost" style={{marginTop:20}}>Ver coleção completa</a>
</div>

          </div>
        </section>

        {/* CONTACT */}
        <section id="contato">
          <div className="container" style={{maxWidth:800, margin:'0 auto'}}>
            <h2>Contato</h2>
            <ContactForm />
          </div>
        </section>
      </main>

      {/* Cart Sidebar */}
      <aside className={`cart-sidebar ${sidebarOpen ? 'open' : ''}`} aria-hidden={!sidebarOpen}>
        <div className="cart-header">
          <h3>Carrinho</h3>
          <button className="btn btn-ghost" onClick={()=> setSidebarOpen(false)}>×</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 && <p className="text-muted">Seu carrinho está vazio.</p>}
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="meta">
                <h4>{item.name} <small style={{color:'var(--muted)'}}>x{item.qty}</small></h4>
                <p>{formatMoneyBRL(item.price/100)}</p>
              </div>
              <div>
                <button className="btn btn-ghost" onClick={()=> removeFromCart(item.id)}>Remover</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="cart-total" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <strong>Total</strong>
            <span>{formatMoneyBRL(getTotal()/100)}</span>
          </div>
          <button className="btn btn-primary w-100" onClick={checkout} style={{width:'100%', marginTop:12}}>Finalizar compra</button>
        </div>
      </aside>

      <footer>
        <div className="container text-center py-3">
          <p>&copy; {new Date().getFullYear()} Mendonça Dreams — Todos os direitos reservados</p>
        </div>
      </footer>
    </>
  );
}

function ContactForm(){
  const [status, setStatus] = useState('');
  async function handleSubmit(e){
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const res = await fetch('/api/contact', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(f)
    });
    if(res.ok){
      setStatus('Mensagem enviada com sucesso!');
      e.target.reset();
    } else {
      setStatus('Erro ao enviar. Tente novamente.');
    }
  }
  return (
    <form onSubmit={handleSubmit} className="contact-form" style={{marginTop:12}}>
      <label>Nome<input name="name" required /></label>
      <label>Email<input name="email" type="email" required /></label>
      <label>Mensagem<textarea name="message" rows="4" required /></label>
      <button type="submit" className="btn btn-primary">Enviar</button>
      <div style={{marginTop:12, color:'var(--muted)'}}>{status}</div>
    </form>
  );
}
