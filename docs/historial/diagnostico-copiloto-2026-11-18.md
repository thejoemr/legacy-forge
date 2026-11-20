# Diagnóstico del rol de LegacyForge · 2026-11-18

Pregunta: qué papel debe cumplir el harness, cómo se compara con el
desarrollador experto de mantenimiento que lo controla, y qué no cubre
hoy. Base: las skills 0.3.0 tal como están en el proyecto y los casos
de uso que dio el usuario en esta sesión. Segunda pasada incluida
(4.15 a 4.25). Tercera pasada: simulación de casos y contextos (4.26).

## 1. Quién es el harness

Un copiloto de mantenimiento conversacional. No es un agente: no trabaja
solo ni se le delegan tareas para que las termine sin el desarrollador.

En una frase: le ahorra lo técnico al desarrollador experto y le enseña
el negocio mientras trabaja, para que decida con criterio de empresa y
no solo de código.

Lo que es:

- Un acelerador del proceso mental del desarrollador: lee, busca, cruza
  y simula a una velocidad que una persona no alcanza.
- Un par con el mismo criterio que tendría el desarrollador si él mismo
  estuviera programando.
- Un traductor del negocio: conecta cada hallazgo técnico con lo que
  significa para la empresa.
- Una conversación. Por dentro puede tener un mapa mental que orienta su
  razonamiento; por fuera, el desarrollador solo conversa con un colega.
  Puede entrar por cualquier punto, saltar, volver o cambiar de tema, y
  el copiloto se ubica solo.
- Un copiloto en los dos sentidos. Casi siempre acompaña al
  desarrollador; cuando le falta una herramienta o un acceso, los roles
  se invierten y el desarrollador es su copiloto, con instrucciones
  puntuales y listas para copiar y pegar.
- Un guardián de lo que no se negocia: autorización, secretos,
  producción, reversibilidad.

Lo que no es:

- No es quien decide. Prepara las decisiones; el desarrollador las toma.
- No es un procedimiento que se recorre igual en todos los casos.
- No es un asistente con pasos, etapas o formularios que el usuario
  tenga que seguir.
- No es un tutor de programación. El desarrollador ya es experto; lo
  que no sabe es este sistema y este negocio.

## 2. Quién es el desarrollador que lo controla

Un desarrollador de mantenimiento experto que muchas veces es nuevo en
el proyecto y no recibió contexto del negocio. Tiene las herramientas y
los accesos de su trabajo: terminal, IDE, cliente de base de datos,
navegador con herramientas de desarrollo, logs y trazas.

Supuesto de equipo: el desarrollador es el único técnico del sistema.
No hay compañeros con quienes coordinarse ni cuyo trabajo revisar.
Reporta a personas de otras áreas y jerarquías (negocio, operación,
jefatura), que no son técnicas.

Cómo trabaja (según los casos de uso de esta sesión):

1. Asume que el sistema está vivo y sigue creciendo si se le asigna
   trabajo.
2. Antes de tocar algo, entiende el punto focal: para qué existe, quién
   lo llama, qué configuración o dato decide su camino, cuántas ramas
   tiene y cuál toca su tarea.
3. Entiende el desorden controlado: sabe que un parche raro suele
   sostener una regla de negocio, y distingue lo que se respeta de lo
   que estorba.
4. Busca la mejor solución, que no es la más elegante: la que resuelve,
   arriesga lo mínimo, queda limpia en el estilo del sistema y no deja la
   zona peor.
5. Si el refactor de una unidad cabe en la tarea, lo hace. Si ya es una
   tarea en sí misma, hace solo lo mínimo y reporta el refactor al
   equipo, que decide.
6. Diagnostica de lo más barato a lo más caro: simula el caso en la
   cabeza, lee el código, mira la pantalla, el request en el navegador,
   el tracing, los datos. El debug es lo último.
7. Ajusta el rigor al caso: hay pasos que se salta por instinto y otros
   donde es riguroso sin excepción.
8. Explica simple y coloquial, porque no toda su audiencia es técnica, y
   profundiza cuando se lo piden.
9. Aprende el negocio con cada tarea, porque eso alimenta su criterio.
10. Cuando no sabe, pregunta bien, debate con datos y sabe a quién
    acudir.
11. Piensa en desorden: salta de una duda a otra, vuelve atrás, cambia
    de idea a mitad. Su proceso es una conversación, no un flujo.

Lo que además hace un experto y apareció en la segunda pasada:

12. Busca el porqué en el código, los commits y los comentarios, y saca
    de ahí lo que dicen de forma explícita y lo que se deduce.
13. Sabe que una regla de negocio rara vez vive en un solo lugar: el
    cálculo de la pantalla, el del reporte y el del proceso nocturno
    tienen que cuadrar.
14. Le reporta a otras áreas y jerarquías: lleva preguntas al negocio,
    informa avances y explica en su idioma.
15. Libera él mismo. Del copiloto solo necesita que le señale lo que
    depende del entorno o de la configuración.
16. Dimensiona la tarea al entenderla y avisa cuando creció.
17. Con un plazo encima, elige lo pragmático y deja la deuda escrita a
    propósito, no por descuido.

Y en la tercera pasada:

18. Simula en la cabeza el flujo bajo condiciones distintas (entradas,
    estados, concurrencia, ambientes, fallas de infraestructura) y así
    se adelanta a las pruebas y al debug. No simula todo al inicio:
    simula lo que la duda del momento pide, y amplía cuando algo no
    cuadra.

## 3. Reparto del trabajo

Lo hace el copiloto solo, sin pedir permiso:

- Leer código, configuración e historial.
- Buscar consumidores, referencias dinámicas, ramas de ejecución y otras
  implementaciones de la misma regla.
- Simular casos sobre el código.
- Formular hipótesis y descartar las que el código ya descarta.
- Armar el mapa del punto focal y la propuesta.
- Redactar lo que el desarrollador lleva a otras áreas: preguntas para
  el negocio, avances, reportes de deuda, notas de prueba para quien
  valida.
- Llevar el estado de la conversación: qué se sabe, qué se decidió, qué
  falta.

Lo hace el desarrollador cuando el copiloto no puede:

- Lo que el copiloto no tiene en su entorno: terminal, historial, base
  de datos, logs, la aplicación corriendo, el navegador.
- El copiloto le pasa una instrucción puntual, lista para copiar y
  pegar, y él devuelve el dato. No se trata como un obstáculo: es el
  desarrollador haciendo de copiloto del copiloto.

Lo prepara el copiloto y lo decide el desarrollador:

- Qué se modifica y dónde.
- Si un refactor entra en la tarea.
- Si se respeta o se atiende una deuda.
- Qué hipótesis comprobar primero cuando la comprobación le cuesta
  tiempo a él.
- Con plazo, cuánta deuda consciente se acepta.

Es siempre del desarrollador:

- Autorizar cada cambio (APPLY).
- Las decisiones de negocio, alcance y prioridad.
- Todo lo que toca producción o datos reales.
- Liberar.

Nunca lo hace el copiloto:

- Editar sin autorización, leer secretos, guiar cambios en producción.
- Tomar por su cuenta una decisión de criterio que pertenece al
  desarrollador.

## 4. Comparación por capacidad

Cada capacidad del desarrollador, qué tiene hoy el harness y qué falta.
Estado: cubierto, parcial o falta.

### 4.1 Conocer el negocio y el propósito del sistema · parcial

- Hoy: `lf-product` resume el propósito desde el código, solo a mano,
  sin ordenar por importancia y en 40 líneas. `lf-delegate` ya reconoce
  que el usuario no conoce el sistema y que siempre se le explica. Las
  skills piden lenguaje de negocio primero.
- Falta:
  - El lenguaje de negocio está como regla de formato, no como el
    propósito de enseñar el negocio al desarrollador.
  - El conocimiento del negocio no se acumula tarea por tarea: lo que se
    confirma (qué significa un término, por qué existe una regla) no
    alimenta `PRODUCT.md` ni la memoria de forma sistemática.
  - No hay "preguntas para el negocio": lo que el código no responde se
    vuelve supuesto, en lugar de una pregunta que el desarrollador lleve
    a su equipo.
  - El contexto (zonas activas, zonas críticas, qué domina el equipo) no
    se deduce del historial de git. El supuesto "el sistema sigue vivo y
    creciendo" no está escrito.

### 4.2 Entender el punto focal · parcial

- Hoy: `lf-explain` sabe preguntar entrada, datos, proceso, salida,
  errores e impacto, pero solo cuando el usuario pide una explicación.
  `lf-change` (A2) busca consumidores directos y dinámicos, pero después
  de fijar los archivos (A1) y solo para el veredicto de riesgo.
- Falta:
  - Orden invertido: hoy se decide qué tocar y después se revisa. El
    desarrollador primero entiende y después decide.
  - Nadie mapea las ramas de ejecución ni qué configuración, bandera o
    dato decide cada una.
  - El resultado no se muestra: el desarrollador recibe "riesgo bajo",
    no un mapa que pueda validar en 30 segundos.

### 4.3 Leer el desorden controlado · falta

- Hoy: `lf-explain` (R1, R2) hace que gane el código sobre nombres y
  comentarios. `lf-analyze` (R4) ordena imitar el código vecino. Nada
  más.
- Falta:
  - Distinguir tres tipos de desorden: parche que sostiene algo (se
    respeta), deuda estable (se imita) y deuda activa (causa el problema
    o hará fallar el cambio: se atiende).
  - Buscar el porqué con el historial, los comentarios y la memoria
    antes de juzgar un parche (4.16).
  - Explicar el desorden en términos de negocio ("este `If` es un acuerdo
    con ese cliente").
  - Guardar las zonas frágiles en la memoria.

### 4.4 Elegir la mejor solución · parcial

- Hoy: `lf-analyze` (R1 a R9) es fuerte en simplicidad: el nivel de
  intervención más bajo, reutilizar, cero dependencias, no agregar por
  si acaso.
- Falta:
  - "Simple" se mide por el tamaño del cambio, no por el encaje con el
    sistema ni por cómo queda la zona.
  - "Imita el código vecino" no distingue imitar el estilo de copiar un
    defecto (por ejemplo, SQL armado a mano vulnerable a inyección).
  - No existe la regla de no empeorar: lo nuevo en su propia pieza, en el
    estilo del sistema, sin incrustarlo en el espagueti.
  - No hay ventana opcional: cuando hay señales (tercer arreglo en el
    mismo lugar, lógica duplicada otra vez, costo extra pequeño con
    pruebas), ofrecer en una viñeta la alternativa más completa.
  - El crítico (`agents/lf-critico.md`) solo empuja hacia lo mínimo. No
    revisa si la propuesta pertenece al sistema ni si es un parche más
    donde ya hay muchos.

### 4.5 El refactor como criterio de alcance · falta, y hay contradicción

- Hoy: `lf-analyze` (R4, R7) y la regla Status quo de `AGENTS.md`
  prohíben refactorizar dentro de un requerimiento. `lf-propose` lo
  anota como oportunidad, en formato para el desarrollador.
- Falta:
  - Evaluar si el refactor de la unidad cabe en la tarea: misma unidad,
    sin cambiar lo que ven los demás, comprobable con casos de
    comparación, y un esfuerzo extra menor que el cambio. Si cabe, va
    en la definición técnica como un paso más, aplicado antes y por
    separado.
  - Si no cabe, un reporte para el equipo en lenguaje de negocio (qué,
    por qué, impacto, costo, qué pasa si no se hace), que el equipo
    decida fuera del flujo de la tarea.
  - Contradicción a resolver: la regla "no refactorices" de `AGENTS.md`
    y de `lf-analyze` choca con este caso.

### 4.6 Diagnosticar de lo barato a lo caro · parcial, base sólida

- Hoy: `lf-diagnose` ya ordena por costo (código, datos, logs,
  reproducción, debug, instrumentación), exige agotar la lectura de
  código antes de pedir algo (R2) y deja el debug casi al final.
- Falta:
  - Simular el caso concreto sobre el código, rama por rama, como paso
    explícito antes de pedir nada. (Ampliado en 4.26: no basta una sola
    simulación.)
  - Observaciones baratas que no están en la escala: captura de la
    pantalla con el error, el request en la pestaña Red del navegador,
    la herramienta de trazas (Sentry, App Insights, Kibana), y buscar el
    texto del mensaje de error en el código.
  - El costo es fijo por tipo; debería depender del contexto. Una
    captura que el usuario ya tiene cuesta menos que una consulta.
  - Siempre arma el plan completo (G3). Si el error apunta a la línea y
    el código lo confirma, debería ir directo a la causa.
  - Una tarea por mensaje (R9) frena a un experto: pedir dos
    observaciones baratas juntas suele ahorrar una vuelta.
  - Buscar en la memoria si el mismo síntoma ya pasó antes y cuál fue su
    causa (4.16).
  - El razonamiento es el mismo con o sin acceso a herramientas. Lo que
    cambia es quién obtiene la observación: el copiloto, si puede; si
    no, el desarrollador, con una instrucción puntual (4.14).

### 4.7 Ajustar el rigor al caso · falta en las skills

- Hoy: `lf-core` clasifica cada pedido como directo, normal o profundo,
  y eso decide cuánto plan y cuánta crítica lleva. Pero cada skill es
  una máquina de estados ("ejecuta los estados en orden, no pases al
  siguiente sin cumplir su condición").
- Falta:
  - Separar en cada skill lo que nunca se salta (APPLY, secretos,
    producción, respaldo, solo lectura) de lo que es criterio.
  - Atajos legítimos por skill, escritos (por ejemplo: error con línea
    exacta confirmada en el código, causa directa).
  - Cuándo el rigor es obligatorio: dinero, datos reales, contratos con
    otros sistemas, algo difícil de revertir, o una causa que no cuadra.
  - Este es el cambio de fondo, junto con 4.13 y 4.25: los demás puntos
    se apoyan en ellos.

### 4.8 Comunicar · parcial

- Hoy: negocio primero, breve, detalle a pedido, mantener el nivel
  técnico si el usuario lo pide. `lf-delegate` ajusta el detalle a la
  familiaridad con cada herramienta.
- Falta:
  - Distinguir audiencias: el desarrollador (colega: lo técnico general
    no se explica; lo propio del proyecto y del negocio sí) y los
    documentos para otros (reporte al equipo, nota para QA, explicación
    para negocio).
  - El registro según el propósito del mensaje (acordado con el usuario
    en esta sesión):
    - Mensajes informativos (diagnóstico, hipótesis, explicación,
      hallazgo, contexto): se cuentan como una historia del proceso de
      negocio. Sin nombres de métodos, clases, archivos ni líneas, salvo
      que el desarrollador los pida.
    - Mensajes con un fin técnico (la solución que se propone, el
      cambio que pide APPLY): ahí sí entra el detalle técnico necesario
      para evaluarla, como qué clase o método se agrega o cambia y con
      qué enfoque. Siempre breve, y siempre partiendo del efecto en el
      proceso.
    - Instrucciones al desarrollador (4.14): lista de pasos puntual, con
      todo lo necesario para copiar y pegar.
    - El diff completo no se repite: el desarrollador lo ve en su árbol
      de cambios antes del commit.
  - Forma: tan breve como sea posible sin perder precisión. Prosa corta
    y dinámica; viñetas solo cuando de verdad hay una lista. Nada de
    viñetas con etiquetas ("- Riesgo: ...", "- Impacto: ...") como
    plantilla fija: cansa leerlas.
  - Menos ceremonia donde no aporta: encabezados en todo, preguntas
    siempre con 3 opciones y una sola pregunta por mensaje ayudan a un
    novato y frenan a un experto.

### 4.9 Ser copiloto con el criterio del desarrollador · parcial

- Hoy: `lf-core` es autónomo en elegir la ruta. `lf-delegate` (R4) no
  delega decisiones de análisis, solo acciones. `lf-debate` no cede por
  insistencia y deja al usuario las decisiones de negocio.
- Falta:
  - Aprender el criterio del desarrollador. `lf-memory` guarda
    decisiones y familiaridad con herramientas, pero no preferencias de
    criterio ("aquí preferimos funciones sueltas", "eso no se toca, lo
    usa el cierre") para aplicarlas en las tareas siguientes.
  - `claude/LEGACYFORGE.md` presenta al asistente como "le pides algo y
    él decide cómo lograrlo". Conviene reescribirlo con el rol de
    copiloto.

### 4.10 Preguntar, debatir y guiar · cubierto, con ajustes

- Hoy: el bloque Preguntas de `AGENTS.md` agota todo antes de preguntar.
  `lf-debate` resuelve desacuerdos con el dato decisivo. La escalera de
  atasco de `lf-delegate` (T5) guía cuando el usuario se traba.
- Falta:
  - Una escalera explícita para cuando no hay instinto: decidir si la
    evidencia es clara; si no, preguntar mostrando lo encontrado;
    debatir si hay desacuerdo; guiar si nadie sabe.
  - Preguntas abiertas cuando el caso lo pide, sin forzar 3 opciones.

### 4.11 Avisar lo que ve de paso · cubierto

- Hoy: `lf-propose` registra con evidencia, interrumpe solo por riesgo
  real y propone como máximo 3.
- Falta: el formato de reporte para el equipo (4.5, 4.20).

### 4.12 Velocidad · tensión

- El desarrollador espera ir "ridículamente más rápido". Las skills
  llegan a unas 520 líneas, repiten un bloque de formato de 45 líneas y
  fuerzan una pregunta o tarea por mensaje.
- Lo que no cambia: un APPLY por cambio. Es una regla de seguridad.
- Lo que sí puede cambiar: ceremonia, plan completo cuando no hace falta,
  y pasos secuenciales que el criterio permite juntar.

### 4.13 Conversación, no secuencia · parcial, con contradicción de fondo

- Hoy: todas las skills piden no mostrar estados, códigos ni etiquetas,
  y que la conversación se sienta natural. `lf-test` y `lf-delegate`
  aceptan interrupciones y cambios de rumbo en cualquier momento.
- Falta: aunque oculten los nombres, las skills le imponen al usuario
  una secuencia visible:
  - `lf-analyze`: definición funcional, aprobación y después definición
    técnica, con versiones numeradas ("v1", "v2") y "termina tu turno"
    tras cada una. El usuario siente que pasa por etapas.
  - `lf-diagnose`: un mensaje de plan con todas las hipótesis y tareas
    numeradas ("Tarea 2 de ~4") antes de conversar del problema.
  - `lf-test`: casos de uno en uno, "Caso 3 de 8", en orden.
  - Casi todo mensaje cierra con encabezado y 3 opciones. Así se
    siente un formulario, no una conversación.
  - Las respuestas del usuario se clasifican para avanzar de estado
    (aprobación, corrección, cambio de alcance). Clasificar está bien por
    dentro; el problema es que la conversación se organiza en torno a
    esos avances.
- Qué debería pasar:
  - El mapa interno (qué se sabe, qué falta, qué se decidió) lo lleva el
    copiloto en silencio y lo usa para ubicarse en cada mensaje.
  - El usuario entra por cualquier punto: puede pedir el código antes de
    acordar lo funcional, saltar a una duda o volver a algo ya decidido.
    El copiloto responde a eso y, si salta algo que importa, lo dice en
    una línea, sin frenar.
  - Los formatos de las skills pasan a ser listas de qué contenido no
    puede faltar, no plantillas de mensaje.
  - El único ritual visible que se queda es el APPLY, porque es
    seguridad.

### 4.14 El desarrollador como copiloto del copiloto · parcial

- Hoy: `lf-delegate` ya delega lo que el harness no puede hacer, con un
  formato de tarea (para qué, dónde, pasos, qué deberías ver, qué
  devolver) y una escalera de atasco. Ajusta el detalle a la
  familiaridad con cada herramienta. Su R12 pide que los datos del
  sistema en una tarea (rutas, tablas, etiquetas, URL) salgan de
  evidencia.
- Falta:
  - El supuesto de partida está al revés. Hoy toda herramienta sin
    señales empieza como desconocida, y las antiguas (VB6, PowerBuilder)
    como no familiares, con paso a paso. El supuesto debe ser que el
    desarrollador sí tiene y sí domina sus herramientas técnicas
    (terminal, git, IDE, cliente de base de datos, herramientas de
    desarrollo del navegador, logs). Se explica más solo si se atora.
  - Lo que sí se explica siempre es lo propio del proyecto: dónde está
    el log, qué base usar, qué pantalla abrir.
  - Si el copiloto no tiene una herramienta, no lo trata como un
    obstáculo ni dice "no puedo": delega de inmediato.
  - La instrucción debe ser puntual y breve:
    - Qué hacer, como lista de pasos numerados.
    - Por qué y para qué, en una línea: qué decide ese dato.
    - Qué devolver, exactamente.
    - Cuando sirve para separar hipótesis, qué significa cada resultado,
      para que el desarrollador lo interprete solo.
  - Juntar en una sola instrucción las observaciones baratas que van en
    el mismo sentido, aunque sean en lugares distintos.
  - Todo listo para copiar y pegar. Cada vuelta que el desarrollador
    tenga que dar para buscar un dato que el copiloto pudo resolver
    antes es tiempo perdido para los dos:
    - Sin marcadores tipo `<carpeta>` o `<tabla>`. Rutas, nombres de
      tabla y columna, URL, servidor, pantalla y ruta de menú se
      resuelven desde el código, la configuración, `SETUP.md` y la
      memoria antes de delegar.
    - Comandos completos y para su sistema operativo y su shell (de la
      memoria o de `SETUP.md`), ejecutables tal cual.
    - Consultas completas, de solo lectura, con límite de filas y con
      los valores del caso concreto ya puestos (folio, cliente, fechas).
    - Valores de búsqueda listos: el texto exacto del error para buscar
      en el log, el filtro de la pestaña Red, el identificador del
      registro.
    - Si un dato de verdad no se puede resolver desde aquí (por ejemplo,
      la ruta del log en el servidor), se dice cuál es el valor más
      probable según el código y cómo confirmarlo en el mismo paso, en
      lugar de dejar un hueco.
    - Nunca secretos: si la tarea necesita una conexión, se nombra el
      servidor y la base, no la credencial.
  - Ejemplo:

        ► Tu turno · 3 min

        Necesito confirmar si el problema está en la validación de
        correos. Desde aquí no veo el historial ni la base.

        1. En el repo, corre:
               git log --since=2026-11-14 --oneline -- src/Facturacion/Envio
        2. En el cliente de SQL, contra FACT_QA:
               SELECT TOP 5 c.id_cliente, c.email
               FROM clientes c
               JOIN facturas f ON f.id_cliente = c.id_cliente
               WHERE f.fecha_timbrado >= '2026-11-16'
                 AND f.enviada = 0;
        3. Pégame las dos salidas.

        Si el log muestra un cambio en la validación y los correos traen
        mayúsculas o guiones, es la causa. Si no hay cambios, sigo por el
        lado del servidor de correo.

### 4.15 Cuadro de preguntas o chat · decidido, falta aplicarlo

- Hoy: todas las skills dicen "si el asistente tiene una herramienta
  propia para preguntar, úsala para la pregunta y sus opciones". En
  Claude Code y Copilot es un cuadro con opciones y una caja de texto
  que no acepta código largo ni imágenes. El harness lo usa también
  cuando espera que el desarrollador le devuelva algo.
- Regla acordada con el usuario:
  - Cuadro de preguntas: solo decisiones cerradas con opciones cortas.
  - Chat normal: todo lo que espera un resultado (tareas delegadas,
    salidas de comandos, consultas, logs, capturas, preguntas abiertas,
    "pégame..."). El copiloto escribe la instrucción, termina su turno y
    el desarrollador responde en el chat, donde puede pegar código e
    imágenes.
  - El APPLY siempre se escribe en el chat. Además del formato, es muy
    probable que `lf-guard` solo reconozca el APPLY como mensaje del
    usuario y no como opción elegida en el cuadro. Verificarlo al
    implementar.

### 4.16 Buscar el porqué en el código, los commits y los comentarios · parcial

- Hoy: `lf-diagnose` (G2.2) revisa el historial para saber "desde
  cuándo". `lf-explain` deduce del código y hace que el código gane sobre
  nombres y comentarios.
- Falta: usar esas tres fuentes para la intención, no solo para la
  fecha o el comportamiento, y separar lo que dicen de lo que se deduce:
  - Explícito: lo que está escrito. El mensaje del commit que introdujo
    esas líneas (y el ticket que cite), un comentario que explica una
    excepción, un nombre de constante como `CLIENTE_CONVENIO_2019`.
  - Implícito: lo que se deduce. Qué más cambió en el mismo commit, una
    fecha fija en una condición, un caso especial para un solo cliente,
    código desactivado que nadie borró, un comentario que ya no coincide
    con el código.
  - Al contarlo, distinguir siempre cuál es cuál: "el commit dice que es
    por el convenio" frente a "por la fecha, parece una promoción".
  - Leerlo antes de juzgar un parche (4.3) y antes de proponer dónde
    tocar (4.2).
  - Sin git o sin acceso al historial, pedirlo con una instrucción lista
    para copiar (4.14).

### 4.17 La misma regla en varios lugares · falta

- Hoy: `lf-change` (A2) busca los consumidores de lo que se modifica:
  quién lo llama. No busca otras implementaciones de la misma regla.
- Falta:
  - En sistemas heredados, una regla de negocio suele estar repetida: el
    cálculo de la pantalla, el del stored procedure del reporte, el del
    proceso nocturno, una macro de Excel, otro sistema que recibe el
    dato. Cambiar solo una produce descuadres que nadie ve hasta el
    cierre.
  - Antes de proponer, buscar dónde más vive la regla (por nombres del
    dominio, constantes, fórmulas parecidas, SQL) y decir cuáles cambian
    y cuáles no, con su razón.
  - Si está fuera del repositorio (otro sistema, un reporte en el
    servidor), nombrarlo como pregunta para el equipo.

### 4.18 Reportar a otras áreas · parcial

- Supuesto: el desarrollador es el único técnico. No hay coordinación
  entre pares; sí hay personas de negocio, operación y jefatura a
  quienes les pregunta y les reporta.
- Hoy: `lf-branch` detecta otra sesión en la misma carpeta (R14), que
  sigue siendo útil porque el mismo desarrollador puede abrir varias.
- Falta:
  - Dirigir las preguntas para el negocio (4.1) al área o rol que
    probablemente sabe la respuesta según el proceso (cobranza,
    contabilidad, operación), no a personas por nombre.
  - Que el desarrollador pueda pedir, cuando lo necesite, un resumen de
    avance o de hallazgo para su jefatura u otra área, en su idioma.

### 4.19 La liberación es del desarrollador · solo preguntas puntuales

- Decisión del usuario: el copiloto no planea la liberación ni arma
  notas de despliegue.
- Lo único que queda: si el cambio depende de algo que varía por
  entorno o de un valor que no está en el código (un parámetro de
  configuración, la fecha de arranque de una regla, si un ambiente
  tiene la misma versión de base), lo pregunta o lo señala en una línea
  al proponer el cambio.

### 4.20 Lo que sale hacia otras áreas · parcial

- Hoy: `lf-branch` arma el mensaje de commit según las convenciones.
  `lf-propose` guarda oportunidades.
- Falta: redactar, cuando el desarrollador lo necesite, en el idioma de
  su audiencia y listo para copiar y pegar:
  - Preguntas para el negocio, con el contexto justo para que las
    respondan sin una junta.
  - Avance o resultado de una tarea para jefatura u otra área.
  - Reporte de refactor o de deuda (4.5, 4.22).
  - Nota de pruebas para quien valide, si es otra área: qué revisar y
    con qué datos.

### 4.21 Dimensionar la tarea y avisar cuando crece · parcial

- Hoy: `lf-core` clasifica el tamaño para decidir su propio esfuerzo,
  no para informarlo. `lf-branch` (B2) controla el alcance cuando el
  usuario pide algo nuevo.
- Falta:
  - Al entender la tarea, decir en una línea su tamaño y por qué
    (chica, media o grande, y qué la hace así), para que el
    desarrollador pueda comunicarlo a su líder.
  - Avisar cuando la tarea creció por un descubrimiento, no por un
    pedido: "esto ya no es un cambio de una pantalla; la regla también
    vive en el reporte y en el cierre".

### 4.22 Trabajar con plazo · falta

- Hoy: `lf-core` solo tiene la urgencia de un servicio caído.
- Falta:
  - Cuando el desarrollador dice que hay fecha encima, el criterio
    cambia: la solución más pragmática que cumpla, aunque deje deuda.
  - Esa deuda se deja a propósito y por escrito: qué se dejó, por qué y
    qué haría falta después, como nota para el equipo (4.5, 4.20).
  - Lo que nunca se relaja por plazo: lo de seguridad y la regla de no
    empeorar en lo que sí se toca.

### 4.23 Revisar el trabajo de otros · descartado

- Con un solo desarrollador en el equipo no aplica. `lf-test` ya cubre
  revisar un cambio hecho a mano antes de liberar.

### 4.24 El banco de pruebas mide el harness viejo · falta, y bloquea

- Hoy: `agents/lf-simulador.md` hace que el asistente "siga las skills
  literalmente" y reporte como defecto lo que no está escrito. La
  persona del usuario va de junior a no técnico. El criterio 8 de
  evaluación revisa encabezados y preguntas con 3 opciones.
- Falta:
  - La persona principal debe ser el desarrollador experto de
    mantenimiento, nuevo en el proyecto, con sus herramientas.
  - El asistente simulado debe aplicar criterio dentro de los
    invariantes, no seguir pasos al pie de la letra. Si no, la prueba
    castiga justo el comportamiento que se busca.
  - Criterios nuevos de evaluación: ceremonia innecesaria, secuencia
    impuesta, nombres de código en mensajes informativos, delegación con
    huecos o paso a paso innecesario, cuadro de preguntas para respuestas
    abiertas, enseñanza del negocio, encaje de la solución, regla
    repetida en otros lugares no revisada.
  - Esto va antes de implementar: si no, las simulaciones dirán que la
    versión nueva falla por no seguir los formatos viejos.

### 4.25 La estructura del paquete refuerza la secuencia · falta

- Hoy: el bloque "Formato de mensajes" (unas 45 líneas) está copiado en
  12 skills y fija encabezados, viñetas con etiquetas, 3 opciones y una
  pregunta por mensaje. Las skills están partidas por etapa del proceso
  (diagnose, analyze, change, test).
- Falta:
  - Reemplazar el bloque copiado por una sola sección común con las
    reglas nuevas de comunicación (4.8, 4.15). Además recupera unos
    6 000 tokens, como ya pedía la auditoría del 2026-10-29.
  - El mapa del punto focal lo usan `lf-explain`, `lf-analyze`,
    `lf-change` y `lf-diagnose`: debe ser una capacidad común, no cuatro
    versiones.
  - Revisar si la división por etapas sigue sirviendo o si empuja a la
    secuencia que se quiere quitar. Puede bastar con que cada skill
    declare sus invariantes y sus contenidos obligatorios, y que lf-core
    las combine según la conversación.

### 4.26 Simular casos y contextos a lo largo de la conversación · parcial

- Hoy: `lf-diagnose` simula el caso concreto sobre el código, rama por
  rama, una sola vez y con los valores más probables. `lf-verificador`
  diseña hasta 5 casos adversos, pero solo para un cambio ya aplicado.
  La categoría ENTORNO existe como etiqueta de hipótesis, sin un modelo
  del entorno contra el cual razonar.
- El problema: el copiloto da un vistazo, la primera explicación que
  cuadra gana y entrega su informe. Los otros casos, los outliers y las
  condiciones de otros ambientes aparecen recién cuando el desarrollador
  lo corrige. Un experto, en cambio, simula en la cabeza el flujo bajo
  condiciones distintas y se adelanta a las pruebas y al debug. Pesa más
  en errores intermitentes, sin logs y sin forma determinista de
  reproducirlos (ejemplo del usuario: variables de sesión que a veces se
  pierden, con varios servidores en QA y producción y uno en
  desarrollo).
- Falta:
  - La simulación como reflejo, no como barrido inicial. Es una
    observación más de la escalera de costo de `lf-diagnose`: se usa
    cuando es lo más barato que mueve la decisión del momento. Si el
    código ya responde, o el desarrollador puede dar el dato en
    segundos, se lee o se le pregunta; no se simula lo que se intuye.
    Se simula lo mínimo que resuelve la duda abierta y se amplía solo
    con una señal.
  - Llevar los supuestos. Cada razonamiento sobre un flujo asume cosas
    (la sesión vive en memoria, hay un solo servidor, el usuario sigue
    la ruta normal). El copiloto lleva en silencio la lista de lo que
    asumió. Cuando algo de la conversación toca un supuesto, vuelve a
    simular esa parte, no todo.
  - Señales que disparan una simulación nueva:
    - El síntoma trae un detalle nuevo ("solo en la tarde", "con dos
      pestañas"): ese detalle es la condición a variar.
    - Un dato del desarrollador no cuadra con la explicación actual: se
      simulan las alternativas que sí lo explicarían.
    - El desarrollador corrige al copiloto: se corrige el punto y se
      revisa qué más asumió de la misma forma.
    - La hipótesis sobrevive pero no explica todo (por qué solo a
      veces, por qué solo a algunos usuarios).
    - Falta la observación (no hay logs, no se reproduce): la
      simulación ocupa su lugar.
    - Va a proponer un cambio que toca estado compartido (sesión,
      caché, estáticos), dinero o datos: lo simula bajo las condiciones
      que ya salieron.
    - El desarrollador pregunta "¿y si...?".
  - Lo intermitente es pista, no ruido: si falla a veces, la causa
    depende de algo que varía entre ejecuciones. Las dimensiones a
    revisar son tiempo (timeouts, expiración, cambio de día),
    concurrencia (requests paralelos sobre la misma sesión, llamadas
    asíncronas), infraestructura, datos (tamaño, serialización) y
    conducta del usuario (atrás, doble clic, inactividad, varias
    pestañas).
  - Cómo se generan los casos: con las técnicas de caja negra
    (particiones de equivalencia, valores límite, tablas de decisión y
    transición de estados). La sesión, por ejemplo, es una máquina de
    estados (vacía, cargada, modificada, expirada, abandonada), y lo
    intermitente suele vivir en transiciones que nadie pensó.
  - Cómo se recorren: como prueba de escritorio. Cada caso se sigue
    rama por rama sobre el código, con su tabla de valores (qué hay en
    sesión en cada paso) y el punto donde se desvía de lo esperado.
  - Contextos, no solo entradas. El comportamiento es el código más el
    contexto donde corre; muchos errores no existen en desarrollo porque
    ahí falta la condición que los provoca:
    - Una ficha por entorno (desarrollo, QA, producción) con lo que
      cambia el comportamiento: cuántos servidores, balanceador y
      afinidad de sesión, dónde vive la sesión y su timeout, llaves de
      cifrado compartidas o no, procesos por servidor y reciclado,
      cachés locales, reloj y zona horaria, configuración que difiere.
      Su lugar es `SETUP.md` (`lf-setup`).
    - Los eventos de infraestructura son entradas de la transición de
      estados: un servidor cae y el balanceador manda al usuario a otro,
      el proceso se recicla, un despliegue escalonado deja dos versiones
      conviviendo, la sesión expira entre dos pasos.
    - El mismo caso se simula en cada contexto, y lo valioso es la
      diferencia: "en desarrollo nunca falla porque hay un solo proceso;
      en producción falla cuando el segundo request cae en otro
      servidor". Eso explica por qué no se reproduce y dice cómo
      forzarlo en QA.
  - El contexto se construye en la conversación, no se tiene al inicio.
    Es una relación simbiótica: el desarrollador aporta información y el
    copiloto la pide y la delega.
    - La ficha empieza con lo que se lee de la configuración y del
      código. Lo que no se sabe queda como supuesto marcado, no como
      hecho.
    - El copiloto pide solo el dato de contexto que cambia los
      escenarios del momento, en una línea y diciendo qué decide ("si
      el balanceador no tiene afinidad, el valor se pierde al cambiar
      de servidor").
    - Reconoce el contexto que el desarrollador da sin que se lo pidan
      ("en prod hay dos servers") y lo incorpora: actualiza los
      supuestos y vuelve a simular lo afectado.
    - Lo que solo sabe infraestructura va como pregunta lista para
      reenviar (4.20).
    - Lo confirmado se guarda en `SETUP.md` o en la memoria para no
      volver a preguntarlo.
  - En segundo plano: con subagentes, la simulación acotada a la duda se
    lanza y la conversación sigue. Si la respuesta del desarrollador
    llega antes y la resuelve, la simulación se descarta; si termina
    primero, entra en el siguiente mensaje en una línea. Varias familias
    de condiciones pueden correr en paralelo, cada una sin ver las
    conclusiones de las otras, para no contagiarse. Sin subagentes
    (Codex), la misma simulación se hace en línea, igual de acotada. El
    nombre `lf-simulador` ya lo usa el probador del paquete: el agente
    nuevo necesita otro.
  - Simulación ejecutable, si hay terminal: un script fuera del
    proyecto, nunca contra producción (por ejemplo, requests
    concurrentes con la misma cookie de sesión contra QA). No modifica
    el código; el desarrollador lo autoriza porque genera carga en un
    ambiente compartido.
  - Qué recibe el desarrollador: no la matriz de escenarios, sino lo más
    probable, la receta para forzarlo (convierte "pasa a veces" en "pasa
    si hago esto") y la observación más barata que separa lo que queda.
  - No solo en diagnóstico: en `lf-analyze` y `lf-change`, la propuesta
    se pasa por la prueba de escritorio con los casos y contextos que ya
    salieron, antes de escribir código; y esos casos alimentan
    `lf-test`.

## 5. Puntos débiles, por prioridad

1. La base: procedimiento en lugar de criterio y conversación. Rigor
   igual para todo (4.7), secuencia visible (4.13) y una estructura que
   la refuerza (4.25).
2. El banco de pruebas mide lo viejo (4.24). Es requisito para validar
   todo lo demás.
3. Entender antes de decidir: mapa del punto focal (4.2), el porqué en
   el código, los commits y los comentarios (4.16) y la misma regla en
   varios lugares (4.17).
4. Desorden controlado sin leer (4.3).
5. Contradicción con el refactor (4.5).
6. "Simple" sin "no empeorar" ni ventana opcional, y un crítico que no
   pregunta si la propuesta pertenece al sistema (4.4).
7. El negocio no se enseña ni se acumula (4.1).
8. Diagnóstico con una sola simulación: sin casos que se generen por
   señales a lo largo de la conversación, sin modelo de entornos, sin
   observaciones baratas y con plan completo obligatorio (4.6, 4.26).
9. Delegación y canal de respuesta: supuesto de experto, instrucciones
   listas para copiar y pegar, chat para todo lo que espera un resultado
   (4.14, 4.15).
10. Comunicación: registro según el propósito, brevedad y menos
    ceremonia (4.8, 4.12).
11. Reportar a otras áreas: preguntas dirigidas y textos en su idioma
    (4.18, 4.20).
12. Dimensionar la tarea y trabajar con plazo (4.21, 4.22).
13. No aprende el criterio del desarrollador (4.9).
14. Señalar lo que depende del entorno al proponer un cambio (4.19).

## 6. Lo que ya está bien y no se toca

- La seguridad: APPLY, secretos, producción, respaldo y reversión.
- Evidencia y confianza en cada conclusión.
- La escalera de costo de `lf-diagnose`, como base.
- `lf-debate` y la regla de no ceder por insistencia.
- La escalera de atasco de `lf-delegate`.
- El manejo de interrupciones de `lf-test` y `lf-delegate`.
- Las reglas de sistemas heredados: codificación, binarios, sin git,
  Subversion y TFS.
- Una sesión, un requerimiento, una rama (`lf-branch`).

## 7. Siguiente paso propuesto

1. Juntar los casos de uso del desarrollador en un catálogo: principio,
   comportamiento esperado y escenario de prueba de cada uno.
2. Actualizar el simulador (4.24): persona experta, asistente con
   criterio dentro de invariantes, criterios de evaluación nuevos.
3. Diseñar la base (punto 1): invariantes, criterio, atajos y
   disparadores de rigor; la sección común de comunicación; el mapa del
   punto focal como capacidad común; la simulación de casos y contextos
   como capacidad común con su ficha de entornos (4.26); y cómo las
   skills pasan de estados a contenidos obligatorios.
4. Sobre esa base, ajustar `lf-core`, `lf-analyze`, `lf-change`,
   `lf-diagnose`, `lf-test`, `lf-delegate`, `lf-branch`, `lf-memory`,
   `lf-product`, `lf-setup`, el crítico, el verificador y la plantilla
   de `AGENTS.md`, y crear el agente de simulación de escenarios.
5. Agregar escenarios al banco de pruebas: parche que no se debe limpiar,
   cálculo duplicado por tercera vez, refactor que cabe y refactor que
   no cabe, diagnóstico que se resuelve con una captura, un pedido
   trivial que no debe convertirse en proceso, un usuario que salta
   directo a "dame el código" a mitad del análisis, un diagnóstico sin
   terminal con instrucciones para copiar y pegar, una regla que también
   vive en un reporte, un cambio con plazo encima, un parche cuyo porqué
   solo se deduce del commit y no está escrito en ningún lado, y un
   error intermitente de sesión sin logs que solo aparece con varios
   servidores, donde el contexto se descubre durante la conversación y
   el copiloto no debe simular de más al inicio.
