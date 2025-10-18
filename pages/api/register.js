import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  const filePath = path.join(process.cwd(), 'data', 'users.json');
  if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath));

  const users = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: 'E-mail já cadastrado.' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), name, email, password: hashed };
  users.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  res.status(200).json({ message: 'Usuário registrado com sucesso!' });
}
