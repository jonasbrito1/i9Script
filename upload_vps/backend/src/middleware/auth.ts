import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔐 Auth Middleware - Authorization header:', authHeader);

    const token = authHeader?.split(' ')[1];

    if (!token) {
      console.log('❌ Auth Middleware - Token não fornecido');
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: number;
      email: string;
      role: string;
    };

    console.log('✅ Auth Middleware - Token válido, usuário:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Auth Middleware - Token inválido:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const roleMiddleware = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Sem permissão' });
    }

    next();
  };
};
