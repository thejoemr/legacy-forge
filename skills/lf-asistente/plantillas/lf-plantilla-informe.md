# Informe de un agente

Lo devuelve todo agente `lf-` al terminar. El hook `lf-informe` revisa
que traiga los cinco encabezados; si falta uno, el agente lo completa.

```
## Respuesta
<una o dos frases que responden la pregunta del encargo>

## Evidencia
- <hecho> — `<ruta>:<línea>` | commit `<hash>` | salida `<archivo>`
- (Deducido) <lo inferido, separado de lo explícito, con su base>

## Confianza
<alta | media | baja> — <por qué; qué la subiría>

## No revisado
- <lo que quedó fuera y por qué; "nada" si nada>

## Para decidir
- <lo que tocaría una decisión del humano o de otros: riesgo que
  aceptar, regla que confirmar con el negocio, observación que solo él
  puede hacer (lista para ejecutar). "Nada" si nada>
```

Secciones opcionales, después de las cinco, según el agente:
`## Cadena`, `## Consultas`, `## Casos`, `## Planteamiento`,
`## Borrador`, `## Receta`, `## Diferencias`.

`## Cadena` es obligatoria cuando la unidad es un flujo o territorio:

```
## Cadena
| # | Eslabón | Dónde | Marca |
|---|---|---|---|
| 1 | Entrada: <pantalla, endpoint, job> | `<ruta>:<línea>` | leído |
| 2 | <servicio, regla, acceso a datos> | `<ruta>:<línea>` | leído |
| 3 | Base: <procedimiento, trigger, vista> | `<ruta>` | ubicado: <por qué no se leyó> |
| 4 | Después: <quién lee lo escrito> | busqué en <dónde> | no encontrado |
```

Reglas:

- Cada hecho con su cita. Sin cita, va como deducido.
- Ningún secreto ni dato personal: nombra la clave o el campo, nunca el
  valor.
- "No encontré" no prueba ausencia: di dónde buscaste.
- Todo eslabón ubicado o no encontrado de la cadena aparece también en
  "No revisado".
