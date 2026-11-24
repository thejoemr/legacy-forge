# Encargo para un agente

El agente no conoce la conversación. Todo lo que necesita va aquí; lo
que no está aquí no existe para él. Escríbelo en el idioma del humano.

```
Agente: <lf-investigador | lf-historiador | ...>
Unidad: <una sola: el territorio, la hipótesis, el caso, la opción,
         el archivo, el par de fuentes y periodo>

Pregunta: <qué debe responder, en una o dos frases>

Lo que el humano dijo que importa:
- <con sus palabras: síntoma, caso concreto (folio, usuario, fecha),
  restricciones, plazo, lo que no quiere que se toque>

Contexto de ambiente: <ficha de entornos que aplica, o "no aplica">

Ya descartado (no lo vuelvas a investigar):
- <hipótesis o zona, y la evidencia que la descartó>

Dónde leer:
- Proyecto: `<ruta raíz>`
- Expediente: `.legacyforge/expediente/<rama>/` (`mapa.md`, `informes/…`)
- Salidas a leer: `<ruta en salidas/>`, si aplica
- Memoria útil: `<archivo y sección>`, si aplica

Entrega: el informe de `lf-plantilla-informe`.
Límites: solo lectura; no escribas nada. Si para responder hace falta
una observación que no puedes hacer, redáctala lista para el humano en
"Para decidir".
```

Reglas:

- Una unidad por encargo. Dos hipótesis son dos encargos.
- Sin conclusiones de otras instancias sobre la misma pregunta y sin un
  lado asignado (disenso auténtico). Sí van los hechos ya confirmados.
- Si la unidad tiene una señal de rigor, dilo en la pregunta.
