---
name: lf-simulacion
description: "Casos de caja negra recorridos en el código por ambiente. Cuando algo falla a veces o solo en un ambiente."
---

# lf-simulacion

Usada por: Simulador de caso (recorre un caso), Diseñador de pruebas y el asistente (genera los casos).

## Para qué

Adelantarse a pruebas y depuración: ver en el código qué pasaría con un
caso, antes de pedirle al humano que lo pruebe.

## Generar casos (el asistente)

Técnicas de caja negra, las que apliquen:

- Particiones: una entrada por grupo que el código trata distinto
  (persona física y moral, con y sin crédito, moneda nacional y
  extranjera).
- Límites: justo antes, en y después de cada umbral (fechas de corte,
  montos, longitudes, cero, vacío, nulo).
- Tabla de decisión: combinaciones de condiciones que cambian el
  resultado.
- Estados y transiciones: secuencias de pasos (doble clic, volver atrás,
  sesión expirada, dos usuarios al mismo tiempo, reintento).
- Contexto de ambiente (lf-entornos): varios servidores sin afinidad,
  reciclado a media operación, reloj distinto entre servidor y base,
  configuración que difiere.

Un caso por encargo al Simulador.

## Recorrer un caso (el Simulador)

1. Fija la entrada y el contexto de ambiente.
2. Recorre el código paso a paso con esos valores: cada condición, qué
   rama toma y por qué; cada valor calculado.
3. Anota dónde se desvía del resultado esperado y qué condición lo causa.
4. Receta para forzarlo: datos, pasos y ambiente donde se reproduciría.

## Entrega

Por caso: reproduce sí o no, dónde se desvía, con qué confianza, y la
receta.

## Decide

El humano, si y dónde se fuerza la receta (nunca en producción).

## Límites

Una simulación es hipótesis: nunca se presenta como causa confirmada.
