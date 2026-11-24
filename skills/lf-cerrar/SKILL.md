---
name: lf-cerrar
description: "Cierra un requerimiento en orden: resumen, pendientes, disensos, memoria y textos para otras áreas. Solo con /lf-cerrar."
disable-model-invocation: true
---

# /lf-cerrar

Cuando el humano dice que terminó. Todo sale del expediente; no se
relee el sistema.

## 1. Revisar (D0)

- Cambios sin commit en archivos que tocó el asistente; rama y commits
  del requerimiento.
- Decisiones del caso: ¿quedó cada una registrada (lf-plantilla-registro)?
  ¿hay objeciones sin registrar?
- `pendientes.md`: memoria propuesta, oportunidades, sugerencias.
- Casos de prueba que el humano no confirmó.

## 2. Entregar, en un mensaje

1. Lo hecho, en dos o tres frases de negocio, y en qué rama quedó.
2. Lo que queda abierto, si hay: sin commit, pruebas sin confirmar,
   riesgos aceptados.
3. Lo que se guardará en la memoria, en una línea por entrada; el humano
   puede quitar o corregir antes de guardar (lf-memoria).
4. Textos listos para otras áreas que apliquen (resumen del cambio, nota
   de pruebas, reporte de deuda, avance para jefatura), en bloques para
   copiar. Los largos los prepara el Redactor.
5. Una pregunta: qué hacer con lo abierto (commit, dejarlo, revertir) y
   si guarda la memoria así.

## 3. Con su respuesta

- Guarda la memoria aceptada y una entrada en `memoria/sesiones.md`:
  fecha, requerimiento, rama, estado, lo abierto.
- Pregunta, solo si el expediente pesa, si se borra o se conserva.
- Los commits pendientes siguen lf-versiones (requieren su APPLY si no
  lo dio ya).
