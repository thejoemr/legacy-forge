# Registro de decisión

Se agrega a `memoria/decisiones.md` cada vez que se decide algo con
consecuencias (solución, riesgo aceptado, deuda, decisión en contra de
la recomendación). Breve: una entrada se lee en 20 segundos.

```
### <AAAA-MM-DD> · <tema>
Decisión: <qué se decidió>
Decidió: <el humano | negocio (por medio del humano) | …>
Alternativas: <las que se descartaron, en una línea>
Recomendación del asistente: <la misma | otra: cuál>
Objeción: <si el asistente recomendó otra cosa: la razón, una frase>
Evidencia: <citas o archivos del expediente>
Riesgo aceptado: <cuál, o "ninguno">
Se revisa si: <señal observable que la reabriría>
Estado: <vigente | señal cumplida AAAA-MM-DD | reabierta | cerrada>
```

Reglas:

- La señal es observable: "si vuelven a fallar folios de empresas", no
  "si hay problemas".
- Cuando la señal se cumple, el asistente lo dice al humano en una
  línea; reabrir lo decide él.
- Los disensos entre agentes que no cambiaron la decisión también se
  guardan, con la observación que los decidiría.
