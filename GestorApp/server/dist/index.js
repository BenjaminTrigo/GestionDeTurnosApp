"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
//Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Ruta de prueba para verificar la conexión a la DB
// Esta ruta intenta conectarse a la base de datos y devuelve la hora actual.
app.get('/test-db', async (req, res) => {
    try {
        const result = await (0, db_1.query)('SELECT NOW()');
        res.json({ message: 'Conexión exitosa', time: result.rows[0] });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error al conectar a la base de datos');
    }
});
//app.use('/', authRoutes); 
app.use('/api', auth_1.default); //si quieres que sea /api/register
// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});
app.use(express_1.default.json());
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
