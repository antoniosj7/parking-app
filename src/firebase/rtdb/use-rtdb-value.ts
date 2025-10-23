'use client';
import { useEffect, useState, useRef } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { useDatabase } from '../provider';

export function useRtdbValue<T>(path: string) {
  const database = useDatabase();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pathRef = useRef(path);

  useEffect(() => {
    if (!database) {
      setLoading(false);
      return;
    }
    
    // Si el path cambia, resetea el estado
    if(pathRef.current !== path) {
        setLoading(true);
        setData(null);
        setError(null);
        pathRef.current = path;
    }

    const valueRef = ref(database, path);

    const unsubscribe = onValue(
      valueRef,
      (snapshot) => {
        setData(snapshot.val() as T);
        setLoading(false);
      },
      (err: Error) => {
        console.error(`Error fetching RTDB value for path: ${path}`, err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup: desuscribirse del listener cuando el componente se desmonte o el path cambie.
    return () => off(valueRef, 'value', unsubscribe);

  }, [database, path]);

  return { data, loading, error };
}
