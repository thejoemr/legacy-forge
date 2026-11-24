---
name: lf-iniciar
description: "Prepara un proyecto: documentos, instrucciones y memoria. Solo con /lf-iniciar."
disable-model-invocation: true
---

# /lf-iniciar

Prepara el proyecto para trabajar con el asistente, con una sola
autorización al final.

## 1. Lo que ya hay (D0)

Proyecto de trabajo (`../lf-asistente/references/proyecto.md`). Si
existen SETUP, ARCHITECTURE, PRODUCT, AGENTS.md o `.legacyforge/`, se
regeneran solo los bloques gestionados; el resto es del equipo.

## 2. Documentadores en paralelo

Un `lf-documentador` por documento (SETUP, ARCHITECTURE, PRODUCT). Si
hay varios repositorios grandes, uno por repositorio y documento. Cada
encargo lleva la plantilla y el límite de
`../lf-asistente/plantillas/lf-plantillas-documentos.md`.

Mientras trabajan, una sola pregunta al humano, si no está en
`config.json`: dónde vive la memoria.

- `.legacyforge/` excluida de git (recomendado: no ensucia el
  repositorio).
- `.legacyforge/` versionada con el equipo.
- Otra carpeta fuera del proyecto.

## 3. Lo que se propone

```
■ Cambio propuesto · preparar el proyecto · riesgo bajo
```

En pocas líneas:

- Qué dice cada documento, en una frase, y lo que quedó "No
  determinado".
- Las contradicciones entre documentación existente y código.
- El bloque de instrucciones para `AGENTS.md` (y `CLAUDE.md` con
  `@AGENTS.md`), de `../lf-asistente/plantillas/documentos/bloque-instrucciones.md`.
- La carpeta de memoria y su `config.json`; pregunta en una línea si hay
  servidores o bases de producción que el asistente nunca deba tocar y
  sus nombres.
- Qué no se toca: todo lo que está fuera de los bloques.

Pide APPLY. Con APPLY: escribe los documentos, el bloque, la carpeta y,
si eligió excluirla, la línea en `.git/info/exclude`. Sin respaldo extra
para archivos nuevos; los existentes los respalda `lf-respaldo`.

## 4. Cierre

Una línea de lo creado y el siguiente paso: que cuente lo que necesita.
