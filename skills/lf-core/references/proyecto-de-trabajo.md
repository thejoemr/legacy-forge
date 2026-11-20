# Proyecto de trabajo

Referencia común. La carpeta abierta (workspace) puede contener varios
proyectos independientes. Antes de explorar, fija el proyecto de trabajo:

1. Si ya se fijó un proyecto en esta sesión, úsalo.
2. Si la carpeta abierta es un repositorio, ese es el proyecto.
3. Si contiene varios repositorios, identifica los candidatos:
   - Cada repositorio es un proyecto propio.
   - Una carpeta sin .git que agrupa varios repositorios es un solo
     proyecto (por ejemplo, microservicios) si hay evidencia de que
     forman una aplicación: docker-compose o scripts compartidos,
     referencias de uno a URLs, puertos o colas de otro, o un prefijo
     común en los nombres. Sin esa evidencia, cada repositorio es un
     proyecto.
   - Sin git, cada subcarpeta con su propio archivo de proyecto (.sln,
     .vbp, .dpr, .pbt, pom.xml, build.xml, Makefile) es un proyecto.
4. Si el desarrollador nombró el proyecto, o los archivos que mencionó
   están en uno, usa ese y dilo en una línea. Si no, pregunta cuál,
   mostrando hasta 3 candidatos (los más recientes según git log o, sin
   git, por fecha de modificación) y la opción de indicar otro.
5. Todo se limita a la carpeta del proyecto: exploración, búsquedas,
   documentos, memoria y ramas. No leas los demás proyectos.
6. Los documentos del proyecto (SETUP.md, ARCHITECTURE.md, PRODUCT.md,
   AGENTS.md) van en su carpeta raíz.

En las skills, "workspace" significa la carpeta del proyecto de trabajo.
