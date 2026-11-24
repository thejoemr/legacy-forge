# Proyecto de trabajo

La carpeta abierta puede contener varios proyectos. Antes de explorar:

1. Si ya se fijó un proyecto en la sesión, úsalo.
2. Si la carpeta es un repositorio, ese es el proyecto.
3. Si contiene varios repositorios:
   - Cada repositorio es un proyecto propio.
   - Una carpeta sin `.git` que agrupa repositorios es un solo proyecto
     si hay evidencia de que forman una aplicación: docker-compose o
     scripts compartidos, referencias de uno a URLs, puertos o colas de
     otro, o un prefijo común. Sin esa evidencia, cada uno es un
     proyecto.
   - Sin git, cada subcarpeta con su propio archivo de proyecto (`.sln`,
     `.vbp`, `.dpr`, `.pbt`, `pom.xml`, `build.xml`, `Makefile`) es un
     proyecto.
4. Si el humano nombró el proyecto, o los archivos que mencionó están en
   uno, úsalo y dilo en una línea. Si no, pregunta cuál, con hasta 3
   candidatos (los más recientes) y la opción de indicar otro.
5. Todo se limita a ese proyecto: lecturas, agentes, documentos, memoria,
   expediente y ramas.
