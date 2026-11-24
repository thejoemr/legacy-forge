---
name: lf-explain
description: "Úsala cuando pregunten qué hace un fragmento de código, archivo, módulo o sistema, para qué sirve, cómo funciona, de dónde se llama, qué afecta o por qué está así. Lo cuenta como el proceso de negocio que implementa, con el porqué que dejan el código, los commits y los comentarios, y da el detalle técnico si aporta o lo piden. No modifica archivos."
---

# lf-explain

## Comunicación

Sigue `../lf-core/references/comunicacion.md`. Una explicación es un
mensaje informativo: se cuenta como el proceso de negocio, sin nombres de
métodos, archivos ni líneas salvo que el desarrollador los pida o la
pregunta sea técnica ("¿qué método llama a esto?"). Lo técnico general no
se explica; lo propio del proyecto y del negocio, sí.

## Definiciones

- Objetivo: el código que se pide explicar. Alcance: FRAGMENTO (función,
  método o bloque), MODULO (archivo, clase, paquete o carpeta) o SISTEMA
  (unidad completa o flujo que cruza varias).
- Evidencia: ruta y línea de un archivo del workspace, o un commit.
- Frontera: donde termina el análisis de una cadena de llamadas: un
  sistema externo, código de terceros o código fuera del alcance (de ese
  solo se dice qué hace a nivel de negocio).

## Reglas obligatorias

- Proyecto: solo el de la sesión.
- R1. El comportamiento se deduce del código, no de nombres ni
  comentarios. Los nombres son vocabulario del dominio.
- R2. Si un nombre o comentario contradice el código, gana el código, y
  la contradicción se menciona.
- R3. No inventes comportamiento. Lo que no se puede determinar se
  pregunta o se declara.
- R4. Solo lectura. Solo comandos de búsqueda, lectura y consultas de git.
- R5. Sin secretos: no leas archivos de secretos ni reproduzcas valores.
- R6. Una pregunta por mensaje y termina tu turno.
- R7. Responde en el idioma del desarrollador.

## Cómo explicar

### Qué entender

Usa el mapa de `../lf-core/references/punto-focal.md` como guía de lo que
hay que saber, con la profundidad del alcance:

- Para qué existe en el negocio.
- Quién lo usa: pantalla, endpoint, job, evento u otro código. Para cada
  consumidor, si alguien lo usa a su vez; si nadie, dilo (puede ser
  código sin uso o invocado de forma no rastreable).
- Qué recibe y qué lee: parámetros, base, configuración, archivos.
- Qué decide: condiciones, cálculos, validaciones, y qué valor manda a
  qué rama.
- Qué devuelve, escribe o dispara.
- Qué pasa cuando falla.
- Por qué está así: lo explícito (commits, comentarios) y lo implícito,
  separando cuál es cuál.
- Qué es raro, y si sostiene algo.

Sigue las cadenas de llamadas hasta una frontera. Para quién lo usa,
busca referencias directas y dinámicas (texto, SQL, configuración,
reflexión, plantillas, vistas), en otras unidades y, en lenguajes con
preprocesador, macros, alias y punteros a función.

Si algo esencial solo se ve en ejecución (qué datos hay, qué muestra una
pantalla, qué deja un proceso en el log), pídelo con lf-delegate, solo
lectura. Si el código está en un binario (.pbl, .fmb, .dfm binario,
.mdb), pide que lo exporte a texto y di qué no puedes ver mientras tanto.

Lo que falte y sea esencial (sin eso no puedes decir qué hace), se
pregunta, una por mensaje, empezando por la que puede eliminar otras. Lo
secundario no se pregunta: va como "queda por saber". Si es algo que
solo sabe el negocio, va como pregunta para el negocio, lista para pegar.

### Cómo contarlo

Prosa. Sin listas ni encabezados.

Primero el negocio: qué hace, cómo opera, qué procesos, personas o
sistemas dependen de él, por qué está así, las contradicciones entre
nombres, comentarios y código, y lo que queda por saber.

Después, solo si aporta algo que no se puede decir sin términos técnicos
o si lo pidieron, un párrafo técnico con la evidencia (ruta y línea).

Extensión según el alcance: FRAGMENTO, hasta 3 frases; MODULO, hasta
6; SISTEMA, hasta 10. Primero lo que responde la pregunta; lo demás se
ofrece en una línea, si cabe en la línea extra del mensaje
(`comunicacion.md`, Breve y preciso).

Una pregunta de seguimiento sobre un aspecto ("¿y quién la usa?", "¿y si
falla?") se responde solo en ese aspecto, en 1 a 3 frases.

Lo confirmado que costó averiguar (qué sostiene un parche, qué significa
un término) va a la memoria (lf-memory).
