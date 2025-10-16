export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end();
  const { name, email, message } = req.body || {};
  if(!name || !email || !message) return res.status(400).json({ error:'Dados incompletos' });

  // Aqui você pode:
  // - Enviar por e-mail via SendGrid/Nodemailer
  // - Salvar em DB (Supabase, Fauna, Firestore)
  // Para demo, apenas logamos e retornamos sucesso.

  console.log('Contato recebido', { name, email, message });
  return res.status(200).json({ ok: true });
}
