# Índice de skills de LegacyForge

Lo único que un asistente ve de cada skill antes de activarla: nombre,
descripción y cómo se invoca. Generado de los encabezados (0.4.2)
con `node scripts/indice-skills.mjs`.

## lf-analyze

- Invocación: la activa el asistente por su descripción, o el usuario con /.
- Archivo: `skills/lf-analyze/SKILL.md`
- Descripción: Úsala ante un requerimiento nuevo (funcionalidad o cambio con impacto funcional) o un defecto ya diagnosticado cuya corrección no es obvia, antes de cambiar código. Entiende el punto focal y dónde más vive la regla, y define la mejor solución para este sistema: la que resuelve, arriesga lo mínimo, encaja con el código vecino y no deja la zona peor. Soporta iteraciones y cuestionamientos sin perder lo acordado. No la uses para cambios pequeños ya definidos (lf-change).

## lf-architecture

- Invocación: solo si el usuario la invoca con / (o $ en Codex).
- Archivo: `skills/lf-architecture/SKILL.md`
- Descripción: Genera o actualiza ARCHITECTURE.md: un resumen de cómo está construido el proyecto según su código (partes, tecnologías, cómo se conectan, organización de carpetas, convenciones visibles) y dónde encontrar cada cosa por concepto. No hace preguntas. Solo se ejecuta por invocación directa.

## lf-branch

- Invocación: la activa el asistente por su descripción, o el usuario con /.
- Archivo: `skills/lf-branch/SKILL.md`
- Descripción: Úsala al empezar a trabajar un requerimiento, user story o corrección, cuando se pida algo que podría estar fuera de su alcance, antes de que el desarrollador pruebe los cambios en otro equipo, y cuando pida eliminar una rama. Cada sesión trabaja un solo requerimiento en su propia rama de git; confirma ahí los cambios aplicados y la sube para que el desarrollador la descargue y pruebe donde quiera.

## lf-change

- Invocación: la activa el asistente por su descripción, o el usuario con /.
- Archivo: `skills/lf-change/SKILL.md`
- Descripción: Úsala antes de crear, editar o borrar cualquier archivo de código, configuración, dependencias, build, infraestructura, CI o base de datos (fix, refactor, feature o cambio de configuración). Evalúa el riesgo con el mapa del punto focal, plantea el cambio con el detalle técnico justo, pide autorización con el token APPLY, lo aplica conservando el formato del archivo y lo prueba con lf-test.

## lf-core

- Invocación: solo la activa el asistente por su descripción; no aparece en el menú /.
- Archivo: `skills/lf-core/SKILL.md`
- Descripción: Úsala al recibir cualquier pedido de trabajo sobre el proyecto, antes de elegir otra skill, cada vez que un resultado cambie el plan, y cuando la ruta normal no esté disponible (el entorno no corre, no se puede probar, falta una herramienta). Es el criterio del copiloto: entiende el objetivo, decide cuánto rigor merece, qué entender antes de tocar, qué hace él y qué le pide al desarrollador, cuándo preguntar o debatir y cómo conversar.

## lf-debate

- Invocación: la activa el asistente por su descripción, o el usuario con /.
- Archivo: `skills/lf-debate/SKILL.md`
- Descripción: Úsala antes de presentar una propuesta con señales de rigor (dinero, datos, contratos, difícil de revertir, regla repetida) para someterla a crítica, cuando el desarrollador no está de acuerdo o pregunta si estás seguro, y cuando pide comparar opciones, pros y contras o un abogado del diablo. Busca la mejor objeción y el dato que decide la discusión, propone cómo comprobarlo y deja registrado quién decidió y por qué.

## lf-delegate

- Invocación: solo la activa el asistente por su descripción; no aparece en el menú /.
- Archivo: `skills/lf-delegate/SKILL.md`
- Descripción: Úsala cuando necesites un dato o una acción que no puedes obtener por ti mismo (probar en la aplicación, consultar la base de datos, ejecutar o compilar en el equipo del desarrollador, ver logs, trazas o el navegador, observar un sistema externo), y cuando el desarrollador se atore en una tarea o herramienta. El desarrollador se vuelve tu copiloto: le pasas instrucciones puntuales, listas para copiar y pegar, y gestionas la iteración hasta resolver o cambiar de estrategia.

## lf-diagnose

- Invocación: la activa el asistente por su descripción, o el usuario con /.
- Archivo: `skills/lf-diagnose/SKILL.md`
- Descripción: Úsala cuando se reporte un comportamiento inesperado, un error o una user story que describe un problema, antes de proponer o desarrollar una solución. Simula el caso sobre el código, formula hipótesis, consigue la observación más barata que las separa (código, historial, captura, request del navegador, trazas, logs, datos; el debug al final) y llega a la causa raíz con su evidencia. No modifica código.

## lf-explain

- Invocación: la activa el asistente por su descripción, o el usuario con /.
- Archivo: `skills/lf-explain/SKILL.md`
- Descripción: Úsala cuando pregunten qué hace un fragmento de código, archivo, módulo o sistema, para qué sirve, cómo funciona, de dónde se llama, qué afecta o por qué está así. Lo cuenta como el proceso de negocio que implementa, con el porqué que dejan el código, los commits y los comentarios, y da el detalle técnico si aporta o lo piden. No modifica archivos.

## lf-help

- Invocación: la activa el asistente por su descripción, o el usuario con /.
- Archivo: `skills/lf-help/SKILL.md`
- Descripción: Guía de uso de LegacyForge. Úsala cuando el desarrollador pregunte cómo usar estas skills, qué puede hacer, por dónde empezar o qué sigue, cuando las acaba de instalar, o cuando invoque /lf-help. Revisa el estado del proyecto y recomienda el siguiente paso, breve.

## lf-init

- Invocación: solo si el usuario la invoca con / (o $ en Codex).
- Archivo: `skills/lf-init/SKILL.md`
- Descripción: Inicializa o actualiza la documentación del proyecto para personas y agentes. Resume a partir del código, en este orden, cómo correrlo (lf-setup), cómo está construido (lf-architecture) y para qué existe (lf-product), y crea o actualiza AGENTS.md para que referencie esos documentos sin repetirlos. Una sola confirmación al final. Solo se ejecuta por invocación directa.

## lf-memory

- Invocación: la activa el asistente por su descripción, o el usuario con /.
- Archivo: `skills/lf-memory/SKILL.md`
- Descripción: Úsala al empezar a trabajar en un proyecto para recuperar lo que ya se aprendió, al cerrar un requerimiento o confirmar algo que costó averiguar para guardarlo, y cuando el desarrollador diga recuerda, olvida o pregunte qué se sabe o qué quedó pendiente. Mantiene en la carpeta .legacyforge del proyecto el conocimiento confirmado del sistema y del negocio, las zonas frágiles, las decisiones, el criterio del desarrollador, las oportunidades y el estado de cada sesión.

## lf-optimize

- Invocación: la activa el asistente por su descripción, o el usuario con /.
- Archivo: `skills/lf-optimize/SKILL.md`
- Descripción: Úsala cuando algo funciona pero va lento o consume de más, aunque el desarrollador no diga optimizar (tarda minutos, se traba), o cuando hay que modernizar una parte (versión de framework, librería sin soporte, patrón obsoleto) sin cambiar lo que hace. Mide antes, busca la causa con evidencia, plantea pasos pequeños y reversibles que encajen con el sistema y mide después de cada uno. Cada cambio pasa por lf-change y su APPLY.

## lf-product

- Invocación: solo si el usuario la invoca con / (o $ en Codex).
- Archivo: `skills/lf-product/SKILL.md`
- Descripción: Genera o actualiza PRODUCT.md: para qué existe el proyecto según lo que hay en el código (qué es, procesos de negocio, funcionalidades, datos principales, integraciones y roles) más lo que ya se confirmó del negocio en sesiones anteriores. No hace preguntas ni ordena por importancia. Solo se ejecuta por invocación directa.

## lf-propose

- Invocación: la activa el asistente por su descripción, o el usuario con /.
- Archivo: `skills/lf-propose/SKILL.md`
- Descripción: Úsala cuando, trabajando en otra cosa, aparezca algo que conviene mejorar o vigilar (un riesgo latente, deuda que estorba, un refactor que no cabe en la tarea, una simplificación, falta de pruebas), al terminar un trabajo para sugerir el siguiente paso, y cuando el desarrollador pregunte qué mejorarías, qué sigue o qué pendientes hay. Registra cada oportunidad con evidencia, decide si interrumpir o esperar, y prepara el reporte para quien decide sin mezclarlo con la tarea en curso.

## lf-setup

- Invocación: solo si el usuario la invoca con / (o $ en Codex).
- Archivo: `skills/lf-setup/SKILL.md`
- Descripción: Genera SETUP.md: un resumen de lo que hay en el código para poner a correr el proyecto (aplicaciones, requisitos y versiones declaradas, configuración, comandos encontrados y lo que no se encontró). No hace preguntas: el desarrollador agrega lo que sepa, si quiere. Solo se ejecuta por invocación directa.

## lf-team

- Invocación: solo la activa el asistente por su descripción; no aparece en el menú /.
- Archivo: `skills/lf-team/SKILL.md`
- Descripción: Úsala cuando un trabajo de lectura se puede repartir (mapear un flujo que cruza varias partes, buscar consumidores o los otros lugares de una regla en varios repositorios, leer el historial de una zona, explorar varias hipótesis a la vez) o cuando hace falta una mirada independiente: criticar una propuesta o verificar un cambio. Reparte encargos a subagentes de solo lectura, comprueba lo que devuelven y los integra. Si no hay subagentes, hace lo mismo en pasadas separadas.

## lf-test

- Invocación: la activa el asistente por su descripción, o el usuario con /.
- Archivo: `skills/lf-test/SKILL.md`
- Descripción: Úsala para probar un cambio: después de que lf-change lo aplica, o por separado para probar un cambio hecho a mano, confirmar que un problema ya no ocurre o revisar regresiones antes de liberar. Corre las verificaciones automáticas del proyecto, diseña los casos por riesgo (incluidos los otros lugares de la regla y los consumidores) y le pasa al desarrollador, listos para ejecutar, los que no puede correr por sí misma.
