# Proyecto: gastos — Calculadora de gastos del mes

## Qué es
Página para anotar gastos y ver cuánto llevo gastado en el mes.
- Para quién: mi primo. Es para mostrarle que aprendí bien (proyecto 2 del método 0 a 100).
- Terminado cuando: puedo anotar un gasto (monto, moneda, categoría y fecha), ver el total del mes, ver el total por categoría, borrar un gasto, tener un presupuesto con alerta, y está publicado con un link que abre en el celular.
- Estado: **TERMINADO** (20/10/2026).

## Link publicado
https://gamesandpages.github.io/gastos/
(repositorio: https://github.com/gamesandpages/gastos)

## Decisiones
- Solo HTML, CSS y JavaScript. Sin servidor.
- Los gastos se guardan en `localStorage` (la memoria del navegador). Cada persona ve solo sus propios gastos. Los datos no pasan de un navegador a otro (ni de la compu al celular).
- Monedas: colones (₡) y dólares ($). Los totales van separados por moneda; no se convierte una en otra.
- Categorías fijas: Comida, Transporte, Casa, Servicios, Ocio, Otros.
- Un presupuesto mensual por moneda, el mismo para todos los meses. La barra se pone naranja al 80% y roja si me paso.
- Selector de mes arriba: los totales y la lista muestran solo el mes elegido (arranca en el mes actual).
- Los campos de número bloquean `e`, `+` y `-`.

## Cómo se corre
- En la compu: abre `index.html` con doble clic en el navegador.
- Publicado: abre el link de arriba.

## Cómo se publica un cambio
1. Hacer el cambio y probarlo con doble clic en `index.html`.
2. `git add -A` y `git commit -m "mensaje"`.
3. `git push`. GitHub Pages actualiza el link solo en 1-2 minutos.

## Archivos
- `index.html`: la página.
- `estilos.css`: los estilos (color principal verde azulado #0e7466).
- `app.js`: la lógica.

## Plan
1. [x] Preparar el proyecto (carpeta, git, archivos base).
2. [x] Formulario y lista de gastos, guardados en localStorage, con botón para borrar.
3. [x] Total del mes por moneda y total por categoría.
4. [x] Presupuesto con alerta (barra que se pone roja).
5. [x] Pulir para celular y publicar (GitHub Pages).

## Ideas para después (opcionales)
- Editar un gasto ya anotado.
- Exportar los gastos a un archivo, para no perderlos si se borra la memoria del navegador.

## Próximo paso
Mostrarle el link a mi primo. El proyecto está terminado.
