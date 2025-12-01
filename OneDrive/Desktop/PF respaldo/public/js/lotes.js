// --- Cargar materias primas en el formulario ---
async function cargarMateriasParaLote() {
    const res = await fetch("/api/materias");
    const materias = await res.json();

    const contenedor = document.getElementById("insumos-list");
    contenedor.innerHTML = "";

    if (materias.length === 0) {
        contenedor.innerHTML = "<p>No hay materias primas registradas</p>";
        return;
    }

    materias.forEach(m => {
        contenedor.innerHTML += `
            <div class="insumo-item">
                <label>
                    <strong>${m.nombre}</strong> (Stock: ${m.cantidad_stock})
                </label>
                <input 
                    type="number" 
                    class="input-insumo" 
                    data-id="${m.id}"
                    min="0" 
                    max="${m.cantidad_stock}"
                    placeholder="Cantidad a usar"
                />
            </div>
        `;
    });
}

// registrar lote
document.getElementById("form-lote-produccion").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre_producto = document.getElementById("nombre_producto").value;
    const cantidad_producida = parseFloat(document.getElementById("cantidad_producida").value);
    const fecha_produccion = document.getElementById("fecha_produccion").value;

    // recolecta insumos
    const insumos = [];
    document.querySelectorAll(".input-insumo").forEach(input => {
        const cantidad = parseFloat(input.value || 0);
        if (cantidad > 0) {
            insumos.push({
                id: parseInt(input.dataset.id),
                cantidad_usada: cantidad
            });
        }
    });

    const res = await fetch("/api/lotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre_producto,
            cantidad_producida,
            fecha_produccion,
            insumos_utilizados: insumos
        })
    });

    const data = await res.json();
    alert(data.message || data.error);

    cargarLotes();
    cargarMateriasParaLote(); // refresca stock
});

// carga historial
async function cargarLotes() {
    const res = await fetch("/api/lotes");
    const lotes = await res.json();

    const tabla = document.getElementById("lotes-list");
    tabla.innerHTML = "";

    lotes.forEach(l => {
        tabla.innerHTML += `
            <tr>
                <td>${l.id}</td>
                <td>${l.nombre_producto}</td>
                <td>${l.cantidad_producida}</td>
                <td>${l.fecha_produccion}</td>
                <td><button class="btn-eliminar" data-id="${l.id}">Eliminar</button></td>
            </tr>
        `;
    });
}

// elimina lotes
document.getElementById("lotes-list").addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
        const id = e.target.dataset.id;

        if (!confirm("¿Eliminar este lote?")) return;

        const res = await fetch(`/api/lotes/${id}`, { method: "DELETE" });
        const data = await res.json();

        alert(data.message || data.error);
        cargarLotes();
    }
});

// Inicializar
cargarMateriasParaLote();
cargarLotes();
