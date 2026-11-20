---
name: lf-delegate
description: "Úsala cuando necesites un dato o una acción que no puedes obtener por ti mismo (probar en la aplicación, consultar la base de datos, ejecutar o compilar en el equipo del desarrollador, ver logs, trazas o el navegador, observar un sistema externo), y cuando el desarrollador se atore en una tarea o herramienta. El desarrollador se vuelve tu copiloto: le pasas instrucciones puntuales, listas para copiar y pegar, y gestionas la iteración hasta resolver o cambiar de estrategia."
user-invocable: false
---

# lf-delegate

## Comunicación

Sigue `../lf-core/references/comunicacion.md`, sección "Cuando el
desarrollador es tu copiloto". En particular:

- Las tareas van en el chat normal, nunca en el cuadro de preguntas: el
  desarrollador tiene que poder pegar salidas, código e imágenes.
- No numeres las tareas de una serie ("Tarea 2 de 4"). El encabezado
  lleva solo los minutos: `► Tu turno · 3 min`.

## Principio

Cuando te falta una herramienta o un acceso, no es un obstáculo: el
desarrollador los tiene y se vuelve tu copiloto. Tu trabajo es que su
parte le cueste lo menos posible: instrucciones puntuales, con todo
resuelto, que solo tenga que copiar, pegar, ejecutar y devolver.

## Familiaridad

Hay dos conocimientos distintos:

- Del sistema: tablas, pantallas, navegación, dónde está el log, qué base
  usar, qué significa cada dato. El desarrollador NO lo tiene. Siempre se
  resuelve tú y se le da hecho.
- De herramientas: terminal, git, IDE, cliente de base de datos,
  herramientas de desarrollo del navegador, logs, depurador. Es un
  desarrollador experto: se supone que los domina.

Familiaridad por herramienta y versión:

- FAMILIAR: valor inicial de toda herramienta de desarrollo, también las
  antiguas (VB6, Visual Studio 2008, PowerBuilder, Oracle Forms). Se le
  dice qué hacer, no cómo usar la herramienta.
- PARCIAL: dice que conoce una parecida o una versión distinta, o se
  atoró una vez. Se le señala lo que difiere.
- NO_FAMILIAR: dice que no la conoce, o se atoró dos veces. Paso a paso.

Señales para bajarla: lo dice ("nunca usé esto"), pregunta cómo hacer
algo básico en la herramienta, o hizo algo distinto de lo pedido por no
entender un paso. Señal para subirla: resuelve sin dificultad. La
familiaridad baja solo en esa herramienta, no en todas.

Si una tarea se puede hacer con varias herramientas, usa la que el
registro, SETUP.md o la memoria dicen que usa. Si no se sabe, la más
común en ese entorno, y pregunta solo si no le funciona.

## Definiciones

- Tarea delegada: una acción que el desarrollador hace por ti, con un
  objetivo. Puede tener pasos en varios lugares si sirven al mismo
  objetivo.
- Tipo de tarea:
  - UI: interactuar con la aplicación.
  - DATOS: una consulta en una base de datos.
  - COMANDO: un comando en una terminal (incluido git).
  - LOGS: buscar en registros de la aplicación, del servidor o en una
    herramienta de trazas.
  - NAVEGADOR: request, respuesta o consola en las herramientas de
    desarrollo del navegador.
  - DEBUG: ejecutar con depurador y observar valores.
  - OBSERVACION: revisar un sistema externo (colas, correo, archivos
    generados, consola de un servicio).
  - EDICION: editar un archivo que no puedes editar sin dañarlo
    (codificación no UTF-8, binario).
- Capacidad: algo concreto que puedes hacer donde corres: terminal, una
  herramienta en una versión, una conexión, un navegador. Estado:
  DISPONIBLE, NO_DISPONIBLE o NO_COMPROBADA (inicial).
- Otro equipo: cuando el desarrollador ejecuta en otra máquina.
- Registro de delegación, durante la conversación:
  - Capacidades comprobadas.
  - Si ejecuta en otro equipo: sistema operativo, ruta del código allá y
    archivos cambiados desde su última prueba.
  - Familiaridad por herramienta y la herramienta que eligió para cada
    tipo de tarea.
  - Escalones de atasco ya intentados.
  - Entorno que informó (desarrollo, QA, etc.).
  - Tareas enviadas, respuestas y su clasificación.
  - Conocimiento del sistema confirmado: rutas de navegación, tablas y
    columnas, etiquetas, datos de prueba válidos, dónde está cada log.

## Reglas obligatorias

Cuándo delegar:

- R1. Nunca delegues lo que puedes hacer tú. Antes, comprueba que el dato
  no sale del código, de los archivos o de tus capacidades. Un `.dbf` o un
  archivo de datos de texto se lee (solo lectura); no leas como texto
  `.frx`, `.scx` ni `.mdb`. Un valor no secreto de configuración se busca
  por su clave, sin abrir el archivo de claves. En bases de archivos
  compartidos, la consulta delegada se abre sin exclusividad ni edición.
- R2. Delega solo si el resultado cambia algo: una decisión, un
  diagnóstico, una prueba o un documento.
- R3. No delegues lo que ya está en el registro.
- R4. Las decisiones de análisis, diseño o diagnóstico son tuyas. Se
  delegan acciones y observaciones. Si te falta una capacidad, no digas
  "no puedo": delega en el mismo mensaje.

Seguridad:

- R5. Nunca pidas contraseñas, tokens, claves ni cadenas de conexión. Si
  hace falta un acceso que no tiene, di qué acceso pedir y a qué área, sin
  guiar cómo obtener credenciales.
- R6. Consultas de solo lectura por defecto (SELECT o equivalente),
  siempre con límite de filas. Si el único usuario de base que conoces
  puede escribir, dilo y recomienda uno de solo lectura.
- R7. Una tarea que modifica datos o estado (INSERT, UPDATE, DELETE,
  ejecutar un proceso, enviar un formulario que guarda) requiere:
  1. Confirmar que el entorno no es producción.
  2. Explicar qué cambia y por qué hace falta.
  3. Incluir cómo revertirlo o verificar el estado previo.
  4. Autorización explícita del desarrollador antes de enviar los pasos.
     Si el mensaje ya explicó qué se escribe y cómo se revierte, que elija
     el entorno de prueba cuenta como autorización. Un entorno de pruebas
     documentado (README, SETUP.md) que el planteamiento de lf-change
     nombra, con su APPLY, también cuenta.

  En producción no guías ninguna modificación paso a paso. Si producción
  es el único entorno, o el dato dañado solo existe ahí:
  - Lo que no escribe sí se delega: consultas de solo lectura, logs,
    casos que se detienen antes de guardar.
  - Una corrección de datos o de esquema se entrega como script
    revisable, hecho con lf-change: respaldo previo, el cambio,
    verificación posterior y cómo revertir. La ejecuta el responsable por
    su cuenta. Se dice en qué herramienta se pega, qué esperar y cómo
    deshacer, sin guiar la modificación.
  - Si el desarrollador ya escribió en producción: sin regañar, di qué se
    escribió y qué no sabes, a quién avisar, y ofrece el script
    revisable.
  - Si no sabes a qué base apunta una aplicación o si es producción, el
    primer paso de cualquier tarea UI es "no pulses el botón que guarda";
    la tarea termina antes de guardar.
  - Para probar algo que escribe, ofrece como decisión suya una copia de
    los datos (comprueba antes que el código no apunta a producción por
    rutas o servidores fijos) o una prueba mínima en producción con un
    registro marcado, respaldo y borrado al final. Nunca lo eliges tú.
  - Si producción ya está caída, puedes explicar la recuperación que el
    equipo ya usa, con su reversa y qué verificar, sin ejecutarla.

- R8. Si un resultado puede traer datos personales, pide solo las
  columnas necesarias y sugiere enmascararlos.
- R9. Nunca reproduzcas en el chat un secreto que aparezca en un
  resultado.

Forma:

- R10. Todo resuelto, listo para copiar y pegar (`comunicacion.md`): sin
  marcadores, con rutas, tablas, columnas, URL, servidor, base, pantalla
  y ruta de menú reales; comandos para su sistema operativo y su shell;
  consultas completas con los valores del caso puestos; textos de
  búsqueda exactos. Si un dato no se puede resolver, el valor más probable
  y cómo confirmarlo en el mismo paso.
- R11. Junta en una tarea las observaciones que sirven al mismo objetivo,
  aunque se hagan en lugares distintos (por ejemplo, un comando de git y
  una consulta). Hasta 3 pasos de obtención; si son más, es más de una
  tarea.
- R12. Cada dato específico del sistema sale de evidencia. Si lo deduces
  del código pero nadie lo confirmó, márcalo "según el código" y di qué
  hacer si no coincide.
- R13. Para operar una herramienta (menús de un IDE, opciones de un
  cliente) puedes usar conocimiento general, indicando la versión. Si no
  estás seguro de dónde está una opción en esa versión, da una
  alternativa (atajo, búsqueda de comandos, línea de comandos).
- R14. El detalle depende de la familiaridad con la herramienta de ese
  paso.
- R15. Protege su tiempo: una tarea que se alarga se reevalúa (T5).
- R16. Si hay varias formas de obtener algo, recomienda la más rápida
  para este desarrollador y envía esa completa. Las otras, en una línea
  si hace falta.
- R17. Responde en el idioma del desarrollador.
- R18. Una capacidad no implica otra: que git funcione no significa que
  el SDK, la compilación o la base estén disponibles.
- R19. Una capacidad NO_DISPONIBLE no se reintenta ni se resuelve
  instalando algo: se delega.
- R20. Una tarea pendiente nunca bloquea una solicitud nueva. Si pide
  otra cosa, tiene prioridad (T4, CAMBIO_DE_RUMBO).

## Estados

### T0. Capacidades

Comprueba cada capacidad justo antes de necesitarla, con acciones de solo
lectura:

- Terminal: un comando de lectura (`git --version`). Si no existe, se
  rechaza o no devuelve salida: NO_DISPONIBLE, y no vuelvas a intentar
  comandos en esta conversación.
- Herramienta: `<herramienta> --version` y, para SDKs, las versiones
  instaladas. Una versión distinta de la del proyecto cuenta como
  NO_DISPONIBLE.
- Base de datos: cliente del motor. Tenerlo no implica conexión: no te
  conectes sin autorización.
- Aplicación o navegador: herramienta de navegador y acceso a la URL.

Dónde ejecuta el desarrollador: la primera vez que delegues algo que se
ejecuta, dedúcelo de SETUP.md, la memoria o lo que ya dijo. Pregúntalo
solo si no se puede deducir y cambia la tarea (rutas, comandos, sistema
operativo). Si es otro equipo, pide solo lo que falte: sistema operativo
y ruta del código allá.

### T1. Decisión

Para cada dato o acción, en este orden:

1. ¿Sale del código o de los archivos? Obtenlo tú.
2. ¿Está en el registro? Úsalo.
3. ¿Lo puedes hacer tú? Solo si la capacidad está DISPONIBLE.
4. ¿Cumple R2? Si no, sigue sin él.
5. ¿Es un dato que el desarrollador probablemente ya tiene a mano (el
   mensaje de error completo, una captura, el folio)? Pídelo en una
   línea, sin formato de tarea.
6. Delega.

### T2. Preparación

Lee en `references/tipos-de-tarea.md` la sección del tipo y reúne la
evidencia que indica. Todo lo que la tarea necesita se resuelve aquí,
antes de redactar.

Si de verdad no se puede saber algo del sistema que la tarea necesita
(dónde está el log en el servidor), la tarea incluye un paso de
descubrimiento corto con el valor más probable: "el log suele estar en
`D:\Logs\Facturacion\`, según `log4net.config`; si no está ahí, búscalo
con `dir /s Facturacion*.log` en D:".

### T3. Redacción

    ► Tu turno · <minutos> min

    <Qué necesitas confirmar y por qué no lo ves desde aquí, en 1 o 2
    frases.>

    1. <paso, con el comando o la consulta completos en un bloque>
    2. <paso>
    3. Pégame <exactamente qué: la salida, el conteo, la captura>.

    <Qué significa cada resultado, si sirve para separar hipótesis. Qué
    hacer si algo no coincide.>

Lo que no puede faltar: el para qué, los pasos con todo resuelto, qué
devolver. "Dónde" va dentro del paso (en qué equipo, qué base, qué
pantalla). Si el desarrollador usa otro equipo, dilo en el primer paso.

"Pégame" pide el mínimo: la salida como texto, un conteo, el mensaje de
error completo o una captura.

Detalle por paso, según la familiaridad con su herramienta:

- FAMILIAR: el qué. "Corre esto en la raíz del repo", "en el cliente de
  SQL, contra FACT_QA".
- PARCIAL: el qué y dónde, señalando lo que difiere de lo que conoce. "En
  VS Code no hay botón de compilar: en la terminal integrada corre
  `dotnet build Ventas.sln`."
- NO_FAMILIAR: una acción por paso, dónde está cada opción, qué debe
  verse, el error más común y cómo reconocerlo. Más de 6 pasos se dividen.

### T4. Iteración

Clasifica cada respuesta:

- ESPERADO: registra el dato y lo confirmado del sistema. Decide el
  siguiente paso con el resultado.
- INESPERADO: es información valiosa. Analízala antes de seguir; si
  cambia el plan, dilo en una frase.
- BLOQUEADO (no encuentra la opción, error, sin acceso, sin datos):
  diagnostica con lo que reportó. Si la causa es la herramienta, baja la
  familiaridad y reenvía con más detalle. Si no, otra ruta, otra
  consulta, un descubrimiento o un dato de prueba distinto. Si es falta
  de acceso, qué acceso pedir (R5) y sigue con lo que no depende de él.
- PARCIAL: registra lo obtenido y pide solo lo que falta.
- NO_PUEDE: regístralo como pendiente y busca otra vía; si no hay, di
  qué queda sin verificar.
- OTRO (una pregunta o comentario sobre la tarea): respóndelo; la tarea
  sigue pendiente.
- CAMBIO_DE_RUMBO (pide otra cosa, aunque venga con un resultado):
  registra el resultado que haya y deja la tarea pendiente sin
  recordarla. Si te invocó otra skill, devuélvele el control. Retoma la
  tarea solo si sigue siendo necesaria cuando se resuelva lo nuevo.

Al terminar una serie, resume en pocas líneas los datos obtenidos, lo
confirmado del sistema (va a la memoria) y lo pendiente.

### T5. Atasco

Señales, basta una:

- La misma tarea lleva 3 intercambios sin avanzar.
- Quedó BLOQUEADA 2 veces.
- Tardó más del doble de lo estimado.
- Frustración o duda repetida ("no me sale", "ya llevo rato").

No repitas la misma instrucción. Usa el primer escalón no intentado:

1. Más detalle: baja la familiaridad y reescribe la tarea.
2. Pasos más pequeños: uno por mensaje, confirmando cada uno.
3. Otra ruta: otra herramienta, pantalla, consulta o enfoque.
4. Hacerlo tú, si tus capacidades lo permiten, con las autorizaciones
   que correspondan.
5. Reducir alcance: ¿sigue siendo necesario el dato (R2)?
6. Apoyo humano: qué área o rol podría resolverlo (infraestructura, DBA,
   soporte del proveedor).

Si se atoró, dilo en una línea y aplica el escalón que más tiempo ahorre
según lo observado, en el mismo mensaje. Si no está claro cuál, ofrece
los dos mejores como opciones cerradas.

Si los 6 se agotaron, registra el dato como pendiente, di qué se intentó
y sigue con lo que no depende de él.

## Trabajo en otro equipo

Tú editas aquí; él compila, prueba o consulta allá.

1. Antes de una tarea que dependa de archivos que cambiaste desde su
   última prueba, los cambios tienen que llegar:
   - Con rama de trabajo (lf-branch) y git allá: súbela y que la
     descargue (lf-branch, B5).
   - Si no, la lista de archivos que debe llevar, con su ruta relativa.
   - Nunca la carpeta completa: la configuración local de su equipo, las
     carpetas de control de versiones, `.lf-change-respaldo/` y los
     compilados se quedan donde están.
2. Las rutas de la tarea son las de su equipo.
3. Si un resultado contradice el cambio, antes de diagnosticar confirma
   que los archivos llegaron (por ejemplo, que vea una línea de uno).
4. Si se revierte un cambio que ya llevó, dile qué volver a llevar.

## Uso desde otras skills

Las skills que necesitan algo que no pueden obtener siguen este flujo
desde T1. La skill que invoca conserva sus reglas de autorización; esta
agrega las de seguridad de la delegación (R5 a R9).
