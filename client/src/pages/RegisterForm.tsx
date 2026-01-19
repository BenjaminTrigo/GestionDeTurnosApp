import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, Sparkles, User } from "lucide-react";
import { BackgroundDecoration } from "@/components/BackgroundDecoration"
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";



export const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (event:React.FormEvent) => {
            event.preventDefault();
            setIsLoading(true);
            // Simulate login
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setIsLoading(false);
        try {
            // Enviamos los datos a nuestro endpoint de Node.js
            await api.post('/register', { name, email, password });
            
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            navigate('/'); // Lo enviamos al login
        } catch (error) {
            alert(error.response?.data?.message || 'Error al registrarse');
        }
        
    } 

return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
            <div className="text-left mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 animate-pulse-glow">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>
            </div>

                {/* Logo and Header */}
                <div className="w-full max-w-md">
                    <BackgroundDecoration />
                    {/* LOGO */}
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Registrese!
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Ingresa tus credenciales para crear una nueva cuenta.
                        </p>
                </div>

                {/* Form Container */}
                <div className="glass-card p-8 gold-glow">
                    <form className="space-y-8">
                        {/* Full Name */}
                        <div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="fullName"
                                    className="text-xl font-medium textforeground"
                                > Nombre completo
                                </Label>
                            </div>

                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /> 
                                <Input 
                                id="fullName"
                                type="text"
                                variant="elegant"
                                placeholder="Nombre completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-12"
                                required
                            />
                            </div>
                        </div>
                        {/* Email Field */}
                        {/* <CustomFormEmail /> */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-foreground"
                            >
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                id="email"
                                type="email"
                                variant="elegant"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-12"
                                required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-xl font-medium text-foreground"
                            > Contraseña
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    variant="elegant"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={handleRegister}
                                    className="pl-12 pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                    ) : (
                                    <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    className="border-glass-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                                >
                                    Recordarme
                                </label>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-primary hover:bg-gold-light text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-70"
                        >
                            {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Creando cuenta...
                            </div>
                            ) : (
                            "Crear cuenta"
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-glass-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-glass text-muted-foreground">
                                o continúa con
                            </span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-12 bg-secondary/50 border-glass-border hover:bg-secondary hover:border-primary/50 transition-all duration-300 rounded-xl"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                        </svg>
                        Google
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-12 bg-secondary/50 border-glass-border hover:bg-secondary hover:border-primary/50 transition-all duration-300 rounded-xl"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                    </Button>
                    </div>
                    {/* Log in Link */}
                    <p className="text-center mt-8 text-muted-foreground">
                        ¿Tienes una cuenta?{" "}
                        <a
                        href="/"
                        className="text-primary hover:text-gold-light font-medium transition-colors"
                        >
                        Iniciar sesión
                        </a>
                    </p>
            </div>
        </div>
    );
};  
