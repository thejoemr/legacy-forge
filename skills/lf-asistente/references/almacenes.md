# Almacenes

Los escribe solo el asistente. Los agentes los leen. El humano elige
dónde viven, los ve, los corrige y los borra.

## Ubicación

Por defecto `.legacyforge/` en la raíz del proyecto, excluida de git con
`.git/info/exclude` (no ensucia el repositorio). El humano puede pedir
otra cosa al iniciar: versionarla con el equipo, o fuera del proyecto
(`LF_HOME`). Lo que eligió queda en `.legacyforge/config.json`.

```
.legacyforge/
  config.json            produccion, ramas protegidas, ubicación
  memoria/               lo confirmado, entre sesiones (lf-memoria)
    sistema.md           causas, zonas, consumidores delicados
    negocio.md           términos y reglas, con fuente y estado
    entornos.md          fichas de ambiente (lf-plantilla-entornos)
    decisiones.md        registros de decisión y disenso
    sugerencias.md       aceptadas y rechazadas, con su razón
    calibracion.md       aciertos por zona y tipo de corazonada
    criterio.md          cómo prefiere trabajar el humano
    sesiones.md          una entrada por sesión cerrada
  expediente/<rama>/     el caso en curso
    caso.md              pedido, caso concreto, tamaño, decisiones
    mapa.md              territorios, hipótesis vivas y descartadas
    informes/            un archivo por informe de agente
    salidas/             salidas completas de comandos y del humano
    pendientes.md        memoria propuesta, oportunidades, sugerencias
  respaldo/<rama>/       copias previas a cada archivo modificado
```

## config.json

```json
{
  "produccion": ["SRV-PROD-01", "FACT_PROD", "prod.empresa.local"],
  "ramasProtegidas": "^(main|master|develop|development|trunk)$",
  "memoria": ".legacyforge"
}
```

`produccion` son textos (servidor, base, host) que, si aparecen en un
comando, lo bloquean (`lf-guard-produccion`). Los da el humano.

## Expediente

- Se crea con el primer encargo del caso; la carpeta es el nombre de la
  rama con `/` cambiado por `_` (sin git: `sin-rama_<fecha>`).
- Cada informe de agente se guarda completo en `informes/` antes de
  integrarlo: `<agente>-<unidad>.md`.
- Lo que el humano pega y es largo se guarda en `salidas/` y lo lee el
  Lector de evidencia.
- El asistente relee el expediente por partes en vez de cargar todo.
- Al cerrar se resume en la memoria y se puede borrar (lo decide el
  humano).
