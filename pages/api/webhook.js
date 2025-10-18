import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
};

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  const payload = await buffer(req);
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    if(process.env.STRIPE_WEBHOOK_SECRET){
      event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // Sem verificação — útil para dev/testes (não recomendado em produção)
      event = JSON.parse(payload.toString());
    }
  } catch (err) {
    console.error('Webhook error', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Trate eventos que interessam (ex: checkout.session.completed)
  if(event.type === 'checkout.session.completed'){
    const session = event.data.object;
    // TODO: salvar pedido no seu DB, enviar e-mail, etc.
    console.log('Pagamento concluído para sessão:', session.id);
  }

  res.status(200).json({ received: true });
}
