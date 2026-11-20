---
name: lf-team
description: "Úsala cuando un trabajo de lectura se puede repartir (mapear un flujo que cruza varias partes, buscar consumidores o los otros lugares de una regla en varios repositorios, leer el historial de una zona, explorar varias hipótesis a la vez) o cuando hace falta una mirada independiente: criticar una propuesta o verificar un cambio. Reparte encargos a subagentes de solo lectura, comprueba lo que devuelven y los integra. Si no hay subagentes, hace lo mismo en pasadas separadas."
user-invocable: false
---

# lf-team

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. El desarrollador no
necesita saber cómo se repartió el trabajo. Como mucho, una línea:
"revisé en paralelo los tres servicios que usan esto".

## Principio

lf-delegate reparte trabajo al desarrollador: lo que el copiloto no puede
ver ni ejecutar. Esta skill reparte trabajo a otros agentes: lo que el
copiloto sí puede hacer, pero conviene hacer en paralelo, en segundo
plano o con ojos que no conozcan su razonamiento.

## Roles

- lf-explorador: localiza y resume. Flujos, consumidores, dónde más vive
  una regla, qué cambió en el historial y por qué (commits y
  comentarios).
- lf-critico: ataca una propuesta. Evidencia débil, alternativa más
  simple, consumidor u otro lugar de la regla olvidado, falta de encaje
  con el código vecino, parches que sostienen algo y escenario de falla.
- lf-verificador: comprueba una afirmación o un cambio contra el código y
  diseña casos que intenten romperlo.
- lf-escenarios: recorre un flujo bajo una familia de condiciones
  (tiempo, concurrencia, infraestructura, datos, conducta del usuario) y
  en los contextos de la ficha de entornos, sin ejecutarlo. Devuelve los
  escenarios que resuelven la duda y la receta para forzarlos
  (`../lf-core/references/simulacion.md`).

Son los archivos de la carpeta `agents` del paquete. Claude Code los lee
de `.claude/agents/`; Copilot en VS Code lee esa misma carpeta y también
`.github/agents/`. Decide tú:

- Si los agentes lf- están disponibles, úsalos.
- Si no, pero puedes lanzar subagentes, usa uno genérico con el encargo
  completo y los límites escritos.
- Si no puedes lanzar subagentes, "Sin subagentes". No lo consultes.

## Reglas obligatorias

- R1. Solo lectura. Un subagente nunca crea, edita ni borra archivos,
  nunca hace commit ni ejecuta comandos que cambien estado. Ningún APPLY
  se traslada a un subagente.
- R2. Mismos límites que tú: el proyecto de la sesión, sin leer archivos
  de secretos, sin reproducir valores secretos. Van escritos en cada
  encargo.
- R3. Un subagente no habla con el desarrollador ni decide por él.
- R4. Lo que devuelve es una pista, no evidencia. Antes de apoyar en ello
  una propuesta, abre tú las citas clave. Si una no coincide, descarta
  ese hallazgo y desconfía del resto del informe.
- R5. Reparte solo si ahorra. No una búsqueda que cabe en dos o tres
  lecturas, ni algo que depende de matices de la conversación.
- R6. Máximo 3 subagentes a la vez, y un solo nivel.
- R7. El crítico, el verificador y el de escenarios reciben la propuesta
  o la duda y la evidencia, no tu razonamiento ni tu preferencia.
- R8. Encargos sin solapamiento.

## Cuándo repartir

- Explorar: 3 o más búsquedas independientes, o más de una unidad o
  repositorio. Por ejemplo, un explorador por cada lugar donde podría
  vivir la regla (código, base de datos, reportes).
- Hipótesis en paralelo: en un diagnóstico, una por explorador, cada uno
  buscando qué la confirma y qué la descarta.
- Escenarios: cuando una señal de `simulacion.md` pide variar
  condiciones o contextos. Un agente lf-escenarios por familia de
  condiciones, sin que vean las conclusiones de los otros.
- Crítica: toda propuesta con señales de rigor (lf-debate la pide).
- Verificación: antes de dar por bueno un cambio de riesgo alto, y para
  diseñar casos adversos (lf-test).

## En segundo plano

Si el asistente permite que un subagente trabaje mientras la
conversación sigue, úsalo para encargos que no bloquean el siguiente
mensaje, sobre todo escenarios y exploraciones largas:

- Lánzalo y sigue conversando. No le digas al desarrollador que esperas
  un resultado, salvo que lo que sigue dependa de él.
- Si la conversación resuelve la duda antes de que vuelva, descarta el
  resultado sin mencionarlo.
- Si vuelve primero, intégralo (E3) y dilo en una o dos líneas en tu
  siguiente mensaje.
- Si el asistente no lo permite, el encargo corre antes de responder; si
  es largo, primero responde lo que ya sabes.

## Estados

### E1. Partir

1. La pregunta que necesitas responder, en una frase.
2. Divídela en partes independientes, cada una con qué respuesta la da
   por terminada.
3. Un rol por parte.

### E2. Encargar

Cada encargo es autosuficiente. Incluye, en este orden:

    Objetivo: <la pregunta, en una frase.>
    Contexto: <lo mínimo para entenderla: qué hace el sistema aquí, en
      2 o 3 frases, en términos del negocio. Sin tu hipótesis favorita
      si es crítico, verificador o de escenarios.>
    Dónde: <carpeta del proyecto y, si se sabe, por dónde empezar.>
    Límites: solo lectura; no salir de <proyecto>; no leer .env,
      secrets.json, *.pfx, *.pem, *.key ni user-secrets; no reproducir
      valores secretos.
    Devuelve:
      - Respuesta en 1 o 2 frases.
      - Hallazgos, cada uno con ruta y línea o commit.
      - Lo explícito (commits, comentarios) separado de lo deducido, si
        se pregunta por un porqué.
      - Confianza: alta, media o baja, y por qué.
      - Lo que no revisaste.
    Tope: detente al responder la pregunta o al revisar <alcance>.

Para lf-escenarios, agrega la familia de condiciones a variar, la ficha
de entornos con lo confirmado y lo supuesto, y lo ya descartado.

### E3. Integrar

1. Separa lo que responde la pregunta de lo que no.
2. Comprueba las citas clave (R4). En un escenario, recorre tú el paso
   donde se desvía.
3. Si dos informes se contradicen, resuelve con el código. Si no basta,
   es una duda abierta: lf-debate o una comprobación con lf-delegate.
4. "No encontré" no es prueba de ausencia: mira qué declaró no haber
   revisado.
5. Hechos, supuestos y dudas al mapa interno (lf-core). Lo que un
   subagente vio fuera de la pregunta va a lf-propose.

### E4. Segunda ronda

Solo si queda una duda que cambia la decisión. Un encargo más, acotado.
Si tampoco se resuelve, deja de repartir y dilo.

## Sin subagentes

Haz los mismos encargos como pasadas separadas, una por rol:

1. Escribe el encargo igual que en E2.
2. Hazlo tú, limitado a ese encargo, y escribe el informe antes de
   empezar el siguiente.
3. En la pasada de crítica o verificación, empieza por el lado contrario:
   primero las razones por las que la propuesta falla, después las que la
   sostienen. En la de escenarios, empieza por los casos que contradicen
   tu hipótesis actual. Usa solo lo que está en la propuesta y en el
   código.

Es más lento y menos independiente. Si la decisión es de riesgo alto,
dilo en una línea y ofrece una comprobación del desarrollador
(lf-delegate) como contrapeso.
