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

## Conexión con ESP32 (o similar)

Para que un dispositivo externo (como un ESP32) pueda actualizar el estado de las plazas en tiempo real, se ha habilitado un endpoint HTTP seguro.

### Configuración

1.  **Crea un Secret para la API Key:**
    En tu proyecto de Google Cloud, crea un nuevo secret para almacenar la clave de API que usará tu dispositivo. Por ejemplo: `my-super-secret-esp32-key`.

    ```bash
    gcloud secrets create ESP32_API_KEY --replication-policy="automatic"
    gcloud secrets versions add ESP32_API_KEY --data-file=- # Pega tu clave y pulsa Ctrl+D
    ```
    Otorga permisos a tu cuenta de servicio de Cloud Functions para que pueda acceder a este secret.

2.  **Programa tu ESP32:**
    Tu dispositivo debe hacer una petición `POST` a la URL de la función `updateSpotStatus`. Necesitarás el firmware de C++ adecuado para conectarte a la WiFi y realizar peticiones HTTPS.

    *   **URL del Endpoint:** La encontrarás en la consola de Firebase o Google Cloud después de desplegar la función.
    *   **Header:** `x-api-key: TU_CLAVE_SECRETA`
    *   **Body (JSON):**
        ```json
        {
          "spotId": "A1",
          "status": "occupied"
        }
        ```
        El `status` puede ser `"occupied"` o `"available"`.

### Ejemplo de código para ESP32 (Arduino C++)

Aquí tienes un fragmento conceptual que puedes adaptar:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "TU_SSID";
const char* password = "TU_WIFI_PASSWORD";
const char* apiKey = "my-super-secret-esp32-key";
const char* serverUrl = "URL_DE_TU_CLOUD_FUNCTION"; // ¡Importante!

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  // ... Esperar conexión
}

void updateSpotStatus(String spotId, String status) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", apiKey);

    String payload = "{\"spotId\":\"" + spotId + "\",\"status\":\"" + status + "\"}";
    
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println(response);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
}

void loop() {
  // Lógica de tu sensor aquí...
  // Si detectas un coche en la plaza "A1":
  // updateSpotStatus("A1", "occupied");

  // Si la plaza "A1" queda libre:
  // updateSpotStatus("A1", "available");
  
  delay(10000); // Esperar 10 segundos
}
```
