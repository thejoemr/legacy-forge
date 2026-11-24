---
name: lf-memoria
description: "Guardar entre sesiones lo confirmado: sistema, negocio, ambientes, decisiones y criterio del humano. Al confirmar algo y al cerrar."
---

# lf-memoria

Solo la usa el asistente para escribir; los agentes la leen.

## Para qué

No empezar de cero cada sesión, y que el humano controle qué se
recuerda.

## Dónde

Archivos y ubicación en `../lf-asistente/references/almacenes.md`. El
humano eligió dónde vive al iniciar; puede verla, corregirla y borrarla.

## Qué se guarda

Solo lo confirmado que costó averiguar:

- Sistema: causas confirmadas, zonas frágiles, consumidores delicados,
  dependencias dinámicas difíciles de encontrar.
- Negocio: términos y reglas con su fuente y quién confirmó.
- Entornos: fichas confirmadas.
- Decisiones y disensos (lf-plantilla-registro).
- Sugerencias aceptadas y rechazadas, con su razón.
- Calibración: qué hipótesis fue la causa y en qué lugar iba.
- Criterio del humano: cómo prefiere trabajar ("quiere ver nombres de
  clase", "commits pequeños", "no tocar el módulo de nómina").

## Cómo

1. Al confirmar algo, anótalo en `pendientes.md` del expediente (D0).
2. Guarda cuando hay una pausa natural o al cerrar, y dile en una línea
   qué guardaste: "guardé que el folio fiscal lo genera el timbrado".
3. Si el humano corrige u olvida algo, se corrige o se borra en ese
   momento.
4. Una entrada: lo confirmado, su evidencia (cita), fecha y quién lo
   confirmó. Corta.
5. Antes de usar una entrada vieja de la zona, ten presente su fecha: el
   código pudo cambiar.

## Decide

El humano: dónde vive, qué se queda y qué se borra.

## Límites

- Nunca secretos, credenciales ni datos personales.
- La memoria es mapa, no evidencia: lo que guía la búsqueda se vuelve a
  comprobar si sostiene una decisión.
