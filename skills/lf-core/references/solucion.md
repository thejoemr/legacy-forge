# Elegir la solución

Referencia común para lf-analyze, lf-change, lf-optimize y el crítico.
Define qué es "la mejor solución" en un sistema heredado que hoy
funciona, y cuándo y cómo sugerir algo más completo.

## La mejor solución

No es la más elegante ni la más moderna. Es la que cumple, en este
orden:

1. Resuelve la necesidad: cumple todos los criterios de aceptación.
2. Arriesga lo mínimo de lo que hoy funciona: el cambio más pequeño,
   reutilizando lo que ya existe, agregando antes que modificando.
3. Queda limpia en el estilo del sistema: se ve como algo que escribió
   el equipo que mantiene este código.
4. No deja la zona peor que como estaba.

Si dos opciones empatan, la que toca menos lugares y es más fácil de
revertir.

## Encajar no es copiar el desorden

- Imita el estilo del código vecino: el mismo paradigma, las mismas
  librerías, los mismos patrones y nombres, aunque sean antiguos. Una
  clase con interfaz en un módulo de funciones sueltas no encaja, aunque
  sea "mejor".
- No imites sus defectos. Copiar una consulta armada concatenando texto,
  un manejo de errores que traga excepciones o un valor secreto en el
  código no es encajar: es repetir un riesgo. Lo nuevo se escribe bien
  dentro del estilo del sistema (por ejemplo, SQL parametrizado con la
  misma librería que ya usa el módulo).
- Cero dependencias, capas o patrones nuevos, salvo que ninguna opción
  sin ellos cumpla.
- Nada por si acaso: sin parámetros, configurabilidad ni generalización
  que nadie pidió.

## No empeorar

- Lo nuevo va en su propia pieza, en el estilo del módulo, y se conecta
  desde un solo punto. No se incrusta otra condición anidada en una
  función de 500 líneas: se escribe una función nueva, igual a sus
  vecinas, y se llama en una línea.
- Si la lógica ya existe en otro lado, se llama; no se copia otra vez.
- Lo viejo no se toca si no estorba.
- En las líneas que de todos modos cambias, puedes dejarlas más claras.
  Nunca reordenes alrededor de ellas.

## Refactor: dentro de la tarea o reporte

Cuando la tarea ya modifica una parte importante de una unidad (una
clase, un módulo, un formulario), o el cambio queda forzado si la unidad
no se reordena, evalúa si su refactor cabe en la tarea. Cabe si se
cumplen todas:

- Queda dentro de la misma unidad.
- No cambia lo que ven los demás: mismas firmas públicas, mismos
  consumidores, mismos datos.
- Hay cómo comprobar que hace exactamente lo mismo: pruebas existentes o
  casos de comparación (misma entrada, misma salida).
- El esfuerzo extra es menor que el del propio cambio.

Si cabe: se incluye en la propuesta como un paso más, con su razón en una
frase. Se aplica primero, como cambio aparte que no altera nada, con su
propio APPLY y sus casos de comparación. Después va el cambio funcional.
Así cada uno se revierte por separado.

Si no cabe: es una tarea en sí misma. Se hacen solo los cambios mínimos
para el objetivo, limpios y sin empeorar, y al cerrar se entrega un
reporte para que el desarrollador lo lleve a quien decide. Sale del flujo
de la tarea: se registra en lf-propose y no se vuelve a sacar.

Reporte de refactor o de deuda (texto para otra área, en su idioma):

    Facturación · descuentos repartidos

    Para agregar el descuento por pronto pago se modificó buena parte del
    cálculo de la factura. Ese cálculo ya tiene cuatro descuentos escritos
    por separado, y lo usa también el cierre de mes.

    Convendría juntarlos en una sola regla configurable. No se hizo ahora
    porque toca el cierre y necesita sus propias pruebas.

    Esfuerzo estimado: medio. Si no se hace, cada descuento nuevo vuelve a
    tocar el cálculo del cierre, con el mismo riesgo de hoy.

## La ventana opcional

La propuesta principal siempre es la mejor solución de arriba. Cuando
hay margen, se agrega una sola frase con la alternativa más completa o
más moderna: qué se gana, cuánto más cuesta y por qué no va ahora. El
desarrollador decide.

Señales para ofrecerla (basta una):

- Es el tercer arreglo o más en el mismo lugar (el historial lo dice).
- La solución mínima duplicaría lógica que ya está repetida.
- El costo extra es pequeño y hay pruebas o casos de comparación que lo
  cubren.
- La zona cambia seguido y la alternativa abarata los cambios que vienen.

Nunca se ofrece si:

- Es una urgencia o hay un plazo encima.
- No hay forma de comprobar que el comportamiento no cambia.
- Toca un parche que sostiene algo.
- Mete un patrón, una librería o una tecnología que el código actual no
  usa en ningún lado.

Si la alternativa es grande, en lugar de la frase va directo al reporte
de deuda.

## Con plazo encima

Si el desarrollador dice que hay fecha (o se deduce de lo que dice), el
criterio se ajusta:

- La solución más pragmática que cumpla, aunque deje deuda.
- Esa deuda se deja a propósito y por escrito: qué se dejó, por qué y qué
  haría falta después, como reporte de deuda al cerrar.
- No se relajan nunca: las reglas de seguridad ni "no empeorar" en lo que
  sí se toca.
- Sin ventana opcional.

## Dimensionar

Al tener el mapa (`punto-focal.md`), di en una línea qué tan grande es la
tarea y por qué: chica (un punto, sin consumidores delicados), media
(varios puntos o un consumidor delicado) o grande (la regla vive en
varios lugares, toca datos o un proceso crítico). Le sirve al
desarrollador para informar a quien le reporta.

Si la tarea crece por algo que descubriste, no por un pedido nuevo,
dilo en cuanto lo veas: "esto ya no es una pantalla; la regla también
vive en el reporte y en el cierre".

## Lo que depende del entorno

La liberación es del desarrollador. Solo señala, al proponer el cambio,
lo que depende del entorno o de un valor que no está en el código: un
parámetro de configuración que cambia por ambiente, la fecha desde la
que aplica una regla, un script de base que tiene que ir antes. Si no se
puede deducir, pregúntalo en una línea.
