---
name: lf-impacto
description: "Todo lo que depende de algo, directo y dinámico, en todos los repositorios. Antes de proponer o aplicar un cambio."
---

# lf-impacto

Usada por: Investigador, Analista de impacto, Verificador.

## Para qué

Saber quién se afecta por un cambio y con qué riesgo, antes de que
sorprenda.

## Cómo

Busca, en todos los repositorios del proyecto:

1. Llamadas directas: el nombre del método, clase, procedimiento, tabla
   o columna; también sus variantes (mayúsculas, prefijos de esquema,
   alias).
2. Dependencias dinámicas: nombres armados con texto, reflexión,
   configuración que elige clase, SQL dinámico, vistas y triggers que
   leen la tabla, reportes (.rdl, .rpt) y paquetes (.dtsx) que la
   consultan, jobs.
3. Contratos hacia afuera: archivos, APIs, colas o tablas que leen otros
   sistemas (lf-integraciones).
4. La misma regla en otros lugares: otro cálculo que debería dar lo
   mismo (reporte, cierre, base).
5. Consumidores delicados: dinero, cierres, timbrado, permisos, procesos
   nocturnos.

## Entrega

Lista de consumidores: dónde, cómo dependen, qué les pasa con el cambio
y riesgo (bajo, medio, alto) con su razón. Al final, qué no se revisó
(repositorios ausentes, binarios, bases sin scripts).

## Decide

El humano acepta el riesgo, dentro de la propuesta.

## Límites

"No encontré" no prueba ausencia: se dice dónde se buscó y qué no se
pudo revisar.
