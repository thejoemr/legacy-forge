# Tipos de tarea

Lee solo la sección del tipo de tarea que vas a preparar. En todos los
tipos, la regla es la misma: lo que el desarrollador necesita para hacer
la tarea se resuelve antes de redactarla. Nada de marcadores.

## Pantalla (UI)

Resuelve antes:

- Punto de acceso: URL o ejecutable, desde configuración o
  launchSettings.
- Ruta de navegación con las etiquetas visibles: definiciones de menú,
  rutas, sitemap, permisos y textos de recursos. No nombres de clases.
- Rol necesario, si el código lo define.
- Datos de prueba válidos según las validaciones del código, o los del
  caso concreto.

Pasos:

1. Entra a `<URL real>` con un usuario con rol <rol real>.
2. Ve a Menú > Submenú > Opción, con las etiquetas exactas.
3. Una acción por paso solo si importa el orden; si no, en una línea.
4. Qué observar, y qué pegar (captura o el texto que aparece).

## Consulta de datos (DATOS)

Resuelve antes:

- Motor y versión, desde configuración o paquetes. La sintaxis es la de
  ese motor (TOP en SQL Server, ROWNUM en Oracle viejo, LIMIT en MySQL).
- Servidor y base por su nombre, desde configuración, nunca la cadena de
  conexión.
- Tablas y columnas, desde migraciones, scripts, modelos o consultas del
  código.
- Los valores del caso: folio, cliente, fechas.

Pasos:

- En qué base: "en el cliente de SQL, contra FACT_QA".
- La consulta completa en un bloque, de solo lectura, con límite de
  filas, con los valores puestos y un comentario breve si una columna no
  es evidente.

## Comando (COMANDO)

Resuelve antes:

- Sistema operativo y shell del desarrollador, del registro, la memoria o
  SETUP.md. Si no se sabe y cambia el comando, pregúntalo una vez junto
  con la primera tarea de este tipo.
- Carpeta exacta y comando completo para ese sistema.
- Para git: la ruta real de los archivos, fechas concretas, el commit o
  la rama por su nombre.

Pasos:

- Dónde: "en la raíz del repo" o la ruta exacta.
- El comando en un bloque, ejecutable tal cual.

## Logs y trazas (LOGS)

Resuelve antes:

- Dónde se escriben: configuración de logging (log4net, NLog, Serilog,
  logback, web.config, appsettings), rutas de archivos, tablas de log o
  herramienta centralizada (Sentry, App Insights, Kibana, Grafana).
- Qué escribe el código en ese flujo: el texto exacto del mensaje, nivel
  y datos que incluye, buscando las llamadas al logger.
- Ventana de tiempo e identificadores del caso.

Pasos:

- Dónde: archivo, tabla o herramienta, con su ruta o nombre real.
- Qué buscar: el texto exacto o el filtro listo para pegar, el
  identificador y la ventana de tiempo.
- Si es una tabla de log, la consulta como en DATOS.

## Navegador (NAVEGADOR)

Resuelve antes:

- La pantalla y la acción que dispara la petición.
- La URL o el fragmento de ruta del endpoint, desde el código del
  cliente o las rutas del servidor.

Pasos:

1. Abre las herramientas de desarrollo en la pestaña Red y filtra por
   `<fragmento de ruta real>`.
2. Haz la acción en la pantalla.
3. Pégame el status, el cuerpo de la petición y el de la respuesta (o la
   consola, si hay un error de JavaScript).

## Depuración (DEBUG)

Es lo último. Antes, confirma que lo más barato no distingue entre las
hipótesis abiertas.

Resuelve antes:

- Unidad a ejecutar y cómo arrancarla, según SETUP.md. Si no se sabe,
  advierte que puede requerir preparar el entorno y cuánto tiempo.
- Puntos de interrupción: archivo, línea y método, donde se toma la
  decisión o se calcula el valor. Condición si la entrada se repite.
- Cómo disparar el flujo con los datos del caso concreto.
- Qué inspeccionar: variables o expresiones exactas.
- Qué valor se espera según cada hipótesis.

Pasos:

1. Abre `<solución real>` con `<unidad real>` como proyecto de inicio.
2. Punto de interrupción en `<archivo>:<línea>` (`<método>`), con
   condición `<expresión>` si aplica.
3. Dispara el flujo: <pantalla, endpoint, job o test> con <datos reales>.
4. Al detenerse, pégame el valor de `<expresiones>`.
5. Si <valor A>, es <hipótesis>; si <valor B>, se descarta.

## Observación (OBSERVACION)

Resuelve antes: dónde se observa (nombre de la cola, carpeta de salida,
buzón), desde configuración, y qué identificador o texto buscar.

Pasos: dónde mirar y qué buscar, con nombres reales; qué pegar.

## Edición de un archivo (EDICION)

Resuelve antes:

- Ruta y líneas ancla (el texto que rodea el cambio).
- Codificación y fin de línea, si se pudieron saber.
- El texto exacto a poner.

Pasos:

1. Haz una copia del archivo en la misma carpeta con otro nombre.
2. Ábrelo con un editor que conserve la codificación (el del IDE propio
   de esa tecnología, o uno que la muestre); no con el editor del
   asistente.
3. Busca el texto ancla y reemplázalo por el texto exacto que va en el
   bloque.
4. Guarda con la misma codificación.
5. Abre la pantalla o página y confirma que los acentos se ven igual.
