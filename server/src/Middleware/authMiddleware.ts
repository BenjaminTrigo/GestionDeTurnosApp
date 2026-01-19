import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Espera: "Bearer TOKEN"

  if (!token) return res.status(401).json({ message: 'Acceso denegado. No hay token.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verified; // Guardamos los datos del usuario en la petición
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token no válido' });
  }
};