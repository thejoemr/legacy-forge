---
name: lf-test
description: "Úsala para probar un cambio: después de que lf-change lo aplica, o por separado para probar un cambio hecho a mano, confirmar que un problema ya no ocurre o revisar regresiones antes de liberar. Corre las verificaciones automáticas del proyecto, diseña los casos por riesgo (incluidos los otros lugares de la regla y los consumidores) y le pasa al desarrollador, listos para ejecutar, los que no puede correr por sí misma."
---

# lf-test

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. En particular:

- Sin conteos ("Caso 3 de 8") ni un caso por mensaje como regla. Los
  casos que el desarrollador puede hacer en el mismo lugar van juntos,
  como una lista con datos y resultado esperado, y él te devuelve lo que
  vio.
- Cada caso dice qué se prueba en términos del proceso ("una factura de
  mayorista con pronto pago").
- Lo que le pides va listo para ejecutar (lf-delegate): pantalla, datos,
  consulta de verificación completa.

## Definiciones

- Objeto de prueba: un cambio aplicado con lf-change, un cambio hecho a
  mano, la corrección de un problema diagnosticado o un área antes de
  liberar.
- Contexto de prueba: propósito, archivos modificados, riesgos,
  consumidores, otros lugares de la regla, criterios de aceptación, el
  caso concreto del problema original si es una corrección, y los
  escenarios y contextos que salieron de la simulación.
- Verificación automática: comandos que el proyecto ya tiene para
  compilar, revisar estilo o ejecutar pruebas.
- Caso: una prueba con precondición, datos, pasos y resultado esperado.
- Causa de una falla: EN_EL_CAMBIO, PREEXISTENTE, ENTORNO o
  CASO_INCORRECTO (el caso esperaba algo equivocado).
- Interrupción: el desarrollador trae algo nuevo en lugar del resultado o
  además de él. AJENA: no toca lo que se prueba; las pruebas se pausan.
  REPLANTEA: muestra que lo probado está mal o incompleto; las pruebas se
  detienen y se replantea.

## Reglas obligatorias

- Proyecto: solo el de la sesión.
- R1. No modifiques código ni configuración. Escribir pruebas
  automáticas nuevas es un cambio con lf-change, solo si se pide.
- R2. Lo que haga el desarrollador va con lf-delegate. Crear o modificar
  datos de prueba sigue sus condiciones (R7).
- R3. Ejecuta tú lo que tus capacidades permitan; pide solo el resto.
- R4. Autorización de comandos:
  - Sin autorización, solo comandos de lectura (versiones, git status,
    git log, listar y leer).
  - Si te invocó lf-change, su APPLY autoriza los comandos de
    verificación que listó. Ninguno más.
  - Cualquier otro comando (compilar, revisar estilo, ejecutar pruebas,
    un script de simulación) requiere autorización explícita. Antes,
    muestra el comando exacto, la carpeta, qué hace y qué recursos
    externos toca según la configuración de pruebas. Termina tu turno y
    espera.
  - Nunca ejecutes comandos que publiquen, desplieguen o migren datos.
  - Nunca pruebes contra producción. Si es el único entorno, la regla de
    lf-delegate (R7): casos que no escriban, el resto como decisión del
    desarrollador, y lo que quede sin probar, dicho.
- R5. Datos de prueba, rutas de navegación, etiquetas y consultas salen
  de evidencia, nunca de suposiciones.
- R6. Una falla se clasifica con evidencia antes de reportarla. Nunca la
  atribuyas al cambio sin comprobarlo.
- R7. Sin secretos: no leas archivos de secretos. Para saber a qué base
  apuntan las pruebas, busca solo el nombre de la clave.
- R8. Responde en el idioma del desarrollador.
- R9. El desarrollador puede interrumpir en cualquier momento. Una
  interrupción se atiende de inmediato (P7), nunca al terminar.

## Estados

### P1. Contexto

1. Si te invoca lf-change, usa su contexto.
2. Si no, reúnelo: el objeto de prueba (con git status o git diff; svn
   status o svn diff; sin control de versiones, el respaldo de lf-change
   o pregunta qué tocó), propósito y criterios (de lf-analyze o del
   desarrollador), caso concreto (de lf-diagnose), escenarios simulados
   y la ficha de entornos (de la conversación o de la memoria),
   consumidores y otros lugares de la regla (como lf-change A2), y
   riesgos.
3. Pregunta solo lo esencial que no puedas obtener: normalmente, qué
   debería pasar si no hay criterios.

### P2. Verificación automática

1. Busca los comandos del proyecto para compilar, revisar estilo y
   ejecutar pruebas: package.json, Makefile, scripts/, CI y SETUP.md.
2. Antes de correrlos, revisa qué tocan en la configuración de pruebas
   (conexiones, URLs, rutas compartidas). Descarta los que publiquen,
   desplieguen o migren (R4).
3. Córrelos con la autorización que corresponda o pásaselos al
   desarrollador listos para pegar. Si prueba en otro equipo, primero qué
   archivos llevar (lf-delegate).
4. Si alguno falla, P5. Si no existe ninguno, dilo en una frase.
5. Si la herramienta disponible es de otra versión que la del proyecto,
   dilo: lo que no detecte queda sin verificar.
6. Un script de base se prueba después de ejecutarlo en una base de
   pruebas, y ejecutarlo es tarea delegada (lf-delegate, R7). Si solo hay
   producción y el script solo agrega un índice reversible, la prueba es
   la medición posterior, con la reversa lista.

### P3. Diseño de casos

En este orden de prioridad:

1. Si es una corrección: reproducir el caso concreto original y
   comprobar que ya no ocurre.
2. Los escenarios que la simulación encontró (en el diagnóstico o sobre
   la propuesta), con la receta para forzarlos y el ambiente donde se
   puede (`../lf-core/references/simulacion.md`).
3. Uno por criterio de aceptación.
4. Uno por riesgo no cubierto, de mayor a menor impacto.
5. Si la regla vive en varios lugares: que todos den lo mismo (por
   ejemplo, la factura y el reporte de ventas del mismo día).
6. El flujo principal, si no está cubierto.
7. Uno de regresión por consumidor afectado no cubierto, empezando por
   los delicados (cierres, reportes, integraciones).
8. Si hubo un refactor sin cambio de comportamiento: los casos de
   comparación (misma entrada, misma salida antes y después).

Hasta 8 obligatorios; el resto, opcionales. Cada caso parte del punto de
entrada más alto del flujo (pantalla, endpoint con su payload, job y
dónde ver el resultado). Si el resultado se confirma mejor en los datos,
agrega una consulta de verificación de solo lectura.

Si un riesgo depende del contexto y el ambiente de pruebas no lo tiene
(un solo servidor donde producción tiene varios), dilo en una línea y da
la forma de forzarlo (apagar un nodo, quitar la afinidad, bajar el
timeout), o déjalo como no probado.

Lo que puedas comprobar tú (con terminal, base de solo lectura o
leyendo), hazlo y repórtalo; no se lo pidas.

### P4. Ejecución

1. Dile en una o dos frases qué vas a probar y por qué esos casos.
2. Pásale juntos los casos que se hacen en el mismo lugar, como una
   instrucción de lf-delegate: datos, pasos, resultado esperado de cada
   uno y qué pegar. Si un caso depende del resultado de otro, va después.
3. Interpreta lo que devuelve:
   - Funcionó como se esperaba: siguiente grupo, o P6.
   - Algo salió distinto: P5.
   - No pudo ejecutarlo (no encuentra la pantalla, sin acceso, sin
     datos): no es una falla. Resuélvelo con lf-delegate y reenvía.
   - Trae algo nuevo (un hallazgo, una duda sobre el enfoque, un ajuste,
     una solicitud o detener las pruebas), aunque venga con lo que vio:
     P7.
   - No queda claro: pregunta en una frase lo que falta.

### P5. Falla

1. Detente. No intentes corregir nada.
2. Clasifica la causa con evidencia: código, consultas, logs o lo que
   reportó. Si no basta, una comprobación con lf-delegate.
3. CASO_INCORRECTO: corrige el caso, di en una frase qué esperaba mal y
   reenvíalo.
4. En otro caso, empieza con "× Falló · <caso>" y di qué falló, qué se
   vio, la causa y su evidencia. Si te invocó lf-change, devuélvele el
   control. Si no, lf-diagnose para investigarla, o lf-change si la causa
   es clara.

### P6. Resultado

Cuando pasaron los casos obligatorios, en pocas líneas: qué se verificó
automáticamente, qué casos pasaron, qué opcionales no se hicieron y qué
riesgos quedaron sin probar y por qué, incluidos los que solo existen en
otro contexto. Si te invocó lf-change, devuélvele el control.

Si la validación la hace otra área, ofrece la nota de pruebas para ella
(qué revisar y con qué datos), lista para pegar.

### P7. Interrupción

1. Clasifica con evidencia: AJENA o REPLANTEA. Ante la duda, REPLANTEA:
   probar algo que quizá cambie es tiempo perdido. Si la interrupción es
   una pregunta que se resuelve con un dato o una búsqueda barata,
   resuélvela primero y clasifica con el resultado.
   - Excepción: toca un archivo bajo prueba sin cambiar lo que se prueba
     (un rótulo, una errata): AJENA, y al retomar se repiten solo los
     casos de ese archivo.
   - Excepción: un desacuerdo sin evidencia nueva ("yo creo que debería
     ser así"): lf-debate, y el caso queda pendiente; suele ser justo la
     comprobación que decide.
   Si de verdad no puedes decidir, pregunta una vez: replantear ahora,
   pausar o seguir probando.
2. REPLANTEA:
   1. Detén las pruebas. No pidas terminar las que faltan.
   2. Qué hay que rehacer: el caso (P5), la implementación, la solución
      (lf-analyze) o la causa (lf-diagnose).
   3. "▲ Atención · <tema>": qué cambia y por qué en palabras del
      negocio, qué hay que rehacer y qué pruebas siguen valiendo.
   4. Si te invocó lf-change, devuélvele el control. Si no, sigue en el
      mismo turno con la skill que corresponda.
   5. Cuando lo rehecho se vuelva a probar, rediseña los casos (P3)
      conservando los que siguen valiendo.
3. AJENA:
   1. No reenvíes ni recuerdes el caso en curso mientras se atiende.
   2. En una o dos líneas: qué casos pasaron, cuáles quedan, y si te
      invocó lf-change, que el cambio sigue aplicado y se puede revertir.
      En el mismo mensaje, atiende la solicitud.
   3. Si te invocó lf-change, devuélvele el control con la pausa.
   4. Al retomar: si la solicitud modificó archivos, vuelven a quedar
      pendientes los casos que dependen de ellos y se repite la
      verificación automática afectada. Si cambió lo que se prueba,
      trátala como REPLANTEA.
   5. Si decide no retomarlas, P6 con los casos pendientes como no
      ejecutados.
