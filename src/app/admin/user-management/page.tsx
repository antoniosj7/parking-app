'use client';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2 } from "lucide-react";
import { useDatabase, useAuth } from "@/firebase";
import { ref, onValue, set, push, child } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { type User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

function UserRow({ user, onRoleChange }: { user: User; onRoleChange: (uid: string, role: 'admin' | 'user') => void; }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{user.displayName || 'N/A'}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Select
          defaultValue={user.role}
          onValueChange={(value) => onRoleChange(user.uid, value as 'admin' | 'user')}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Usuario</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
}

function CreateUserForm({ onUserCreated }: { onUserCreated: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const db = useDatabase();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save user data (including role) in Realtime Database
      const userData: Omit<User, 'uid'> = { displayName, email, role };
      await set(ref(db, `users/${user.uid}`), userData);
      
      toast({ title: "Éxito", description: "Usuario creado correctamente." });
      onUserCreated(); // Close dialog
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="displayName">Nombre</Label>
        <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
      </div>
       <div className="grid gap-2">
          <Label htmlFor="role">Rol</Label>
          <Select value={role} onValueChange={(value) => setRole(value as 'user' | 'admin')}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Usuario</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Crear Usuario
      </Button>
    </form>
  );
}


export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const db = useDatabase();
  const { toast } = useToast();

  useEffect(() => {
    if (!db) return;
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        const usersList: User[] = Object.keys(usersData).map(uid => ({
          uid,
          ...usersData[uid]
        }));
        setUsers(usersList);
      } else {
        setUsers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const handleRoleChange = async (uid: string, role: 'admin' | 'user') => {
    if (!db) return;
    try {
      await set(ref(db, `users/${uid}/role`), role);
      toast({ title: "Rol actualizado", description: "El rol del usuario ha sido cambiado." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el rol." });
    }
  };

  return (
    <div className="flex-1 space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight font-headline">Gestión de Usuarios</h2>
                <p className="text-muted-foreground">
                    Administra los usuarios y sus roles en el sistema.
                </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuevo Usuario</DialogTitle>
                </DialogHeader>
                <CreateUserForm onUserCreated={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
        </div>
     
      <Card>
        <CardHeader>
            <CardTitle>Usuarios Registrados</CardTitle>
            <CardDescription>
                Aquí puedes ver y administrar los usuarios existentes.
            </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : users.length === 0 ? (
             <p className="text-center py-10 text-muted-foreground">No hay usuarios registrados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <UserRow key={user.uid} user={user} onRoleChange={handleRoleChange} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
