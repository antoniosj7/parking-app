'use client';
import { useEffect, useState, useRef } from 'react';
import { onSnapshot, queryEqual, type Query, type DocumentData, type QuerySnapshot, type FirestoreError } from 'firebase/firestore';

export function useCollection<T extends DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const queryRef = useRef<Query<T> | null>(null);

  useEffect(() => {
    if (query === null) {
      setData(null);
      setLoading(false);
      return;
    }
    
    // Check if the query has changed
    if (queryRef.current && queryEqual(queryRef.current, query)) {
      return;
    }
    queryRef.current = query;
    
    setLoading(true);

    const unsubscribe = onSnapshot(query, 
      (snapshot: QuerySnapshot<T>) => {
        const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setData(docs);
        setLoading(false);
      }, 
      (err: FirestoreError) => {
        console.error("Error fetching collection:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
