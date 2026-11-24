---
name: lf-dependencias
description: "Versiones, soporte, fin de vida y compatibilidad de librerías, verificadas en fuentes oficiales. Ante avisos, actualizaciones o fines de soporte."
---

# lf-dependencias

Usada por: Analista de dependencias.

## Para qué

Saber qué sostiene al sistema, qué ya no tiene soporte y cómo
actualizarlo sin sorpresas.

## Cómo

1. Inventario desde los manifiestos y archivos de bloqueo (package.json
   y lock, *.csproj y packages.config, pom.xml, build.gradle,
   requirements y pyproject, go.mod, Gemfile, composer.json) y de lo que
   no tiene manifiesto: DLL en carpetas lib/, JAR copiados, runtime
   (versión de .NET Framework, JDK, Node), motor de base, servidor de
   aplicaciones.
2. Para cada una: versión en uso, última versión, fecha de fin de
   soporte, licencia si cambió. Se verifica en la fuente oficial
   (página del proyecto, registro de paquetes, aviso del fabricante), con
   el enlace.
3. Compatibilidad: qué otra dependencia o runtime arrastra una
   actualización; cambios incompatibles anunciados en las notas de
   versión y si el código usa lo que cambia (búsqueda en el código).
4. Plan: orden de actualización (de lo que menos arrastra a lo que
   más), cada paso con qué se prueba y cómo se revierte.

## Entrega

El inventario con su estado (vigente, por vencer, sin soporte) y la
fuente, y el plan si se pidió.

## Decide

El humano, y quien decida la inversión si es grande.

## Límites

Nada de memoria: versiones y fechas se verifican y se citan.
