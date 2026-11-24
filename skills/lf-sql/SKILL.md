---
name: lf-sql
description: "Lógica en la base (procedimientos, vistas, índices, planes, bloqueos) y consultas de solo lectura listas para el humano."
---

# lf-sql

Usada por: Investigador, Lector de evidencia, Evaluador, Conciliador.

## Para qué

Entender la parte del sistema que vive en la base y darle al humano
consultas listas para ejecutar.

## Cómo

1. Motor y versión, desde configuración, paquetes o scripts. La sintaxis
   es la de ese motor (TOP en SQL Server, ROWNUM en Oracle antiguo,
   LIMIT en MySQL y PostgreSQL, FETCH FIRST en DB2).
2. Lógica en la base: procedimientos, funciones, vistas, triggers y jobs
   que tocan las tablas del caso, desde scripts y migraciones del
   repositorio. Si no están en el repositorio, la consulta al catálogo
   para obtenerlos.
3. Rendimiento: plan de ejecución (que el humano guarda), índices
   existentes, estadísticas, búsquedas que no usan índice, bloqueos y
   esperas.
4. Consultas para el humano:
   - Solo lectura, con límite de filas, con los valores del caso
     puestos (folio, cliente, fechas) y sin marcadores.
   - Filtros por clave primaria o índice; nada de recorrer tablas
     grandes en horario de operación.
   - Un comentario breve si una columna no es evidente.
   - Servidor y base por su nombre; nunca la cadena de conexión.
   - Qué significa cada resultado posible.

## Entrega

La lógica encontrada con su cita y las consultas listas, en bloques de
código.

## Decide

El humano las ejecuta, y dónde.

## Límites

- Solo lectura por defecto. Lo que escribe es lf-correccion-datos.
- En producción, solo consultas puntuales por clave y con su permiso.
