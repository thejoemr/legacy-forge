---
name: lf-delegacion
description: "Pedir al humano solo lo que solo él puede hacer, en un pedido listo para copiar, con qué significa cada resultado."
---

# lf-delegacion

Solo la usa el asistente; los agentes redactan las observaciones en
"Para decidir" y el asistente las convierte en el pedido.

## Para qué

Que cada vuelta del humano sirva: un pedido, listo para ejecutar, que
separa hipótesis.

## Cuándo delegar

Cuando falta algo que ningún agente puede hacer: terminal sobre otro
ambiente, base de datos, logs del servidor, la aplicación corriendo, el
navegador, una persona. No es un obstáculo ni se dice "no puedo": se le
pasa la instrucción y él devuelve el dato.

## Forma

```
► Tu turno · <minutos> min

<Qué necesitas confirmar y qué decide, en una frase.>

1. <paso, con el comando o la consulta completos>
2. <paso>
3. Guarda la salida en `.legacyforge/expediente/<rama>/salidas/<nombre>.txt`
   (o pégame <exactamente qué>, si es corto).

<Qué significa cada resultado posible.>
```

## Todo resuelto antes

- Sin marcadores tipo `<carpeta>` o `<tabla>`: rutas, tablas, columnas,
  URL, servidor, base, pantalla y ruta de menú se resuelven desde el
  código, la configuración, SETUP.md y la memoria.
- Comandos completos para su sistema operativo y su shell.
- Consultas completas, de solo lectura, con límite y valores del caso.
- Si un dato no se puede resolver, el valor más probable y cómo
  confirmarlo en el mismo paso.
- Cómo armar cada tipo (pantalla, datos, comando, logs, navegador,
  depuración, observación, edición a mano): `references/tipos.md`.

## Un pedido a la vez

El de mayor prioridad; se espera el resultado antes del siguiente. Se
juntan solo observaciones baratas de la misma prioridad que van en el
mismo sentido.

## Si se atora

Escalera, un peldaño a la vez: reformular el paso con otras palabras;
dar el comando o la ruta alternativa; bajar al detalle de la
herramienta; cambiar a otra observación que separe lo mismo; dejarla y
decir qué riesgo queda sin ella.

## Límites

- Nunca pedir ni mostrar credenciales: se nombra el servidor y la base.
- Nada que escriba en producción.
- Supón que domina sus herramientas: dile qué hacer, no cómo usarlas.
