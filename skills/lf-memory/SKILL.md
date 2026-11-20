---
name: lf-memory
description: "Úsala al empezar a trabajar en un proyecto para recuperar lo que ya se aprendió, al cerrar un requerimiento o confirmar algo que costó averiguar para guardarlo, y cuando el desarrollador diga recuerda, olvida o pregunte qué se sabe o qué quedó pendiente. Mantiene en la carpeta .legacyforge del proyecto el conocimiento confirmado del sistema y del negocio, las zonas frágiles, las decisiones, el criterio del desarrollador, las oportunidades y el estado de cada sesión."
---

# lf-memory

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. Al guardar, una línea que
diga qué se guardó, sin pedir permiso cada vez, una vez que eligió dónde.

## Principio

En un sistema heredado, lo más caro es lo que no está escrito: qué menú
lleva a qué pantalla, qué tabla guarda qué, qué sostiene un parche raro,
qué significa un término del negocio, por qué se decidió algo, cómo es
cada ambiente. Esta skill lo conserva, corto y con fecha, para que la
siguiente sesión no empiece de cero y el desarrollador vaya armando su
imagen del negocio.

La memoria es un mapa, no evidencia. Lo que afirma se vuelve a comprobar
en el código antes de apoyarse en ello para un cambio.

## Archivos

Todos en `.legacyforge/`, en la raíz del proyecto de trabajo:

- `sistema.md`: lo confirmado del sistema y del negocio, en cuatro
  secciones:
  - Negocio: términos, reglas, procesos y por qué existen ("el pronto
    pago se descuenta al facturar, confirmado por cobranza").
  - Zonas frágiles: qué sostiene un parche, un caso especial o un valor
    fijo, y por qué no se toca.
  - Sistema: rutas de navegación, qué guarda cada tabla, dónde vive cada
    regla (incluidas sus copias), comandos que funcionan, dónde están
    los logs, datos de prueba válidos, trampas conocidas.
  - Entornos: la ficha de cada ambiente (desarrollo, QA, producción)
    según `../lf-core/references/simulacion.md`: servidores y procesos,
    balanceador y afinidad, dónde vive la sesión y su timeout, llaves
    compartidas, reciclado, reloj, configuración que difiere. Se llena
    durante el trabajo, a medida que se confirma.
- `decisiones.md`: decisiones tomadas, con fecha, razón y quién decidió.
- `oportunidades.md`: la lista de lf-propose, con su estado, y los
  reportes de deuda o refactor entregados.
- `sesiones.md`: una entrada por requerimiento: objetivo, rama, estado y
  pendientes. La más reciente arriba.
- `usuario.local.md`: del desarrollador, siempre local:
  - Herramientas y familiaridad (registro de lf-delegate), sistema
    operativo y shell.
  - Su criterio: lo que corrigió o prefirió, para aplicarlo en adelante
    ("en este módulo, funciones sueltas y no clases", "no tocar el
    cierre sin avisar a contabilidad").

Formato de una entrada: una línea, o dos si lleva evidencia.

    - 2026-11-18 · <lo que se sabe, en una frase.> · <evidencia: ruta y
      línea, commit, o "confirmado por el usuario"> · commit <abreviado>

Ejemplo en Entornos:

    - 2026-11-18 · QA: dos servidores detrás de balanceador sin
      afinidad; sesión en memoria. · confirmado por el usuario

## Reglas obligatorias

- R1. Nunca guardes: contraseñas, tokens, claves, cadenas de conexión,
  datos personales, resultados de consultas con datos reales ni opiniones
  sobre personas. De un dato de prueba se guarda cómo encontrarlo, no el
  registro de una persona. Si dicta una clave para que la recuerdes, no
  la guardes ni la repitas: dile que no queda guardada y dónde conviene
  tenerla, y guarda solo lo no secreto (el equipo o la dirección). En
  Entornos, se guarda si las llaves coinciden entre servidores, nunca su
  valor.
- R2. Solo lo confirmado: con evidencia del código o porque el
  desarrollador o el negocio lo dijeron. Las deducciones no entran, o
  entran marcadas "sin confirmar" (por ejemplo, el porqué implícito de un
  parche, deducido de su commit, o un supuesto de entorno que no se pudo
  comprobar).
- R3. Cada entrada lleva fecha y, si hay git, el commit en que se
  confirmó.
- R4. Si la memoria y el código se contradicen, gana el código. Corrige
  la entrada y dilo en una línea.
- R5. Corto: máximo 150 líneas por archivo. Al pasarse, funde repetidas y
  quita caducas antes de agregar.
- R6. Lee solo lo que el pedido necesita: las líneas que mencionan la
  zona de trabajo. No cargues la memoria completa.
- R7. Solo escribes dentro de `.legacyforge/`. Lo del negocio también
  alimenta PRODUCT.md, pero solo cuando se regenera con lf-product.
- R8. El desarrollador manda sobre su memoria: puede verla, corregirla y
  borrarla. "Olvida eso" se cumple sin discutir.
- R9. Solo el proyecto de la sesión.

## Estados

### M0. Primera vez

Si `.legacyforge/` no existe y hay algo que guardar, pregunta una sola
vez, en una pausa y nunca junto a otra decisión pendiente (en el cierre
va primero). Contexto en una frase, y la pregunta:

    Puedo guardar lo que vamos confirmando del sistema y del negocio
    para no averiguarlo de nuevo en la próxima sesión. Son notas cortas
    en `.legacyforge/`. ¿Dónde las guardo?

    1. Solo en este equipo, fuera de git (recomendada: no cambia nada
       para nadie más)
    2. En el repositorio, para compartirlas
    3. No guardar nada

- Solo en este equipo: crea la carpeta y agrega `.legacyforge/` a
  `.git/info/exclude`.
- En el repositorio: crea la carpeta y agrega solo
  `.legacyforge/usuario.local.md` a `.git/info/exclude`. Los archivos
  compartidos se confirman en la rama del requerimiento, en un commit
  aparte, cuando lo pida.
- No guardar: regístralo y no vuelvas a preguntar en esta sesión.

Sin git: guardar en la carpeta del proyecto, solo en este equipo fuera
de la carpeta del código (en la del usuario), o no guardar. Con
Subversion o TFS, recomienda fuera de la carpeta del código; si elige la
del proyecto, que no confirme `.legacyforge/`. Si cierra con prisa,
difiere la pregunta.

### M1. Recordar

Al empezar un trabajo (lf-core):

1. De `sesiones.md`, la entrada más reciente y las del mismo
   requerimiento o zona.
2. De `sistema.md` y `decisiones.md`, solo lo que menciona los términos
   del pedido (pantalla, tabla, proceso, cliente, regla). Las zonas
   frágiles de esa zona, siempre. Entornos, si es un diagnóstico, algo
   que solo pasa en un ambiente o un cambio que toca estado compartido.
3. De `usuario.local.md`, su criterio y sus herramientas.
4. Para cada entrada que vayas a usar, compara su commit con el actual.
   Si los archivos que cita cambiaron, es una pista por confirmar.
5. Si hay una sesión anterior del mismo requerimiento sin cerrar, dilo en
   dos o tres líneas (objetivo, en qué quedó, qué sigue) y continúa.
6. Una decisión registrada que afecta al pedido se menciona en una línea.
   No se reabre.

### M2. Guardar

Cuándo: al cerrar un requerimiento, al confirmar una causa raíz o qué
sostiene un parche, al confirmar algo de un ambiente, al terminar una
serie de tareas delegadas, cuando se toma una decisión con
consecuencias, cuando el desarrollador corrige el criterio del copiloto,
o cuando dice "recuerda que...".

1. Del registro de la conversación, solo lo reutilizable:
   - Negocio: términos, reglas y porqués confirmados.
   - Zonas frágiles: qué sostiene qué.
   - Sistema: lo confirmado que costó una búsqueda o una tarea delegada,
     y dónde más vive cada regla.
   - Entornos: lo confirmado de cada ambiente.
   - Decisiones que alguien podría querer reabrir sin saber por qué.
   - Sesión: objetivo, rama, estado (en curso, en pruebas, terminado,
     abandonado) y pendientes.
   - Desarrollador: herramientas, familiaridad y criterio.
2. Aplica R1 y R2. Ante la duda, no se guarda.
3. Si ya hay una entrada sobre lo mismo, actualízala.
4. Escribe y avisa en una línea: "Guardé dos cosas del negocio y cómo
   está montado QA."

### M3. Consultar y corregir

- "¿Qué sabes de...?", "¿qué quedó pendiente?": responde con las
  entradas, su fecha y si siguen vigentes según el código.
- "Eso ya no es así": corrige con la evidencia nueva.
- "Olvida...": borra y confírmalo en una línea (R8).
- "Borra la memoria": di qué archivos se borran y espera confirmación
  explícita.

### M4. Mantenimiento

Al guardar, si un archivo supera el límite (R5) o tiene entradas cuyo
código citado ya no existe: funde, acorta y retira. Di en una línea
cuántas quitaste.
