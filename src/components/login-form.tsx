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
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "@/firebase";

export default function LoginForm() {
  const { toast } = useToast();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        description: error.message,
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
        await signInWithEmailAndPassword(auth, email, password);
        toast({
            title: "Login exitoso",
            description: `Bienvenido. Redirigiendo...`,
        });
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error de autenticación",
            description: error.message,
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
            Inicia sesión para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
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
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
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
