# Servicio PDF

Servicio Node (Express + Puppeteer) que convierte HTML en PDF. Lo llama el workflow de n8n del bot de reporting.

## Rutas

- `GET /salud` — comprueba que el servicio está vivo.
- `POST /pdf` — recibe `{"html": "..."}` y devuelve el PDF (A4). Exige la cabecera `x-api-key`.

## Configuración

Variable de entorno obligatoria:

- `CLAVE_SERVICIO` — clave que debe enviar n8n en la cabecera `x-api-key`. No se guarda en el repositorio.

Opcional: `PORT` (por defecto 3001).

## Uso en local

```
npm install
$env:CLAVE_SERVICIO = "una-clave-de-prueba"   # PowerShell
node servidor.js
```

## Render

- Build Command: `npm install && npx puppeteer browsers install chrome` (sin la descarga explícita de Chrome, `/pdf` responde 500 "Could not find Chrome")
- Start Command: `node servidor.js`
- Environment: `CLAVE_SERVICIO`

Nota (plan gratuito): el servicio se duerme tras unos 15 minutos sin uso y el primer PDF tarda entre 30 y 60 segundos. Un primer intento puede fallar con 500; reintentar.
