import { Router, Response } from 'express';
import { query } from '../db';
import { verifyToken } from '../Middleware/authMiddleware';

const router = Router();

router.post('/appointments', verifyToken, async (req: any, res: Response) => {
  const { services_id, appointments_date, appointments_time } = req.body; 
  const users_id = req.user.id; 

  try {
    // --- VALIDACIÓN DE HORARIOS DE ATENCIÓN ---
    
    // 1. Validar que no sea fin de semana
    const dayOfWeek = new Date(appointments_date).getUTCDay(); // 0 = Domingo, 6 = Sábado
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({ message: 'No abrimos los fines de semana' });
    }

    // 2. Validar que esté dentro del rango (09:00 a 18:00)
    const hour = parseInt(appointments_time.split(':')[0]);
    if (hour < 9 || hour >= 18) {
      return res.status(400).json({ message: 'El horario de atención es de 09:00 a 18:00' });
    }

    // 3. Validar que la fecha no sea en el pasado
    const selectedDate = new Date(`${appointments_date}T${appointments_time}`);
    if (selectedDate < new Date()) {
      return res.status(400).json({ message: 'No puedes reservar en el pasado' });
    }
    
    // Verificar si el servicio existe 
    const serviceExists = await query('SELECT id FROM services WHERE id = $1', [services_id]);
    if (serviceExists.rows.length === 0) {
      return res.status(400).json({ message: 'Servicio no encontrado' });
    }

    // 1. Validar si el horario ya está ocupado
    const checkConflict = await query(
      'SELECT * FROM appointments WHERE appointments_date = $1 AND appointments_time = $2 AND status != $3',
      [appointments_date, appointments_time, 'CANCELLED']
    );

    if (checkConflict.rows.length > 0) {
      return res.status(400).json({ message: 'Este horario ya está reservado' });
    }

    // 2. Crear el turno
    const newAppointment = await query(
      'INSERT INTO appointments (users_id, services_id, appointments_date, appointments_time) VALUES ($1, $2, $3, $4) RETURNING *',
      [users_id, services_id, appointments_date, appointments_time]
    );

    res.status(201).json({
      message: 'Turno reservado con éxito',
      appointment: newAppointment.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al reservar el turno' });
  }
});

router.get('/my-appointments', verifyToken, async (req: any, res: Response) => {
  const users_id = req.user.id; // Extraemos el ID del token verificado

  try {
    const myAppointments = await query(
      `SELECT 
        a.id, 
        a.appointments_date as date, 
        a.appointments_time as time, 
        a.status,
        s.name as services_name,
        s.price as services_price
      FROM appointments a
      JOIN services s ON a.services_id = s.id
      WHERE a.users_id = $1
      ORDER BY a.appointments_date DESC, a.appointments_time DESC`,
      [users_id]
    );

    res.json(myAppointments.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener tus turnos' });
  }
});

export default router;