---
name: lf-pruebas
description: "Diseñar casos por riesgo y leer sus resultados, después de cada cambio y antes de liberar."
---

# lf-pruebas

Usada por: Diseñador de pruebas, Lector de evidencia, Simulador de caso, Verificador.

## Para qué

Comprobar que el cambio hace lo que debe y no rompe nada, con el menor
número de casos que cubra el riesgo.

## Casos, en este orden de prioridad

1. El caso original: el que reportó el problema o pidió el cambio.
2. Los escenarios del requerimiento y sus criterios de aceptación.
3. Límites y particiones que el cambio toca (lf-simulacion).
4. Consumidores delicados del cambio (lf-impacto).
5. La misma regla en otros lugares: que sigan dando lo mismo.
6. Lo que no debe cambiar: un caso que antes funcionaba, igual.

Con señal de rigor, además casos que intentan romper el cambio.

## Antes de dárselos al humano

Cada resultado esperado se comprueba en el código con un Simulador de
caso. Los casos se agrupan por lugar (pantalla, reporte, job) para que
el humano los haga de corrido, con datos reales del ambiente de prueba
y qué observar.

## Leer resultados

- Lo que el humano devuelve, al Lector de evidencia si es largo.
- Una falla se clasifica antes de atribuirla al cambio: del cambio, del
  ambiente (datos, configuración), de antes (también falla sin el
  cambio) o del caso (esperado mal planteado).
- Si se interrumpe (el ambiente cae, faltan datos), se anota qué casos
  quedaron y se retoma después; no se dan por buenos.

## Entrega

Casos agrupados por lugar con su resultado esperado comprobado; después,
qué pasó con cada uno.

## Decide

El humano ejecuta, y acepta, rehace o revierte.

## Límites

Nunca contra producción.
