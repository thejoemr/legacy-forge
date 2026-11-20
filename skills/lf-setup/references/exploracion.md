# Archivos a leer

Lee los archivos que existan de estas listas en cada nivel: raíz del
proyecto, raíz de cada repositorio y carpeta de cada aplicación. Respeta
la regla de secretos.

Proyecto y dependencias:

- JavaScript/TypeScript: package.json, package-lock.json, yarn.lock,
  pnpm-lock.yaml.
- .NET: *.sln, *.csproj, *.vbproj, *.fsproj, packages.config,
  Directory.Build.props.
- Java: pom.xml, build.gradle, build.gradle.kts, build.xml (Ant).
- Python: requirements*.txt, pyproject.toml, setup.py, Pipfile.
- Otros: go.mod, Gemfile, composer.json, *.vcxproj, CMakeLists.txt.

Versiones fijadas:

- .nvmrc, .node-version, .python-version, .java-version, .tool-versions.
- global.json.
- Campo "engines" de package.json.
- TargetFramework o TargetFrameworkVersion en archivos .NET.
- maven.compiler.source o release en pom.xml.

Arranque:

- docker-compose*.yml, compose*.yml, Dockerfile, .devcontainer/.
- Makefile, scripts/, *.sh, *.ps1, *.bat, *.cmd.
- launchSettings.json, Procfile.
- Mainframe: *.jcl, *.proc y miembros de PROCLIB. De *.cbl y *.cpy lee
  solo la cabecera (IDENTIFICATION y ENVIRONMENT DIVISION) y los nombres
  de archivos y pasos, no el programa completo.
- Por lotes en Windows o Unix: tareas programadas exportadas (*.xml de
  schtasks), crontab, scripts de cierre o de carga.

Configuración:

- Plantillas de entorno: .env.example, .env.sample, .env.template.
- .NET: appsettings.json, appsettings.Development.json, web.config,
  app.config.
- Java: application*.yml, application*.properties.
- Feeds privados: .npmrc, .yarnrc.yml, nuget.config, settings.xml (Maven),
  pip.conf.

Base de datos:

- Scripts y migraciones: migrations/, db/, sql/, *.sql, Flyway, Liquibase,
  Entity Framework Migrations.

CI:

- .github/workflows/*.yml, azure-pipelines.yml, .gitlab-ci.yml,
  Jenkinsfile, bitbucket-pipelines.yml.

Documentación:

- README*, CONTRIBUTING*, docs/.
- Excluye SETUP.md: no es fuente de datos.

Registra la evidencia del IDE o herramienta de compilación requerida:

- Cabecera de archivos .sln: "Format Version" y "VisualStudioVersion"
  indican la versión de Visual Studio con que se creó.
- Proyectos .NET Framework con formato antiguo de .csproj o .vbproj (sin
  atributo Sdk): requieren Visual Studio o MSBuild de Windows; no compilan
  con dotnet build.
- Proyectos con atributo Sdk en .csproj: compilan con dotnet build desde
  cualquier editor.
- Archivos de otros IDEs: .project y .classpath (Eclipse), .idea/
  (IntelliJ), *.vbp (VB6), *.dpr (Delphi), *.pbt (PowerBuilder).
- Tipos de proyecto que dependen de un IDE concreto: reportes (.rdl, .rpt),
  paquetes SSIS (.dtsx), diseñadores visuales.

Registra también la evidencia del sistema operativo objetivo:

- Scripts solo .ps1, .bat o .cmd: indica Windows.
- Scripts solo .sh: indica Linux o macOS.
- .NET Framework (no .NET Core ni .NET 5+), IIS, Windows Services o
  web.config: indica Windows.
- Sistema operativo de los agentes de CI (runs-on, vmImage, pool).

