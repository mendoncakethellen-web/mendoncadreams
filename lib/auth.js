import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'mendonca_super_secret';

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    SECRET,
    { expiresIn: '2h' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
