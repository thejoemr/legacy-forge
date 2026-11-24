# Tipos de pedido

Lee solo la sección que vas a preparar. Todo se resuelve antes de
redactar; nada de marcadores.

## Pantalla

Resuelve: URL o ejecutable (configuración, launchSettings); ruta de
menú con las etiquetas visibles (definiciones de menú, rutas, textos de
recursos); rol necesario; datos de prueba válidos según las
validaciones, o los del caso.

1. Entra a `<URL real>` con un usuario con rol <rol real>.
2. Ve a Menú > Submenú > Opción, con las etiquetas exactas.
3. Una acción por paso solo si importa el orden.
4. Qué observar y qué guardar (captura o texto).

## Datos

Resuelve: motor y versión (sintaxis correcta); servidor y base por su
nombre, nunca la cadena de conexión; tablas y columnas desde
migraciones, scripts o modelos; los valores del caso.

- Dónde: "en tu cliente de SQL, contra FACT_QA".
- La consulta completa en un bloque, solo lectura, con límite, valores
  puestos y un comentario si una columna no es evidente.

## Comando

Resuelve: sistema operativo y shell (memoria, SETUP.md; si no se sabe y
cambia el comando, pregúntalo una vez con el primer pedido); carpeta y
comando completo; para git, rutas reales, fechas, commit o rama.

- Dónde: "en la raíz del repo" o la ruta exacta.
- El comando en un bloque, ejecutable tal cual.

## Logs

Resuelve: dónde se escriben (log4net, NLog, Serilog, logback, web.config,
appsettings, tabla de log, Sentry, App Insights, Kibana, Grafana); el
texto exacto que escribe el código en ese flujo; ventana de tiempo e
identificadores.

- Dónde, con la ruta o el nombre real; qué buscar (texto o filtro listo);
  guardar el resultado en `salidas/`.

## Navegador

Resuelve: pantalla y acción que dispara la petición; fragmento de ruta
del endpoint.

1. Herramientas de desarrollo, pestaña Red, filtro `<fragmento real>`.
2. Haz la acción.
3. Guarda status, cuerpo de la petición y de la respuesta (o la consola
   si hay error de JavaScript).

## Depuración

Lo último: antes confirma que lo más barato no separa las hipótesis.

Resuelve: unidad a ejecutar y cómo arrancarla (SETUP.md); puntos de
interrupción (archivo, línea, método, condición); cómo disparar el flujo
con los datos del caso; qué inspeccionar; qué valor espera cada
hipótesis.

1. Abre `<solución>` con `<unidad>` como proyecto de inicio.
2. Punto de interrupción en `<archivo>:<línea>` (`<método>`), con
   condición `<expresión>` si aplica.
3. Dispara el flujo con <datos reales>.
4. Al detenerse, anota el valor de `<expresiones>`.
5. Si <valor A>, es <hipótesis>; si <valor B>, se descarta.

## Observación

Dónde se observa (cola, carpeta de salida, buzón), desde configuración,
y qué identificador o texto buscar.

## Edición a mano

Para binarios, diseñadores o codificaciones que no se pueden editar con
seguridad desde el asistente (lf-legado). Va dentro de un planteamiento
con APPLY.

1. Copia el archivo en la misma carpeta con otro nombre.
2. Ábrelo con el IDE propio de esa tecnología, que conserva la
   codificación.
3. Busca el texto ancla y reemplázalo por el texto exacto del bloque.
4. Guarda con la misma codificación.
5. Abre la pantalla y confirma que los acentos se ven igual.
