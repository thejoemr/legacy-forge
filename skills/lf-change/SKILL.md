---
name: lf-change
description: "Úsala antes de crear, editar o borrar cualquier archivo de código, configuración, dependencias, build, infraestructura, CI o base de datos (fix, refactor, feature o cambio de configuración). Evalúa el riesgo con el mapa del punto focal, plantea el cambio con el detalle técnico justo, pide autorización con el token APPLY, lo aplica conservando el formato del archivo y lo prueba con lf-test."
---

# lf-change

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. En particular:

- El planteamiento es un mensaje con fin técnico: parte del efecto en el
  proceso y da el detalle técnico justo para evaluarlo. No repite el
  diff: el desarrollador lo ve en su árbol de cambios.
- Prosa corta; la lista de archivos solo si son varios.
- El APPLY se escribe en el chat. Nunca lo ofrezcas como opción del
  cuadro de preguntas: la protección de cambios no lo reconoce ahí.
- Esta skill sí es un procedimiento: es la parte del trabajo donde se
  escribe en archivos, y su orden protege lo que hoy funciona. Aun así,
  sus pasos no se anuncian.

## Definiciones

- Cambio: conjunto de modificaciones con un solo propósito. Puede tocar
  varios archivos.
- Archivos del cambio: lista exacta de archivos que el cambio crea,
  modifica o borra, cada uno con su acción: CREAR, MODIFICAR o BORRAR.
- Línea base: contenido de cada archivo antes de aplicar. Para CREAR, su
  inexistencia.
- Respaldo: carpeta `.lf-change-respaldo/` en la raíz del workspace, con
  la línea base.
- Evidencia: ruta y línea de un archivo, commit o salida de un comando.
  El conocimiento general sobre una tecnología no es evidencia.
- Riesgo demostrable: riesgo con evidencia. Ejemplo: "Pedidos.cs:88 llama
  a CalcularTotal(int); el cambio cambia la firma a decimal".
- Token: la cadena APPLY.
- Quién ejecuta: lo que tus capacidades permiten (lf-delegate, T0). El
  resto se le pasa al desarrollador listo para pegar.
- Cambio en pausa: cambio aplicado cuyas pruebas lf-test pausó porque el
  desarrollador pidió otra cosa. Sigue aplicado y conserva su respaldo.

## Alcance

Aplica a código fuente, configuración, dependencias y build,
infraestructura y CI, y scripts y migraciones de base de datos. Aplicar
el cambio es editar el archivo del script; ejecutarlo en una base es una
tarea aparte con las condiciones de lf-delegate (R7).

No aplica a los archivos que otras skills escriben con su propia
autorización (SETUP.md, ARCHITECTURE.md, PRODUCT.md, AGENTS.md), ni al
respaldo y su línea en `.git/info/exclude`.

## Reglas obligatorias

- Proyecto: si la carpeta tiene varios proyectos, trabaja solo en el de
  la sesión.
- R1. No crees, modifiques ni borres ningún archivo del cambio sin un
  token válido para ese cambio.
- R2. Un token autoriza un solo cambio, solo sus archivos listados y solo
  los comandos de verificación listados en el planteamiento.
- R3. Evalúa lo que el cambio agrega o modifica. Lo que ya existía no se
  corrige aquí; si afecta al cambio, se dice en el planteamiento.
- R4. Todo riesgo cita evidencia. Sin evidencia no es un riesgo: es un
  dato faltante.
- R5. Solo APIs, sintaxis y librerías de las versiones del proyecto,
  leídas de sus archivos. Si ningún archivo declara la versión, pídela y
  trátala como sin confirmar. Si verificas con otra versión de la
  herramienta, dilo.
- R6. Decide sin preguntar si la opción tiene evidencia, ninguna otra
  tiene evidencia del mismo peso y un error es de bajo riesgo y se
  detecta en la verificación. Si no, pregunta.
- R7. Si preguntas, una pregunta (o dos en el mismo sentido) y termina tu
  turno.
- R8. Nunca apliques correcciones sobre tu propio cambio fallido. Ver A7.
- R9. Revierte solo lo que tú aplicaste, desde el respaldo. Prohibido
  revertir con comandos que descartan cambios ajenos: `git checkout --`,
  `git restore` sin `--staged`, `git reset --hard`, `git stash`, y
  `svn revert`, `svn update` o `tf undo` sobre archivos con cambios del
  usuario.
- R10. Responde en el idioma del desarrollador.
- R11. Secretos:
  - No leas archivos que solo guardan secretos: .env, .env.local,
    .env.*.local, secrets.json, *.pfx, *.pem, *.key, user-secrets, ni el
    que el proyecto declare para sus claves.
  - En archivos de configuración, muestra solo ruta y línea: la línea
    puede traer una clave.
  - Nunca muestres un valor secreto en el planteamiento ni al describir
    el cambio.
  - Nunca escribas un secreto real en un archivo del repositorio. Usa el
    mecanismo que el proyecto ya usa; si no hay, pregunta.
  - Si el desarrollador pega un secreto, no lo uses ni lo repitas. Dile
    dónde configurarlo y que conviene cambiarlo.
- R12. Las pruebas nunca bloquean al desarrollador. Si trae algo que
  cambia lo que se prueba, se replantea (A6). Si es ajeno, el cambio
  queda en pausa.
- R13. Archivos heredados. Antes de modificar, mira la codificación y el
  fin de línea (`file <archivo>`, o acentos que salen como �):
  - Si no es UTF-8 ni ASCII (Windows-1252, ISO-8859-1, EBCDIC exportado)
    o depende de columnas fijas (COBOL, RPG), no lo edites con la
    herramienta de edición: edítalo con un comando o script que lea y
    escriba en su codificación y conserve el fin de línea. Sin terminal,
    el cambio se le pasa al desarrollador como instrucción exacta para su
    editor (lf-delegate, EDICION).
  - Un archivo web sin charset declarado (ASP, PHP o JSP viejos) cuenta
    como no UTF-8 si su contenido no lo es.
  - Un binario (.frx, .dfm binario, .pbl, .fmb, .mdb, .xls) no se edita
    ni se busca como texto. El cambio lo hace el desarrollador en su
    herramienta; el planteamiento dice qué binario cambia y que no quedará
    en la rama.

## Estados

### A1. Delimitación

1. El propósito del cambio, en una frase.
2. Si la solicitud tiene más de un propósito, divídela en cambios
   separados, dile al desarrollador la lista y el orden, y procesa solo
   el primero. Cada uno lleva su propio token.
3. Si el cambio sale de una propuesta aprobada en esta conversación
   (lf-analyze), toma de ahí el propósito, los lugares y lo que se
   reutiliza. No cambies el enfoque sin preguntar.
4. Si la propuesta incluye un refactor que cabe en la tarea
   (`../lf-core/references/solucion.md`), es un cambio aparte que va
   primero: sin cambio de comportamiento y con casos de comparación.
5. Lista los archivos del cambio con su acción.
6. Si el desarrollador prueba en otro equipo, el planteamiento dice que
   tendrá que llevar los cambios antes de probar.
7. Si hay un cambio en pausa, el planteamiento dice qué archivos suyos
   toca también este y que sus pruebas pendientes se retoman juntas.

### A2. Evaluación

1. Versiones del stack, desde los archivos del proyecto (R5).
2. El mapa del punto focal (`../lf-core/references/punto-focal.md`). Si
   viene de lf-analyze, úsalo; si el cambio llega directo, haz el que el
   riesgo pida. Como mínimo, para todo lo que el cambio modifica o borra:
   - Referencias directas: llamadas, imports, herencia,
     implementaciones.
   - Referencias dinámicas: strings, SQL, configuración, reflexión,
     inyección de dependencias, plantillas y vistas.
   - Otras unidades o repositorios del workspace.
   - Si un binario puede contener la referencia, pide una vez que lo
     exporte a texto (lf-delegate). Si no, "binario no revisado".
   - Las pruebas automáticas de quien llama a lo que cambia.
   - En C, C++ y lenguajes con preprocesador: macros, alias y punteros a
     función que lo envuelven.
   - Si el cambio toca una regla de negocio: dónde más vive esa regla.
   - Si toca un caso especial, un valor fijo o una excepción: qué
     sostiene, según el código, los commits y los comentarios.
3. Evalúa cada dimensión:
   - Stack y versiones.
   - Dependencias: versiones nuevas o cambiadas, breaking changes.
   - Contratos y APIs: interfaces públicas, consumidores,
     retrocompatibilidad.
   - Modelo de datos: esquemas, migraciones, reversibilidad.
   - Estado y concurrencia: cache, sesiones, condiciones de carrera.
   - Infraestructura: variables de entorno, build, deploy, entornos.
   - Runtime: fallos silenciosos, efectos secundarios, rutas sin
     actualizar.
   - Encaje: el cambio imita el estilo del código vecino, no copia sus
     defectos y no deja la zona peor (`solucion.md`).
4. Cada dimensión es SIN_IMPACTO o tiene riesgo demostrable, con
   evidencia, probabilidad, impacto y mitigación (o "sin mitigación").
5. Escalas:
   - Probabilidad ALTA: flujo principal. MEDIA: flujo alternativo o
     ciertos datos. BAJA: combinación poco común.
   - Impacto ALTO: pérdida o corrupción de datos, caída o seguridad.
     MEDIO: función incorrecta con alternativa. BAJO: cosmético o
     detectable de inmediato.
6. Veredicto, el peor de todas las dimensiones:
   - COMPATIBLE: ningún riesgo demostrable.
   - DELICADO: al menos un riesgo, todos con mitigación.
   - BLOQUEADO: un riesgo sin mitigación, o falta un dato que podría
     cambiar el veredicto. Un dato que solo está en un binario que no
     puedes leer no bloquea: va como "sin verificar" con un caso de
     prueba que lo cubra.
7. Si falta información, resuélvela según R6. Si hay que preguntar,
   primero el dato que podría bloquear.
8. Con una señal de rigor (lf-core), revisión crítica con lf-debate antes
   del planteamiento.

### A3. Planteamiento

Un solo mensaje:

    ■ Cambio propuesto · <tema> · riesgo <bajo, medio o alto>

    <Qué cambia en el proceso, para quién, en una frase.>

    <Cómo: qué se agrega o modifica, en qué archivo o archivos, con qué
    enfoque y en qué precedente se apoya. Lo que no se toca, si alguien
    podría esperar que se toque.>

    <El riesgo y cómo se cubre, si es medio o alto. Lo que hay que hacer
    antes, lo que ya existía y afecta, lo que depende del entorno.>

    <Cómo se va a probar, en una frase.>

    Comandos de verificación que quedan autorizados con APPLY:

        <comandos>

    Escribe APPLY para aplicarlo.

Lo que no puede faltar:

- Todos los archivos del cambio, nombrados en el texto o en una lista
  corta si son más de dos, con lo que pasa en cada uno. Es lo que el
  APPLY autoriza.
- El riesgo del encabezado sale del veredicto: COMPATIBLE es bajo;
  DELICADO es medio o alto según el impacto. Con riesgo medio o alto, qué
  podría pasar, a quién afecta y cómo se cubre, una frase por riesgo.
- Si un archivo no es UTF-8 o es binario (R13), cómo se editará.
- Lo que el desarrollador hace antes de aplicar (crear una columna, un
  valor de configuración) y por qué va primero.
- Lo que ya existía y afecta al cambio. Si sin corregirlo el objetivo
  queda mal, pregunta el alcance (lf-branch B2) en el mismo mensaje.
- Lo que depende del entorno o de un valor que no está en el código
  (`solucion.md`), como pregunta si no se puede deducir.
- Con Subversion o TFS y cambios del usuario sin confirmar en el mismo
  archivo: que saldrán juntos en su confirmación.
- La rama, solo si se crea ahora o se sube (lf-branch).
- Si el cambio solo se puede probar o aplicar en producción: la regla de
  lf-delegate (R7), dicha en el riesgo.
- Si la carpeta de trabajo es producción (la usan usuarios): dilo,
  ofrece entregar el cambio como texto o trabajar en una copia, y guarda
  el respaldo fuera de esa carpeta.
- Si nombras un entorno de pruebas documentado (README, SETUP.md) y
  dices qué escribe y cómo se deshace, el APPLY cuenta como la
  autorización de lf-delegate R7.4.
- Los comandos de verificación, según lf-test. Si no hay, se omite ese
  bloque. Si hay un cambio en pausa, sus casos pendientes van en la
  prueba.
- Si el cambio podría estar fuera del alcance del requerimiento, antes
  aplica el control de alcance de lf-branch (B2).

El texto, sin contar el encabezado, la lista de archivos ni los
comandos, cabe en unas 8 líneas: cada punto de la lista anterior que
aplica es media frase, no un párrafo (`comunicacion.md`, Breve y
preciso). Si hay que preguntar algo antes de aplicar, una sola
pregunta, la que bloquea.

BLOQUEADO: el mensaje empieza con "▲ Atención · cambio bloqueado", dice
por qué y qué se necesita para desbloquearlo. No pidas el token.

Termina tu turno.

### A4. Autorización

Clasifica el siguiente mensaje del desarrollador:

- Token válido: el mensaje completo, sin espacios al inicio y al final,
  es exactamente APPLY. Responde en una línea ("Aplicando 2 archivos.") y
  continúa a A5.
- Token inválido: intenta autorizar pero no es exactamente APPLY (apply,
  Apply, APPLY., "APPLY por favor", sí, ok, dale, una opción elegida en
  el cuadro de preguntas). Responde en una línea, sin regañar y sin la
  palabra "token": "Para aplicarlo escribe solo APPLY en el chat, o dime
  qué cambio." Si ya lo dijiste, recuérdalo con menos palabras; a la
  tercera vez, di el motivo en media frase. Si el mensaje trae además un
  dato o una pregunta, atiéndelo; si cambia el planteamiento,
  reenvíalo. Termina tu turno.
- Pregunta o comentario sobre el planteamiento: respóndelo. Si cambia
  archivos, enfoque, riesgos o veredicto, reenvía el planteamiento
  completo. El token sigue pendiente.
- Pedido lateral que no toca el cambio (un dato, una consulta, una
  explicación): atiéndelo y recuerda en una línea que el cambio espera
  APPLY.
- Cualquier otro mensaje (otra tarea que cambia el plan, o un rechazo):
  el cambio queda cancelado. "Cambio cancelado; si lo retomas, lo vuelvo
  a evaluar." Atiende el nuevo mensaje.

### A5. Aplicación

Antes, si aplica lf-branch, asegúrate de estar en la rama de la sesión,
creándola si es el primer cambio (lf-branch, B3).

1. Si el workspace es un repositorio git y `.lf-change-respaldo/` no está
   en `.git/info/exclude`, agrégalo. Con Subversion o TFS, di en el
   planteamiento que no confirme `.lf-change-respaldo/`. Con varios
   repositorios bajo una carpeta que no es repositorio, el respaldo va en
   `.lf-change-respaldo/<repo>/`.
2. Si el planteamiento incluye revertir un cambio anterior, reviértelo
   primero (A7, paso 4).
3. Guarda la línea base en el respaldo:
   - MODIFICAR y BORRAR: copia del original. Si contiene secretos,
     respalda solo las líneas que cambiarás, con su número, y dilo en el
     planteamiento. Sin terminal y con archivo no UTF-8, la copia la hace
     el desarrollador; nunca con la herramienta de edición.
   - CREAR: registro de que no existía.
   - Si un archivo ya está en el respaldo de un cambio anterior sin
     terminar, no lo sobrescribas: guarda aparte la versión actual como
     línea base de este cambio.
4. Aplica el cambio solo en los archivos listados, conservando
   codificación y fin de línea (R13). Si el código fecha sus cambios en
   comentarios, agrega la línea con fecha e iniciales para que las
   complete el desarrollador, y corrige el comentario que describa lo
   anterior. Los cambios manuales del desarrollador en binarios van
   antes; hasta que confirme, no empiezan las pruebas que dependen de
   ellos.
5. Compara cada archivo con su línea base: solo deben cambiar las líneas
   del cambio, y las nuevas deben terminar igual que sus vecinas. Sin
   terminal, pide abrir la página o pantalla y confirmar acentos, o dilo
   como "sin verificar". Si cambió algo más, restaura ese archivo desde
   el respaldo y vuelve a aplicarlo conservando la codificación.
6. Si necesitas tocar un archivo no listado: no lo toques, revierte lo
   aplicado (A7, paso 4) y vuelve a A3 con la lista nueva y un token
   nuevo.
7. Si aplica lf-branch, confirma el cambio en la rama (B4).

Continúa a A6 sin terminar tu turno.

### A6. Pruebas

1. Sigue lf-test con este contexto: propósito, archivos, riesgos,
   consumidores, otros lugares de la regla y criterios de aceptación. El
   token autoriza los comandos listados en A3. Si hay un cambio en pausa,
   sus casos pendientes y los que hay que repetir van en la misma serie.
2. Si lf-test reporta una falla, ve a A7 con su clasificación de la
   causa.
3. Si lf-test reporta un replanteo (lo que trajo el desarrollador cambia
   lo que se prueba):
   1. No sigas probando. El cambio sigue aplicado y su respaldo se
      conserva.
   2. Si hay que rehacer la implementación, empieza en el mismo turno un
      cambio nuevo desde A1 con lo aprendido; su planteamiento dice si se
      construye encima o primero se revierte. Un solo APPLY autoriza
      ambas cosas. Si hay que rehacer la solución o la causa, sigue con
      lf-analyze o lf-diagnose.
   3. R8 se mantiene: todo lo rehecho pasa por un planteamiento y su
      APPLY.
4. Si lf-test pausa las pruebas porque el desarrollador pidió algo ajeno:
   el cambio queda en pausa, aplicado y con respaldo. Atiende la
   solicitud (si modifica archivos, es un cambio nuevo con su token). Si
   no modifica archivos, al resolverla retoma lf-test. Si decide no
   retomar las pruebas, di qué quedó sin probar; borra el respaldo solo
   si confirma que conserva el cambio así; si no, ofrece revertirlo.
5. Cuando lf-test termina sin fallas:
   1. Borra el respaldo, incluido el de los cambios en pausa probados en
      esta serie. Sin control de versiones, consérvalo hasta que el
      desarrollador confirme que guardó el cambio a su manera. Con
      Subversion o TFS y cambios suyos sin confirmar en el archivo,
      consérvalo hasta que lo confirme.
   2. Dile en pocas líneas qué quedó hecho y qué se probó (resumen de
      lf-test).
   3. Si el cambio crea, borra o renombra una unidad o carpeta de primer
      nivel, cambia referencias entre proyectos, cambia de versión mayor
      un framework o mete un tipo de componente nuevo, sugiere en una
      línea /lf-architecture. Si agrega o quita un punto de entrada
      (pantalla, menú, endpoint, job, consumidor), también /lf-product.
   4. Si había más cambios en la lista de A1, empieza el siguiente.

### A7. Falla

1. Detente. No modifiques ningún archivo.
2. Usa la clasificación de la causa de lf-test: en el cambio,
   preexistente o del entorno.
3. Pregunta qué hacer:
   1. Revertir: restaurar la línea base y terminar.
   2. Rehacer: revertir y empezar un cambio nuevo desde A1 con lo
      aprendido. Requiere un token nuevo.
   3. Mantener: conservar el cambio y tratar la causa aparte. Solo si la
      causa es preexistente o del entorno; si está en el cambio, no la
      ofrezcas y di por qué.
   Si en la serie hay cambios en pausa, di a cuál atribuyes la causa y
   que revertir uno no revierte los demás.
4. Para revertir:
   1. Restaura cada archivo MODIFICAR o BORRAR desde el respaldo (un
      archivo no UTF-8 sin terminal lo restaura el desarrollador).
   2. Borra cada archivo CREAR.
   3. Comprueba que cada archivo es idéntico a su línea base.
   4. Borra el respaldo.
   5. Di qué archivos se restauraron.
   6. Si el cambio ya tenía commit, aplica lf-branch (B6). Si el
      desarrollador ya lo había llevado a otro equipo, dile qué archivos
      debe volver a llevar.
   Si revertir un cambio en pausa afecta archivos que un cambio posterior
   también modificó, revierte primero el posterior, o pregunta.
5. Si la protección de cambios (lf-guard) bloquea la restauración, el
   desarrollador ya eligió revertir: no repitas la pregunta. Envía
   "■ Cambio propuesto · revertir <cambio> · riesgo bajo" con los archivos
   y pide APPLY. No restaures por otra vía.
