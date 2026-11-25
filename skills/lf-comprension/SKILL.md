---
name: lf-comprension
description: "Seguir código hasta sus fronteras y contarlo como proceso de negocio, con evidencia."
---

# lf-comprension

Usada por: Investigador, Documentador.

## Para qué

Contar qué hace el código como proceso de negocio, de punta a punta,
con evidencia, sin fiarse de nombres, comentarios ni documentos.

## Cadena

Un flujo cruza capas, y la respuesta suele estar en la que no se leyó.
Antes de profundizar, arma la cadena completa:

1. Punto de entrada: la pantalla, el endpoint, el job o el mensaje que
   dispara el flujo. Búscalo por el texto visible, la ruta o el nombre
   del job, no por el nombre que "debería" tener.
2. Ida: cada capa que el flujo cruza hasta escribir o responder. Según
   el sistema: entrada (pantalla, formulario, endpoint, consumidor de
   cola), servicio o controlador, reglas de negocio, acceso a datos, la
   base (procedimientos, triggers, vistas, funciones), integraciones
   (API, archivo, cola, correo), configuración que cambia el camino.
3. Vuelta: qué regresa al usuario o al que llamó, y cómo se muestra o
   se transforma en el camino.
4. Después: quién lee lo que el flujo escribió (reporte, job nocturno,
   otro módulo, otro sistema). Ahí suelen estar los descuadres.

Cada eslabón queda con una de tres marcas: leído (con cita), ubicado
(se sabe dónde está, no se leyó, y por qué) o no encontrado (dónde se
buscó). Ningún eslabón se omite en silencio.

## Cómo

1. A lo ancho primero: ubica cada eslabón con al menos una cita antes
   de leer a fondo cualquiera.
2. Luego a lo hondo, donde la pregunta lo pide. En cada decisión (if,
   switch, regla), anota la condición en palabras del negocio y qué hace
   cada rama.
3. Una frontera es donde el código del sistema termina: una librería de
   terceros o un sistema externo. La base no es frontera si tiene
   lógica: un procedimiento o trigger es parte del flujo y se sigue.
   En un sistema externo, anota qué sale y qué entra.
4. Dependencias dinámicas: reflexión, nombres armados con texto,
   configuración que elige clase, SQL dinámico, eventos. Si las hay, el
   flujo puede seguir por ahí; dilo y ubica a dónde.
5. Las ocho preguntas del punto a tocar: qué lo dispara, qué datos
   recibe, qué decide, qué guarda, qué devuelve, quién más lo llama,
   qué pasa si falla y dónde más vive la misma regla.
6. Precedentes: si otra parte resuelve algo parecido, anótala; sirve
   para la solución (lf-solucion).

## Sesgo de la capa densa

La búsqueda devuelve más resultados donde hay más texto (cientos de
procedimientos, muchas pantallas casi iguales), y es fácil quedarse
ahí. Cantidad de resultados no es relevancia. Si una capa acapara la
lectura, cúbrela lo justo para seguir la cadena y señálala para un
encargo aparte. La respuesta no generaliza desde una sola capa.

## Entrega

El comportamiento contado como proceso ("cuando el cliente tiene crédito
vencido, la factura se guarda pero no se timbra"), con la cita de cada
paso; la cadena con la marca de cada eslabón; lo deducido separado y lo
no revisado.

## Límites

- El código manda. Si un nombre, comentario o documento dice otra cosa,
  gana el código y la contradicción se reporta.
- Lectura proporcional en profundidad, no en cobertura: abre lo que el
  flujo toca, no el módulo entero, pero todo lo que el flujo toca queda
  al menos ubicado.
- Lo general de la tecnología no se explica; lo propio del sistema,
  siempre.
