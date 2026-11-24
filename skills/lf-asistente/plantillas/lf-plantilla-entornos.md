# Ficha de ambiente

Una por ambiente, en `memoria/entornos.md`. Lo deducido del código va
marcado "(supuesto)" hasta que el humano lo confirme. Nunca credenciales.

```
### <DEV | QA | UAT | PROD | …>
Servidores: <cuántos, nombres> (supuesto|confirmado)
Balanceador y afinidad: <sí/no, sticky por cookie/IP, sin afinidad>
Sesión: <en memoria del proceso | servidor de estado | base | cache>
Reciclado: <cada cuánto se reinicia la app o el pool>
Reloj y zona horaria: <servidor, base, si difieren>
Base de datos: <motor, versión, nombre de la base>
Configuración que difiere: <claves que cambian contra otros ambientes>
Procesos programados: <qué corre y cuándo>
Integraciones: <a qué contraparte apunta>
Quién manda: <responsable, si se sabe>
Confirmado por el humano: <AAAA-MM-DD | pendiente>
```

Uso: el Simulador de caso recorre cada caso en el contexto de la ficha
que aplica. Si falta un dato que separa hipótesis, se pide en una línea
diciendo qué decide (lf-entornos).
