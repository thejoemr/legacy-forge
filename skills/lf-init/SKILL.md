---
name: lf-init
description: "Inicializa o actualiza la documentación del proyecto para personas y agentes. Resume a partir del código, en este orden, cómo correrlo (lf-setup), cómo está construido (lf-architecture) y para qué existe (lf-product), y crea o actualiza AGENTS.md para que referencie esos documentos sin repetirlos. Una sola confirmación al final. Solo se ejecuta por invocación directa."
disable-model-invocation: true
---

# lf-init

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. Mientras corren las fases,
una línea por fase como mucho. El resumen final es breve y dice lo que
hay que decidir.

## Definiciones

- Documentos del proyecto: SETUP.md (lf-setup), ARCHITECTURE.md
  (lf-architecture) y PRODUCT.md (lf-product).
- AGENTS.md: instrucciones que los agentes leen al iniciar cada sesión,
  en la raíz del repositorio.
- Bloque gestionado: la parte de AGENTS.md entre estas dos líneas. Es la
  única parte que esta skill escribe.

      <!-- legacyforge:inicio -->
      <!-- legacyforge:fin -->

- Contenido del equipo: todo lo que está en AGENTS.md fuera del bloque.
- Fase: ejecución de una skill de documentación dentro de este flujo.
- Borrador: el documento que genera una fase, en
  `.lf-borradores/<DOCUMENTO>` hasta la autorización final (I5).
- Estado de un documento:
  - NO_EXISTE.
  - AL_DIA: su huella tiene el mismo commit que HEAD.
  - DESACTUALIZADO: su huella tiene otro commit.
  - SIN_HUELLA: tiene el bloque de su skill pero no huella. SETUP.md con
    bloque siempre está así.
  - DEL_EQUIPO: existe sin el bloque de su skill. La skill agrega su
    bloque al final sin tocar lo demás.
- Acción por documento: CREAR, ACTUALIZAR u OMITIR.
- Versión del bloque: la que dice su segunda línea ("LegacyForge
  0.4.0"). Un bloque sin versión o con una anterior se actualiza.

## Reglas obligatorias

- R1. Para ejecutar una skill de documentación, localiza su SKILL.md y
  síguelo como parte de este flujo. Búscalo en este orden: la carpeta
  hermana de esta skill (`../<nombre>/`, que cubre también la
  instalación como plugin), `.agents/skills/<nombre>/`,
  `.github/skills/<nombre>/`,
  `.claude/skills/<nombre>/`, `~/.agents/skills/<nombre>/`,
  `~/.copilot/skills/<nombre>/`, `~/.claude/skills/<nombre>/`. Si no lo
  encuentras, dilo en una línea y omite esa fase.
- R2. Cada skill conserva sus reglas, con una excepción dentro de este
  flujo: la fase no envía su resumen ni pide autorización. Escribe su
  borrador y continúa. La autorización es una sola, al final (I5).
- R3. Lo que necesites de una fase terminada lo lees del borrador, no de
  la conversación.
- R4. AGENTS.md no repite contenido de los documentos del proyecto. Los
  referencia e indica cuándo leer cada uno.
- R5. Solo escribes dentro del bloque gestionado. No borres ni reescribas
  contenido del equipo. Si es redundante, repórtalo en I5 y que decida
  el desarrollador.
- R6. El bloque gestionado tiene como máximo 120 líneas: se carga en cada
  sesión de cada agente.
- R7. No modifiques otros archivos, excepto los que generan las fases y,
  con autorización, la línea de importación de CLAUDE.md y el encabezado
  o la descripción de skills superpuestas (I5).
- R8. Decide sin preguntar si la opción tiene evidencia, ninguna otra
  tiene evidencia del mismo peso y un error solo afecta la documentación.
- R9. Una pregunta por mensaje y termina tu turno.
- R10. Responde en el idioma del desarrollador.

## Estados

### I0. Diagnóstico

1. Fija el proyecto de trabajo
   (`../lf-core/references/proyecto-de-trabajo.md`). AGENTS.md y los
   documentos van en su raíz.
2. Commit actual con `git rev-parse HEAD`. Sin git, los documentos con
   huella quedan como SIN_HUELLA.
3. Estado de cada documento del proyecto, y versión del bloque de
   AGENTS.md si existe.
4. Localiza el SKILL.md de cada skill de documentación (R1).
5. Inventario de archivos de instrucciones:
   - AGENTS.md en la raíz y en subcarpetas, con o sin bloque.
   - CLAUDE.md, .claude/CLAUDE.md y CLAUDE.local.md. Si existe alguno,
     Claude Code ignora AGENTS.md salvo que CLAUDE.md lo importe con
     `@AGENTS.md`.
   - .github/copilot-instructions.md y .github/instructions/*.md.
   - Reglas de otras herramientas: .cursorrules, .cursor/rules/,
     .windsurfrules, GEMINI.md.
   - README.md y CONTRIBUTING.md, solo las secciones sobre instalación,
     convenciones o forma de trabajar.
6. Inventario de skills y agentes que no son de LegacyForge (sin prefijo
   lf-) en .agents/skills/, .github/skills/, .claude/skills/,
   .github/agents/ y .claude/agents/: nombre y descripción.

### I1. Plan

- NO_EXISTE o DEL_EQUIPO: CREAR.
- DESACTUALIZADO o SIN_HUELLA: ACTUALIZAR.
- AL_DIA: OMITIR.
- SETUP.md con bloque: OMITIR, salvo que pida actualizarlo.
- AGENTS.md: siempre CREAR o ACTUALIZAR.

Orden de las fases, el de un desarrollador que recibe un proyecto:
lf-setup, lf-architecture, lf-product y AGENTS.md.

Dilo en una línea y continúa sin esperar: las fases solo leen, y nada se
escribe hasta la autorización final.

### I2. Fases de documentación

Para cada documento con acción CREAR o ACTUALIZAR, en orden:

1. Una línea: qué fase empieza.
2. Sigue el SKILL.md de la skill desde su primer paso (ACTUALIZAR
   equivale a invocarla con "actualiza").
3. Comprueba que el borrador existe. Antes del primero, si es un
   repositorio git, agrega `.lf-borradores/` a `.git/info/exclude`.
4. Si el desarrollador detiene una fase, el documento queda como no
   generado y sigue la siguiente.

### I3. Contenido de AGENTS.md

1. Lee `assets/plantilla-AGENTS.md`.
2. Completa el bloque: solo las referencias a documentos que existen,
   solo las skills encontradas en I0, y la frase de qué es el producto,
   de PRODUCT.md, de README o, si no hay, ninguna.
3. Revisa cada archivo del inventario (I0, paso 5) fuera de los bloques
   gestionados. Clasifica cada instrucción o sección:
   - REDUNDANTE: dice lo mismo que un documento, el bloque o una skill.
   - CONVENCION_DEL_EQUIPO: contradice una regla general del bloque
     sobre cómo trabajar (estilo, comandos, ramas, commits, cómo se
     escribe el código nuevo). Prevalece la del equipo: no preguntes,
     solo repórtala. Si choca con algo que otra pieza hace cumplir (por
     ejemplo, "commit directo en develop"), regístrala en "Acuerdos con
     el equipo" con la fecha, y di en I5 que, si usan la protección de
     cambios, ajusten `LF_GUARD_PROTECTED`.
   - CONTRADICCION_DE_SEGURIDAD: contradice la autorización de cambios,
     el manejo de secretos o los datos de producción. Requiere decisión.
   - DATO_CONTRADICTORIO: afirma un dato (versión, comando, ruta) que
     contradice la evidencia. Anota la evidencia.
   - COMPLEMENTARIA: no se superpone.
4. Una skill o agente del equipo se SUPERPONE con uno de LegacyForge si
   ambos se activarían en la misma situación según su descripción.
   Requiere decisión.

### I4. Integración con cada herramienta

1. Si existe CLAUDE.md sin `@AGENTS.md`, propón agregarla al inicio.
2. Si existe CLAUDE.local.md, di que también impide que Claude Code lea
   AGENTS.md por sí solo, y que la importación va en CLAUDE.md.

### I5. Resumen y escritura

Escribe también el bloque de AGENTS.md como borrador. Después, un solo
mensaje breve:

- Los borradores, con su ruta en `.lf-borradores/` para abrirlos, y qué
  resume cada uno en una línea.
- Lo omitido y por qué.
- Lo más importante que no se encontró, por documento, con la invitación
  a agregar lo que sepa antes de escribir.
- Si el bloque de AGENTS.md se reemplaza o se agrega al final.
- Lo que encontró la revisión de I3, una línea por hallazgo, sin
  modificar nada.
- El cambio a CLAUDE.md, si aplica.

Antes de pedir autorización, resuelve las decisiones pendientes, una por
mensaje:

- Cada CONTRADICCION_DE_SEGURIDAD:
  1. Mantener la regla de LegacyForge (recomendada, salvo evidencia de un
     control equivalente del equipo).
  2. Aceptar la del equipo como excepción, en "Acuerdos con el equipo",
     con la fecha.
  3. Revisarlo con el equipo y dejar la de LegacyForge mientras tanto.
- Cada SUPERPOSICION:
  1. Usar la de LegacyForge y desactivar la activación automática de la
     del equipo.
  2. Usar la del equipo y desactivar la automática de la de LegacyForge.
  3. Mantener ambas, ajustando sus descripciones.
  Recomienda según cuál cubre mejor el caso. Desactivar la activación
  automática no borra la skill. Si se superpone con lf-change, lf-branch
  o lf-test, que no se pueden desactivar, ofrece solo ajustar la
  descripción de la del equipo o desactivar su activación automática.

Después, una sola autorización para escribir todo: escribir todo,
escribir todo menos lo que indique, o no escribir nada. Termina tu turno.

Con autorización:

1. Lleva cada borrador a su lugar como lo indica su skill. Escribe o
   reemplaza solo el bloque gestionado de AGENTS.md, con los acuerdos.
2. Agrega `@AGENTS.md` a CLAUDE.md, si fue autorizado.
3. Aplica las decisiones sobre skills superpuestas:
   `disable-model-invocation: true` en el encabezado de la elegida y, para
   Codex, `agents/openai.yaml` con `allow_implicit_invocation: false` en
   su carpeta. O ajusta las descripciones. Nada más de esos archivos.
4. Si la protección de cambios bloquea CLAUDE.md o una skill, presenta
   solo esos archivos como "■ Cambio propuesto" y pide APPLY escrito en
   el chat; lo demás ya quedó escrito.
5. Di qué archivos se modificaron.
6. Si hubo redundancias o datos contradictorios, ofrece en una línea
   limpiarlos, como cambio aparte.
7. Borra `.lf-borradores/`.
8. Cierra: el proyecto está listo; el asistente lee las instrucciones
   nuevas en una sesión nueva; /lf-help ($lf-help en Codex) muestra qué
   usar.
