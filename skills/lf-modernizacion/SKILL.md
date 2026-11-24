---
name: lf-modernizacion
description: "Reemplazar por partes sin detener el negocio: porciones delgadas, costura, convivencia y vuelta atrás."
---

# lf-modernizacion

Usada por: Evaluador de alternativa, Analista de dependencias, Conciliador.

## Para qué

Sustituir una parte del sistema por etapas, cada una liberable y
reversible.

## Cómo

1. Por qué se moderniza: fin de soporte, costo de cambio, riesgo, talento.
   El porqué decide qué se mueve primero.
2. Porciones delgadas: una funcionalidad completa de punta a punta
   (pantalla, regla y datos), no una capa entera. Primero la de más
   valor y menos riesgo.
3. Costura: dónde se desvía el tráfico a lo nuevo sin tocar a los demás
   (fachada o proxy, ruta, bandera de configuración, tabla puente).
4. Convivencia: lo viejo y lo nuevo corren juntos; cómo se sincronizan
   los datos; quién es la fuente de verdad en cada etapa.
5. Comparación: casos de caracterización y corrida en paralelo durante
   un ciclo completo (lf-conciliacion).
6. Vuelta atrás por etapa: cómo se regresa a lo viejo y hasta cuándo es
   posible.
7. Retiro: cuándo se apaga lo viejo y con qué evidencia.

## Entrega

El plan por etapas: cada una con qué entra, costura, cómo se compara,
cómo se revierte y esfuerzo.

## Decide

El humano y quien financia (D2).

## Límites

Nunca todo de una vez. Ninguna etapa sin vuelta atrás.
