# Flujos

No son secuencias para el humano: él entra por cualquier punto y salta.
Son lo que el asistente lleva por dentro para no olvidar nada. Cada paso
que lee el sistema lo hace un agente (lf-orquestacion).

## Entender (una pregunta sobre el código)

1. Investigador por cada territorio que toca la pregunta (proyecto,
   módulo o flujo); Historiador si la pregunta es por qué está así.
2. El asistente lo cuenta como el proceso de negocio (lf-comunicacion,
   lf-negocio).

## Diagnosticar (algo falla o tarda)

1. El asistente toma el síntoma y un caso concreto (folio, usuario,
   fecha). Si el humano no lo dio y el código no deja elegir uno, lo pide
   en una línea.
2. Memoria de la zona; Investigador por cada territorio del flujo e
   Historiador para cambios recientes y zonas calientes.
3. Hipótesis candidatas (lf-intuicion); un Investigador por hipótesis.
4. Si algo falla a veces o solo en un ambiente: el asistente genera los
   casos (lf-simulacion) y lanza un Simulador de caso por cada uno.
5. Al humano, solo la observación que ningún agente puede hacer, en un
   pedido (lf-delegacion). Lo que devuelve lo guarda en el expediente y
   lo lee el Lector de evidencia.
6. Causa con evidencia, o causa probable con su confianza y qué la
   confirmaría (lf-diagnostico). Si hay datos dañados, el alcance
   (Investigador) y la corrección (Evaluador, lf-correccion-datos).
7. La causa confirmada va a la memoria.

## Proponer (un requerimiento, una corrección no obvia, una mejora)

1. Investigadores por territorio si no hay mapa; Historiador para el
   porqué de lo que se va a tocar.
2. Un Evaluador de alternativa por opción, incluida la que pidió el
   humano (lf-solucion).
3. El asistente compara y recomienda; con una señal de rigor, Crítico
   sobre la recomendada.
4. Simulador de caso por cada caso que ya salió, sobre la recomendada.
5. Al humano: la decisión preparada (lf-decision). Él elige.

## Cambiar

1. Analista de impacto por cada repositorio que el cambio toca.
2. El planteamiento (del Evaluador, o del asistente si es directo) con
   archivos, riesgo, cómo se prueba y la mejora de paso aparte, si hay.
3. APPLY del humano; el asistente respalda, aplica y hace commit
   (lf-cambio, lf-versiones).
4. Compilación y pruebas existentes, corridas por el asistente con el
   registrador de salidas (`lf-salidas`), y en paralelo un Verificador
   por archivo o consumidor. Las salidas largas las lee el Lector de
   evidencia.

## Probar

1. Diseñador de pruebas sobre el cambio; un Simulador de caso por caso
   para confirmar el resultado esperado antes de dárselo al humano.
2. Al humano, los casos que hay que ver de verdad, agrupados por lugar.
3. Lo que devuelve, al Lector de evidencia; las fallas se clasifican
   antes de atribuirlas al cambio (lf-pruebas).

## Cerrar

Lo que hace `/lf-cerrar`: resumen, pendientes, disensos registrados,
memoria, textos para otras áreas y siguiente paso.
