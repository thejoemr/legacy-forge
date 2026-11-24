# Informe de simulación de LegacyForge

Estado: ronda 2 completa en los 18 escenarios, sin BLOQUEANTES. Los IMPORTANTES y varios MENORES de la ronda 2 están corregidos; no se hizo una tercera ronda de comprobación.

## Qué se probó y cómo

Un agente simulador (`agents/lf-simulador.md`) representa tres papeles:
el usuario (un desarrollador con muletillas, ambigüedad y contexto
incompleto), el asistente que lee las skills reales, y el entorno
(archivos, herramientas, fallos). Cada escenario de `pruebas/escenarios.md`
corre sobre un proyecto de juguete en tecnología antigua. Los hallazgos
se clasifican BLOQUEANTE, IMPORTANTE y MENOR, y se validan contra el
texto de la skill antes de corregir.

Tecnologías cubiertas: VB6 y SQL Server 2000, ASP clásico y Access,
.NET 3.5 y Oracle 10g, COBOL y JCL, Java 6 y Struts, PHP 5.3 y MySQL 5.1,
Delphi 7 y Firebird, PowerBuilder y Forms 6i, Node 8 y AngularJS,
C con Makefile, Rails 2.3, MFC con SVN, T-SQL 2005, Python 2.7 y Django
1.4, Perl CGI, Visual FoxPro, Java 1.4 y EJB 2.

## Rondas

- Ronda 1 (18 escenarios): unos 100 hallazgos. Se corrigieron la
  codificación de archivos heredados, entornos solo de producción,
  activación automática de analyze y optimize, ramas hotfix, SVN y sin
  control de versiones, ramas sin remoto, secretos, binarios y urgencia.
- Ronda 2 (los 18 escenarios): ningún BLOQUEANTE. Hallazgos IMPORTANTES corregidos:
  - Escritura accidental del usuario en producción y tarea UI que no
    avisa "no guardes" (lf-delegate R7).
  - Datos que solo están en un binario ya no bloquean el veredicto
    (lf-change A2.6) y hay paso para exportarlos (A2.2).
  - Respaldo, comparación y restauración sin terminal y con archivos no
    UTF-8; fin de línea de las líneas nuevas (lf-change A5, A7).
  - Respaldo que duplicaba secretos (lf-change A5.3).
  - Carpeta de trabajo que es producción (lf-change A3).
  - Tipo de tarea EDICION en lf-delegate.
  - Un `.dbf` se puede leer; la copia de datos no debe apuntar a
    producción (lf-delegate R1, R7).
  - Preguntas de 2 opciones cuando solo hay 2 con sentido (bloque de
    formato compartido).
  - Pregunta de memoria antes de otras al cerrar; sin git también se
    cierra (lf-memory M0, lf-branch B0).
  - Base `develop` si va por delante, `git checkout` en equipos viejos,
    cambios del usuario sin confirmar en Subversion, memoria fuera de la
    carpeta con Subversion (lf-branch, lf-change, lf-memory).
  - Regla de dinero en lf-core: un ticket que ya fija la regla es un
    cambio definido.
  - Mensaje del hook al bloquear un commit cuando el equipo acordó
    commitear en esa rama.

## Qué no se pudo comprobar

Nada corrió en un asistente real. Las simulaciones leen las skills como
texto y representan al asistente con un modelo. No se verificó:

- Que Claude Code lea `env` de `.claude/settings.json` para
  `LF_GUARD_PROTECTED`.
- Los nombres de herramientas de Copilot en los hooks (en vista previa).
- El comportamiento de subagentes reales.
- Compilar, ejecutar o medir en las tecnologías antiguas.
- El guard no ve escrituras por terminal (`sed -i`, redirecciones, `cp`,
  `mv`, `rm`); las skills lo declaran y mantienen la regla.

## Riesgos que quedan

- Los cambios de la última pasada de arreglos no se volvieron a simular.
- El bloque de AGENTS.md no lleva versión: un proyecto preparado con un
  paquete anterior conserva reglas viejas y nada lo detecta.
- La plantilla de AGENTS.md está en el tope de 120 líneas.

- Las skills son largas (hasta unas 520 líneas); un asistente con poca
  ventana puede aplicar mal reglas lejanas.
- La calidad depende de que el asistente cargue la skill correcta por su
  descripción; el índice (`pruebas/indice-skills.md`) permite revisarlas.
