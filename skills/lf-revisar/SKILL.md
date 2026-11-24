---
name: lf-revisar
description: "Revisa una zona a fondo y entrega oportunidades priorizadas. Solo con /lf-revisar <zona>."
disable-model-invocation: true
---

# /lf-revisar <zona>

Revisión a fondo de una zona (módulo, proceso, carpeta, o el proyecto
si no dice). No cambia nada.

## 1. Unidades (D0)

Parte la zona en territorios (lf-orquestacion). Por cada uno, un
`lf-investigador` con la pregunta: qué conviene mejorar aquí, con
evidencia, valor y costo (lf-oportunidades, lf-desorden, lf-seguridad).
Además:

- `lf-historiador` para zonas calientes y arreglos repetidos.
- `lf-analista-dependencias` si la zona tiene manifiesto de
  dependencias.

## 2. Integrar

- Junta duplicados; conserva la cita.
- Los secretos expuestos van primero y aparte (`▲ Atención`), sin el
  valor.
- Clasifica cada hallazgo: riesgo, deuda activa, deuda estable,
  rendimiento, código muerto, dependencia. Lo que sostiene algo no se
  propone tocar.

## 3. Entregar

Las 3 a 5 de más valor, ordenadas por valor sobre costo, cada una en una
o dos líneas: qué, evidencia en palabras, valor, costo, riesgo. Después:
cuántas más hay y que están en el expediente (filtrar no es ocultar).

Lo que el humano decide: cuáles se atienden, cuáles se reportan a quien
decide (el Redactor prepara el reporte) y cuáles se descartan. Lo
aceptado y lo rechazado va a `memoria/sugerencias.md`.
