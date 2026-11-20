---
name: lf-branch
description: "Úsala al empezar a trabajar un requerimiento, user story o corrección, cuando se pida algo que podría estar fuera de su alcance, antes de que el desarrollador pruebe los cambios en otro equipo, y cuando pida eliminar una rama. Cada sesión trabaja un solo requerimiento en su propia rama de git; confirma ahí los cambios aplicados y la sube para que el desarrollador la descargue y pruebe donde quiera."
---

# lf-branch

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. Lo de ramas se dice en una
línea, sin ceremonia: en qué rama quedan los cambios y qué hacer para
probarlos. Los comandos de git solo cuando el desarrollador deba
ejecutarlos o los pida, listos para pegar.

## Principio

Una sesión, un requerimiento, una rama. Lo que no pertenece al
requerimiento no se mezcla: se pregunta y, si es otro, se trabaja en otra
sesión.

## Definiciones

- Requerimiento: una unidad de trabajo con un propósito (user story,
  ticket, bug o cambio pedido).
- Requerimiento de la sesión: el que se trabaja en esta conversación. Se
  fija en B1.
- Alcance: objetivo, criterios de aceptación si existen, y áreas ya
  tocadas. Se actualiza con lo que el desarrollador acuerde.
- Cambio: una modificación con un propósito (lf-change).
- Tarea de repositorio: un pedido sobre git que no cambia código
  (eliminar una rama, ver estado, listar ramas, ver historial). No se
  evalúa contra el alcance.
- Rama de trabajo, rama base, ramas protegidas (la base, main, master,
  develop, trunk y las que digan las convenciones; release/* y hotfix/*
  son de trabajo salvo que las convenciones digan otra cosa).
- Convenciones del equipo: nombre de ramas, rama base y formato de
  commits (B0).

## Reglas obligatorias

- R1. Detecta pronto, crea tarde: el requerimiento se fija al empezar,
  la rama se crea justo antes del primer cambio. Un análisis o
  diagnóstico sin cambios no crea rama.
- R2. Una sola rama de trabajo por sesión.
- R3. Nunca decidas en silencio que algo queda fuera del alcance:
  pregunta, explicando por qué dudas (B2).
- R4. Nunca hagas commit en una rama protegida, salvo que las
  convenciones o un acuerdo de AGENTS.md digan que el equipo confirma ahí.
  Entonces no crees rama y dilo. Si lf-guard bloquea ese commit, el
  equipo puede ajustar `LF_GUARD_PROTECTED` o confirmar a mano.
- R5. En cada commit, solo los archivos del cambio. Nunca `git add -A`,
  `git add .` ni `git commit -a`.
- R6. Por tu cuenta, nunca reescribas historia ni borres trabajo: nada de
  `push --force`, `reset`, `rebase`, `commit --amend` sobre commits
  subidos, `stash` ni borrar ramas. Para eliminar una rama, B8. Si pide
  reescribir historia, explica el riesgo y dale los comandos para que los
  ejecute él.
- R7. Nunca toques cambios que no hiciste tú, tampoco con `svn revert`,
  `svn update` o `tf undo`. Si hay archivos modificados por él, pregunta.
- R8. Las convenciones del equipo prevalecen sobre estos valores.
- R9. Sin terminal o sin git (lf-delegate, T0), cada comando de git se le
  pasa al desarrollador listo para pegar.
- R10. Antes de cada commit, revisa archivos y contenido (B4). Si hay un
  posible secreto, no hagas commit: detente y pregunta.
- R11. El requerimiento termina solo cuando el desarrollador lo dice.
- R12. Una pregunta por mensaje y termina tu turno.
- R13. Responde en el idioma del desarrollador.
- R14. Una carpeta de código, una sesión con cambios a la vez. Si la rama
  actual cambió sin que la cambiaras, o aparecen cambios que no hiciste,
  otra sesión puede estar usando la misma carpeta: "Sesiones en
  paralelo".

## Estados

### B0. Aplicabilidad y convenciones

Una vez por sesión, la primera vez que haga falta:

1. ¿Hay git? Si la carpeta agrupa varios repositorios, aplica esta skill
   a cada uno que el cambio toque. Si no hay git:
   - Otro control de versiones (.svn o $tf): sin ramas ni commits tuyos;
     él confirma con su herramienta. Solo comandos de lectura (`svn
     status`, `svn diff`, `svn log` si hay red); B1, B2 y B7.
   - Sin control de versiones: B1, B2 y B7 sin los pasos de rama. El
     respaldo de lf-change es la única vuelta atrás: dilo antes del
     primer cambio.
2. Convenciones, en este orden: instrucciones del equipo (AGENTS.md fuera
   del bloque, CONTRIBUTING.md), patrón de ramas (`git branch -a`) y de
   commits (`git log --oneline -20`).
3. Si el equipo no usa una rama por requerimiento, o el desarrollador lo
   rechazó, no crees ramas. El control de alcance (B2) se mantiene.
4. Rama base: la de las convenciones; si no, la rama por defecto del
   remoto (`git symbolic-ref refs/remotes/origin/HEAD`); sin remoto, la
   local main, master o develop que exista. Si hay duda entre dos,
   pregunta. Si develop tiene commits que la rama por defecto no tiene
   (`git rev-list --count origin/HEAD..origin/develop`), la base es
   develop; dilo.
5. Por defecto: `feature/<id>-<descripcion>` o `fix/<id>-<descripcion>`
   (sin identificador, 2 a 5 palabras en minúsculas con guiones), y
   mensaje de commit "<id>: <propósito>".

### B1. Requerimiento de la sesión

Con el primer pedido de trabajo:

1. Fija el proyecto de trabajo
   (`../lf-core/references/proyecto-de-trabajo.md`). Una tarea de
   repositorio se atiende (B8 para eliminar) sin fijar requerimiento.
2. Fija el requerimiento y su alcance inicial.
3. Revisa la rama actual (`git branch --show-current`):
   - Rama de trabajo de este requerimiento (mismo identificador o
     descripción): continuación. Si está subida y el remoto tiene commits
     nuevos, `git pull --ff-only`.
   - Rama de otro requerimiento: díselo y pregunta si continúa ese o
     empieza uno nuevo desde la base.
   - Rama protegida: la rama se creará con el primer cambio (B3).
4. Registra la rama de la sesión en cuanto exista.
5. Si ya hay rama, dilo en una línea.

### B2. Control de alcance

Las tareas de repositorio no se evalúan.

Dentro del alcance, sin preguntar, aunque toque otros archivos o
unidades: ajustes de un cambio ya hecho, fallas al probar este
requerimiento, lo necesario para un criterio de aceptación, comentarios
sobre el resultado, pasos previos que el requerimiento necesita, un
cambio sobre lo que se acaba de explicar o diagnosticar, y los otros
lugares donde vive la misma regla que se está cambiando.

Posiblemente fuera: otro identificador de ticket, algo que no sirve al
objetivo ni a ningún criterio (otro bug, una mejora, otra
funcionalidad), o algo relacionado que no está en los criterios.

Ante algo posiblemente fuera, antes de hacer nada, di qué detectaste y
por qué dudas, y pregunta:

1. Incluirlo en este requerimiento, en la misma rama.
2. Trabajarlo en una sesión nueva, con su rama.
3. Solo anotarlo para después.

Recomienda incluir si sirve al mismo objetivo para los mismos usuarios;
sesión nueva si es independiente.

- Incluir: amplía el alcance. Si tiene otro identificador, sus commits lo
  llevan.
- Sesión nueva: no lo trabajes aquí. Entrega un texto breve para
  arrancarla: qué hacer, por qué se separó y lo que ya se sabe. Sigue con
  el requerimiento.
- Anotar: regístralo (lf-propose) y menciónalo al cerrar.

### B3. Creación de la rama

Justo antes del primer cambio, o si lo pide, si no hay rama:

1. `git status`. Si hay cambios que no hiciste tú (R7), pregunta si
   llevarlos a la rama nueva, si los confirma antes o si se detiene.
2. Si existe una rama remota de este requerimiento, úsala.
3. Si no: con remoto, `git fetch origin <base>` y
   `git switch -c <rama> --no-track origin/<base>`; sin remoto,
   `git switch -c <rama> <base>`, y dilo.
4. Una línea: nombre de la rama y base.

Con varios repositorios, la rama se crea en cada uno cuando el primer
cambio lo toca, con el mismo nombre.

### B4. Commit

Después de que lf-change aplica un cambio y antes de sus pruebas:

1. Si la rama actual es protegida sin acuerdo (R4), no hagas commit y
   dilo. Si no es la rama de la sesión, "Sesiones en paralelo".
2. `git add <archivos>` solo con los del cambio.
3. Revisa lo agregado (R10): ningún nombre como .env, .env.local,
   .env.*.local, secrets.json, *.pfx, *.pem, *.key, *.p12 o id_rsa; en
   `git diff --cached`, ninguna contraseña, token, clave de API, cadena
   de conexión con usuario y contraseña ni bloque "PRIVATE KEY" (ignora
   marcadores evidentes como `${DB_PASSWORD}`). Si encuentras algo,
   `git restore --staged <archivo>` (no modifica el archivo), di archivo y
   línea sin el valor, y pregunta.
4. Commit con el mensaje de las convenciones. Con varios repositorios,
   uno en cada uno, con el mismo mensaje.
5. Si prueba en otro equipo, B5.

El APPLY de lf-change cubre este commit y la subida de B5 si el
planteamiento los mencionó.

### B5. Subir la rama

Cuando prueba en otro equipo o lo pide:

1. `git push -u origin <rama>` la primera vez y `git push origin <rama>`
   después. Nunca `--force`.
2. Si el push es rechazado porque el remoto tiene commits nuevos, no
   combines ni reescribas: dilo y pregunta.
3. Sin remoto o sin permisos: la lista de archivos de lf-delegate (Trabajo
   en otro equipo).
4. Con varios repositorios, sube la rama de cada uno con commits de esta
   sesión.
5. Pásale la instrucción para el otro equipo, por repositorio: la primera
   vez `git fetch origin` y `git checkout <rama>` (`git switch` solo con
   git 2.23 o superior allá); las siguientes, `git pull`; y que
   `git rev-parse --short HEAD` muestre `<commit que subiste>`. Si allá
   no hay git, la lista de archivos. Si un servidor de integración
   despliega por rama, que confirme el commit en el registro del build.

### B6. Reversión

Si lf-change revierte un cambio que ya tiene commit, después de restaurar:

1. Comprueba que estás en la rama de trabajo.
2. Commit nuevo con la restauración: "Revierte: <propósito>". Nunca
   `git reset`.
3. Si la rama estaba subida, súbela (B5).

Si decide que un cambio ya incluido no pertenecía al requerimiento,
revierte así y ofrece trabajarlo en una sesión nueva.

### Sesiones en paralelo

Al retomar tras una pausa o una tarea delegada,
`git branch --show-current` y `git status --short` en cada repositorio de
la sesión. Si no queda nada por cambiar, dilo en una línea y sigue.

Señales de que otra sesión usa la misma carpeta: la rama actual no es la
registrada, o aparecieron durante la sesión cambios sin confirmar que no
hiciste. No son señales: estar en cualquier rama al empezar, cambios que
ya existían al empezar, ni los archivos que él creó o modificó al hacer
algo que le pediste.

Ante una señal:

1. No cambies de rama, no hagas commit, no modifiques archivos.
2. En dos frases, qué viste y el riesgo: los cambios de un requerimiento
   pueden terminar en la rama de otro.
3. Pregunta:
   1. Trabajar esta sesión en una copia aparte,
      `git worktree add <carpeta nueva> <rama de la sesión>`, y abrir esa
      carpeta (recomendada si trabaja requerimientos en paralelo).
   2. Pausar la otra sesión y volver a la rama de esta.
   3. Seguir en la rama actual, si confirma que es la correcta.
   Con una copia aparte, el APPLY ya dado vale para el mismo cambio en la
   ruta equivalente.

### B7. Cierre

Cuando dice que el requerimiento terminó:

1. Confirma que no quedan cambios sin commit.
2. En pocas líneas: rama, cuántos commits y si está subida; pendientes
   anotados.
3. Entrega los textos para otras áreas que hayan quedado (reporte de
   refactor o de deuda, nota de pruebas), listos para pegar, si no los
   entregaste antes.
4. Una línea con el siguiente paso habitual del equipo (pull request o
   combinación). No lo ejecutes.
5. Si creaste una copia con `git worktree`, ofrece quitarla con
   `git worktree remove <carpeta>` cuando todo esté confirmado.
6. Para otro requerimiento, sugiere una sesión nueva.

### B8. Eliminar ramas a pedido

Eliminar una rama es decisión del desarrollador. Tu trabajo es que la
tome sabiendo qué se pierde y cómo recuperarla.

1. Identifica la rama exacta; si puede ser más de una, pregunta.
2. Si es protegida (R4), no la elimines: dilo y que lo haga el
   responsable del repositorio.
3. Alcance: local, remota o ambas. Si no lo dijo, pregunta; recomienda
   solo local salvo que haya dicho que ya no se necesita en el remoto.
4. Evidencia, solo con lectura: punta (`git rev-parse <rama>`), commits
   que no están en la base (`git log --oneline origin/<base>..<rama>`),
   si existe en el remoto y si el remoto tiene commits que no están en
   local, autores distintos de él, y si es la rama de esta sesión, la
   actual o la de otra copia (`git worktree list`).
5. "■ Cambio propuesto · eliminar rama <nombre> · riesgo <nivel>": qué se
   elimina, qué se pierde (commits con sus títulos, o "nada"), quién más
   se afecta, y cómo recuperarla (`git branch <rama> <punta>`). Riesgo
   bajo: no se pierde ningún commit; medio: se pierden commits suyos;
   alto: se pierden commits de otros o se elimina del remoto con trabajo
   no combinado. "Escribe APPLY para eliminarla." Termina tu turno.
6. Con APPLY:
   - Si es la rama actual, cámbiate antes a la base. Si hay cambios sin
     confirmar, no sigas: pregunta.
   - Si está abierta en otra copia, no sigas: que primero la cierre.
   - Local: `git branch -d <rama>` (`-D` solo si el mensaje mostró los
     commits que se pierden). Remota: `git push origin --delete <rama>`.
   - Di qué se eliminó y repite el comando para recuperarla.
7. Si era la rama de esta sesión, pregunta si se abandona el
   requerimiento (B7) o se crea una rama nueva con el próximo cambio.
