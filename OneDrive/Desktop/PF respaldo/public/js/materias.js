// Cargar todas las materias primas
async function cargarMaterias() {
    const res = await fetch("/api/materias");
    const datos = await res.json();

    const tabla = document.getElementById("inventario-list");
    tabla.innerHTML = "";

    datos.forEach(m => {
        tabla.innerHTML += `
            <tr>
                <td>${m.id}</td>
                <td>${m.nombre}</td>
                <td>${m.lote_proveedor || ''}</td>
                <td>${m.fecha_caducidad || ''}</td>
                <td>${m.cantidad_stock}</td>
                <td>
                    <button class="btn-eliminar" data-id="${m.id}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

// Registrar una nueva materia prima
document.getElementById("form-materia-prima").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const lote_proveedor = document.getElementById("lote_proveedor").value;
    const fecha_caducidad = document.getElementById("fecha_caducidad").value;
    const cantidad_stock = document.getElementById("cantidad_stock").value;

    const res = await fetch("/api/materias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, lote_proveedor, fecha_caducidad, cantidad_stock })
    });

    const data = await res.json();
    document.getElementById("mensaje-feedback").textContent = data.message || data.error;

    cargarMaterias();
});

// ELIMINAR materia prima
document.getElementById("inventario-list").addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-eliminar")) {

        const id = e.target.getAttribute("data-id");

        if (confirm("¿Seguro que deseas eliminar esta materia prima?")) {

            const res = await fetch(`/api/materias/${id}`, {
                method: "DELETE"
            });

            const data = await res.json();

            document.getElementById("mensaje-feedback").textContent =
                data.message || data.error;

            cargarMaterias(); // refrescar tabla
        }
    }
});

cargarMaterias();
