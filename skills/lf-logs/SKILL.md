---
name: lf-logs
description: "Leer logs y trazas guardados y correlacionar por usuario, folio o request."
---

# lf-logs

Usada por: Lector de evidencia.

## Para qué

Extraer de una salida larga solo lo que confirma o descarta cada
hipótesis, sin que llegue cruda a la conversación.

## Cómo

1. Lee el archivo que el humano guardó en `salidas/` del expediente; si
   no está guardado y es largo, el asistente le pide guardarlo ahí, no
   pegar miles de líneas.
2. Ubica la ventana de tiempo del caso y los identificadores (usuario,
   folio, request id, hilo, sesión).
3. Correlaciona: todas las líneas de ese identificador, en orden; el
   primer error, no el último; lo que pasó justo antes.
4. Cuenta: cuántas veces aparece el error, desde cuándo, en qué
   servidores o hilos; si coincide con despliegues, reciclados o jobs.
5. Tiempos: dónde se va el tiempo entre pasos, si hay marcas.
6. Contrasta con lo que el código escribe en ese flujo (texto exacto de
   las llamadas al logger): lo que debería aparecer y no aparece también
   es evidencia.

## Entrega

Por hipótesis: las líneas que la confirman o la descartan (con número de
línea del archivo), conteos y la conclusión. Lo que el log no puede
decir, dicho.

## Límites

- Nunca repite secretos, tokens, contraseñas ni datos personales: los
  enmascara (`****`) o nombra el campo.
- Cita pocas líneas: las que deciden.
