# Entender el punto focal

Referencia común para lf-explain, lf-diagnose, lf-analyze, lf-change y
lf-optimize. Es lo que un desarrollador de mantenimiento con experiencia
hace antes de decidir qué tocar: entender el punto donde cae la tarea y
lo que lo rodea. No es toda la aplicación; es ese método, esa pantalla,
ese proceso y su vecindad.

## Cuándo

- Antes de definir cualquier cambio que no sea trivial, y antes de
  formular hipótesis en un diagnóstico.
- La profundidad sigue al riesgo. Para cambiar un texto de una etiqueta,
  basta mirar quién la usa. Para tocar un cálculo de dinero, el mapa va
  completo.
- Se arma primero y se decide después. Nunca al revés: fijar los
  archivos y luego buscar quién los usa solo sirve para justificar.

## El mapa

Lo construyes tú, leyendo, sin olvidar lo que el desarrollador ya dijo
en la conversación. Ocho preguntas, en este orden de peso:

1. Para qué existe en el negocio. Qué proceso sirve, a quién, y qué
   pasaría en la operación si falla.
2. Quién lo usa. Pantallas, procesos, jobs, reportes, otros sistemas.
   Referencias directas y dinámicas: texto, SQL, configuración,
   reflexión, plantillas, binarios exportados. Para cada uno, quién lo
   usa a su vez, hasta llegar a algo que el negocio reconozca.
3. Qué decide su camino. Configuración, banderas, tipo de cliente,
   fechas, datos, parámetros. Qué valor manda a qué rama.
4. Cuántas ramas tiene y cuál toca la tarea. Las que no toca también
   cuentan: son las que no deben cambiar.
5. Dónde más vive la misma regla. En un sistema heredado, una regla de
   negocio rara vez está en un solo lugar: el cálculo de la pantalla, el
   del stored procedure del reporte, el del proceso nocturno, una vista,
   otro sistema que recibe el dato. Búscala por los nombres del dominio,
   constantes, fórmulas parecidas y SQL. Cambiar solo una produce
   descuadres que nadie ve hasta el cierre.
6. Cómo resolvió el sistema algo parecido. Ver "Precedentes".
7. Por qué está así. Ver "El porqué".
8. Qué es raro y qué se hace con ello. Ver "El desorden controlado".

Y al final, lo que no sabes: con qué confianza, y si se averigua leyendo,
con el desarrollador (lf-delegate) o con el negocio.

## Precedentes

La pregunta 5 busca la misma regla; esta busca el mismo tipo de
problema, ya resuelto en otro lado. Un desarrollador con experiencia lo
hace antes de diseñar, porque el sistema ya decidió cómo se hacen las
cosas aquí.

Qué buscar, según la tarea:

- Una pantalla, un reporte, un job o un endpoint hermano: otro que
  valida, exporta, calcula, envía o pagina igual que lo que hay que
  hacer.
- Utilidades compartidas: módulos comunes, helpers, clases base,
  funciones de acceso a datos, componentes de formulario, rutinas de
  bitácora, de fechas o de folios.
- Integraciones parecidas: otra llamada al mismo servicio, otro archivo
  de intercambio con el mismo formato, otra cola.
- Cambios parecidos en el historial: un commit que agregó un caso
  similar (otro descuento, otro tipo de cliente, otro campo al reporte)
  enseña qué lugares tuvo que tocar.

Cómo buscar: por la forma del problema y no solo por los nombres del
dominio. Busca los verbos y las piezas técnicas (exportar, `Excel`,
`SendMail`, `ExecuteReader`, la tabla de parámetros, el control de la
grilla), carpetas vecinas con la misma estructura y el `git log` de
archivos parecidos.

Qué hacer con lo que encuentras, en este orden:

1. Reutilizarlo: si ya hace lo que hace falta, se llama.
2. Adaptarlo: si resuelve algo casi igual, se sigue su forma (o se copia
   y se ajusta, si así trabaja el sistema), sin copiar sus defectos.
3. Tomarlo como la forma de la casa: si nada sirve directo, lo nuevo se
   escribe como esos precedentes.

Si hay varios patrones para lo mismo, elige el del mismo módulo, el más
repetido o el más reciente, en ese orden, y dilo. Un precedente prueba
cómo trabaja el equipo, no que funcione bien: si tiene un defecto
(`solucion.md`), se sigue su forma y se corrige el defecto en lo nuevo.

Si no hay precedente, también es dato: lo nuevo no tiene forma de la
casa y conviene decirlo en la propuesta.

En un diagnóstico, un flujo parecido que sí funciona sirve de
comparación: la diferencia entre los dos suele ser la causa.

## El porqué

Sale del código, de los commits y de los comentarios. Saca de ahí lo que
dicen y lo que se deduce, y al contarlo distingue siempre cuál es cuál.

- Explícito: lo que está escrito. El mensaje del commit que introdujo
  esas líneas y el ticket que cita, un comentario que explica una
  excepción, un nombre como `CLIENTE_CONVENIO_2019`.
- Implícito: lo que se deduce. Qué más cambió en el mismo commit, una
  fecha fija en una condición, un caso especial para un solo cliente,
  código desactivado que nadie borró, un comentario que ya no coincide
  con el código.
- Al contarlo: "el commit dice que es por el convenio" frente a "por la
  fecha, parece una promoción de un mes".

Cómo leer el historial: `git log -L` o `git blame` sobre las líneas que
importan, y `git show` del commit que las introdujo. Con Subversion,
`svn blame` y `svn log`. Sin historial, los comentarios y las fechas de
los archivos. Si no tienes terminal, pide la salida al desarrollador con
una instrucción lista para pegar.

Un comentario o un mensaje de commit es una pista, no una prueba: si el
código dice otra cosa, gana el código y la contradicción se menciona.

## El desorden controlado

Lo feo de un sistema heredado no es todo igual. Antes de juzgarlo,
clasifícalo:

- Parche que sostiene algo. Un caso especial, un valor fijo, un desvío
  raro que responde a una regla de negocio o a un acuerdo. Se respeta:
  no se limpia, no se generaliza, no se mueve. Si la tarea lo toca, se
  dice y se trabaja alrededor.
- Deuda estable. Código feo, repetido o anticuado que funciona y no
  estorba a la tarea. Se imita en estilo y se deja como está.
- Deuda activa. Lo que causa el problema, o lo que hará que el cambio
  falle o quede mal. Se atiende dentro de la tarea, en la medida
  mínima, o se reporta si no cabe (`solucion.md`, refactor).

Ante la duda entre "sostiene algo" y "deuda", trátalo como si sostuviera
algo hasta tener el porqué.

Cuando puedas, explícalo en términos de negocio: "este caso aparte es el
acuerdo de 2019 con ese cliente", no "hay un if hardcodeado". Así el
desarrollador sabe si lo puede tocar.

Lo que confirmes de una zona frágil (qué sostiene y por qué) va a la
memoria (lf-memory), para no volver a averiguarlo.

## Cómo se muestra

El mapa se comparte con el desarrollador, para que lo valide en
segundos y decidan viendo lo mismo. Es un mensaje informativo
(`comunicacion.md`): se cuenta como el proceso de negocio, no como el
código.

- Lo que importa para la tarea, no las ocho preguntas. Si una respuesta
  no cambia nada, no se dice.
- Lo raro, con su porqué y qué harás con ello.
- El riesgo principal, si lo hay, en una frase.
- La duda que bloquea, una sola; las demás esperan su turno.

Hasta unas 6 líneas. Ejemplo:

    Esto cambia lo que se cobra y se timbra al mayorista. El mismo
    cálculo lo usan captura, reimpresión y cierre de mes; los tres
    descuentos especiales que tiene son acuerdos de 2019 (dice el
    commit) y no los toco. El reporte de ventas calcula aparte en la
    base: hay que tocar los dos o va a descuadrar. Tarea media.
    ¿El pronto pago se descuenta al facturar o al cobrar?

En pedidos directos (una pregunta, un cambio de una línea ya definido),
el mapa existe en tu cabeza pero no se muestra: solo la frase que
importe, si alguna.
