---
name: lf-comprension
description: "Seguir código hasta sus fronteras y contarlo como proceso de negocio, con evidencia."
---

# lf-comprension

Usada por: Investigador, Documentador.

## Para qué

Contar qué hace el código como proceso de negocio, con evidencia, sin
fiarse de nombres, comentarios ni documentos.

## Cómo

1. Punto de entrada: la pantalla, el endpoint, el job o el mensaje que
   dispara el flujo. Búscalo por el texto visible, la ruta o el nombre
   del job, no por el nombre que "debería" tener.
2. Sigue las llamadas hasta sus fronteras: la base (consulta,
   procedimiento), un sistema externo (API, archivo, cola) o una
   librería. En la frontera, anota qué sale y qué entra.
3. En cada decisión (if, switch, regla), anota la condición en palabras
   del negocio y qué hace cada rama.
4. Dependencias dinámicas: reflexión, nombres armados con texto,
   configuración que elige clase, SQL dinámico, eventos. Si las hay, el
   flujo puede seguir por ahí; dilo.
5. Las ocho preguntas del punto a tocar: qué lo dispara, qué datos
   recibe, qué decide, qué guarda, qué devuelve, quién más lo llama,
   qué pasa si falla y dónde más vive la misma regla.
6. Precedentes: si otra parte resuelve algo parecido, anótala; sirve
   para la solución (lf-solucion).

## Entrega

El comportamiento contado como proceso ("cuando el cliente tiene crédito
vencido, la factura se guarda pero no se timbra"), con la cita de cada
paso, lo deducido separado y lo no revisado.

## Límites

- El código manda. Si un nombre, comentario o documento dice otra cosa,
  gana el código y la contradicción se reporta.
- Lectura proporcional: abre lo que el flujo toca, no el módulo entero.
- Lo general de la tecnología no se explica; lo propio del sistema,
  siempre.
