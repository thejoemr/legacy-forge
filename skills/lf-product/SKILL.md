---
name: lf-product
description: "Genera o actualiza PRODUCT.md: para qué existe el proyecto según lo que hay en el código (qué es, procesos de negocio, funcionalidades, datos principales, integraciones y roles) más lo que ya se confirmó del negocio en sesiones anteriores. No hace preguntas ni ordena por importancia. Solo se ejecuta por invocación directa."
disable-model-invocation: true
---

# lf-product

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. PRODUCT.md es lo primero
que un desarrollador nuevo lee para entender el negocio: se escribe en
lenguaje de negocio, no de código.

## Principio

Resumir para qué existe el proyecto según lo que hay. PRODUCT.md es un
mapa del negocio: puntos clave y dónde profundizar. Es el último
documento: primero se sabe cómo correrlo (SETUP.md) y cómo está
construido (ARCHITECTURE.md).

Todo sale del código, de su documentación y de lo que la memoria del
proyecto ya confirmó sobre el negocio. Lo que no se puede saber se anota
como no determinado.

## Reglas obligatorias

- R1. Cada afirmación sale del código, de su documentación (README,
  textos de la interfaz, menús) o de una entrada confirmada de
  `.legacyforge/sistema.md`. Los nombres de clases y tablas sirven como
  vocabulario del dominio, no como prueba de lo que algo hace.
- R2. No hagas preguntas. Única excepción: cuál es el proyecto de
  trabajo, si no se puede saber.
- R3. Solo lectura: listar, buscar y leer archivos, y consultas de git.
- R4. No leas archivos con valores secretos: .env, .env.local,
  .env.*.local, secrets.json, *.pfx, *.pem, *.key, user-secrets.
- R5. No ordenes funcionalidades por importancia ni las califiques.
  Agrúpalas como las agrupa el propio sistema (menús, módulos, carpetas).
- R6. Escribe solo PRODUCT.md, solo dentro de su bloque y con
  autorización. Un PRODUCT.md existente no es fuente de datos, salvo su
  sección "Agregado por el usuario", que se conserva.
- R7. Responde en el idioma del desarrollador.
- R8. Tamaño: máximo 50 líneas dentro del bloque, sin contar la huella.
  Una línea por punto. Hasta 12 funcionalidades (agrupa por área si hay
  más), 8 datos principales, 8 puntos del negocio y 5 no determinados.

## Pasos

1. Fija el proyecto de trabajo (`../lf-core/references/proyecto-de-trabajo.md`).
2. Si existen ARCHITECTURE.md o SETUP.md, úsalos para saber dónde buscar.
3. Lee, solo lo necesario:
   1. README y documentación.
   2. Títulos, menús y textos de la interfaz.
   3. Puntos de entrada: pantallas, rutas, controladores, jobs,
      consumidores de colas.
   4. Procesos que el negocio reconoce: cierres, cortes, timbrado,
      conciliaciones, envíos programados. Qué hacen y cuándo corren.
   5. Entidades principales: modelos, tablas, migraciones.
   6. Integraciones: APIs externas, colas, archivos de intercambio,
      correo.
   7. Roles y permisos, si el código los define.
   8. De `.legacyforge/sistema.md`, si existe, solo las entradas sobre el
     negocio (términos, reglas, por qué existe algo) que siguen vigentes.
4. Arma el resumen con `assets/plantilla-PRODUCT.md`, respetando R8.
   Omite las secciones vacías, excepto "No determinado". Escribe la
   huella al final del bloque.
5. Si te invoca lf-init, guarda el borrador y termina aquí.
6. Si no, envía el resumen: una línea por sección y lo no determinado.
   Cierra con "si sabes algo del negocio que no se ve en el código,
   dímelo y lo agrego; si no, lo escribo así". Termina tu turno.
7. Lo que el desarrollador agregue va en "Agregado por el usuario", con
   sus palabras.
8. Con su autorización, escribe el bloque:
   - Archivo nuevo: solo el bloque.
   - Archivo con bloque: reemplaza solo el bloque, conservando "Agregado
     por el usuario".
   - Archivo sin bloque (del equipo): agrega el bloque al final y no
     toques lo demás.
