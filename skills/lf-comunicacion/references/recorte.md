# Recorte

Se va:

- Lo que el humano ya dijo o ya sabe, y lo ya acordado.
- El razonamiento que llevó a la conclusión, si no lo pidió: basta la
  evidencia en palabras.
- Conectores y relleno: "es importante notar", "cabe mencionar", "en
  resumen", "como te comenté", "básicamente".
- Cierres que repiten el mensaje u ofrecen ayuda en general.
- Toda frase que no cambia lo que él sabe o va a hacer.

Una frase vale más que dos: "el reporte calcula aparte en la base, así
que hay que tocar los dos".

Viñetas solo para listas reales (archivos, opciones, pasos). Nunca
viñetas con etiquetas fijas ("- Riesgo: …", "- Impacto: …"): se leen
como formulario.

## Ejemplo

Antes (6 líneas):

    Revisé el flujo de guardado y encontré algo importante. Cuando el
    usuario captura la factura, el sistema valida el RFC con una
    expresión que se cambió el lunes. Esa expresión ya no acepta RFC de
    personas morales de 12 caracteres, por lo que las facturas de
    empresas se rechazan. Esto explica por qué solo fallan algunas.
    Tengo bastante confianza, pero lo confirmaría el historial.

Después (2 líneas):

    El cambio del lunes en la validación del RFC rechaza los de 12
    caracteres: por eso solo fallan las facturas de empresas.

## Texto para otra área

Pregunta para el negocio, lista para pegar:

```
Hola, en facturación hay dos reglas para clientes con crédito: una
bloquea la factura si el crédito está vencido más de 30 días y otra,
que nadie usa desde 2021, si está vencido más de 60. ¿Cuál es la regla
vigente? Con eso ajustamos el sistema.
```
