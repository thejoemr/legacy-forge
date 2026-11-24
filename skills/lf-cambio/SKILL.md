---
name: lf-cambio
description: "El único camino para modificar archivos: plantear, esperar APPLY, respaldar, aplicar conservando formato, verificar y revertir lo propio."
---

# lf-cambio

Solo la usa el asistente. Es el único camino para escribir en el
proyecto.

## 1. Planteamiento

Con el informe del Analista de impacto (y del Evaluador, si hubo
opciones):

```
■ Cambio propuesto · <tema> · riesgo <bajo|medio|alto>
```

En hasta 8 líneas:

- El efecto en el proceso, en una frase.
- Qué se agrega o cambia, con el detalle técnico justo para evaluarlo
  (clase, método o consulta; enfoque; en qué precedente se apoya).
- Archivos, y cómo se editará cada heredado (lf-legado).
- Riesgo y su razón; consumidores delicados.
- Cómo se probará (lf-pruebas).
- Si hay refactor que cabe (lf-refactor), va como cambio aparte y
  primero, con su propio APPLY.
- Si hay mejora de paso, como pieza separada: "si la quieres, dime APPLY
  con mejora".
- Lo que depende del ambiente (configuración, script de base, fecha).

Termina tu turno. El humano escribe APPLY en el chat.

## 2. Con el APPLY

- APPLY vale para ese planteamiento, nada más. Si al aplicar descubres
  que hace falta otro archivo o algo distinto, para y vuelve a plantear.
- `APPLY con mejora` incluye la mejora de paso; `APPLY` solo, no.
- Antes del primer cambio del requerimiento, la rama (lf-versiones).
- Respaldo: el hook `lf-respaldo` copia cada archivo antes de
  modificarlo a `.legacyforge/respaldo/<rama>/`. Si el hook no está
  instalado, haz la copia tú antes de editar.
- Aplica con la herramienta adecuada para el formato del archivo
  (lf-legado). Si `lf-formato` avisa que cambió la codificación o el fin
  de línea, restaura desde el respaldo y aplica de otra forma.

## 3. Verificar

- Compila o corre lo que exista (build, pruebas) con el registrador de
  salidas; una salida larga la lee el Lector de evidencia.
- Un Verificador por archivo o consumidor, en paralelo.
- Si algo falla por el cambio: dilo, propone corregir o revertir.

## 4. Informar

Qué cambió (en el proceso), qué se verificó y qué falta que pruebe el
humano, en pocas líneas. El commit, si lo pidió, según lf-versiones.

## Revertir

Solo lo propio: desde el respaldo, archivo por archivo, lo que modificó
el asistente en este requerimiento. Nunca `git checkout --`, `reset
--hard` ni `restore` sobre cambios que pueden ser de otros.

## Límites

D3, siempre. Bajo urgencia se acortan las preguntas, no la autorización.
