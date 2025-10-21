'use client';
import { useEffect, useState } from 'react';
import { onSnapshot, doc, type DocumentReference, type DocumentData, type FirestoreError } from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useDoc<T extends DocumentData>(path: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!firestore) return;
    
    const docRef = doc(firestore, path) as DocumentReference<T>;

    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ ...docSnap.data(), id: docSnap.id });
        } else {
          setData(null);
        }
        setLoading(false);
      }, 
      (err: FirestoreError) => {
        console.error(`Error fetching doc: ${path}`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path]);

  return { data, loading, error };
}
