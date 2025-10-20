import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { generateToken } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email, password } = req.body;

    // Caminho do arquivo de usuários
    const filePath = path.join(process.cwd(), 'data', 'users.json');

    if (!fs.existsSync(filePath)) {
      console.error('❌ Arquivo users.json não encontrado.');
      return res.status(400).json({ error: 'Nenhum usuário cadastrado ainda.' });
    }

    // Lê os usuários
    const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const user = users.find((u) => u.email === email);


   // Substitua console.error por mensagens mais profissionais
if (!user) {
  return res.status(400).json({ error: 'E-mail não encontrado. Verifique e tente novamente.' });
}
if (!valid) {
  return res.status(400).json({ error: 'Senha incorreta. Tente novamente ou redefina sua senha.' });
}

    // Gera token JWT
    const token = generateToken(user);
    console.log('✅ Login bem-sucedido:', email);

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('❌ Erro interno no login:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}
