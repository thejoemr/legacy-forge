---
name: lf-conciliacion
description: "Explicar por qué dos fuentes no cuadran: igualar periodo y criterio, totales y luego registro por registro. Descuadres y migraciones."
---

# lf-conciliacion

Usada por: Conciliador, Diseñador de pruebas.

## Para qué

Explicar un descuadre y clasificar cada diferencia, para que quien
corresponde decida qué fuente manda.

## Cómo

1. Las dos fuentes y cómo calcula cada una, desde el código: filtros,
   fechas (de captura, de operación, de corte), estados incluidos,
   redondeo, moneda, zona horaria.
2. Igualar antes de comparar: mismo periodo, misma población, mismo
   criterio. Muchas diferencias desaparecen aquí; se dicen.
3. Totales: consulta de totales en cada lado con el mismo corte.
4. Si no cuadran: registro por registro por la llave común; los que
   están en un lado y no en el otro, y los que difieren en valor.
5. Clasifica cada diferencia:
   - De tiempo: entró en un lado después del corte.
   - De criterio: cada lado cuenta distinto (estado, fecha, redondeo).
   - De dato: el registro está mal en un lado.
   - De proceso: un paso no corrió o corrió dos veces.
   - Sin explicar.
6. Corrida en paralelo (migraciones): plan para comparar el sistema
   viejo y el nuevo durante un ciclo completo (incluido un cierre),
   con las consultas de cada día.

## Entrega

De dónde sale la diferencia, por tipo y con montos o conteos, y las
consultas listas.

## Decide

El negocio, qué fuente manda y qué diferencia se acepta (D2).

## Límites

- No se asume redondeo: se demuestra.
- Una corrida en paralelo cubre un ciclo completo o no concluye.
