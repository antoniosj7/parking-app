# PUMG - Parrilla Universal de Gestión de Aparcamiento (Firebase Studio)

Este es un proyecto Next.js para gestionar un sistema de aparcamiento en tiempo real, diseñado para funcionar con Firebase y dispositivos IoT como el ESP32.

## Límite Físico de Plazas

El sistema está configurado para permitir un número fijo de plazas de aparcamiento, definido en una "lista blanca".

### Cambiar las Plazas Permitidas
Para modificar las plazas de aparcamiento permitidas, debes actualizar la variable de entorno `ALLOWED_SPOTS_JSON` en tu entorno de despliegue de **Cloud Functions**. Esta variable debe contener un array JSON de strings, por ejemplo: `ALLOWED_SPOTS_JSON='["P1","P2","P3","P4","P5"]'`.

El frontend también lee una variable `NEXT_PUBLIC_ALLOWED_SPOTS_JSON` para renderizar la parrilla, asegúrate de mantenerlas sincronizadas.

### Reiniciar y Sembrar Plazas
Después de un despliegue, o si necesitas restaurar las plazas a su estado inicial, puedes usar los siguientes comandos desde la raíz del proyecto:

```bash
# Elimina todas las plazas existentes en la colección 'spots'
npm run reset:spots

# Crea las plazas definidas en NEXT_PUBLIC_ALLOWED_SPOTS_JSON con estado inicial
npm run seed:spots

# O puedes ejecutar ambos en orden para un reseteo completo
npm run reset:spots && npm run seed:spots
```

**Importante:** Solo los usuarios con rol de `admin` pueden crear, modificar o eliminar documentos en la colección `spots` de Firestore a través de las reglas de seguridad. Los scripts de semilla requieren acceso de escritura a la base de datos.

## Conexión con ESP32 (o similar)

Para que un dispositivo externo (como un ESP32) pueda actualizar el estado de las plazas en tiempo real, se ha habilitado un endpoint HTTP seguro en las Cloud Functions.

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
          "spotId": "P1",
          "occupied": true
        }
        ```
        El `spotId` debe coincidir con uno de los valores en `ALLOWED_SPOTS_JSON`. El valor de `occupied` debe ser un booleano (`true` si hay un coche, `false` si está libre).

### Ejemplo de código para ESP32 (Arduino C++)

Aquí tienes un fragmento conceptual que puedes adaptar:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h> // Necesitarás una librería para manejar JSON

const char* ssid = "TU_SSID";
const char* password = "TU_WIFI_PASSWORD";
const char* apiKey = "my-super-secret-esp32-key";
const char* serverUrl = "URL_DE_TU_CLOUD_FUNCTION"; // ¡Importante!

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  // ... Esperar conexión
}

void updateSpotStatus(String spotId, bool isOccupied) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", apiKey);

    JSONVar payload;
    payload["spotId"] = spotId;
    payload["occupied"] = isOccupied;
    
    String jsonPayload = JSON.stringify(payload);
    
    int httpResponseCode = http.POST(jsonPayload);

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
  // bool carDetected = digitalRead(SENSOR_PIN) == LOW; // Ejemplo con un sensor
  
  // Si detectas un coche en la plaza "P1":
  // updateSpotStatus("P1", true);

  // Si la plaza "P1" queda libre:
  // updateSpotStatus("P1", false);
  
  delay(5000); // Esperar 5 segundos entre lecturas
}
```
