// Representa un usuario en la base de datos RTDB en la ruta /users/{uid}
export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  displayName?: string;
}
