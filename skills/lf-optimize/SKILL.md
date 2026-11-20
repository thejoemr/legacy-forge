---
name: lf-optimize
description: "Úsala cuando algo funciona pero va lento o consume de más, aunque el desarrollador no diga optimizar (tarda minutos, se traba), o cuando hay que modernizar una parte (versión de framework, librería sin soporte, patrón obsoleto) sin cambiar lo que hace. Mide antes, busca la causa con evidencia, plantea pasos pequeños y reversibles que encajen con el sistema y mide después de cada uno. Cada cambio pasa por lf-change y su APPLY."
---

# lf-optimize

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. Los números se dicen con
su unidad y cómo se midieron. Cuando el desarrollador tiene que medir,
la instrucción va lista para pegar (lf-delegate).

## Principio

En un sistema heredado, optimizar o modernizar es el trabajo con más
riesgo y menos urgencia. Tres condiciones: se mide antes, el
comportamiento no cambia, y se avanza en pasos que se pueden deshacer.

Las demás skills no modernizan "de paso" dentro de otro requerimiento.
Aquí la mejora es el requerimiento: tiene su sesión, su rama y sus
criterios. Aun así, cada paso encaja con el sistema y no deja la zona
peor (`../lf-core/references/solucion.md`).

## Definiciones

- Meta: la métrica que debe mejorar y el valor suficiente ("el cierre de
  mes tarda menos de 10 minutos", "compila con el SDK con soporte").
- Línea base: la medición antes de tocar nada, con su método, para
  repetirla igual.
- Red de seguridad: lo que avisa si el comportamiento cambió: pruebas
  existentes o casos de comparación (misma entrada, misma salida).
- Paso: un cambio pequeño con una ganancia esperada, que se revierte
  solo.
- Convivencia: periodo en que lo viejo y lo nuevo funcionan a la vez.

## Reglas obligatorias

- R1. Sin línea base no hay optimización. Si no se puede medir, primero
  cómo medir.
- R2. El comportamiento observable no cambia. Si una mejora exige
  cambiarlo, es un requerimiento para lf-analyze.
- R3. Sin red de seguridad no se toca. Si la zona no tiene pruebas, el
  primer paso es crear casos de comparación que fijen lo que hace hoy,
  incluidos sus errores conocidos. Los casos guardan entradas, conteos y
  totales, no filas con datos de personas.
- R4. La causa se demuestra con una medición, un plan de ejecución, un
  perfil o un log con tiempos.
- R5. Un paso a la vez, una variable a la vez.
- R6. Cada paso que toca archivos pasa por lf-change y su APPLY, y se
  prueba con lf-test.
- R7. Después de cada paso se mide igual que la línea base. Si la
  ganancia no llega al mínimo acordado, se revierte.
- R8. Se termina al alcanzar la meta.
- R9. Modernización siempre gradual: por partes, con convivencia y con
  vuelta atrás. Nunca un reemplazo completo de una vez.
- R10. Versiones y compatibilidad se leen de los archivos del proyecto y
  de la documentación oficial de la versión de destino, no de memoria.
- R11. Nunca se mide ni se prueba carga contra producción. Leer métricas
  o logs que producción ya genera sí, con permiso. Si producción es el
  único entorno, lf-delegate R7. Una corrida normal de la operación,
  hecha una vez por el desarrollador, es una medición permitida. Un
  cambio de esquema, como un índice, se entrega como script revisable.
- R12. Sin secretos.

## Lo que no puede faltar

### Meta

1. Qué se quiere mejorar y para quién: qué operación, qué usuarios, en
   qué momento duele.
2. Una meta medible y un mínimo que justifique el esfuerzo. Si no la
   tiene, propón una con evidencia (un tiempo de espera configurado, un
   acuerdo de servicio, el fin de soporte de una versión). Con urgencia
   o plazo, la meta va como supuesto y se puede ajustar.
3. Para modernización: qué obliga o qué se gana (seguridad, soporte,
   desbloquear otra mejora). "Es viejo" no es razón. La meta es que siga
   funcionando igual y un hito concreto.
4. Si la plataforma de destino no corre sobre la actual, el primer paso
   define dónde corre lo nuevo y cómo convive con lo viejo, o qué
   actualización previa lo permite. Si nadie lo sabe todavía,
   pregúntalo antes de armar el plan.

### Línea base y red de seguridad

1. Cómo medir: qué operación, con qué datos, en qué entorno, cuántas
   repeticiones. Mide tú si puedes; si no, instrucción lista para pegar.
2. Registra la línea base con su método.
3. Revisa la red de seguridad. Si no existe, es el primer paso (R3).

### Causa

1. El mapa del punto focal en lo que importe
   (`../lf-core/references/punto-focal.md`). En flujos amplios, lectura
   repartida con lf-team.
2. Hipótesis de dónde se va el tiempo o qué impide la actualización.
   Sospechosos frecuentes: consultas dentro de ciclos o sin índice, traer
   más datos de los que se usan, trabajo repetido, llamadas externas en
   serie sin tiempo límite, bloqueos y transacciones largas; para
   actualizar, APIs retiradas, dependencias sin versión compatible,
   configuración que cambió de formato.
3. Confirma con una medición la de mayor peso (R4).

### Plan

Un mensaje breve: qué se busca y cuánto, dónde está hoy el problema con
su medida, la línea base y cómo se midió, la meta y el mínimo por paso,
los pasos (hasta 5, cada uno con su ganancia esperada y su riesgo), la
red de seguridad y lo que no se toca. Termina con lo que sigue: empezar
por el primero, ajustar, o dejarlo anotado.

- Ordena por ganancia sobre riesgo. Primero lo que no cambia código: un
  índice, una configuración, un parámetro.
- Más de 5 pasos es más de un requerimiento.
- Un plan con señales de rigor pasa antes por lf-debate.
- Modernización: cada paso deja el sistema funcionando y liberable.

### Ejecución

Por cada paso, en orden:

1. Plantéalo con lf-change; su APPLY lo autoriza.
2. Pruébalo con lf-test, incluidos los casos de comparación.
3. Mide como en la línea base y di antes y ahora, y qué casos de
   comparación pasaron.
4. Si no llegó al mínimo o cambió el comportamiento: revierte (lf-change)
   y di qué se aprendió.
5. Si se alcanzó la meta, termina, aunque queden pasos.

### Cierre

Línea base, resultado final y cómo se midió; pasos aplicados y
revertidos; lo que queda como oportunidad (lf-propose). El método de
medición y lo aprendido, a la memoria (lf-memory).
