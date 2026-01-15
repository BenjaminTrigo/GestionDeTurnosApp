"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../db");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post('/register', [
    (0, express_validator_1.body)('name').notEmpty().isLength({ min: 2 }),
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        // 1. Verificar si el usuario ya existe
        const userExists = await (0, db_1.query)('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        // 2. Encriptar la contraseña (Hash)
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        // 3. Insertar en la base de datos
        const newUser = await (0, db_1.query)('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email', [name, email, hashedPassword, 'CLIENT']);
        res.status(201).json({
            message: 'Usuario registrado con éxito',
            user: newUser.rows[0]
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.default = router;
