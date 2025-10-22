'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { useAuth } from '../provider';

// Mock user para facilitar las pruebas de desarrollo sin necesidad de iniciar sesión.
// Este usuario tiene rol de 'admin'.
const mockUser = {
  uid: 'admin-mock-uid',
  email: 'admin-dev@pumg.com',
  displayName: 'Admin de Prueba',
  getIdTokenResult: () => Promise.resolve({
    claims: { role: 'admin' },
    token: 'mock-token',
    expirationTime: '2099-12-31T23:59:59Z',
    authTime: '2024-01-01T00:00:00Z',
    issuedAtTime: '2024-01-01T00:00:00Z',
    signInProvider: 'mock',
    signInSecondFactor: null,
  }),
  // Añadir el resto de propiedades de User para que coincida con el tipo
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  providerId: 'mock',
  refreshToken: 'mock-refresh-token',
  tenantId: null,
  delete: () => Promise.resolve(),
  getIdToken: () => Promise.resolve('mock-token'),
  reload: () => Promise.resolve(),
  toJSON: () => ({}),
} as unknown as User;

const USE_MOCK_USER = process.env.NODE_ENV === 'development';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(USE_MOCK_USER ? mockUser : null);
  const [loading, setLoading] = useState(!USE_MOCK_USER);

  useEffect(() => {
    // Si estamos usando el mock, no necesitamos el listener de Firebase Auth.
    if (USE_MOCK_USER) return;
    
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Si el mock está activado y el usuario cierra sesión (user se vuelve null),
  // evitamos que el mock se vuelva a activar automáticamente.
  const effectiveUser = USE_MOCK_USER && user === null ? null : user;

  return { user: effectiveUser, loading };
}
