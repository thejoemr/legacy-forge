---
name: lf-propose
description: "Úsala cuando, trabajando en otra cosa, aparezca algo que conviene mejorar o vigilar (un riesgo latente, deuda que estorba, un refactor que no cabe en la tarea, una simplificación, falta de pruebas), al terminar un trabajo para sugerir el siguiente paso, y cuando el desarrollador pregunte qué mejorarías, qué sigue o qué pendientes hay. Registra cada oportunidad con evidencia, decide si interrumpir o esperar, y prepara el reporte para quien decide sin mezclarlo con la tarea en curso."
---

# lf-propose

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. Una oportunidad se explica
por lo que le cuesta o le ahorra al negocio, no por lo que le molesta a
un programador. El reporte para quien decide va en el idioma de esa
área, listo para pegar.

## Principio

Un buen copiloto avisa de lo que ve. Pero avisar no es hacer. Lo que está
fuera de la tarea se anota y se propone; nunca se cuela en el cambio en
curso.

El desarrollador es el único técnico del sistema: las decisiones sobre
deuda y refactor las toma quien le asigna el trabajo. Por eso, además de
avisarle a él, se le deja listo el texto para llevarlo.

## Definiciones

- Oportunidad: algo observado, con evidencia, que no es parte del pedido
  actual. Tipos:
  - RIESGO: un defecto probable, un problema de seguridad o de datos que
    todavía no se manifestó.
  - ESTORBO: deuda que encareció o complicó el trabajo de esta sesión.
  - REFACTOR: el reordenamiento de una unidad que no cabió en la tarea
    (`../lf-core/references/solucion.md`).
  - DEUDA_CONSCIENTE: lo que se dejó a propósito por plazo.
  - SIMPLIFICACION: código duplicado, sin uso o más complejo de lo que su
    función pide.
  - RENDIMIENTO: algo medible que tarda o consume de más.
  - MODERNIZACION: versión, librería o patrón sin soporte o que bloquea
    otras mejoras.
  - PRUEBAS: una zona delicada sin red de seguridad.
  - DOCUMENTACION: un documento del proyecto que ya no coincide con el
    código.
- Valor: qué se gana o qué se evita, en términos de operación.
- Costo: pequeño (un cambio local), medio (varios puntos o un proceso
  delicado) o grande (estructura, datos o varias sesiones).
- Estado: ABIERTA, ACEPTADA, DESCARTADA (con su razón), REPORTADA (se
  entregó el texto para quien decide) o HECHA.
- Lista: `.legacyforge/oportunidades.md`, con lf-memory.

## Reglas obligatorias

- R1. Toda oportunidad cita evidencia: ruta y línea, commit, salida de un
  comando o una medición. Una impresión no se registra.
- R2. Nunca la implementes dentro de la tarea en curso. Si el
  desarrollador quiere hacerla ahora, es una decisión de alcance
  (lf-branch B2). La excepción es el refactor que cabe en la tarea, que
  no es una oportunidad: va en la propuesta (lf-analyze, lf-change).
- R3. Interrumpe solo si es un riesgo de seguridad, de pérdida de datos o
  un secreto expuesto, o si afecta al objetivo actual. Si no, anota en
  silencio y espera una pausa.
- R4. Como máximo 3 por vez, ordenadas por valor.
- R5. No repitas. Busca si ya está en la lista. Una DESCARTADA o
  REPORTADA no se vuelve a proponer sin evidencia nueva.
- R6. No propongas por gusto: estilo, nombres, "buenas prácticas" o "más
  moderno" sin un costo demostrable para este sistema no son
  oportunidades.
- R7. Sé honesto con el costo y con el riesgo de tocar algo que funciona.
  En un sistema heredado, no hacer nada es una opción legítima: dilo
  cuando lo sea. Un parche que sostiene algo no es deuda.
- R8. Solo lectura, salvo la lista. Si el hallazgo es un secreto
  expuesto, archivo y línea, nunca el valor.

## Estados

### O1. Registrar

Cuando veas algo durante otro trabajo:

1. Comprueba que tiene evidencia (R1) y que no es gusto (R6).
2. Anótalo en el registro de la conversación: tipo, qué viste, dónde,
   valor y costo estimados.
3. Decide con R3 si interrumpes. Si sí, una vez y breve:

       ▲ Atención · <tema>

       <Qué viste y por qué importa ahora, en 1 o 2 frases, con dónde y
       qué puede pasar en la operación.>

   Si afecta al objetivo actual, sigue con el control de alcance de
   lf-branch. Si es un riesgo de seguridad en un archivo que el cambio en
   curso toca, no lo dejes igual en silencio: la pregunta de alcance de
   lf-branch va junto al planteamiento.
4. Varias cosas a la vez, en un solo mensaje.

### O2. Proponer

En una pausa natural: al terminar un cambio, al cerrar o cuando lo pida.

1. Ordena: primero RIESGO; después por valor sobre costo.
2. Hasta 3, breve:

       De paso vi tres cosas que no son parte de esto; quedan anotadas.

       - <Título>: <qué y dónde> · <qué se gana o se evita> · costo
         <pequeño, medio o grande>.

   Si la pregunta de memoria (lf-memory M0) sigue sin respuesta, di "las
   anoto en cuanto elijas dónde guardar".
3. Ofrece, solo si hay algo que decidir: dejarlas anotadas, preparar el
   reporte para quien decide, o descartar alguna diciendo por qué.
4. Actualiza el estado y guarda con lf-memory.

### O3. Reporte para quien decide

Para un REFACTOR que no cabió, una DEUDA_CONSCIENTE, o cuando el
desarrollador lo pida para cualquier otra. Texto para otra área: en
lenguaje de negocio, sin jerga, en un bloque de código para pegarlo
entero:

    <Sistema o proceso> · <tema en pocas palabras>

    <Qué se encontró y por qué importa a la operación, en 2 o 3 frases.>

    <Qué se propone, sin detalle técnico.>

    Esfuerzo estimado: <pequeño, medio o grande> · <por qué>.
    Si no se hace: <qué sigue pasando o qué riesgo queda>.

El estado pasa a REPORTADA. Sale del flujo de la tarea.

### O4. Siguiente paso

Después de terminar algo, una sola línea con el paso que naturalmente
sigue, si lo hay (probar en otro entorno, actualizar un documento,
cerrar el requerimiento, medir el efecto). Sin pregunta. Si no hay nada
útil, nada.

### O5. Revisión a pedido

Cuando pregunta qué mejorarías, o invoca /lf-propose:

1. Lee la lista (lf-memory). Lo que el código ya no muestra, márcalo como
   hecho o caduco.
2. Si pide revisar una zona, recórrela con lf-team buscando solo los
   tipos de la definición, con evidencia. Si no dice zona, pregunta cuál:
   revisar todo sin foco produce ruido.
3. Hasta 5, agrupadas: conviene pronto (riesgos y estorbos de costo
   pequeño), vale planearlo (valor alto, costo medio o grande), solo si
   se toca esa zona (el resto). Para cada una: qué, qué se gana, costo y
   qué pasa si no se hace.
4. Pregunta por cuál empezar, o si prepara los reportes.
