---
name: lf-historial
description: "El porqué y el desde cuándo, de commits, tickets y comentarios con git de solo lectura."
---

# lf-historial

Usada por: Historiador.

## Para qué

Separar el porqué escrito (commit, ticket, comentario) del deducido, y
fechar cambios que coinciden con un síntoma.

## Cómo

Comandos permitidos (solo lectura):

```
git log --follow --format="%h %ad %an %s" --date=short -- <archivo>
git log -L <inicio>,<fin>:<archivo>
git blame -w -C <archivo> -L <inicio>,<fin>
git show <hash> --stat
git log --since=<fecha> --until=<fecha> --format="%h %ad %s" --date=short -- <ruta>
git log --format="%h %s" --grep=<ticket>
```

1. Por qué está así: blame de las líneas, el commit que las introdujo,
   su mensaje y el ticket que cite; los comentarios cercanos.
2. Desde cuándo: commits de la zona entre la última vez que funcionó y
   la primera que falló.
3. Zonas calientes: archivos con más commits de corrección ("fix",
   "corrige", "hotfix", número de incidente) en los últimos 12 meses;
   arreglos repetidos en el mismo lugar.
4. Sin git (SVN, TFS, VSS, copias con fecha): comentarios de cabecera,
   carpetas de respaldo y fechas de archivo; dilo como evidencia débil.

## Entrega

- Lo explícito: qué dice el commit o el ticket, con hash y fecha.
- Lo deducido: lo que sugiere el contexto, marcado.
- Cambios que coinciden con el síntoma, con fecha.
- Zonas calientes con su conteo.

## Límites

- Un mensaje de commit es pista, no prueba: se contrasta con el código.
- Solo lectura de git: nada de checkout, reset, stash ni commits.
- Autores: solo si importan para saber a quién preguntar; nunca para
  culpar.
