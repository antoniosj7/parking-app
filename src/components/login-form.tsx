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
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, type User, sendPasswordResetEmail } from "firebase/auth";
import { useAuth, useDatabase } from "@/firebase";
import { Separator } from "./ui/separator";
import { ref, get } from "firebase/database";

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useDatabase();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthSuccess = async (user: User) => {
    if (!db) {
        toast({
            variant: "destructive",
            title: "Error de base de datos",
            description: "No se pudo obtener el rol del usuario.",
        });
        return;
    }
    // Obtener el rol desde Realtime Database
    const userRoleRef = ref(db, `users/${user.uid}/role`);
    const snapshot = await get(userRoleRef);
    const role = snapshot.val() || 'user';
    
    toast({
        title: "Login exitoso",
        description: `Bienvenido, ${user.displayName || user.email || 'usuario'}. Redirigiendo...`,
    });

    // Redirigir según el rol
    const targetPath = role === 'admin' ? '/admin/parking' : '/app/parking';
    router.push(targetPath);
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Error de configuración",
            description: "No se ha podido conectar con el servicio de autenticación.",
        });
        return;
    }
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        // Aquí deberíamos registrar al usuario en nuestra RTDB si es la primera vez
        // Por ahora, asumimos que ya existe o lo manejamos en el `handleAuthSuccess`
        await handleAuthSuccess(result.user);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error con Google",
            description: `${error.code || 'unknown_error'} - ${error.message || 'Error inesperado.'}`,
        });
    } finally {
        setGoogleLoading(false);
    }
  }

  const handlePasswordReset = async () => {
    if (!auth) return;
    if (!email) {
      toast({
        variant: "destructive",
        title: "Correo electrónico requerido",
        description: "Por favor, introduce tu correo electrónico para restablecer la contraseña.",
      });
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Correo de recuperación enviado",
        description: `Se ha enviado un enlace para restablecer la contraseña a ${email}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `${error.code || 'unknown_error'} - ${error.message || 'Error inesperado.'}`,
      });
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await handleAuthSuccess(userCredential.user);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error de autenticación",
            description: `${error.code || 'unknown_error'} - ${error.message || 'Error inesperado.'}`,
        });
    } finally {
        setLoading(false);
    }
  };

  return (
      <Card className="w-full shadow-2xl shadow-primary/10 border-border/50 bg-card/80 backdrop-blur-lg">
        <CardHeader className="text-center">
            <Logo className="mx-auto h-12 w-12 mb-4" />
          <CardTitle className="text-3xl font-headline">Bienvenido a PUMG</CardTitle>
          <CardDescription>
            Inicia sesión para gestionar el aparcamiento
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
              <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn} disabled={loading || googleLoading}>
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177.2 56.4l-63.1 61.9C338.4 99.8 298.4 87 248 87c-73.2 0-134.3 59.4-134.3 132.3s61.1 132.3 134.3 132.3c84.3 0 115.7-64.2 120.2-95.7H248v-65.8h239.2c1.2 12.8 2.3 26.7 2.3 41.8z"></path></svg>
                )}
                {googleLoading ? 'Iniciando...' : 'Continuar con Google'}
              </Button>
            </div>
            <div className="my-4 flex items-center">
              <Separator className="flex-1" />
              <span className="mx-4 text-xs text-muted-foreground">O INICIA SESIÓN CON EMAIL</span>
              <Separator className="flex-1" />
            </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Usuario o Email</Label>
              <Input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                placeholder="admin@pumg.com"
                required
                disabled={loading || googleLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="ml-auto inline-block text-sm underline underline-offset-4 text-primary/80 hover:text-primary"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="current-password"
                placeholder="••••••••"
                required 
                disabled={loading || googleLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading || googleLoading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col !pb-6 !pt-2">
           <p className="mt-2 text-xs text-center text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/signup"
                className="underline underline-offset-4 text-primary/90 hover:text-primary"
              >
                Regístrate
              </Link>
            </p>
        </CardFooter>
      </Card>
  )
}
