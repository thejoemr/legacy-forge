---
name: lf-entornos
description: "Ficha de cada ambiente (servidores, sesión, reciclado, reloj, configuración), marcando lo supuesto. Cuando algo depende del ambiente."
---

# lf-entornos

Usada por: Investigador, Simulador, Analista de impacto, Documentador.

## Para qué

Razonar con el contexto real donde corre el sistema: muchos fallos "a
veces" o "solo en QA" son del ambiente.

## Cómo

1. Deducir del código y la configuración: archivos por ambiente
   (appsettings.QA.json, web.config con transformaciones, perfiles de
   Spring, variables por ambiente en CI), dónde vive la sesión, caché en
   memoria, jobs programados, zona horaria usada.
2. Llenar la ficha (`../lf-asistente/plantillas/lf-plantilla-entornos.md`)
   marcando cada dato como supuesto o confirmado.
3. Al humano, solo el dato que separa hipótesis, en una línea, diciendo
   qué decide: "¿QA tiene más de un servidor? Si sí y sin afinidad, eso
   explica que se pierda el carrito".
4. Lo confirmado va a `memoria/entornos.md`.

## Entrega

Qué cambia de un ambiente a otro y qué es supuesto.

## Decide

Nada; el humano confirma los datos.

## Límites

- Lo no confirmado se marca.
- Nunca credenciales ni cadenas de conexión: nombres de servidor y base.
- Los nombres de servidores y bases de producción que dé el humano van a
  `config.json` (`produccion`) para que el hook los bloquee.
