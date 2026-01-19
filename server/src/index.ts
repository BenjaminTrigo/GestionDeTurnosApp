import express, { Request, Response } from "express";
import cors from 'cors';
import { query } from "./db";
import authRoutes from './Routes/auth';
import serviceRoutes from "./Routes/services";
import appointmentsRoutes  from "./Routes/appointments";

const app = express();
const PORT = process.env.PORT || 3001;

//Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba para verificar la conexión a la DB
// Esta ruta intenta conectarse a la base de datos y devuelve la hora actual.
app.get('/test-db', async (req:Request, res: Response) => {
    try {
        const result = await query('SELECT NOW()');
        res.json({ message: 'Conexión exitosa', time: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al conectar a la base de datos');
    }
});
app.use('/', authRoutes); 
app.use('/services', serviceRoutes);
app.use('/appointments', appointmentsRoutes);

// Middleware de manejo de errores
app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})