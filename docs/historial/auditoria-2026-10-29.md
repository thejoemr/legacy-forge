# Auditoría de LegacyForge · 2026-10-29

Veredicto inicial: no está listo para producción.
Estado tras correcciones (mismo día): listo para un piloto controlado.
Pendiente para producción: puntos 4, 5, 8, 9 y 10.

## Bloqueantes

1. lf-test no carga. Su encabezado no es YAML válido: la descripción
   contiene ": " sin comillas. lf-change depende de lf-test para probar.
2. lf-test, usada sola, ejecuta comandos de compilación y pruebas sin
   autorización. Pruebas de integración o scripts de CI pueden tocar bases
   compartidas o desplegar.
3. Secretos: lf-change no tiene regla de secretos (lee y edita
   configuración), y lf-branch solo revisa nombres de archivo antes del
   commit, no su contenido. Una cadena de conexión en appsettings.json
   podría confirmarse y subirse al remoto.

## Importantes (antes de producción)

4. La autorización APPLY depende de que el modelo invoque lf-change. No
   hay un hook que bloquee ediciones sin autorización.
5. Sin validación real desde la primera prueba. lf-branch, lf-test, el
   modelo de capacidades, los bloques gestionados y el formato visual no
   se han probado en ningún asistente.
6. Sesiones paralelas sobre la misma copia del código: lf-branch puede
   cambiar de rama bajo otra sesión. B4 no define qué hacer si la rama
   actual no es la de la sesión.
7. .lf-change-respaldo/ y .lf-setup-progreso.md no se excluyen de git.

## Menores

8. El paquete no tiene número de versión ni registro de cambios.
9. Una sesión completa carga unos 23 000 tokens de instrucciones;
   relevante con modelos de contexto pequeño.
10. lf-setup está en 494 de 500 líneas recomendadas.

## Lo que pasó la revisión

- 11 de 12 encabezados válidos; nombres y tamaños correctos.
- Descripciones: 4 236 caracteres en total, dentro del presupuesto de
  Codex (unas 8 000).
- Configuración de Codex presente en todas las skills de invocación
  directa.
- Todas las referencias a archivos existen; referencias entre skills
  consistentes; sin restos de nombres anteriores.
- Bloque de formato idéntico en las 12 skills; plantillas con bloque
  gestionado y huella dentro.
- El zip coincide con el código fuente.

## Correcciones aplicadas

- 1: descripciones de las 12 skills entre comillas; 12/12 encabezados
  válidos.
- 2: lf-test pide autorización para compilar o ejecutar pruebas cuando no
  la invoca lf-change; revisa qué recursos tocan; nunca publica, despliega,
  migra ni prueba contra producción.
- 3: lf-change tiene regla de secretos (no leer, no mostrar, no escribir
  valores reales en el repositorio). lf-branch revisa nombres y contenido
  de lo agregado antes de cada commit.
- 6: lf-branch registra la rama de la sesión, no hace commit si la rama
  actual no coincide y propone una copia separada (git worktree) cuando
  detecta otra sesión en la misma carpeta.
- 7: el respaldo de lf-change y el progreso de lf-setup se agregan a
  .git/info/exclude.
- Re-auditoría: 0 problemas en encabezados, tamaños, referencias y restos;
  formato idéntico en las 12 skills; regla de secretos en las 9 skills que
  leen o editan código; zip idéntico a la fuente.

## Piloto · feedback 1 (2026-10-30)

Contexto: skills en una carpeta "projects" con muchos repositorios
(monorepos y grupos de microservicios), usando Copilot en VS Code.

Problemas observados y correcciones:

- Las skills trataban la carpeta abierta como un solo proyecto y
  mezclaban repositorios de sistemas distintos. Ahora todas fijan un
  proyecto de trabajo (repositorio o carpeta que agrupa repositorios de
  una misma aplicación) y se limitan a él. lf-branch crea la misma rama en
  cada repositorio que toca. La guía recomienda instalar las skills a
  nivel de usuario y abrir cada proyecto por separado.
- lf-init preguntaba cosas que un usuario nuevo no puede saber (orden de
  prioridad de funcionalidades, intención de diseño). Ahora, si no hay
  evidencia de que conoce el proyecto, asume que es nuevo y anota esas
  dudas como pendientes por validar con el equipo. lf-product ya no pide
  validar el orden de las funcionalidades.
- lf-init encadenaba varias confirmaciones. Ahora genera borradores en
  .lf-borradores/ y pide una sola autorización al final.
- Copilot usó su propio cuadro de preguntas con opciones True/False y se
  filtraron términos internos ("capacidad secundaria", "cálculos"). El
  formato prohíbe opciones Sí/No o True/False, exige opciones
  descriptivas con la recomendada primero y lista los términos internos
  que no deben usarse.

## Piloto · feedback 2 (2026-10-30)

Caso: en una sesión nueva, el usuario pidió eliminar la rama en la que
estaba. lf-branch lo bloqueó.

Causas:

- R6 prohibía borrar ramas sin excepción, incluso a pedido del usuario.
- B1 trató el pedido como el requerimiento de la sesión y preguntó si
  continuaba el requerimiento anterior.
- La detección de sesiones paralelas podía activarse en una sesión nueva,
  porque todavía no había rama registrada.

Correcciones:

- B8: eliminar ramas a pedido del usuario, con evidencia de qué se pierde,
  riesgo, comando de recuperación y APPLY. Las ramas protegidas no se
  eliminan.
- Tareas de repositorio (eliminar ramas, ver estado o historial) no son
  requerimientos ni se evalúan contra el alcance.
- Las señales de sesiones paralelas solo aplican después de registrar la
  rama de la sesión y a cambios que aparecen durante ella.

## Piloto · feedback 3 (2026-10-30): sobreingeniería en la documentación

Observación del usuario: lf-init y sus fases preguntaban de más (incluso
la arquitectura del procesador) y producían guías verificadas en lugar de
un resumen. Un desarrollador, al recibir un proyecto, primero ve cómo
correrlo, luego la arquitectura y al final el propósito.

Correcciones:

- lf-setup, lf-architecture y lf-product reescritas como resúmenes de lo
  que hay en el código: solo lectura, sin preguntas (salvo elegir el
  proyecto si hay varios), sin pruebas ni delegación, sin métricas ni
  ranking. Lo que el código no dice se anota como no encontrado; el
  usuario puede agregar lo que sepa.
- Tamaño: lf-setup de 490 a 133 líneas (de 9 archivos de referencia a 1);
  lf-architecture de 368 a 141; lf-product de 349 a 137.
- lf-init: orden cómo correrlo, arquitectura, propósito y AGENTS.md; ya
  no pide aprobar el plan; una sola confirmación al final.
- Documentos del equipo: el bloque se agrega al final sin preguntas.

## Piloto · feedback 4 (2026-10-30): documentos como mapa

Los documentos de lf-init deben ser compactos: puntos clave y dónde
profundizar. Plantillas reducidas a una línea por punto y límites
explícitos: SETUP.md 40 líneas, ARCHITECTURE.md 60, PRODUCT.md 40, con
topes por sección.

## Piloto · feedback 5 (2026-10-30): mensajes en el chat

Caso: la definición técnica de lf-analyze en Copilot salió dentro del
cuadro de preguntas, con rutas borradas ("guarda (, )"), nueve campos
densos y frases comprimidas de la escala interna ("Alcance: un cambio
local").

Causas:

- La regla de formato permitía la herramienta de preguntas sin decir que
  el contenido va fuera de ella. Esa herramienta muestra texto plano y
  borra enlaces.
- Las rutas no tenían prohibido el formato de enlace.
- Las plantillas usaban líneas "Campo:" sin viñeta, que VS Code une en un
  párrafo, y la definición técnica pedía ocho secciones, incluida "Nivel
  de intervención: N<nivel>".
- El formato de pregunta de siete skills pedía las opciones dentro de una
  frase, lo que choca con los botones.

Correcciones:

- Formato compartido (12 skills y AGENTS.md): contenido en el chat; la
  herramienta de preguntas solo lleva la pregunta y sus opciones. Rutas
  entre comillas invertidas, nunca como enlace. Cada dato en una viñeta
  con su nombre. Breve: 1 o 2 frases y hasta 6 viñetas; más detalle si el
  usuario lo pide. Frases completas, sin etiquetas comprimidas. "Nivel de
  intervención" y N0 a N4 pasan a la lista de términos internos.
- Formato de pregunta unificado en siete skills: contexto en el chat,
  luego una pregunta de una línea con 3 opciones y la recomendada primero.
- lf-analyze: definiciones funcional y técnica con resumen y viñetas, sin
  secciones vacías, con un ejemplo de cómo debe verse. Las alternativas
  descartadas y el orden de dependencias se muestran solo a pedido.
- lf-change: el planteamiento pasa de once elementos a resumen, archivos,
  riesgo, rama, pruebas y comandos autorizados. Detalle de riesgos solo si
  es medio o alto.
- lf-delegate e lf-init: plantillas con viñetas y omisión de lo que no
  aplica.

