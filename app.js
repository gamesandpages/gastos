// Al abrir la página, la fecha arranca con el día de hoy.
// toISOString da la hora en UTC, así que restamos la diferencia
// horaria para no caer en el día de mañana por la noche.
const hoy = new Date();
hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
document.getElementById("fecha").value = hoy.toISOString().slice(0, 10);

// --- Guardar gastos en localStorage ---
// localStorage solo guarda texto, así que convertimos la lista
// a texto con JSON.stringify y de vuelta con JSON.parse.
const CLAVE = "gastos";

function leerGastos() {
    const texto = localStorage.getItem(CLAVE);
    return texto ? JSON.parse(texto) : [];
}

function guardarGastos(gastos) {
    localStorage.setItem(CLAVE, JSON.stringify(gastos));
}

const form = document.getElementById("form-gasto");

form.addEventListener("submit", function (evento) {
    // Evita que la página se recargue al enviar el formulario.
    evento.preventDefault();

    const gasto = {
        id: Date.now(), // número único para poder borrarlo después
        monto: Number(document.getElementById("monto").value),
        moneda: document.getElementById("moneda").value,
        categoria: document.getElementById("categoria").value,
        fecha: document.getElementById("fecha").value
    };

    const gastos = leerGastos();
    gastos.push(gasto);
    guardarGastos(gastos);
    mostrarGastos();

    // Limpia el monto para anotar el siguiente; lo demás se queda igual.
    document.getElementById("monto").value = "";
    document.getElementById("monto").focus();
});

// --- Mostrar la lista de gastos ---
const SIMBOLOS = { CRC: "₡", USD: "$" };

function formatearMonto(monto, moneda) {
    // toLocaleString pone separadores de miles: 12500 -> "12 500".
    return SIMBOLOS[moneda] + monto.toLocaleString("es-CR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function formatearFecha(fecha) {
    // La fecha viene como "2026-10-20". La partimos a mano en vez de usar
    // new Date(), que la tomaría en hora UTC y mostraría el día anterior.
    const [anio, mes, dia] = fecha.split("-");
    return dia + "/" + mes + "/" + anio;
}

function mostrarGastos() {
    const lista = document.getElementById("lista-gastos");
    const gastos = leerGastos();

    // Más nuevo primero: por fecha y, si es el mismo día, por orden de anotado.
    gastos.sort(function (a, b) {
        if (a.fecha !== b.fecha) {
            return a.fecha < b.fecha ? 1 : -1;
        }
        return b.id - a.id;
    });

    lista.innerHTML = "";
    document.getElementById("sin-gastos").hidden = gastos.length > 0;

    gastos.forEach(function (gasto) {
        const item = document.createElement("li");

        const info = document.createElement("div");
        const categoria = document.createElement("div");
        categoria.textContent = gasto.categoria;
        const detalle = document.createElement("div");
        detalle.className = "gasto-detalle";
        detalle.textContent = formatearFecha(gasto.fecha);
        info.append(categoria, detalle);

        const monto = document.createElement("span");
        monto.className = "gasto-monto";
        monto.textContent = formatearMonto(gasto.monto, gasto.moneda);

        const borrar = document.createElement("button");
        borrar.type = "button";
        borrar.className = "boton-borrar";
        borrar.textContent = "✕";
        borrar.title = "Borrar gasto";
        borrar.setAttribute("aria-label", "Borrar gasto");
        borrar.addEventListener("click", function () {
            borrarGasto(gasto.id);
        });

        const derecha = document.createElement("div");
        derecha.className = "gasto-derecha";
        derecha.append(monto, borrar);

        item.append(info, derecha);
        lista.append(item);
    });
}

// --- Borrar un gasto ---
function borrarGasto(id) {
    if (!confirm("¿Seguro que quieres borrar este gasto?")) {
        return;
    }
    // filter arma una lista nueva con todos los gastos menos el que tiene ese id.
    const gastos = leerGastos().filter(function (gasto) {
        return gasto.id !== id;
    });
    guardarGastos(gastos);
    mostrarGastos();
}

// Al abrir la página, mostramos lo que ya estaba guardado.
mostrarGastos();
