---
name: lf-ayuda
description: "Revisa el estado del proyecto y dice por dónde empezar. Con /lf-ayuda o cuando el humano no sabe qué hacer."
---

# /lf-ayuda

Menos de un minuto de lectura. El humano quiere saber qué hacer, no cómo
funciona el paquete por dentro.

## Lo que debe saber

Le escribe al asistente como a un colega ("el reporte tarda", "arregla
lo de la factura"). El asistente investiga con sus agentes, le trae lo
encontrado con una recomendación y él decide. Antes de tocar cualquier
archivo, el asistente le explica el cambio y le pide escribir APPLY.

## 1. Estado, solo leyendo

1. Proyecto de trabajo (`../lf-asistente/references/proyecto.md`); si
   hay varios y no dijo cuál, lístalos y pregunta.
2. Si `AGENTS.md` tiene `<!-- legacyforge:inicio` y con qué versión.
3. Si existen SETUP.md, ARCHITECTURE.md y PRODUCT.md; si la huella
   apunta a otro commit, están desactualizados.
4. Si existe `.legacyforge/`: la última entrada de `memoria/sesiones.md`
   y los registros con estado "señal cumplida".
5. Solo si pregunta por la instalación: si están los agentes `lf-` y los
   hooks (README del paquete).

## 2. Recomendación (el primer caso que aplique)

1. Primer uso: una frase de bienvenida y `/lf-iniciar`, con qué hará.
2. Trae algo concreto: que lo cuente con sus palabras.
3. Sesión anterior sin cerrar: qué era, en qué quedó; puede retomarlo
   diciéndolo.
4. Instrucciones de una versión anterior o documentos desactualizados:
   una frase y `/lf-iniciar`.
5. Ninguno: la guía rápida.

## 3. Guía rápida

- Acabo de llegar al proyecto: `/lf-iniciar`.
- Me reportaron un problema, tengo un requerimiento, quiero entender o
  cambiar algo: cuéntamelo.
- ¿Qué conviene mejorar en esta zona?: `/lf-revisar <zona>`.
- Terminé: `/lf-cerrar`.

Una línea: conviene una sesión por requerimiento. En Codex los comandos
van con `$` en lugar de `/`.
