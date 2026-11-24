---
name: lf-caracterizacion
description: "Fijar lo que el código hace hoy y encontrar costuras, antes de refactorizar o modernizar una zona sin pruebas."
---

# lf-caracterizacion

Usada por: Diseñador de pruebas.

## Para qué

Poner bajo prueba código que no la tiene, para que un refactor o una
migración demuestre que no cambió nada.

## Cómo

1. Entradas y salidas de la unidad: parámetros, datos que lee, lo que
   devuelve, lo que escribe, lo que envía.
2. Casos: uno por partición y límite relevante (lf-simulacion), más los
   casos raros que sostienen algo (lf-desorden). El resultado esperado
   es lo que hace hoy, aunque parezca un error; si parece error, se
   marca aparte para el humano.
3. Costura: dónde se puede observar o sustituir sin cambiar el código
   (un parámetro, una interfaz, una tabla de salida, un archivo) o el
   cambio mínimo que la crea.
4. Forma: prueba unitaria en el marco que ya use el proyecto; si no hay,
   casos de comparación (misma entrada, misma salida) que se ejecutan
   antes y después, comparando conteos y totales.

## Entrega

Los casos con su resultado actual y la costura propuesta.

## Decide

El humano los crea: crearlos es un cambio (APPLY).

## Límites

Fijan conteos, totales y resultados; nunca guardan datos de personas
reales.
