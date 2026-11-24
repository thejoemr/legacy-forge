---
name: lf-solucion
description: "Comparar opciones por lo que resuelven, riesgo, encaje y precedentes, y recomendar la mínima que cumpla. Al proponer cómo resolver."
---

# lf-solucion

Usada por: Evaluador de alternativa, Crítico, Verificador y el asistente.

## La mejor solución

No es la más elegante ni la más moderna. Es la que cumple, en orden:

1. Resuelve la necesidad: todos los criterios de aceptación.
2. Arriesga lo mínimo de lo que hoy funciona: el cambio más pequeño,
   agregando antes que modificando.
3. Encaja: se ve como algo que escribió el equipo que mantiene el código.
4. No deja la zona peor.

Si dos empatan, la que toca menos lugares y es más fácil de revertir.

## Primero, lo que ya existe

1. Reutilizar: si algo ya hace lo que hace falta, se llama.
2. Adaptar un precedente: si otra parte resolvió algo casi igual, se
   sigue su forma. La lógica idéntica se llama, no se copia.
3. Escribir algo nuevo, con la forma de la casa.

La propuesta dice en qué se apoya ("igual que la exportación de
pedidos"), o que no hay precedente.

## Encajar no es copiar el desorden

- Mismo paradigma, librerías, patrones y nombres que el código vecino.
- Sin repetir defectos: SQL parametrizado con la misma librería, errores
  que no se tragan, nada de secretos en código.
- Cero dependencias, capas o patrones nuevos, salvo que ninguna opción
  sin ellos cumpla. Nada "por si acaso".

## No empeorar

Lo nuevo va en su propia pieza, en el estilo del módulo, conectada
desde un solo punto. No se anida otra condición en una función de 500
líneas: se escribe una función nueva, igual a sus vecinas.

## Opciones

Cada opción seria se evalúa en: qué resuelve, qué toca, riesgo y su
razón, encaje, esfuerzo, reversibilidad y qué deja de deuda. La que
pidió el humano siempre se evalúa, con la misma seriedad.

La ventana opcional: cuando hay margen, una frase con la alternativa más
completa (qué gana, cuánto más cuesta, por qué no ahora). Señales para
ofrecerla: tercer arreglo en el mismo lugar, la mínima duplicaría
lógica ya repetida, el costo extra es pequeño y hay casos que lo
cubren. Nunca con urgencia, sin forma de comprobar el comportamiento,
sobre un parche que sostiene algo o con una tecnología que el código no
usa.

## Entrega y decisión

Una recomendación con su porqué y las alternativas serias con su costo
(lf-decision). El humano elige.

## Límites

Con plazo encima, la más pragmática que cumpla, con su deuda por escrito
(lf-alcance). Nunca se relajan D3 ni "no empeorar".
