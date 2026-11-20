---
name: lf-architecture
description: "Genera o actualiza ARCHITECTURE.md: un resumen de cómo está construido el proyecto según su código (partes, tecnologías, cómo se conectan, organización de carpetas, convenciones visibles) y dónde encontrar cada cosa por concepto. No hace preguntas. Solo se ejecuta por invocación directa."
disable-model-invocation: true
---

# lf-architecture

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. El resumen es breve: lo
que hay, sin evaluarlo y sin explicar lo que un desarrollador ya sabe.

## Principio

Resumir cómo está construido lo que hay, no evaluarlo ni diseñarlo.
ARCHITECTURE.md es un mapa: puntos clave y dónde profundizar. Todo sale
del código. Lo que no se puede determinar se anota como no determinado.

Las convenciones visibles son las que el código nuevo debe imitar
(`../lf-core/references/solucion.md`): paradigma, librerías, patrones,
nombres. Anótalas aunque sean antiguas.

## Reglas obligatorias

- R1. Cada afirmación sale del código: una ruta, una búsqueda o un dato
  de git. Un nombre de carpeta solo no prueba un estilo de arquitectura.
- R2. No hagas preguntas. Única excepción: cuál es el proyecto de
  trabajo, si no se puede saber.
- R3. Solo lectura: listar, buscar y leer archivos, y consultas de git.
- R4. No leas archivos con valores secretos: .env, .env.local,
  .env.*.local, secrets.json, *.pfx, *.pem, *.key, user-secrets.
- R5. No leas el código archivo por archivo. Sigue la estrategia del paso
  2.
- R6. Escribe solo ARCHITECTURE.md, solo dentro de su bloque y con
  autorización. Un ARCHITECTURE.md existente no es fuente de datos.
- R7. Responde en el idioma del desarrollador.
- R8. Tamaño: máximo 60 líneas dentro del bloque, sin contar la huella.
  Una línea por punto. Hasta 12 conceptos en "Dónde encontrar", 5
  convenciones y 5 puntos no determinados. Si hay más partes de las que
  caben, agrúpalas por carpeta.

## Pasos

1. Fija el proyecto de trabajo (`../lf-core/references/proyecto-de-trabajo.md`).
2. Recorre, en este orden y solo lo necesario:
   1. Árbol de carpetas hasta 3 niveles, sin dependencias ni compilados
      (node_modules, vendor, packages, bin, obj, target, dist, build).
   2. Archivos de proyecto y referencias entre proyectos.
   3. Puntos de entrada de cada aplicación (Program, Main, Startup,
      index, rutas, controladores raíz, jobs).
   4. Hasta 2 archivos de muestra por tipo de carpeta, para reconocer
      convenciones.
   5. Configuración que conecta partes: docker-compose, URLs, colas,
      cadenas de conexión (solo los nombres).
   6. Lógica que vive en la base de datos (stored procedures, vistas,
      triggers) o en reportes, si el proyecto los tiene: es donde suelen
      repetirse las reglas de negocio.
3. Para "Dónde encontrar cada cosa", usa `references/conceptos.md` como
   lista de ideas. Incluye solo los conceptos que encuentres, con su
   carpeta o patrón de ruta y un ejemplo.
4. Arma el resumen con `assets/plantilla-ARCHITECTURE.md`, respetando R8.
   Omite las secciones vacías, excepto "No determinado". Escribe la
   huella al final del bloque.
5. Si te invoca lf-init, guarda el borrador y termina aquí.
6. Si no, envía el resumen: una línea por sección y lo no determinado.
   Cierra con "si sabes algo que no se ve en el código, dímelo y lo
   agrego; si no, lo escribo así". Termina tu turno.
7. Lo que el desarrollador agregue va en "Agregado por el usuario", con
   sus palabras.
8. Con su autorización, escribe el bloque:
   - Archivo nuevo: solo el bloque.
   - Archivo con bloque: reemplaza solo el bloque.
   - Archivo sin bloque (del equipo): agrega el bloque al final y no
     toques lo demás.

## Uso por otras skills

ARCHITECTURE.md sirve para saber dónde buscar, no como evidencia: lo que
afirme se confirma en el código.
