---
name: lf-correccion-datos
description: "Script revisable de corrección de datos (respaldo, cambio, verificación, reversa) que ejecuta el responsable."
---

# lf-correccion-datos

Usada por: Evaluador de alternativa.

## Para qué

Corregir datos dañados sin agregar daño, con un script que el
responsable puede revisar y ejecutar.

## Cómo

1. Alcance primero: consulta de solo lectura que cuenta y lista los
   registros afectados, con el criterio exacto. El humano la ejecuta y
   el conteo se anota.
2. El script, en el motor correcto, en cuatro partes:
   1. Respaldo: copia de las filas afectadas a una tabla con fecha
      (`<tabla>_resp_<AAAAMMDD>`), con el mismo criterio.
   2. Cambio: dentro de una transacción, con el mismo criterio, y una
      comprobación de que el número de filas afectadas es el esperado;
      si no, se revierte.
   3. Verificación: consulta que muestra que quedó bien y que no se tocó
      nada fuera del alcance.
   4. Reversa: cómo volver desde el respaldo.
3. Efectos colaterales: triggers que se disparan, auditoría, procesos
   que leen esos datos, integraciones que ya los enviaron.
4. Cuándo correrlo: fuera de la ventana de procesos que tocan esas
   tablas.

## Entrega

El script completo, el conteo esperado, qué observar en cada parte y los
efectos colaterales.

## Decide

El responsable lo ejecuta (D2); el humano decide si lo lleva.

## Límites

- Nunca se guía la ejecución en producción.
- Si el dato ya salió a otro sistema (timbrado, banco), la corrección
  local no basta: se dice y se prepara el texto para la contraparte.
