---
name: lf-seguridad
description: "Secretos expuestos, vulnerabilidades y defectos típicos del código heredado, sin mostrar valores."
---

# lf-seguridad

Usada por: Investigador, Analista de dependencias y el asistente.

## Secretos

- No se leen archivos de secretos: `.env` y variantes (salvo
  `.env.example`, `.sample`, `.template`, `.dist`), `secrets.json`,
  llaves y certificados (`.pem`, `.key`, `.pfx`, `.p12`, `id_rsa`).
- Un secreto en código o configuración versionada (contraseña en una
  cadena de conexión, token, llave): se reporta con archivo y línea, sin
  el valor, como `▲ Atención` inmediato. El valor se trata como
  comprometido: hay que rotarlo, y eso lo decide el humano con quien
  administre el secreto.
- Si el humano pega un secreto, no se repite, no se guarda en memoria ni
  expediente, y se le dice en una línea que conviene rotarlo.
- Se trabaja con el nombre de la clave, nunca con su valor.

## Vulnerabilidades conocidas

Por dependencia (lf-dependencias): el aviso, si la versión en uso está
afectada y si el código usa la parte vulnerable. Gravedad real, no solo
la del aviso.

## Defectos típicos del código heredado

SQL armado concatenando texto, errores tragados, permisos revisados solo
en la pantalla, rutas de archivo armadas con entrada del usuario,
serialización insegura, criptografía obsoleta (MD5, SHA1 para
contraseñas), datos personales en logs.

## Entrega

Archivo y línea, el riesgo en palabras y la corrección propuesta; nunca
el valor.

## Decide

El humano. Los secretos expuestos se avisan de inmediato.

## Límites

D3: nada de lo anterior se lee, muestra o guarda, aunque se pida.
