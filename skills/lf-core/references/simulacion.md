# Simular casos y contextos

Referencia común. La usan lf-diagnose, lf-analyze, lf-change, lf-test y
lf-explain cada vez que hay que saber cómo se comporta un flujo: qué
camino toma, si el código funciona, por qué falla a veces, qué pasaría
con un cambio.

## Principio

Un desarrollador experto no se queda con la primera lectura. Recorre el
código en la cabeza bajo condiciones distintas y así se adelanta a las
pruebas y al debug. Tú haces lo mismo, más rápido y con más casos, pero
solo los que la duda del momento pide.

La simulación es una observación más de la escalera de costo
(lf-diagnose): no le cuesta nada al desarrollador, pero sí tiempo y
atención. Se usa cuando es lo más barato que mueve la decisión.

- Si el código ya responde, o el desarrollador puede dar el dato en
  segundos, se lee o se le pregunta. No se simula lo que se intuye.
- Se simula lo mínimo que resuelve la duda abierta.
- Se amplía solo cuando aparece una señal.

No es un barrido al inicio. Al empezar, basta con el caso concreto o el
flujo principal. Los demás casos nacen de la conversación.

## Los supuestos

Cada vez que razonas un flujo asumes cosas: que la sesión vive en
memoria, que hay un solo servidor, que el usuario sigue la ruta normal,
que el dato llega con el formato esperado. Llévalos en tu mapa interno
(lf-core, Supuestos), cada uno con qué cambiaría si fuera falso.

Cuando algo de la conversación toca un supuesto, vuelve a simular solo
la parte que depende de él.

## Señales que disparan una simulación

- El síntoma trae un detalle nuevo ("solo en la tarde", "con dos
  pestañas", "solo a los de crédito"): ese detalle es la condición a
  variar.
- Un dato del desarrollador no cuadra con la explicación actual: simula
  las alternativas que sí lo explicarían.
- El desarrollador te corrige: corrige el punto y revisa qué más
  asumiste de la misma forma.
- La hipótesis sobrevive pero no explica todo: por qué solo a veces, por
  qué solo a algunos.
- Falta la observación (no hay logs, no se reproduce, no hay acceso): la
  simulación ocupa su lugar, con la confianza que eso da.
- Vas a proponer o aplicar un cambio que toca estado compartido (sesión,
  caché, variables estáticas, archivos temporales), dinero o datos:
  simula el cambio bajo las condiciones que ya salieron.
- El desarrollador pregunta "¿y si...?".

## Lo intermitente es pista

Si falla a veces, la causa depende de algo que varía entre una ejecución
y otra. Busca qué varía en ese flujo:

- Tiempo: timeouts, expiración, cambio de día o de mes, horario de
  procesos nocturnos.
- Concurrencia: dos requests sobre la misma sesión o el mismo registro,
  llamadas asíncronas, doble clic, procesos en paralelo.
- Infraestructura: qué servidor o proceso atiende, reciclado, caídas,
  despliegues (ver Contextos).
- Datos: valores límite, nulos, tamaño, caracteres especiales, objetos
  que no se pueden serializar.
- Conducta del usuario: botón atrás, varias pestañas, inactividad,
  recargar a mitad de un proceso.

## Cómo se generan los casos

Con las técnicas de caja negra, eligiendo la que encaja con la duda:

- Particiones de equivalencia: un caso por grupo de valores que el
  código trata igual.
- Valores límite: el borde de cada grupo (0, 1, el máximo, la fecha de
  corte).
- Tablas de decisión: las combinaciones de condiciones que deciden el
  camino.
- Transición de estados: cuando hay algo que cambia de estado (sesión,
  pedido, documento). Los errores intermitentes suelen vivir en
  transiciones que nadie pensó: dos cambios a la vez, un paso después de
  expirar, volver a un estado anterior.

## Cómo se recorren

Como prueba de escritorio: cada caso se sigue rama por rama sobre el
código real, con su tabla de valores (qué hay en cada variable, en
sesión o en la base después de cada paso), hasta el punto donde se
desvía de lo esperado o hasta confirmar que no se desvía. Cita ruta y
línea en cada paso: es lo que hace verificable la simulación.

Lo que el código no deja saber (un valor de configuración por entorno,
lo que responde un sistema externo) se marca como supuesto dentro del
recorrido.

## Contextos, no solo entradas

El comportamiento es el código más el contexto donde corre. Muchos
errores no existen en desarrollo porque ahí falta la condición que los
provoca.

Ficha de entornos. Una por ambiente (desarrollo, QA, producción, los que
haya), con lo que cambia el comportamiento:

- Cuántos servidores y procesos por servidor; si hay balanceador y si
  tiene afinidad de sesión.
- Dónde vive la sesión (en memoria, servidor de estado, SQL, caché
  distribuida), su timeout y si las llaves de cifrado o de máquina son
  las mismas en todos los servidores.
- Reciclado de procesos, cachés locales, archivos temporales locales.
- Reloj y zona horaria, versión de base y de runtime.
- Configuración que difiere entre ambientes (transformaciones de
  configuración, variables de entorno, parámetros en base).

Los eventos de infraestructura son entradas de la transición de estados:
un servidor cae y el balanceador manda al usuario a otro, el proceso se
recicla, un despliegue escalonado deja dos versiones conviviendo, la
sesión expira entre dos pasos.

Simula el mismo caso en cada contexto que importe. Lo valioso es la
diferencia: "en desarrollo nunca falla porque hay un solo proceso; en
producción falla cuando el segundo paso cae en otro servidor". Eso
explica por qué no se reproduce y dice cómo forzarlo donde sí se puede
probar.

## El contexto se construye en la conversación

Nadie te da la ficha al inicio. Se arma entre los dos:

- Empieza con lo que se lee: configuración y sus variantes por entorno,
  scripts de despliegue, `SETUP.md`, la memoria (`.legacyforge/`,
  sección Entornos).
- Lo que no se sabe queda como supuesto marcado, nunca como hecho.
- Pide solo el dato de contexto que cambia los escenarios del momento,
  en una línea y diciendo qué decide: "¿el balanceador de QA tiene
  afinidad de sesión? Si no, el valor se pierde al cambiar de servidor".
- Reconoce el contexto que el desarrollador da sin que se lo pidas ("en
  prod hay dos servers") y úsalo: actualiza los supuestos y vuelve a
  simular lo afectado.
- Lo que solo sabe infraestructura u operación va como pregunta lista
  para reenviar (`comunicacion.md`).
- Lo confirmado se guarda en la memoria (lf-memory, Entornos) para no
  volver a preguntarlo.

## En segundo plano

Si el asistente puede lanzar subagentes, la simulación acotada a la
duda va al agente `lf-escenarios` (lf-team) y la conversación sigue.

- Si la respuesta del desarrollador llega antes y resuelve la duda, el
  resultado se descarta sin mencionarlo.
- Si termina primero, entra en tu siguiente mensaje en una o dos líneas.
- Varias familias de condiciones (tiempo, concurrencia, infraestructura)
  pueden ir en paralelo, una por agente, sin ver las conclusiones de los
  otros. Máximo 3 (lf-team R6).
- El agente recibe el flujo, la duda, la ficha con sus supuestos y lo ya
  descartado; no tu hipótesis favorita.

Sin subagentes (Codex), haz la misma simulación en línea, igual de
acotada, como una pasada aparte (lf-team, Sin subagentes).

## Simulación ejecutable

Si tienes terminal y el entorno lo permite, una simulación se puede
correr de verdad: por ejemplo, un script que manda requests concurrentes
con la misma cookie de sesión contra QA.

- El script vive fuera del proyecto y no modifica código ni
  configuración.
- Nunca contra producción.
- Genera carga y datos en un ambiente compartido: el desarrollador lo
  autoriza antes de correrlo, con el comando exacto a la vista. Si no
  tienes terminal o acceso, va como instrucción lista para pegar
  (lf-delegate).

## Qué recibe el desarrollador

No la matriz de escenarios. Recibe, en dos o tres líneas, lo más
probable con su confianza y un solo siguiente paso, el de mayor
prioridad (lf-core, Paso a paso):

- La pregunta de contexto que falta, si sin ella la simulación no se
  sostiene.
- Si no, la receta para forzarlo: los pasos y las condiciones que
  convierten "pasa a veces" en "pasa si hago esto".
- Si no hay receta, la observación más barata que separa lo que queda
  abierto.

Lo que no entra se queda en tu mapa para el mensaje siguiente.

El detalle (los escenarios, el recorrido con rutas y líneas) solo si lo
pide.

## Sobre una propuesta

Antes de proponer o aplicar un cambio con una señal de las de arriba, la
solución se pasa por la prueba de escritorio con los casos y contextos
que ya salieron en la conversación. Si un caso la rompe, se ajusta antes
de presentarla. Los casos que sobrevivieron se vuelven casos de lf-test,
incluidos los que solo se pueden forzar en un contexto concreto.

## Errores a evitar

- Simular al inicio todo lo imaginable.
- Simular lo que se responde leyendo una línea o preguntando una cosa.
- Quedarse con la primera trayectoria que explica el síntoma.
- Simular solo el contexto de desarrollo y concluir que "funciona".
- Presentar una simulación como un hecho comprobado.
- Volcar la matriz de casos en el mensaje.
