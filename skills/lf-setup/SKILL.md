---
name: lf-setup
description: "Genera SETUP.md: un resumen de lo que hay en el código para poner a correr el proyecto (aplicaciones, requisitos y versiones declaradas, configuración, comandos encontrados y lo que no se encontró). No hace preguntas: el desarrollador agrega lo que sepa, si quiere. Solo se ejecuta por invocación directa."
disable-model-invocation: true
---

# lf-setup

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. El resumen es breve y
directo: lo que hay y lo que falta, sin explicar lo que un desarrollador
ya sabe.

## Principio

Resumir lo que hay, no escribir una guía. SETUP.md es un mapa: puntos
clave y dónde profundizar. Todo sale del código. Lo que el código no
dice se anota como no encontrado. El desarrollador puede agregar lo que
sepa, pero no se le interroga.

## Reglas obligatorias

- R1. Cada dato cita el archivo de donde sale. Prohibido completar con
  conocimiento general, valores por defecto de un framework o
  suposiciones.
- R2. No hagas preguntas. Única excepción: cuál es el proyecto de
  trabajo, si no se puede saber.
- R3. Solo lectura: listar y leer archivos, y consultas de git. No
  compiles, no instales, no ejecutes el proyecto.
- R4. No leas archivos con valores secretos: .env, .env.local,
  .env.*.local, secrets.json, *.pfx, *.pem, *.key, user-secrets. De la
  configuración, registra solo nombres de claves y variables.
- R5. Escribe solo SETUP.md, solo dentro de su bloque y con
  autorización. Un SETUP.md existente no es fuente de datos.
- R6. Responde en el idioma del desarrollador.
- R7. Tamaño: máximo 40 líneas dentro del bloque. Una línea por punto.
  Si hay más elementos de los que caben, los principales y el archivo
  donde está el resto. Hasta 8 requisitos, 5 comandos y 5 puntos no
  encontrados.

## Pasos

1. Fija el proyecto de trabajo (`../lf-core/references/proyecto-de-trabajo.md`).
2. Lee los archivos que existan de `references/exploracion.md` en la raíz
   del proyecto, en la de cada repositorio y en la carpeta de cada
   aplicación. No leas el código fuente completo.
3. Arma el resumen con `assets/plantilla-SETUP.md`, respetando R7. Omite
   las secciones vacías, excepto "No encontrado".
4. Si te invoca lf-init, guarda el borrador y termina aquí.
5. Si no, envía el resumen: una línea por sección y lo no encontrado.
   Cierra con "si sabes algo de lo que falta, dímelo y lo agrego; si no,
   lo escribo así". Termina tu turno.
6. Lo que el desarrollador agregue va en "Agregado por el usuario", con
   sus palabras. Vuelve al paso 5.
7. Con su autorización, escribe el bloque:
   - Archivo nuevo: solo el bloque.
   - Archivo con bloque: reemplaza solo el bloque.
   - Archivo sin bloque (del equipo): agrega el bloque al final y no
     toques lo demás.

## Alcance

Solo lo necesario para poner a correr el proyecto. Funcionalidades y
arquitectura interna son de lf-product y lf-architecture.
