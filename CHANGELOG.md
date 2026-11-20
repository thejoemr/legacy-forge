# Registro de cambios de LegacyForge

## 0.4.1 · 2026-11-20 · Distribución en GitHub

El paquete se versiona en `thejoemr/legacy-forge` y se instala con un
comando en cada asistente. El contenido de las skills es el de 0.4.1,
con dos ajustes para que funcionen instaladas como plugin.

Nuevo:

- `README.md`: instalación por asistente (Claude Code, GitHub Copilot en
  VS Code y CLI, Codex y otros compatibles con Agent Skills).
- `install.sh` (macOS, Linux, WSL, Git Bash) e `install.ps1` (Windows):
  instalan skills, ayudantes y, con `--hooks`, la protección de cambios,
  a nivel de usuario o de repositorio. Se ejecutan desde un clon o
  descargándose solos. Desinstalan con `--uninstall` y muestran lo que
  harían con `--dry-run`.
- Plugin de Claude Code (`.claude-plugin/plugin.json`) y marketplace
  (`.claude-plugin/marketplace.json`) con dos plugins: `legacyforge`
  (skills y ayudantes) y `legacyforge-guard` (protección de cambios,
  opcional).
- Manifiesto de plugin para Copilot CLI (`plugin.json`), con las skills.
- `scripts/check.mjs`: comprueba encabezados, referencias, listas de los
  instaladores, versiones, la copia del guard y el índice de skills.
- `scripts/test-guard.mjs`: 57 casos del guard con nombres de
  herramienta de Claude Code y de Copilot.
- `scripts/indice-skills.mjs`: regenera `pruebas/indice-skills.md`.
- `scripts/hooks-config.mjs`: agrega o quita los hooks del guard en un
  `settings.json` sin tocar lo demás.

Cambiado:

- `lf-init` R1: busca primero las skills hermanas (`../<nombre>/`), que
  es donde están en cualquier forma de instalación, incluido el plugin.
- `lf-help`, paso 1.4: reconoce la instalación como plugin o a nivel de
  usuario antes de sugerir copiar las skills.
- `claude/LEGACYFORGE.md` pasa a `docs/GUIA.md`; la instalación se
  movió al README. Los análisis de `claude/` pasan a `docs/historial/`.

Sin cambios: el resto de las skills, los agentes y `hooks/lf-guard.mjs`.
La plantilla de `AGENTS.md` sigue en 0.4.1: no hace falta volver a
correr `/lf-init` en proyectos ya preparados con 0.4.1.

## 0.4.1 · 2026-11-18 · Simulación de casos y contextos, mensajes cortos

Base: `docs/historial/diagnostico-copiloto-2026-11-18.md`, sección 4.26,
y la prueba de 0.4.0 en un proyecto real (la redacción convence; los
mensajes son demasiado largos).

Nuevo:

- `skills/lf-core/references/simulacion.md`: simular flujos como prueba
  de escritorio. Es un reflejo y no un barrido inicial: un caso primero,
  y más casos o contextos solo con una señal de la conversación (detalle
  nuevo del síntoma, dato que no cuadra, corrección, hipótesis que no
  explica todo, observación que no existe, cambio que toca estado
  compartido, "¿y si...?"). Supuestos llevados en el mapa interno y
  revisados cuando algo los toca. Lo intermitente como pista. Casos
  generados con técnicas de caja negra (particiones, valores límite,
  tablas de decisión, transición de estados). Contextos: ficha de
  entornos (servidores, balanceador y afinidad, sesión, reciclado, reloj,
  configuración que difiere) y eventos de infraestructura como entradas.
  La ficha se arma con el desarrollador durante el trabajo. Segundo plano
  con subagentes, simulación ejecutable con autorización y nunca contra
  producción, y qué recibe el desarrollador (lo más probable, la receta
  para forzarlo, la observación que separa).
- `agents/lf-escenarios.md`: subagente de solo lectura que recorre un
  flujo bajo una familia de condiciones y en los contextos de la ficha, y
  devuelve los escenarios que resuelven la duda con su receta.
- `pruebas/escenarios-copiloto.md`: E29 (sesión que se pierde a veces,
  solo con varios servidores, contexto que se descubre en la
  conversación) y E30 (pregunta de flujo que se responde leyendo: sin
  simular de más, respuesta corta).

Cambiado:

- `lf-core`: sección Simular; los supuestos incluyen los de la
  simulación y del contexto; confianza baja para una simulación sin
  observación; relación de ida y vuelta con el desarrollador; ruta 4 de
  "Decidir con lo que hay" es simular; situación "no se reproduce donde
  se puede probar"; errores nuevos (una sola trayectoria, simular todo al
  inicio, "funciona en desarrollo", mensajes largos); "corto por defecto"
  en Cómo hablas y en la revisión antes de enviar.
- `lf-diagnose`: sección "Simular cuando hace falta"; ENTORNO incluye la
  infraestructura de cada ambiente; una simulación sola no confirma una
  causa (R2); el dato de contexto como observación casi sin costo; la
  receta para forzarlo antes de instrumentar y antes de cerrar con causa
  probable; lo confirmado de los entornos va a la memoria.
- `lf-analyze`: prueba de escritorio de la propuesta con los casos y
  contextos que ya salieron, antes de presentarla; un dato de contexto
  nuevo en la iteración; tope de unas 15 líneas al presentar.
- `lf-test`: los escenarios simulados son casos con su receta; riesgos
  que solo existen en otro contexto se fuerzan o se dicen como no
  probados; un script de simulación requiere autorización.
- `lf-team`: rol lf-escenarios, sección "En segundo plano".
- `lf-memory`: sección Entornos en `sistema.md`.
- `skills/lf-core/references/comunicacion.md`: "Breve y preciso" con
  extensión de referencia por tipo de mensaje, un hilo por mensaje, qué
  recortar antes de enviar; resultados que llegan después en una o dos
  líneas; el dato de contexto se pide en una línea.
- `skills/lf-init/assets/plantilla-AGENTS.md`: versión 0.4.1, viñeta de
  simulación y comunicación corta. Sigue en 120 líneas.
- `agents/lf-simulador.md`: el desarrollador da el contexto de a poco;
  verdad de la infraestructura oculta; extensión de cada mensaje en la
  transcripción y en el informe; criterio 8 ampliado (extensión) y
  criterio 16 nuevo (simulación).

Decisión: la ficha de entornos vive en la memoria (`.legacyforge/`), no
en `SETUP.md`, porque se arma durante el trabajo y `SETUP.md` se
regenera desde el código. `lf-setup` no cambia.

Sin cambios: descripciones de las skills (el índice no se regenera),
`hooks/`, `lf-change`, `lf-delegate`, `lf-explain`, `lf-setup`.

Para actualizar un proyecto: reemplaza la carpeta de skills, copia
`agents/lf-escenarios.md` con los demás ayudantes y vuelve a correr
`/lf-init` (o reemplaza a mano el bloque de `AGENTS.md`).

Sin probar: ni en un asistente real ni con el simulador. Siguiente paso:
E29, E30 y una muestra de E19 a E28 para revisar la extensión.

## 0.4.0 · 2026-11-18 · Copiloto

Cambio de papel: LegacyForge deja de comportarse como un conjunto de
procedimientos y pasa a ser el copiloto conversacional de un
desarrollador de mantenimiento experto, nuevo en el proyecto. Le ahorra
lo técnico, le enseña el negocio y prepara las decisiones que él toma.
Base del cambio: `docs/historial/diagnostico-copiloto-2026-11-18.md`.

Nuevo:

- `skills/lf-core/references/comunicacion.md`: reglas de comunicación
  comunes. Reemplaza el bloque "Formato de mensajes" que estaba copiado
  en 12 skills. Conversación sin etapas ni conteos; registro según el
  propósito (informativo como historia del negocio, técnico al proponer
  la solución); brevedad sin viñetas con etiquetas; solo tres
  encabezados (■ ► ▲); preguntas solo si cambian lo que se hará, abiertas
  o cerradas según el caso; cuadro de preguntas solo para decisiones
  cerradas y todo lo que espera un resultado en el chat; APPLY siempre
  escrito en el chat; instrucciones al desarrollador listas para copiar y
  pegar, sin marcadores.
- `skills/lf-core/references/punto-focal.md`: entender antes de decidir.
  Para qué existe en el negocio, quién lo usa, qué decide su camino,
  ramas, dónde más vive la misma regla, el porqué (código, commits y
  comentarios; explícito e implícito) y el desorden controlado (parche
  que sostiene algo, deuda estable, deuda activa).
- `skills/lf-core/references/solucion.md`: la mejor solución (resuelve,
  arriesga lo mínimo, encaja con el estilo del sistema, no deja la zona
  peor); imitar el estilo y no los defectos; refactor que cabe en la
  tarea o se reporta; ventana opcional con señales; trabajo con plazo;
  dimensionar la tarea; lo que depende del entorno.
- `skills/lf-core/references/proyecto-de-trabajo.md`: la sección que
  estaba copiada en seis skills.
- `pruebas/escenarios-copiloto.md`: diez escenarios nuevos (E19 a E28).

Cambiado:

- `lf-core`: reescrita como el criterio del copiloto. Separa lo que nunca
  se salta (APPLY, secretos, producción, respaldo, solo lectura,
  codificación, una rama por requerimiento, evidencia) de lo que es
  criterio, con atajos legítimos y señales que obligan al rigor completo.
  Escalera para cuando falta instinto: decidir, preguntar, debatir,
  guiar. Seguir al desarrollador cuando salta pasos.
- `lf-diagnose`: simulación del caso sobre el código, búsqueda del texto
  del error, historial y memoria antes de pedir nada; observaciones
  baratas (captura, pestaña Red, trazas); costo según el contexto; causa
  directa cuando el código la confirma; sin plan visible.
- `lf-analyze`: sin dos etapas con aprobación ni versiones numeradas; el
  punto focal compartido antes de proponer; criterios de encaje, no
  empeorar, regla repetida, refactor y ventana; preguntas para el
  negocio en lugar de preguntarle al desarrollador lo que no sabe.
- `lf-change`: evaluación con el mapa del punto focal, otros lugares de
  la regla y parches; dimensión de encaje; planteamiento en prosa con el
  detalle técnico justo; el refactor que cabe va como cambio aparte y
  primero; un APPLY elegido en el cuadro de preguntas no vale.
- `lf-delegate`: el desarrollador es experto; toda herramienta de
  desarrollo empieza como familiar, también las antiguas. Instrucciones
  sin marcadores, con comandos y consultas completos y qué significa cada
  resultado. Tipo de tarea NAVEGADOR. Varias observaciones en una tarea
  si sirven al mismo objetivo. Sin "no puedo".
- `lf-test`: casos agrupados por lugar en vez de uno por mensaje y sin
  conteos; casos para los otros lugares de la regla y de comparación
  tras un refactor; nota de pruebas para quien valide.
- `lf-memory`: negocio, zonas frágiles y criterio del desarrollador.
- `lf-propose`: tipos REFACTOR y DEUDA_CONSCIENTE; reporte para quien
  decide, en su idioma y listo para pegar; estado REPORTADA.
- `lf-product` y su plantilla: procesos del negocio y lo que ya se
  confirmó del negocio en la memoria.
- `lf-explain`, `lf-debate`, `lf-optimize`, `lf-team`, `lf-branch`,
  `lf-init`, `lf-help`, `lf-setup`, `lf-architecture`: sin el bloque de
  formato copiado, con las reglas nuevas de comunicación.
- `skills/lf-init/assets/plantilla-AGENTS.md`: papel de copiloto, lo que
  nunca se salta, cómo trabajar y comunicación nueva. Lleva la versión
  en su segunda línea para detectar bloques viejos. 120 líneas.
- `agents/lf-critico.md`: también revisa regla repetida, encaje, no
  empeorar, parches que sostienen algo y si el refactor de verdad cabe.
- `agents/lf-explorador.md`: dónde más vive una regla y el porqué.
- `agents/lf-simulador.md`: persona principal experta y nueva en el
  proyecto; el copiloto simulado aplica criterio dentro de los
  invariantes; 15 criterios de evaluación nuevos.
- `pruebas/indice-skills.md`: regenerado. Descripciones: 7 192
  caracteres, dentro del presupuesto de Codex.

Sin cambios: `hooks/` (el guard ya solo acepta APPLY como mensaje del
usuario), `lf-setup/references`, `lf-architecture/references`,
`agents/lf-verificador.md`.

Sin probar: ni en un asistente real ni con el simulador nuevo. Siguiente
paso: correr E19 a E28 y una muestra de E01 a E18.

## 0.3.0 · 2026-11-15 · Probado con simulaciones

Se creó un simulador (`agents/lf-simulador.md`) y 18 escenarios
(`pruebas/escenarios.md`) con tecnologías antiguas y usuarios que hablan
como desarrolladores reales. Dos rondas; ronda 2 sin BLOQUEANTES.
Detalle en `pruebas/informe-simulacion.md`.

- Archivos heredados: codificación y fin de línea conservados, binarios no
  se editan, respaldo sin secretos, sin terminal el usuario hace la copia
  (lf-change R13, A5, A7; tipo EDICION en lf-delegate).
- Producción: sin entorno de pruebas, escritura accidental del usuario,
  carpeta de trabajo que es producción, copia de datos que apunta a
  producción (lf-delegate R7, lf-change A3).
- Sin git y Subversion: cierre y memoria sin ramas, cambios sin confirmar
  del usuario, base `develop`, `git checkout` en equipos viejos.
- Intención: lf-analyze y lf-optimize se activan solas; un ticket ya
  definido va directo a lf-change; preguntas de 2 opciones si solo hay 2.
- Debate: seguir el camino del usuario requiere que lo diga; evidencia
  nueva es un dato verificable.
- Hook v0.3.0: `hotfix` y `release` ya no son ramas protegidas por
  defecto; el mensaje del bloqueo contempla el acuerdo del equipo; se
  entienden `-C` y `-c` de git.
- lf-core documenta que el guard no ve escrituras por terminal.
- Sigue sin probarse en un asistente real.

## 0.2.1 · 2026-11-11 · Asistente que decide, y Copilot

- `skills/lf-core`: nueva sección "Decidir con lo que hay". El asistente
  elige la ruta de cada paso (hacerlo, ayudante, usuario, razonarlo,
  dejarlo pendiente) según lo disponible y el riesgo, y dice qué se
  pierde al bajar de ruta. Cubre entorno sin instalar, pruebas que no
  puede ejecutar, sin terminal, sin git, sin datos, sin ayudantes, sin
  hook y usuario que no sabe o no está.
- `hooks/lf-guard.mjs`: reconoce las herramientas por tipo y no por el
  nombre de Claude Code, para servir también en Copilot. Lee parches y
  listas de archivos. Modo de depuración `LF_GUARD_DEBUG=1`.
- `hooks/copilot-hooks.json`: configuración para `.github/hooks/`.
- `skills/lf-team`: los agentes también sirven en Copilot (VS Code); el
  asistente decide entre agentes lf-, subagente genérico o pasadas.
- Corrección: la versión 0.2.0 decía que agentes y hook eran solo para
  Claude Code. Copilot en VS Code soporta ambos.
- Sin probar en un asistente real, igual que 0.2.0.

## 0.2.0 · 2026-11-11 · Capa de inteligencia

Estado: sin probar en un asistente real. Requiere piloto antes de usarse
en producción. Análisis completo en `docs/historial/analisis-2026-11-11.md`.

Nuevo:

- `skills/lf-core`: razonamiento. Objetivo, esfuerzo según riesgo, plan,
  elección de skill, verificación y nivel de confianza.
- `skills/lf-team`: reparto de lectura a subagentes de solo lectura, con
  comprobación de lo que devuelven. Alternativa en pasadas si no hay
  subagentes.
- `skills/lf-debate`: revisión crítica antes de proponer, manejo de
  desacuerdos por el dato que decide, y debate a pedido.
- `skills/lf-propose`: oportunidades con evidencia, cuándo interrumpir,
  lista priorizada y siguiente paso sugerido.
- `skills/lf-optimize`: rendimiento y modernización gradual, con medición
  antes y después. Solo por invocación directa.
- `skills/lf-memory`: notas entre sesiones en `.legacyforge/`.
- `agents/`: lf-explorador, lf-critico y lf-verificador (Claude Code).
- `hooks/lf-guard.mjs` y `hooks/settings-claude.json`: exige APPLY para
  editar, protege archivos de secretos y bloquea git destructivo
  (Claude Code). Aborda el punto 4 de la auditoría del 2026-10-29;
  falta probarlo en una sesión real.

Cambiado:

- `skills/lf-init/assets/plantilla-AGENTS.md`: sección Razonamiento,
  referencia a la memoria y skills nuevas. Para seguir en 120 líneas,
  "Flujo de trabajo" pasó a una viñeta de Razonamiento y se acortó la
  redacción de Desacuerdos y Preguntas, sin quitar reglas.
- `skills/lf-help`: lista las skills nuevas, detecta notas de sesiones
  anteriores y la instalación opcional de Claude Code.
- `claude/LEGACYFORGE.md` (hoy `docs/GUIA.md`): instalación de ayudantes
  y protección, cómo piensa el asistente, tabla de capacidades por
  asistente, versión.

Sin cambios: lf-analyze, lf-diagnose, lf-change, lf-test, lf-explain,
lf-branch, lf-delegate, lf-setup, lf-architecture, lf-product, lf-init.
La capa nueva se engancha a ellas desde lf-core y AGENTS.md.

## 0.1.0 · 2026-10-30 · Piloto

Las 12 skills originales, con las correcciones de la auditoría del
2026-10-29 (`docs/historial/auditoria-2026-10-29.md`) y de los cinco
ciclos de feedback del piloto.
