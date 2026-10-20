// Al abrir la página, la fecha arranca con el día de hoy.
// toISOString da la hora en UTC, así que restamos la diferencia
// horaria para no caer en el día de mañana por la noche.
const hoy = new Date();
hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
document.getElementById("fecha").value = hoy.toISOString().slice(0, 10);

// El selector de mes arranca en el mes actual ("2026-10").
const MES_ACTUAL = hoy.toISOString().slice(0, 7);
const mesInput = document.getElementById("mes");
mesInput.value = MES_ACTUAL;

mesInput.addEventListener("change", function () {
    // Si alguien borra el mes, volvemos al actual.
    if (!mesInput.value) {
        mesInput.value = MES_ACTUAL;
    }
    mostrarGastos();
});

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

// Los campos de número aceptan "e" (notación científica: 2e5 = 200000), "+" y "-".
// En un monto eso solo causa errores, así que bloqueamos esas teclas
// en todos los campos de número (monto y presupuestos).
document.querySelectorAll('input[type="number"]').forEach(function (campo) {
    campo.addEventListener("keydown", function (evento) {
        if (["e", "E", "+", "-"].includes(evento.key)) {
            evento.preventDefault();
        }
    });
});

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

    // Saltamos al mes del gasto, para que se vea en la lista aunque sea de otro mes.
    mesInput.value = gasto.fecha.slice(0, 7);
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
    // Solo los gastos del mes elegido: "2026-10-20" empieza con "2026-10".
    const gastos = leerGastos().filter(function (gasto) {
        return gasto.fecha.startsWith(mesInput.value);
    });

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

    mostrarTotales(gastos);
}

// --- Totales del mes ---
function mostrarTotales(gastos) {
    // Sumamos por moneda y, dentro de cada categoría, también por moneda.
    const totales = { CRC: 0, USD: 0 };
    const porCategoria = {};

    gastos.forEach(function (gasto) {
        totales[gasto.moneda] += gasto.monto;
        if (!porCategoria[gasto.categoria]) {
            porCategoria[gasto.categoria] = { CRC: 0, USD: 0 };
        }
        porCategoria[gasto.categoria][gasto.moneda] += gasto.monto;
    });

    document.getElementById("total-CRC").textContent = formatearMonto(totales.CRC, "CRC");
    document.getElementById("total-USD").textContent = formatearMonto(totales.USD, "USD");

    const presupuesto = leerPresupuesto();
    mostrarBarra("CRC", totales.CRC, presupuesto.CRC);
    mostrarBarra("USD", totales.USD, presupuesto.USD);

    // De mayor a menor: primero por colones y, si empatan, por dólares.
    const categorias = Object.keys(porCategoria);
    categorias.sort(function (a, b) {
        return (porCategoria[b].CRC - porCategoria[a].CRC) ||
               (porCategoria[b].USD - porCategoria[a].USD);
    });

    const cuerpo = document.getElementById("cuerpo-categorias");
    cuerpo.innerHTML = "";
    document.getElementById("tabla-categorias").hidden = categorias.length === 0;
    document.getElementById("sin-categorias").hidden = categorias.length > 0;

    categorias.forEach(function (nombre) {
        const fila = document.createElement("tr");
        const celdas = [
            nombre,
            porCategoria[nombre].CRC ? formatearMonto(porCategoria[nombre].CRC, "CRC") : "—",
            porCategoria[nombre].USD ? formatearMonto(porCategoria[nombre].USD, "USD") : "—"
        ];
        celdas.forEach(function (texto) {
            const celda = document.createElement("td");
            celda.textContent = texto;
            fila.append(celda);
        });
        cuerpo.append(fila);
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

// --- Presupuesto ---
// Un presupuesto por moneda, el mismo para todos los meses. 0 = sin presupuesto.
const CLAVE_PRESUPUESTO = "presupuesto";

function leerPresupuesto() {
    const texto = localStorage.getItem(CLAVE_PRESUPUESTO);
    return texto ? JSON.parse(texto) : { CRC: 0, USD: 0 };
}

function guardarPresupuesto(presupuesto) {
    localStorage.setItem(CLAVE_PRESUPUESTO, JSON.stringify(presupuesto));
}

function mostrarBarra(moneda, gastado, limite) {
    const barra = document.getElementById("barra-" + moneda);
    const texto = document.getElementById("texto-" + moneda);

    // Sin presupuesto en esta moneda: no hay barra.
    if (!limite) {
        barra.hidden = true;
        texto.textContent = "";
        return;
    }

    const porcentaje = gastado / limite * 100;
    // Redondeamos a centavos: las sumas con decimales a veces dan 0.30000000000000004.
    const exceso = Math.round((gastado - limite) * 100) / 100;
    const pasado = exceso > 0;

    barra.hidden = false;
    // La barra no puede pasar del 100% de ancho, aunque el gasto sí.
    barra.querySelector(".barra-relleno").style.width = Math.min(porcentaje, 100) + "%";
    barra.classList.toggle("aviso", porcentaje >= 80 && !pasado);
    barra.classList.toggle("pasado", pasado);
    texto.classList.toggle("pasado", pasado);

    if (pasado) {
        texto.textContent = "Te pasaste por " + formatearMonto(exceso, moneda);
    } else {
        texto.textContent = formatearMonto(gastado, moneda) + " de " + formatearMonto(limite, moneda);
    }
}

const formPresupuesto = document.getElementById("form-presupuesto");
const campoCRC = document.getElementById("presupuesto-CRC");
const campoUSD = document.getElementById("presupuesto-USD");

// Al abrir la página, mostramos el presupuesto guardado en los campos.
const presupuestoGuardado = leerPresupuesto();
campoCRC.value = presupuestoGuardado.CRC || "";
campoUSD.value = presupuestoGuardado.USD || "";

formPresupuesto.addEventListener("submit", function (evento) {
    evento.preventDefault();
    guardarPresupuesto({
        CRC: Number(campoCRC.value) || 0,
        USD: Number(campoUSD.value) || 0
    });
    mostrarGastos();

    // Aviso de "guardado" que se esconde solo a los 2 segundos.
    const aviso = document.getElementById("presupuesto-guardado");
    aviso.hidden = false;
    setTimeout(function () {
        aviso.hidden = true;
    }, 2000);
});

// Al abrir la página, mostramos lo que ya estaba guardado.
mostrarGastos();
