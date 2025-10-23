'use client';
import Link from "next/link"
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useUserRole } from "@/context/user-role-context";
import { createUserWithEmailAndPassword, updateProfile, type User } from "firebase/auth";
import { useAuth } from "@/firebase";

export default function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUserRole } = useUserRole();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleAuthSuccess = (user: User) => {
    setUserRole('user'); // New users are always 'user' role
    toast({
      title: "Registro exitoso",
      description: `Bienvenido, ${user.displayName || user.email}. Redirigiendo...`,
    });
    router.push('/grid'); // Redirect to the main grid for users
    router.refresh();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "Contraseña inválida",
            description: "La contraseña debe tener al menos 6 caracteres.",
        });
        return;
    }
    setLoading(true);

    if (!auth) {
        toast({
            variant: "destructive",
            title: "Error de configuración",
            description: "No se ha podido conectar con el servicio de autenticación.",
        });
        setLoading(false);
        return;
    }
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        handleAuthSuccess(userCredential.user);
    } catch (error: any) {
        let description = "Ha ocurrido un error inesperado al registrarse.";
        if (error.code === 'auth/email-already-in-use') {
            description = "Este correo electrónico ya está en uso.";
        } else if (error.code === 'auth/invalid-email') {
            description = "El formato del correo electrónico no es válido.";
        } else if (error.code === 'auth/weak-password') {
            description = "La contraseña es demasiado débil.";
        } else if (error.code === 'auth/operation-not-allowed') {
            description = "La operación no está permitida. Por favor, asegúrate de que el proveedor de inicio de sesión (Email/Contraseña) esté activado en la consola de Firebase.";
        }
        
        toast({
            variant: "destructive",
            title: "Error de registro",
            description: description,
        });
    } finally {
        setLoading(false);
    }
  };

  return (
      <Card className="w-full shadow-2xl shadow-primary/10 border-border/50 bg-card/80 backdrop-blur-lg">
        <CardHeader className="text-center">
            <Logo className="mx-auto h-12 w-12 mb-4" />
          <CardTitle className="text-3xl font-headline">Crear una Cuenta</CardTitle>
          <CardDescription>
            Ingresa tus datos para registrarte en PUMG
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="displayName">Nombre</Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                placeholder="Tu Nombre"
                required
                disabled={loading}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="new-password"
                placeholder="••••••••"
                required 
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.g.value)}
              />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col !pb-6 !pt-2">
           <p className="mt-2 text-xs text-center text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/"
                className="underline underline-offset-4 text-primary/90 hover:text-primary"
              >
                Inicia sesión
              </Link>
            </p>
        </CardFooter>
      </Card>
  )
}
