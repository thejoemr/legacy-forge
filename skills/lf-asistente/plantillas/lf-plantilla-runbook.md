# Runbook

Para un fallo que se repite. Lo debe poder seguir alguien que no conoce
el sistema, a las 3 de la mañana. Sin credenciales.

```
# <Fallo> · runbook

Cómo se ve: <síntoma visible y dónde: alerta, pantalla, log, correo>
Cómo confirmarlo: <consulta o comando de solo lectura, completo, y qué
resultado lo confirma>

Mitigar:
1. <paso exacto, con servidor, ruta o pantalla reales>
2. <paso>
Quién puede hacerlo: <rol o área>

Verificar que se resolvió: <qué ver y dónde>

Revertir la mitigación, si empeora: <pasos>

Escalar a: <área> si <condición>
Causa conocida y arreglo de fondo: <referencia, o "pendiente">
Última revisión: <AAAA-MM-DD>
```
