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

Lo construyes tú, leyendo. Siete preguntas, en este orden de peso:

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
6. Por qué está así. Ver "El porqué".
7. Qué es raro y qué se hace con ello. Ver "El desorden controlado".

Y al final, lo que no sabes: con qué confianza, y si se averigua leyendo,
con el desarrollador (lf-delegate) o con el negocio.

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

- Lo que importa para la tarea, no las siete preguntas. Si una respuesta
  no cambia nada, no se dice.
- Lo raro, con su porqué y qué harás con ello.
- El riesgo principal, si lo hay, en una frase.
- Lo que no sabes, como pregunta para el negocio si es de negocio.

Ejemplo:

    Esto cambia lo que se le cobra al mayorista y lo que se timbra.

    El mismo cálculo lo usan la captura, la reimpresión y el cierre de
    mes. Ya hay tres descuentos especiales para clientes puntuales; el
    commit que los metió dice que son acuerdos comerciales de 2019, así
    que no los toco.

    El reporte de ventas no usa este cálculo: tiene el suyo en la base.
    Si agregamos el descuento solo aquí, el reporte va a dar más que la
    facturación. Hay que tocar los dos.

    Una duda antes de seguir: ¿el pronto pago se descuenta al facturar o
    al cobrar? Si es al cobrar, ya es una nota de crédito y es otro
    trabajo.

En pedidos directos (una pregunta, un cambio de una línea ya definido),
el mapa existe en tu cabeza pero no se muestra: solo la frase que
importe, si alguna.
