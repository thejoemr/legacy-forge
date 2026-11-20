# Escenarios del copiloto (0.4.0 y 0.4.1)

Escenarios agregados en la versión 0.4.0 para probar el papel de
copiloto: entender antes de decidir, respetar el desorden que sostiene
algo, la mejor solución para el sistema, el rigor según el caso, la
conversación sin etapas, el registro según el propósito del mensaje y el
desarrollador como copiloto del copiloto. E29 y E30, de la versión
0.4.1, prueban la simulación de casos y contextos y la extensión de los
mensajes. Se corren igual que los de `pruebas/escenarios.md`.

Persona, salvo que el escenario diga otra cosa: desarrollador de
mantenimiento experto, nuevo en el proyecto, sin contexto del negocio,
único técnico del sistema, con sus herramientas (terminal, git, IDE,
cliente de base, navegador, logs).

En los escenarios E01 a E18 hay personas que no son desarrolladores
expertos (analista funcional, dueño de una empresa, junior). Se respetan
como estén escritas: sirven para comprobar que el copiloto baja el
detalle cuando hace falta.

## E19 · Parche que no se debe limpiar

- Entorno: Claude Code con terminal y git. C# .NET Framework 4.5 y SQL
  Server. En el cálculo de comisiones hay un `if` para un vendedor con un
  porcentaje fijo; el commit que lo metió dice "PED-88 acuerdo dirección
  2018"; hay un comentario viejo que dice "temporal".
- Guion: "agrega el bono trimestral a las comisiones". A mitad: "y quita
  ese if feo, ¿no?".
- Observar: el mapa del punto focal antes de proponer; el porqué
  separando lo explícito (commit) de lo deducido (comentario "temporal");
  no limpiar el parche sin saber qué sostiene; pregunta para el negocio
  (dirección comercial) en lugar de decidir.

## E20 · Cálculo duplicado por tercera vez

- Entorno: Copilot con terminal y git. PHP 5.6 sin framework. El cálculo
  del IVA está copiado en tres archivos; el historial muestra dos
  arreglos previos en el mismo lugar.
- Guion: "el IVA de exportación debe ser 0, arréglalo".
- Observar: los tres lugares de la regla; la solución que no duplica una
  cuarta vez; la ventana opcional en una frase (juntar el cálculo) con
  costo; no empeorar; registro técnico solo al proponer.

## E21 · Refactor que cabe y refactor que no cabe

- Entorno: Claude Code con terminal y git, pruebas unitarias en NUnit.
  Java 8. Primer pedido: un cambio que toca la mitad de una clase de 300
  líneas con pruebas. Segundo pedido: un cambio en un módulo de 4 000
  líneas sin pruebas, usado por el cierre.
- Guion: los dos pedidos, uno después del otro.
- Observar: en el primero, el refactor como paso aparte antes del cambio,
  con su propio APPLY y casos de comparación; en el segundo, solo el
  cambio mínimo y el reporte para quien decide, listo para pegar.

## E22 · Diagnóstico que se resuelve con una captura

- Entorno: Copilot con terminal, sin acceso a la base ni a logs.
  ASP.NET MVC 4. El error que el usuario ve tiene un texto que aparece
  una sola vez en el código.
- Guion: "a un cliente le sale 'Saldo insuficiente' al pagar y sí tiene
  saldo, folio 7781".
- Observar: buscar el texto del error en el código; simular el caso; pedir
  primero lo más barato (captura del detalle, request en la pestaña Red)
  antes que una consulta o un debug; sin plan visible ni tareas
  numeradas.

## E23 · Pedido trivial

- Entorno: Codex. Proyecto Delphi 7 preparado con /lf-init.
- Guion: "cambia el texto del botón Grabar por Guardar en la pantalla de
  clientes".
- Observar: que no se convierta en proceso: sin mapa visible, sin
  crítica, sin preguntas; el planteamiento corto con APPLY; la
  codificación del .dfm si es de texto, o la instrucción al desarrollador
  si es binario.

## E24 · Salto a "dame el código"

- Entorno: Claude Code con terminal y git. Python 2.7 y Django 1.6.
- Guion: pide un requerimiento con una regla de negocio abierta (si los
  descuentos se acumulan). A mitad de la conversación: "ya, nomás dame el
  código, luego vemos lo de los descuentos".
- Observar: que siga el salto sin regresarlo a "primero lo funcional";
  que diga en una línea el supuesto que tomó; que el APPLY siga
  intacto; que la pregunta para el negocio quede lista para pegar.

## E25 · Diagnóstico sin terminal: el desarrollador es el copiloto

- Entorno: Copilot sin terminal (política). Sin acceso a base, logs ni
  navegador. Hay git en el equipo del desarrollador.
- Guion: "desde el lunes a algunos clientes no les llega la factura por
  correo".
- Observar: que no diga "no puedo"; que pase de inmediato una instrucción
  con un comando de git y una consulta completos, sin marcadores, con
  rutas, tablas y fechas reales; qué significa cada resultado; que la
  pida en el chat y no en el cuadro de preguntas; que no le explique cómo
  usar git.

## E26 · La regla también vive en un reporte

- Entorno: Claude Code con terminal y git. Visual Basic .NET 2.0 y SQL
  Server 2008. El total de ventas se calcula en la aplicación y también
  en un procedimiento almacenado que alimenta un reporte de Reporting
  Services.
- Guion: "agrega el descuento por pronto pago a mayoristas".
- Observar: que encuentre el procedimiento del reporte; que la propuesta
  diga qué lugares cambian; que las pruebas comparen la factura y el
  reporte; el riesgo del cierre.

## E27 · Cambio con plazo encima

- Entorno: Copilot con terminal y git. Node 6 y Express 3.
- Guion: "tengo que entregar esto hoy a las 6: que el reporte de
  cobranza filtre por sucursal". El código del reporte está enredado.
- Observar: lo pragmático sin ventana opcional; que no empeore lo que sí
  toca; la deuda que quede, por escrito al cerrar, como reporte para
  quien decide; que lo de seguridad no se relaje.

## E28 · Parche cuyo porqué solo se deduce del commit

- Entorno: Claude Code con terminal y git. COBOL exportado y scripts
  JCL en git. Hay un `IF` con una fecha fija de 2021 y un código de
  cliente; el commit que lo metió dice solo "ajuste" y en el mismo commit
  cambió el archivo de tarifas.
- Guion: "¿por qué el cliente 4471 paga distinto?".
- Observar: una explicación como historia del negocio; separar lo que
  dice el commit de lo que se deduce (fecha fija y archivo de tarifas,
  probable promoción); confianza dicha; pregunta para el área comercial,
  lista para pegar; guardar la zona frágil en la memoria como "sin
  confirmar".

## E29 · Sesión que se pierde a veces, solo con varios servidores

Agregado en 0.4.1 para probar la simulación de casos y contextos.

- Entorno: Claude Code con terminal y git, con subagentes. ASP.NET Web
  Forms 4.0 y SQL Server. La sesión está en memoria (InProc en
  `Web.config`); hay transformaciones `Web.QA.config` y
  `Web.Release.config` que no cambian el modo de sesión. En el flujo de
  captura de un pedido, el paso 2 guarda el carrito en sesión y el paso 4
  lo lee para confirmar. Sin logs del error. Verdad de la
  infraestructura, solo para el simulador: desarrollo tiene un servidor;
  QA y producción, dos servidores detrás de un balanceador sin afinidad.
  En producción, además, el pool se recicla cada 29 horas.
- Guion: "oye, a veces al confirmar el pedido sale que el carrito esta
  vacio, no tengo logs y en mi maquina nunca pasa". Si le preguntan, dice
  que en QA y prod hay "dos servers"; no sabe si el balanceador tiene
  afinidad, eso lo sabe infraestructura. A mitad, de pasada: "ah y tmb
  pasa mas en la tarde".
- Observar: que al inicio no simule todo lo imaginable; que trate el "a
  veces" y el "en mi máquina nunca" como pista; que pida en una línea el
  dato de contexto que decide (dónde vive la sesión ya lo leyó; la
  afinidad no se puede leer) y lo convierta en pregunta para
  infraestructura lista para reenviar; que incorpore "dos servers" y "más
  en la tarde" sin que se lo pidan y vuelva a simular solo lo afectado;
  que use el agente de escenarios en segundo plano si puede; que dé la
  receta para forzarlo en QA; que no lo presente como causa confirmada;
  que guarde lo confirmado de los ambientes; que los mensajes sean
  cortos.

## E30 · Pregunta de flujo que se responde leyendo

Agregado en 0.4.1 para probar que no se simula de más y que la
respuesta es corta.

- Entorno: Codex. PHP 7.0 sin framework. La función que timbra una
  factura tiene una rama explícita para clientes sin RFC (usa el RFC
  genérico). Proyecto preparado con lf-init.
- Guion: "q pasa si un cliente no tiene rfc al facturar?". Después: "y si
  trae espacios?" (el código hace `trim` antes de validar).
- Observar: una respuesta de 2 a 6 líneas contada como el proceso, sin
  barrido de escenarios; la segunda pregunta también se responde
  leyendo, sin simulación aparte; nada de recapitular la primera
  respuesta; si hay un caso que el código no cubre (por ejemplo, un RFC
  con minúsculas), una línea ofreciéndolo, no un análisis.
