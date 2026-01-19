import  { Router, Request, Response,  } from "express";
import { query } from "../db";

const router = Router();

// Crear un nuevo servicio
router.post('/services', async (req: Request, res: Response) => {
    const { name, description, duration_minutes, price } = req.body;

    try {
        const newServices = await query (
            'INSERT INTO services (name, description, duration_minutes, price) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, duration_minutes, price]
        );

        res.status(201).json(newServices.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el servicio' });
    }
});

// Obtener todos los servicios
router.get('/services', async (req: Request, res: Response) => {
    try { 
        const services = await query('SELECT * FROM services WHERE is_active = true ORDER BY name ASC');
        res.json(services.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener servicios' });        
    } 
});

// Borrado Lógico de un servicio
router.delete('/services/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // En lugar de DELETE, usamos UPDATE
    const result = await query(
      'UPDATE services SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'El servicio no existe' });
    }

    res.json({ 
      message: 'Servicio desactivado con éxito (Borrado lógico)',
      service: result.rows[0] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al desactivar el servicio' });
  }
});

export default router;


