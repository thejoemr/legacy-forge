---
name: lf-legado
description: "Antes de modificar un archivo heredado: codificación, fin de línea, binarios, columnas fijas y cómo editarlo sin dañarlo."
---

# lf-legado

Usada por: Analista de impacto.

## Para qué

Que editar un archivo viejo no lo dañe: acentos rotos, fin de línea
cambiado, formato binario corrompido.

## Cómo, por archivo a modificar

1. Codificación: BOM (UTF-8 con BOM, UTF-16), UTF-8 sin BOM, o una
   codificación de un byte (Windows-1252, ISO-8859-1). Pistas: bytes de
   acentos que no son UTF-8 válido, `<?xml encoding=…>`, `charset` en
   páginas, `.editorconfig`, `.gitattributes`.
2. Fin de línea: CRLF, LF o mixto. Se conserva el que tiene.
3. Binario o formato de herramienta: `.frx`, `.dfm` binario, `.rpt`,
   `.xls`, `.mdb`, `.dtsx` y diseñadores generados. Un binario no se
   edita como texto.
4. Columnas fijas y longitudes: COBOL, archivos de intercambio,
   copybooks.
5. Archivos generados: si se regeneran desde otra fuente, el cambio va
   en la fuente.
6. Control de versiones distinto de git (SVN, TFS, VSS): archivos de
   solo lectura que hay que desbloquear; lo hace el humano.

## Cómo se editará

- Texto en UTF-8 o ASCII: con la herramienta de edición del asistente.
- Codificación de un byte o UTF-16: con un comando que lea y escriba en
  esa codificación (por ejemplo `iconv` o PowerShell con `-Encoding`),
  dentro del APPLY; o, si no hay forma segura, como instrucción para que
  el humano lo edite en su IDE.
- Binario o diseñador: siempre lo hace el humano en su herramienta, con
  pasos exactos.

## Entrega

Por archivo: codificación, fin de línea, tipo y cómo se editará. Va en
el planteamiento.

## Límites

Si no se puede saber la codificación, se dice y se edita como si fuera
de un byte, o lo edita el humano.
