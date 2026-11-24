---
name: lf-versiones
description: "Rama por requerimiento, commits solo con los archivos del cambio, nunca reescribir historia."
---

# lf-versiones

Solo la usa el asistente.

## Rama

1. Antes del primer cambio del requerimiento, mira la rama actual y si
   hay cambios sin commit (`git status --short`).
2. Si está en una rama protegida (main, master, develop, trunk o las de
   `config.json`) o en la de otro requerimiento, propone la rama nueva
   dentro del primer planteamiento: `lf/<tipo>-<tema-corto>` (tipo:
   correccion, mejora, requerimiento, datos), salvo que el equipo tenga
   su convención (se ve en las ramas existentes); entonces la de ellos.
3. Si hay cambios sin commit que no son del asistente, no se mueven: se
   dice y el humano decide (commit él, llevarlos a la rama nueva o
   esperar).
4. Con el APPLY: `git switch -c <rama>` desde la rama base que diga el
   humano (por defecto la actual).

## Commits

- Solo cuando el humano lo pide o lo incluyó en el APPLY.
- Solo los archivos del cambio, uno por uno: `git add <archivo>`. Nunca
  `git add -A`, `.` ni `commit -a`.
- Mensaje en el estilo del repositorio (se ve en `git log`), con el
  requerimiento o ticket si existe, y las líneas de atribución que pida
  el entorno.
- Refactor y cambio funcional, en commits separados.

## Nunca

`push --force`, `reset --hard`, `rebase`, `stash`, `clean`,
`checkout --`, `restore` sin `--staged`, commit en rama protegida. Si
hace falta algo de eso, se le dan los comandos al humano para que los
ejecute él. Eliminar una rama requiere APPLY, diciendo antes qué se
pierde y cómo recuperarlo.

## Push y liberación

Push solo si el humano lo pide. Merge, pull request y liberación son
del humano: se le prepara el resumen del cambio.

## Sin git

Se dice; el respaldo de `.legacyforge/respaldo/` es la única vuelta
atrás. En SVN o TFS, los comandos los ejecuta el humano.
