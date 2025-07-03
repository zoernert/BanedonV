import jwt from 'jsonwebtoken';

export class AuthService {
  generateToken(userId: string, email: string): string {
    const payload = { userId, email };
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  generateRefreshToken(userId: string): string {
    const payload = { userId };
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
  }
}
