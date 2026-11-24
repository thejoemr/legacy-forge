# Archivos a leer para SETUP

Lee los que existan en la raíz del proyecto, de cada repositorio y de
cada aplicación. Respeta la regla de secretos.

Proyecto y dependencias: package.json y archivos de bloqueo; *.sln,
*.csproj, *.vbproj, packages.config, Directory.Build.props; pom.xml,
build.gradle, build.xml; requirements*.txt, pyproject.toml, setup.py,
Pipfile; go.mod, Gemfile, composer.json, *.vcxproj, CMakeLists.txt.

Versiones fijadas: .nvmrc, .node-version, .python-version,
.java-version, .tool-versions, global.json, "engines" de package.json,
TargetFramework, maven.compiler.source.

Arranque: docker-compose*.yml, Dockerfile, .devcontainer/, Makefile,
scripts/, *.sh, *.ps1, *.bat, launchSettings.json, Procfile. Mainframe:
*.jcl, PROCLIB y solo la cabecera de *.cbl y *.cpy. Por lotes: tareas
programadas exportadas, crontab, scripts de cierre o carga.

Configuración: .env.example y similares; appsettings*.json, web.config,
app.config; application*.yml o .properties; feeds privados (.npmrc,
nuget.config, settings.xml, pip.conf).

Base de datos: migrations/, db/, sql/, *.sql, Flyway, Liquibase, EF
Migrations.

CI: .github/workflows, azure-pipelines.yml, .gitlab-ci.yml,
Jenkinsfile, bitbucket-pipelines.yml.

Documentación: README*, CONTRIBUTING*, docs/. SETUP.md no es fuente.

IDE requerido: cabecera de .sln (VisualStudioVersion); .csproj sin
atributo Sdk requiere Visual Studio o MSBuild de Windows; con Sdk compila
con dotnet build. Otros: .project (Eclipse), .idea/, *.vbp (VB6), *.dpr
(Delphi), *.pbt (PowerBuilder); .rdl, .rpt, .dtsx dependen de su IDE.

Sistema operativo: solo .ps1/.bat indica Windows; solo .sh, Linux o
macOS; .NET Framework, IIS o web.config, Windows; runs-on y vmImage del
CI.
