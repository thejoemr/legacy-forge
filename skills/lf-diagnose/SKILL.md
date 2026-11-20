---
name: lf-diagnose
description: "Úsala cuando se reporte un comportamiento inesperado, un error o una user story que describe un problema, antes de proponer o desarrollar una solución. Simula el caso sobre el código, formula hipótesis, consigue la observación más barata que las separa (código, historial, captura, request del navegador, trazas, logs, datos; el debug al final) y llega a la causa raíz con su evidencia. No modifica código."
---

# lf-diagnose

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. En particular:

- El diagnóstico es un mensaje informativo: se cuenta como lo que pasa en
  el proceso de negocio, sin métodos, archivos ni líneas, salvo que el
  desarrollador los pida.
- Nada de planes visibles con todas las hipótesis ni tareas numeradas
  ("Tarea 2 de 4"). Di lo que crees que pasa, con qué confianza, y lo
  siguiente que hace falta ver.
- Cuando el desarrollador tiene que conseguir una observación, va como
  instrucción lista para copiar y pegar (lf-delegate).

## Principio

Llegar a la causa confirmada con el menor costo para el desarrollador.
Primero se exprime lo que no cuesta nada: el código, el historial, la
simulación del caso en la cabeza. Después, lo que él ya tiene a mano. El
debug es lo último.

## Definiciones

- Síntoma: el comportamiento observado, contrastado con el esperado.
- Caso concreto: una instancia real del síntoma con identificadores (un
  folio, un usuario, una fecha y hora). Es el dato más valioso.
- Hipótesis: posible causa. Categorías:
  - DEFECTO: el código hace algo incorrecto.
  - DATOS: los datos tienen valores que el código no espera.
  - CONFIGURACION: configuración o parámetros distintos a lo esperado.
  - ENTORNO: diferencias entre entornos, servicios caídos, permisos, o un
    compilado distinto del código fuente. Incluye lo que solo pasa con la
    infraestructura de un ambiente: varios servidores, balanceador,
    reciclado, caídas.
  - INTEGRACION: un sistema externo respondió algo inesperado.
  - DISEÑO: el sistema hace lo que fue construido para hacer; la
    expectativa es la que difiere.
- Estado de una hipótesis: ABIERTA, CONFIRMADA o DESCARTADA, siempre con
  la evidencia que la movió.
- Evidencia: ruta y línea, commit, salida de un comando, resultado de
  una consulta, línea de un log, captura u observación del desarrollador.
  Una simulación es evidencia de que un camino es posible, no de que
  ocurrió.

## Lo que nunca se salta

- R1. Solo lectura. No se modifica código, datos ni configuración.
  Agregar registros temporales (instrumentar) es un cambio aparte con
  lf-change y su APPLY.
- R2. Una hipótesis se confirma solo con evidencia que explique el caso
  concreto. Coincidencias no bastan, y una simulación sola tampoco.
- R3. Consultas en producción: solo de lectura, filtradas por claves o
  columnas indexadas, con límite de filas, y el desarrollador confirma
  que está autorizado. Si medir exige recorrer una tabla grande, se
  ofrece como decisión (copia o ventana de baja carga).
- R4. Sin secretos: no se leen archivos de secretos; en configuración se
  muestra solo la clave y la línea.
- R5. Responde en el idioma del desarrollador.

## Cómo diagnosticar

No es una secuencia fija. Es lo que no puede faltar; el orden y lo que
se junta los decides tú según el caso.

### Entender el síntoma

- Qué se observa, qué se esperaba y de dónde sale esa expectativa.
- Quién, cuándo, en qué entorno, desde cuándo, siempre o a veces.
- Un caso concreto. Si el código no te deja elegir uno, pídelo en una
  línea (es un dato libre). Si el sistema está caído, el caso es lo que
  falla ahora (lf-core, urgencia).

### Exprimir lo que no cuesta nada

Antes de pedirle algo al desarrollador:

1. Arma el mapa del punto focal en lo que importe
   (`../lf-core/references/punto-focal.md`): por dónde entra el flujo,
   qué decide su camino, dónde más vive la regla y qué estado comparte
   (sesión, caché, estáticos, archivos).
2. Simula el caso concreto sobre el código, rama por rama, con sus
   valores reales o los más probables: qué camino toma, qué valor sale
   en cada paso, dónde se desvía de lo esperado. Anota lo que asumiste
   para recorrerlo.
3. Busca el texto exacto del error o del mensaje en el código: dice
   dónde se produce.
4. Revisa el historial de los archivos del flujo: cambios recientes que
   coincidan con "desde cuándo", y el porqué de las líneas sospechosas
   (commit, comentario, lo que se deduce).
5. Busca en la memoria (lf-memory) si el mismo síntoma o la misma zona ya
   aparecieron y cuál fue la causa, y qué se sabe de los entornos.

Muchas veces aquí ya está la causa. Si el error apunta a una línea y el
código lo confirma, ve directo al resultado: no hace falta lista de
hipótesis.

### Hipótesis

Si no está clara, formula hasta 5. Considera siempre DATOS, CONFIGURACION
y DISEÑO además de DEFECTO, y ENTORNO si el síntoma es intermitente o
solo pasa en un ambiente. Para cada una, qué observación la confirma y
cuál la descarta, y qué más tendría que ser cierto si fuera la causa.
Ordénalas por probabilidad según la evidencia.

Al desarrollador no le muestras la lista: le dices en una o dos frases
qué es lo más probable, qué otra cosa podría ser y qué hace falta ver.

### Simular cuando hace falta

La simulación del paso 2 es una sola trayectoria. Amplíala solo cuando
la conversación lo pida, con `../lf-core/references/simulacion.md`:

- Las señales que la disparan: un detalle nuevo del síntoma, un dato que
  no cuadra, una corrección del desarrollador, una hipótesis que no
  explica todo, una observación que no existe.
- Si falla a veces, la causa depende de algo que varía: busca qué varía
  en ese flujo (tiempo, concurrencia, infraestructura, datos, conducta
  del usuario).
- Si solo falla en un ambiente, simula el mismo caso en cada contexto de
  la ficha de entornos y busca la diferencia. El dato de contexto que
  falta se pide en una línea, diciendo qué decide.
- Con subagentes, va en segundo plano (lf-team, lf-escenarios) mientras
  la conversación sigue.

Lo que sale de una simulación es una hipótesis con su receta para
forzarla, no una causa confirmada (R2).

### La observación más barata que separa las hipótesis

Elige la observación que confirme o descarte la hipótesis más probable,
o que parta en dos las abiertas, con el menor costo real para el
desarrollador en este contexto. El costo depende de lo que ya tiene a
mano, no del tipo:

- Sin costo (lo haces tú): código, configuración, historial, simulación
  acotada.
- Casi sin costo: lo que el desarrollador ya tiene o ve en segundos. Una
  captura de la pantalla con el error, el request y la respuesta en la
  pestaña Red del navegador, la entrada en la herramienta de trazas
  (Sentry, App Insights, Kibana), el mensaje completo del error, un dato
  de contexto que sabe (cuántos servidores hay, dónde vive la sesión).
- Bajo: una consulta de solo lectura, una búsqueda en un log, un comando
  de git que tú no puedes correr.
- Medio: reproducir el caso en un entorno de pruebas, forzando las
  condiciones que la simulación encontró.
- Alto: debug con puntos de interrupción.
- Último: instrumentar con registros temporales (requiere cambio,
  despliegue y APPLY). Solo si el problema ocurre donde no se puede
  depurar, los logs no lo muestran y la simulación no dejó una forma de
  forzarlo.

Si dos observaciones baratas apuntan al mismo lado, pídelas juntas. Sube
de costo solo si lo barato no distingue entre las hipótesis abiertas, y
dilo en una frase.

Si puedes hacerla tú (tienes terminal, base de solo lectura, logs),
hazla. Si no, el desarrollador es tu copiloto: instrucción lista para
copiar y pegar (lf-delegate), con qué significa cada resultado.

### Con cada resultado

- Actualiza las hipótesis y los supuestos con la evidencia.
- Si el resultado toca un supuesto, vuelve a simular solo lo que depende
  de él.
- Si aparece algo que ninguna explica, es información: formula una nueva.
- Si una se confirma, ve al resultado.
- Si no, la siguiente observación, con una línea de qué queda abierto.

Si después de 6 observaciones no hay causa, o la observación que falta no
existe (no hay logs, ni datos, ni forma de reproducir), cierra con causa
probable. Antes, comprueba si una simulación de contextos deja una
receta para forzarlo: suele ser lo que falta en un error intermitente.

## Resultado

Causa confirmada: el mensaje dice la causa en el idioma del negocio, en
máximo 3 frases, con su evidencia en palabras ("el cambio del lunes en la
validación de correos", "214 omisiones en la bitácora"). El detalle
técnico (ruta, línea, commit) solo si lo pide o si el siguiente paso es
un cambio.

Causa probable: empieza con "▲ Atención · causa probable", y di qué sigue
sin confirmar, la confianza y qué la confirmaría. Si la simulación dejó
una receta para forzarlo, va aquí como el siguiente paso.

En los dos casos incluye, si aplica:

- Alcance: cuántos registros, clientes o casos, desde cuándo, y qué se
  calcula a partir de lo dañado (saldos, reportes). Si no se midió, la
  consulta para medirlo, lista para pegar.
- Lo que se descartó, en una línea, si ayuda a confiar en la causa.
- El siguiente paso según la categoría:
  - DEFECTO: si la corrección es obvia y acotada, lf-change; si no,
    lf-analyze con este diagnóstico. Las pruebas incluirán reproducir el
    caso concreto y los escenarios que lo forzaban.
  - DATOS: corrección con las condiciones de lf-delegate (R7; si solo
    existe en producción, script revisable que ejecuta el responsable), y
    si el código debe prevenirlo.
  - CONFIGURACION o ENTORNO: qué ajustar y quién lo hace. Si lo ajusta
    infraestructura, la pregunta o el pedido listo para reenviar.
  - INTEGRACION: qué reportar al responsable del sistema externo, como
    texto listo para pegar.
  - DISEÑO: no hay defecto. Si se quiere otro comportamiento, es un
    requerimiento nuevo (lf-analyze). Si la regla es de negocio, la
    pregunta para el área que decide.
- Lo que hay que decidir y quién: si una decisión es de negocio (por
  ejemplo, reenviar facturas o si una promoción sigue vigente), dilo como
  tal.

No propongas la solución durante el diagnóstico. Si la viste, guárdala
como punto de partida para el análisis.

La causa confirmada y su caso van a la memoria (lf-memory), y lo
confirmado de los entornos también.
