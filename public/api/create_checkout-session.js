import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' });

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { items } = req.body || [];
  if(!items || items.length === 0) return res.status(400).json({ error: 'Carrinho vazio' });

  // Mapear items para line_items do Stripe (usando preço e nome em modo "payment")
  // Aqui usamos mode=payment e definimos price_data inline para simplicidade (modo teste).
  try {
    const line_items = items.map(it => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: it.name,
        },
        unit_amount: Number(it.price), // em centavos
      },
      quantity: it.qty || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cancel`,
    });

    // Retornar a URL do Checkout para o cliente redirecionar
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar sessão' });
  }
}
