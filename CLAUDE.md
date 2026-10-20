# Proyecto: gastos — Calculadora de gastos del mes

## Qué es
Página para anotar gastos y ver cuánto llevo gastado en el mes.
- Para quién: mi primo. Es para mostrarle que aprendí bien (proyecto 2 del método 0 a 100).
- Terminado cuando: puedo anotar un gasto (monto, moneda, categoría y fecha), ver el total del mes, ver el total por categoría, borrar un gasto, tener un presupuesto con alerta, y está publicado con un link que abre en el celular.

## Decisiones
- Solo HTML, CSS y JavaScript. Sin servidor.
- Los gastos se guardan en `localStorage` (la memoria del navegador). Cada persona ve solo sus propios gastos.
- Monedas: colones (₡) y dólares ($). Los totales van separados por moneda; no se convierte una en otra.
- Categorías fijas: Comida, Transporte, Casa, Servicios, Ocio, Otros.
- Un presupuesto mensual por moneda, el mismo para todos los meses. La barra se pone naranja al 80% y roja si me paso.
- Selector de mes arriba: los totales y la lista muestran solo el mes elegido (arranca en el mes actual).

## Cómo se corre
Abre `index.html` con doble clic en el navegador.

## Archivos
- `index.html`: la página.
- `estilos.css`: los estilos (color principal verde azulado #0e7466).
- `app.js`: la lógica.

## Plan
1. [x] Preparar el proyecto (carpeta, git, archivos base).
2. [x] Formulario y lista de gastos, guardados en localStorage, con botón para borrar.
3. [x] Total del mes por moneda y total por categoría.
4. [x] Presupuesto con alerta (barra que se pone roja).
5. [ ] Pulir para celular y publicar.

## Próximo paso
Paso 5: pulir para celular y publicar.
