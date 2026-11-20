---
name: lf-help
description: "Guía de uso de LegacyForge. Úsala cuando el desarrollador pregunte cómo usar estas skills, qué puede hacer, por dónde empezar o qué sigue, cuando las acaba de instalar, o cuando invoque /lf-help. Revisa el estado del proyecto y recomienda el siguiente paso, breve."
---

# lf-help

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. El desarrollador quiere
saber qué hacer, no cómo funciona el paquete por dentro. Menos de un
minuto de lectura.

## Lo que el desarrollador debe saber

LegacyForge es su copiloto de mantenimiento. No tiene que aprender
comandos: le escribe como a un colega ("el reporte tarda un buen",
"arregla lo de la factura") y el copiloto decide qué hacer. Antes de
tocar cualquier archivo le explica el cambio y le pide escribir APPLY.

Skills que puede invocar directamente con "/" (en Codex, "$"):

- /lf-init: preparar el proyecto la primera vez. Resume cómo correrlo,
  cómo está construido y para qué existe, y genera las instrucciones para
  los agentes.
- /lf-setup, /lf-architecture, /lf-product: actualizar solo uno de esos
  documentos.
- /lf-analyze, /lf-diagnose, /lf-test, /lf-optimize, /lf-propose,
  /lf-debate: también se activan solas al contarle lo que necesita; se
  pueden invocar si quiere forzar ese enfoque.

Lo que pasa solo: el copiloto entiende el punto que se va a tocar antes
de proponer, le enseña el negocio de paso, le pide lo que no puede hacer
él con instrucciones listas para pegar, trabaja una rama por
requerimiento y recuerda entre sesiones lo que se confirmó.

## Pasos

### 1. Estado del proyecto

Solo leyendo. Si la carpeta tiene varios proyectos
(`../lf-core/references/proyecto-de-trabajo.md`) y no dijo cuál, lista
los proyectos, una línea cada uno, diciendo si ya está preparado, y
pregunta con cuál. Después, solo ese:

1. Si AGENTS.md tiene `<!-- legacyforge:inicio -->` y con qué versión.
2. Si existen SETUP.md, ARCHITECTURE.md y PRODUCT.md, con o sin bloque
   de LegacyForge. Los que existen sin bloque son del equipo.
3. Si ARCHITECTURE.md o PRODUCT.md tienen huella con un commit distinto
   del actual: están desactualizados.
4. Dónde están las skills: `.agents/skills/` (Copilot y Codex) y
   `.claude/skills/` (la única carpeta de proyecto que lee Claude Code).
   Si están instaladas como plugin (Claude Code o Copilot CLI), o a nivel
   de usuario, no hace falta nada más. Si usa Claude Code y no las
   encuentra en ningún lado, dale el comando de instalación del README
   del paquete, para su sistema operativo. Si están en una carpeta que
   agrupa varios proyectos, recomienda instalarlas a nivel de usuario
   (guía del paquete) y abrir cada proyecto en su ventana.
5. Si existe `.legacyforge/`: lee de `sesiones.md` solo la entrada más
   reciente (lf-memory).
6. Si faltan los ayudantes (`lf-` en `.claude/agents/` o
   `.github/agents/`) o la protección de cambios (lf-guard). Solo si
   pregunta por la instalación o por seguridad.

### 2. Recomendación

El primer caso que aplique:

1. Primer uso: una frase de bienvenida y /lf-init, con 2 frases de qué
   hará. Si solo quiere ponerlo a correr, /lf-setup.
2. Describió lo que quiere hacer: dile que se lo cuente así, con sus
   palabras, o la skill que lo fuerza.
3. Hay una sesión anterior sin terminar: qué requerimiento era, en qué
   quedó, y que puede retomarlo diciéndolo.
4. El bloque de AGENTS.md es de una versión anterior, o hay documentos
   desactualizados: dilo en una frase y recomienda /lf-init o la skill
   que los actualiza.
5. Ninguno: la guía rápida.

### 3. Guía rápida

Una lista corta, adaptando la redacción:

- Acabo de llegar al proyecto: /lf-init.
- Me reportaron un problema, tengo un requerimiento, quiero entender o
  cambiar algo: cuéntamelo.
- Quiero probar un cambio antes de liberar: /lf-test.
- No sé qué opción conviene: pregúntame o /lf-debate.
- Algo va lento o quedó viejo: cuéntamelo, o /lf-optimize.
- Qué mejorar o qué quedó pendiente: /lf-propose.
- Cambió la estructura o las funcionalidades: /lf-architecture o
  /lf-product.

Una línea: conviene una sesión por requerimiento. Y otra: /lf-help
($lf-help en Codex) vuelve a mostrar esto.

Responde en el idioma del desarrollador.
