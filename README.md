# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Límite físico de plazas

El sistema está configurado para permitir un número fijo de plazas de aparcamiento.

### Cambiar las plazas permitidas
Para modificar las plazas de aparcamiento permitidas, debes actualizar la variable de entorno `NEXT_PUBLIC_ALLOWED_SPOTS_JSON` en tu entorno de despliegue. Esta variable debe contener un array JSON de strings, por ejemplo: `NEXT_PUBLIC_ALLOWED_SPOTS_JSON='["A1","A2","A3","B1","B2","B3"]'`.

### Reiniciar y sembrar plazas
Después de un despliegue, o si necesitas restaurar las plazas a su estado inicial, puedes usar los siguientes comandos:

```bash
# Elimina todas las plazas existentes
npm run reset:spots

# Crea las plazas definidas en ALLOWED_SPOTS
npm run seed:spots

# O puedes ejecutar ambos en orden
npm run reset:spots && npm run seed:spots
```

**Importante:** Solo los usuarios con rol de `admin` pueden crear, modificar o eliminar documentos en la colección `spots` de Firestore.