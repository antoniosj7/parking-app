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
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useUserRole } from "@/context/user-role-context";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, type User, signInAnonymously } from "firebase/auth";
import { useAuth } from "@/firebase";
import { Separator } from "./ui/separator";

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUserRole } = useUserRole();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthSuccess = async (user: User) => {
    const idTokenResult = await user.getIdTokenResult(true);
    const role = (idTokenResult.claims.role as string) || 'user';
    
    setUserRole(role as 'admin' | 'user');
    toast({
        title: "Login exitoso",
        description: `Bienvenido, ${user.displayName || user.email || 'usuario'}. Redirigiendo...`,
    });

    const targetPath = role === 'admin' ? '/admin' : '/grid';
    router.push(targetPath);
    router.refresh();
  };

  const handleAnonymousSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    try {
        const userCredential = await signInAnonymously(auth);
        await handleAuthSuccess(userCredential.user);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error de autenticación",
            description: "No se pudo iniciar sesión anónimamente.",
        });
    } finally {
        setLoading(false);
    }
  }


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
        await handleAuthSuccess(result.user);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error de autenticación con Google",
            description: "No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.",
        });
    } finally {
        setGoogleLoading(false);
    }
  }

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
        let description = "Usuario o contraseña incorrectos.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            description = "El correo electrónico o la contraseña son incorrectos.";
        } else if (error.code === 'auth/invalid-email') {
            description = "El formato del correo electrónico no es válido.";
        }

        toast({
            variant: "destructive",
            title: "Error de autenticación",
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
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión como Admin'}
            </Button>
             <Button type="button" variant="secondary" className="w-full" onClick={handleAnonymousSignIn} disabled={loading || googleLoading}>
                {loading ? 'Entrando...' : 'Entrar como invitado'}
            </Button>
          </form>
        </CardContent>
      </Card>
  )
}
