// pages/success.js
export default function Success({}) {
  return (
    <main className="container py-5">
      <h1>Pagamento concluído</h1>
      <p>Obrigado! Sua compra foi processada. Em breve você receberá um e-mail com detalhes.</p>
    </main>
  );
}

// pages/cancel.js
export default function Cancel(){
  return (
    <main className="container py-5">
      <h1>Pagamento cancelado</h1>
      <p>O pagamento foi cancelado. Você pode tentar novamente ou entrar em contato conosco.</p>
    </main>
  );
}
