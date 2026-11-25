---
name: lf-orquestacion
description: "Partir el trabajo en unidades, lanzar agentes con encargos autosuficientes, integrar informes y comprobar citas. Siempre que haya que leer el sistema."
---

# lf-orquestacion

Solo la usa el asistente. Es D0: no se consulta al humano.

## Qué hace un agente, siempre

Por definición, no por umbrales: todo lo que exige leer el sistema,
simular un caso, evaluar una opción, revisar un cambio o redactar desde
el código lo hace un agente. El asistente lee el sistema solo para
comprobar citas clave y los archivos que va a modificar.

| Necesidad | Agente | Una instancia por |
|---|---|---|
| Entender, ubicar, confirmar o descartar | lf-investigador | Proyecto, módulo, flujo, hipótesis o decisión con disenso |
| Por qué está así, desde cuándo | lf-historiador | Zona o conjunto de archivos |
| Una salida larga (log, traza, plan, build) | lf-lector-evidencia | Salida |
| Qué pasaría con un caso | lf-simulador-caso | Caso |
| Qué probar | lf-disenador-pruebas | Cambio o flujo |
| Cómo resolver | lf-evaluador-alternativa | Opción |
| Qué arriesga un cambio | lf-analista-impacto | Repositorio o unidad |
| Por qué podría fallar | lf-critico | Propuesta o postura cuestionada |
| Si el cambio se sostiene | lf-verificador | Archivo o consumidor |
| Librerías y soporte | lf-analista-dependencias | Proyecto o manifiesto |
| SETUP, ARCHITECTURE, PRODUCT | lf-documentador | Documento |
| Texto para otra área | lf-redactor | Documento |
| Por qué no cuadran dos fuentes | lf-conciliador | Par de fuentes y periodo |

## Cómo

1. Parte el trabajo en unidades independientes. Las independientes van
   en paralelo, en un mismo turno; las que dependen de otra, después.
2. Cadena primero. Si la pregunta es sobre un flujo, el alcance es de
   punta a punta (lf-comprension, "Cadena") salvo que el humano lo
   acote. La primera pasada es a lo ancho: un Investigador con el flujo
   completo como unidad, que entrega la cadena con cada eslabón marcado.
   Después, una capa que pida lectura a fondo (la base, una
   integración, un job) va en su propio encargo, para que la capa más
   grande no se coma a las demás. Partir por capa sin la cadena antes
   no vale: deja huecos entre capas.
3. Un encargo por instancia (`../lf-asistente/plantillas/lf-plantilla-encargo.md`):
   autosuficiente, una unidad, sin conclusiones de otras instancias ni
   un lado asignado.
4. Expediente: crea `.legacyforge/expediente/<rama>/` con el primer
   encargo; guarda cada informe completo en `informes/` antes de
   integrarlo y actualiza `mapa.md` (territorios, la cadena de cada flujo
   con la marca de cada eslabón, hipótesis vivas y descartadas con su
   evidencia).
5. Integra: junta hallazgos, separa hechos de deducciones, conserva los
   disensos (lf-disentimiento) y junta en un solo lugar todo lo de
   "Para decidir".
6. Cobertura: antes de concluir, revisa la cadena en `mapa.md`. Cada
   eslabón está leído, o ubicado o no encontrado con su porqué. Si uno
   que importa para la pregunta quedó sin leer, encargo nuevo sobre ese
   eslabón. Si casi toda la evidencia viene de una sola capa, sospecha:
   o la pregunta de verdad vive ahí (y se dice por qué), o falta leer
   las otras.
7. Comprueba las citas clave antes de apoyarte en ellas: las que
   sostienen la recomendación o el cambio. Si una no se sostiene, el
   informe pierde confianza y se dice.
8. Si un informe deja huecos que importan, un encargo nuevo sobre ese
   hueco; no se rellena de memoria.

## Límites

- Los agentes no lanzan agentes: un solo nivel.
- No cambia nada del sistema.
- Sin subagentes (Codex u otros): cada encargo como una pasada aparte
  del asistente, con el mismo encargo e informe, guardado en el
  expediente antes de la siguiente; en esa pasada, solo lectura.
- Si el humano pregunta cómo se hizo, se le dice.
- Si el humano acota el alcance a una capa, se respeta; los eslabones
  que quedan fuera se nombran en una línea al responder.
