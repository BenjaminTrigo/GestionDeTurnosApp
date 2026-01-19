import { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt';
import { query } from "../db";
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', [
    body('name').notEmpty().isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
  ], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // 1. Verificar si el usuario ya existe
    const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // 2. Encriptar la contraseña (Hash)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Insertar en la base de datos
    const newUser = await query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
      [name, email, hashedPassword, 'CLIENT']
    );

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: newUser.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario por email
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // 2. Comparar la contraseña enviada con la guardada (Hash)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // 3. Crear el Token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' } // El token expira en 8 horas
    );

    // 4. Responder con el token y datos básicos
    res.json({
      message: 'Login exitoso',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;


