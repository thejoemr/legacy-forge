# Documentos del proyecto

SETUP.md, ARCHITECTURE.md y PRODUCT.md, en la raíz del proyecto. Los
borradores los genera el Documentador; el asistente los escribe con un
APPLY. Las plantillas están en `documentos/`.

## Reglas comunes

- Cada documento vive entre marcas `<!-- lf-<doc>:inicio -->` y
  `<!-- lf-<doc>:fin -->`. Fuera de las marcas, el contenido es del
  equipo y no se toca. Si el archivo existe sin marcas, el bloque se
  agrega al final y se dice.
- Al regenerar, la sección "Agregado por el usuario" se conserva tal
  cual.
- Todo con su fuente (`archivo donde se declara`). Lo que no se pudo
  determinar va en "No determinado"; nunca se inventa.
- Sin secretos: nombres de variables, nunca valores.
- ARCHITECTURE y PRODUCT llevan huella (fecha y commit de HEAD de cada
  repositorio); si el commit cambió, están desactualizados.

## Límites de tamaño

| Documento | Máximo | Para quién |
|---|---|---|
| SETUP.md | 60 líneas | Correr el proyecto en una máquina nueva |
| ARCHITECTURE.md | 120 líneas | Saber dónde está cada cosa |
| PRODUCT.md | 120 líneas | Saber para qué existe y qué hace, en lenguaje de negocio |

Si no cabe, se resume por áreas y se dice qué quedó fuera.

## Instrucciones del proyecto

`/lf-iniciar` agrega a `AGENTS.md` (y a `CLAUDE.md` con `@AGENTS.md`)
el bloque de `documentos/bloque-instrucciones.md`, que carga al
asistente en cada sesión.
