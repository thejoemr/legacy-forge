# LegacyForge · guía de uso

Versión 0.4.1 · ver `CHANGELOG.md`

Un copiloto para el desarrollador que mantiene un sistema existente. Le
ahorra lo técnico y le enseña el negocio mientras trabaja, para que
decida con criterio de empresa sin romper lo que ya funciona. No es un
método que haya que seguir ni un agente que trabaja solo: es una
conversación con un colega que lee, busca, cruza y simula muy rápido, y
que prepara las decisiones para que las tomes tú.

Funciona sobre GitHub Copilot, Codex o Claude Code y se compone de:

- Skills: el criterio y los procedimientos. Cómo entender, diagnosticar,
  analizar, cambiar, probar, debatir, proponer y recordar.
- Agentes: ayudantes de solo lectura que exploran, critican, verifican y
  simulan escenarios.
- Hooks: una protección fuera del modelo que impide editar sin tu
  autorización. Para Claude Code y Copilot.

Solo las skills son necesarias. Agentes y hooks son opcionales: sin
ellos el copiloto trabaja igual, por otra ruta.

## Instalación

Los comandos para cada asistente están en el `README.md` del
repositorio. Lo que conviene saber además:

- Las skills se instalan siempre completas: algunas comparten
  referencias que viven en `skills/lf-core/references/`.
- Si tienes varios proyectos, instala a nivel de usuario y abre cada
  proyecto en su propia ventana (la carpeta del repositorio, o la que
  agrupa los repositorios de un mismo sistema). Así cada sesión ve un
  solo proyecto.
- Si quieres que todo el equipo lo tenga al clonar, instala dentro del
  repositorio (`--scope project`) y confirma las carpetas que se crean.
- Si ya usabas una versión anterior, vuelve a correr el instalador:
  reemplaza la carpeta de cada skill completa. Después ejecuta `/lf-init`
  en cada proyecto: actualiza el bloque de `AGENTS.md`, que lleva la
  versión para detectar bloques viejos.
- Abre una sesión nueva después de instalar: skills, ayudantes y hooks
  se cargan al iniciar. En Copilot, la herramienta para lanzar
  subagentes debe estar activada en el selector de herramientas del
  chat.

Sin ayudantes, o en Codex, el copiloto hace el mismo trabajo en pasadas
separadas: funciona, pero es más lento y la segunda opinión es menos
independiente. `agents/lf-simulador.md` es solo para probar el paquete y
no se instala.

### Protección de cambios

Sin esta protección, la regla "nada se edita sin APPLY" depende de que el
modelo la siga. Con ella, no puede editar aunque el modelo se equivoque.
Requiere Node.js 18 o superior.

Qué hace:

- Bloquea crear o editar archivos del proyecto si tu último mensaje no
  fue exactamente `APPLY`. Tu siguiente mensaje retira la autorización.
  El APPLY se escribe en el chat: una opción elegida en el cuadro de
  preguntas del asistente no cuenta.
- No bloquea los documentos que el copiloto escribe con su propia
  confirmación (`SETUP.md`, `ARCHITECTURE.md`, `PRODUCT.md`, `AGENTS.md`)
  ni sus carpetas de trabajo (`.legacyforge/`, `.lf-borradores/`,
  `.lf-change-respaldo/`).
- Bloquea leer archivos de secretos (`.env`, `secrets.json`, `*.pfx`,
  `*.pem`, `*.key`).
- Bloquea comandos de git que descartan o reescriben trabajo
  (`push --force`, `reset --hard`, `add -A`, `commit -a`, `stash`,
  `clean`, `rebase`), el commit en ramas principales (main, master,
  develop, trunk) y eliminar ramas sin `APPLY`. Las ramas `hotfix/*` y
  `release/*` no se bloquean.

Qué no hace: no puede detectar toda escritura hecha desde la terminal
(por ejemplo, un script que modifica archivos). Reduce el riesgo; no
reemplaza la revisión de lo que autorizas.

Ajustes, por variables de entorno: `LF_GUARD_PROTECTED` cambia la lista
de ramas donde no se permite commit (una expresión regular; vacía lo
desactiva). Si tu equipo confirma directo en develop, déjala en
`^(main|master)$`. `LF_GUARD_OFF=1` desactiva la protección.
`LF_GUARD_DEBUG=1` anota cada evento en `legacyforge-guard/debug.log` de
tu carpeta temporal.

En Copilot los hooks están en vista previa y tu organización puede
tenerlos desactivados. Compruébalo antes de confiar en él: pide un cambio
pequeño y, sin escribir `APPLY`, verifica que la edición se bloquea. Si
no se bloquea, define `LF_GUARD_DEBUG=1`, repite la prueba y revisa el
registro.

### Si abres una carpeta con varios proyectos

El copiloto te preguntará con cuál trabajar y se limitará a ese. Funciona,
pero abrir cada proyecto por separado es más rápido.

## Primeros pasos

1. Abre el chat de tu asistente en modo agente.
2. Escribe `/lf-help` (en Codex, `$lf-help`; con el plugin de Claude
   Code, `/legacyforge:lf-help`). Revisa tu proyecto y te dice por dónde
   empezar.
3. Si es la primera vez, te recomendará `/lf-init`. Lee el código y
   resume, en el orden en que lo harías tú, cómo correrlo, cómo está
   construido y para qué existe. Al final te muestra lo que no encontró,
   puedes agregar lo que sepas y das una sola confirmación para escribir.

## Qué usar en cada situación

| Situación | Qué hacer |
|---|---|
| No sé por dónde empezar | `/lf-help` |
| Acabo de llegar al proyecto | `/lf-init` |
| Solo quiero ponerlo a correr | `/lf-setup` |
| Me reportaron un problema | Cuéntaselo, o `/lf-diagnose` |
| Tengo un requerimiento nuevo | Cuéntaselo, o `/lf-analyze` |
| Quiero entender una parte del código | Pregúntaselo |
| Quiero hacer un cambio | Pídeselo |
| Quiero probar un cambio o revisar antes de liberar | `/lf-test` |
| No sé cuál opción conviene, o no estoy de acuerdo | Dilo, o `/lf-debate` |
| Algo va lento o quedó viejo | Cuéntaselo, o `/lf-optimize` |
| Quiero saber qué mejorar o qué quedó pendiente | `/lf-propose` |
| Cambió la estructura del proyecto | `/lf-architecture` |
| Se agregaron o quitaron funcionalidades | `/lf-product` |

## Cómo trabaja el copiloto

Escríbele como a un compañero ("oye, el reporte tarda un buen", "arregla
lo de la factura"). No hay pasos que seguir: puedes saltar, volver o
cambiar de idea, y él se ubica.

- Entiende qué quieres lograr, no solo lo que pediste literalmente.
- Antes de proponer, entiende el punto que vas a tocar: para qué existe
  en el negocio, quién lo usa, qué decide su camino, dónde más vive la
  misma regla y por qué está así, según el código, los commits y los
  comentarios.
- Recorre el código en la cabeza con valores concretos, como una prueba
  de escritorio. Empieza por un caso y, a medida que la conversación
  trae detalles ("solo a veces", "en mi máquina no pasa", "en prod hay
  dos servers"), simula otras condiciones y otros ambientes. Te pide el
  dato de contexto que decide cuando hace falta, y lo que le cuentas lo
  usa sin que se lo pidas. Si encuentra un escenario que reproduce el
  problema, te da la receta para forzarlo.
- Respeta el desorden que sostiene algo. Un caso especial raro suele ser
  una regla del negocio; no lo limpia sin saber qué sostiene.
- Busca la mejor solución para este sistema: la que resuelve, arriesga lo
  mínimo, se parece al código que la rodea y no deja la zona peor. Si un
  refactor cabe en la tarea, te lo propone; si no, te deja el reporte
  para quien decide. Si hay margen para algo más completo, te lo dice en
  una frase.
- Ajusta el rigor. Una pregunta se responde directo. Algo con dinero,
  datos, otros sistemas o difícil de revertir recibe el análisis
  completo y una segunda opinión.
- Te cuenta los hallazgos como el proceso de negocio, sin nombres de
  métodos ni líneas, salvo que los pidas. Al proponer la solución sí da
  el detalle técnico justo para evaluarla.
- Cuando no puede hacer algo (no tiene terminal, base o navegador), te lo
  pide con instrucciones listas para copiar y pegar, sin huecos.
- Lo que solo sabe el negocio o infraestructura te lo deja como pregunta
  para el área que corresponde, lista para pegar.
- Te dice qué tan seguro está y qué lo confirmaría.
- Si no estás de acuerdo, no cede por insistencia ni se aferra: busca el
  dato que decide la discusión. Las decisiones de negocio son tuyas.
- Recuerda entre sesiones lo confirmado del sistema, del negocio y de
  cada ambiente, las zonas frágiles, lo decidido y cómo prefieres que se
  hagan las cosas.
- Cuida los sistemas viejos: no guarda en UTF-8 un archivo que estaba en
  otra codificación, no edita binarios y, si solo existe producción, no te
  guía a modificarla: te entrega un script revisable.
- Ante una caída, primero busca cómo restablecer el servicio.

## Lo que pasa solo

- Antes de cambiar cualquier archivo, te explica el cambio y te pide que
  escribas `APPLY` en el chat. Después lo prueba y te pasa las pruebas
  que no puede hacer él.
- Cada sesión trabaja un solo requerimiento, en su propia rama, creada
  justo antes del primer cambio. Si vas a probar en otro equipo, la sube
  y te dice cómo descargarla.
- Si pides eliminar una rama, te muestra antes qué commits se perderían y
  cómo recuperarla, y espera tu `APPLY`.
- Si pides algo que podría estar fuera del requerimiento, te dice por qué
  duda y te deja elegir: incluirlo, otra sesión o anotarlo.
- Cuando hay mucho que leer o simular, reparte el trabajo entre
  ayudantes, a veces en segundo plano mientras conversan, y comprueba lo
  que devuelven.
- La primera vez que haya algo que valga la pena recordar, te pregunta
  dónde guardarlo. Nunca guarda secretos ni datos personales. Puedes
  decirle "recuerda que...", "olvida..." o "¿qué sabes de...?".

## Cómo leer los mensajes

Casi todo es conversación. Solo tres mensajes llevan una marca, para que
los reconozcas de un vistazo:

| Marca | Significa | Qué haces |
|---|---|---|
| `■ Cambio propuesto` | Quiere cambiar el código | Escribe `APPLY` en el chat para autorizarlo |
| `► Tu turno` | Necesita que hagas algo por él | Copia, pega, ejecuta y devuélvele lo que pide |
| `▲ Atención` | Un riesgo que interrumpe lo que se hacía | Tenlo en cuenta |

Los mensajes son cortos a propósito: lo que decide va primero y el resto
te lo ofrece en una línea. Si quieres más, pídelo ("dame el detalle
técnico", "¿en qué archivo?", "¿qué otros escenarios viste?").

## Documentos que genera

| Documento | Para qué sirve |
|---|---|
| `SETUP.md` | Lo que hay en el código para correr el proyecto, y lo que falta |
| `ARCHITECTURE.md` | Cómo está construido, sus convenciones y dónde encontrar cada cosa |
| `PRODUCT.md` | Para qué existe: procesos, funcionalidades y lo que se sabe del negocio |
| `AGENTS.md` | Instrucciones que el asistente lee siempre |
| `.legacyforge/` | Notas entre sesiones: sistema, negocio, ambientes, zonas frágiles, decisiones, pendientes |

Ninguno se escribe sin tu confirmación. Para las notas, la confirmación
es una sola vez, al elegir dónde guardarlas.

## Si tu asistente no puede hacerlo todo

A veces el asistente no tiene terminal, o la tiene pero no están los SDK
o la base de datos del proyecto. No te pregunta qué hacer: comprueba qué
puede hacer ahí y lo que no, te lo pasa a ti listo para ejecutar.

Si editas en un equipo y compilas o pruebas en otro, díselo. Seguirá
editando donde está y, antes de cada prueba, subirá la rama del
requerimiento o te dirá qué archivos llevar.

| Capacidad | Claude Code | Copilot | Codex |
|---|---|---|---|
| Skills | Sí | Sí | Sí |
| Ayudantes de solo lectura | Sí | Sí en VS Code, con subagentes activados | En pasadas separadas |
| Protección de cambios (hook) | Sí | Sí, en vista previa; compruébala al instalar | No incluida: depende de las skills |
| Notas entre sesiones | Sí | Sí | Sí |

## Si tu proyecto ya tenía documentación

LegacyForge no borra lo que tu equipo escribió:

- `AGENTS.md`, `SETUP.md`, `ARCHITECTURE.md` y `PRODUCT.md`: escribe solo
  dentro de su propio bloque, marcado con comentarios invisibles. Si el
  archivo ya existía, agrega su bloque al final.
- `README.md`, `CONTRIBUTING.md` y cualquier otro archivo: no se
  modifican.
- Instrucciones para asistentes que ya tenías (`AGENTS.md`, `CLAUDE.md`,
  instrucciones de Copilot, reglas de Cursor): `/lf-init` las revisa y te
  muestra qué repiten o contradicen. Las convenciones de tu equipo
  mandan. En lo que toca a seguridad te pregunta y deja registrado lo que
  decidas.
- Si ya tienes skills que hacen algo parecido, `/lf-init` te pregunta
  cuál debe activarse sola.
- Las skills usan el prefijo `lf-`, así que no chocan con otras.

## Probar el paquete antes de cambiarlo

- `agents/lf-simulador.md`: un subagente que monta un proyecto heredado
  de prueba, hace de desarrollador (experto, nuevo en el proyecto, con
  prisa y lenguaje real) y de copiloto aplicando las skills, y reporta
  dónde fallan.
- `pruebas/escenarios.md` (E01 a E18): tecnologías antiguas, con y sin
  git, producción como único entorno, urgencias y presión para saltarse
  la autorización.
- `pruebas/escenarios-copiloto.md` (E19 a E30): el papel de copiloto
  (parches que no se limpian, reglas repetidas, refactor que cabe o no,
  diagnóstico barato, pedido trivial, saltos, desarrollador como
  copiloto, plazo, error intermitente que solo pasa con varios
  servidores, pregunta que no merece simulación).
- `pruebas/indice-skills.md`: lo que el asistente ve de cada skill antes
  de activarla. Regenéralo con `node scripts/indice-skills.mjs` si
  cambias una descripción.

Después de modificar una skill, corre los escenarios que la usan y valida
cada hallazgo contra el texto de la skill antes de corregir. Resultados
de las rondas en `pruebas/informe-simulacion.md`.
