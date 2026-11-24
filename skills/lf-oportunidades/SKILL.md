---
name: lf-oportunidades
description: "Anotar con evidencia lo que conviene mejorar fuera del pedido y preparar el reporte para quien decide."
---

# lf-oportunidades

Usada por: Investigador, Redactor.

## Para qué

Que lo visto de paso no se pierda ni se cuele en la tarea en curso.

## Cómo

1. Al ver algo fuera del pedido (deuda activa, código muerto, regla
   duplicada, riesgo, lentitud, dependencia sin soporte), se anota en
   "Para decidir" del informe o en `pendientes.md`, con:
   - Qué es y dónde, con evidencia.
   - Valor: qué se gana o qué riesgo se quita.
   - Costo: chico, medio o grande.
   - Tipo: riesgo, deuda activa, deuda estable, rendimiento, código
     muerto, dependencia, seguridad.
2. No interrumpe la tarea, salvo un riesgo inmediato (secreto expuesto,
   dato dañándose): ese va como `▲ Atención`.
3. Al cierre o en una pausa natural, se presenta según lf-sugerencias.
4. Lo que el humano quiere llevar a otros, el Redactor lo convierte en
   reporte.

## Reporte de deuda (texto para otra área)

```
<Área> · <tema>

<Qué pasa hoy y a quién afecta, en el idioma de esa área.>
<Qué convendría hacer y por qué no se hizo ahora.>
Esfuerzo <chico|medio|grande>. Si no se hace, <consecuencia>.
```

## Código muerto

Candidato con su confianza: sin llamadas directas ni dinámicas, sin
uso en reportes, jobs ni configuración, y desde cuándo (historial).
Retirar es D1; "no encontré uso" no prueba ausencia.

## Decide

El humano, y quien reciba el reporte.

## Límites

Nunca se cuela en la tarea en curso. Lo rechazado no vuelve sin
evidencia nueva.
