// js/app.js

let usuarioActual = null;
let solicitudes = [];

document.addEventListener("DOMContentLoaded", () => {
    const userJSON = localStorage.getItem("usuarioLogueado");
    if (!userJSON) {
        window.location.href = "login.html";
        return;
    }
    usuarioActual = JSON.parse(userJSON);

    cargarDatos();
    configurarUI();
    renderizarTabla();
    
    const hoy = new Date().toISOString().split('T')[0];
    if(document.getElementById("fecha")) document.getElementById("fecha").setAttribute("min", hoy);

    document.getElementById("solicitudForm").addEventListener("submit", manejarSubmit);
    document.getElementById("btnLogout").addEventListener("click", cerrarSesion);
    document.getElementById("btnCancelarEdicion").addEventListener("click", limpiarFormulario);
    
    const filtroAdmin = document.getElementById("filtroEstado");
    if(filtroAdmin) filtroAdmin.addEventListener("change", renderizarTabla);
});

function cargarDatos() {
    const datosGuardados = localStorage.getItem("solicitudesTallerV2");
    if (datosGuardados) {
        solicitudes = JSON.parse(datosGuardados);
    } else {
        solicitudes = [
            { id: 1001, clienteEmail: "cliente1@test.com", clienteNombre: "Juan Pérez", telefono: "0987654321", placa: "PBA-1234", marca: "Toyota", modelo: "Corolla", anio: 2020, kilometraje: 50000, tipoServicio: "Mantenimiento Preventivo General", fecha: "2026-11-20", hora: "09:00", prioridad: "Normal", estado: "Pendiente", observaciones: "Revisión general" },
            { id: 1002, clienteEmail: "cliente2@test.com", clienteNombre: "María López", telefono: "0998765432", placa: "GKS-9876", marca: "Chevrolet", modelo: "Tracker", anio: 2022, kilometraje: 30000, tipoServicio: "Sistema de Frenos", fecha: "2026-11-21", hora: "11:30", prioridad: "Urgente", estado: "En proceso", observaciones: "Chillido al frenar" }
        ];
        guardarDatos();
    }
}

function guardarDatos() {
    localStorage.setItem("solicitudesTallerV2", JSON.stringify(solicitudes));
}

function configurarUI() {
    if(document.getElementById("userInfo")) document.getElementById("userInfo").textContent = `${usuarioActual.nombre} (${usuarioActual.rol.toUpperCase()})`;
    if(document.getElementById("perfilNombre")) document.getElementById("perfilNombre").textContent = usuarioActual.nombre;
    if(document.getElementById("perfilEmail")) document.getElementById("perfilEmail").textContent = usuarioActual.email;
    
    const badge = document.getElementById("perfilRolBadge");
    if (badge) {
        badge.textContent = usuarioActual.rol.toUpperCase();
        badge.className = usuarioActual.rol === "admin" ? "badge bg-warning text-dark mb-1" : "badge bg-primary mb-1";
    }

    const adminEmailSection = document.getElementById("adminEmailSection");
    const estadoSection = document.getElementById("estadoSection");
    const inputNombre = document.getElementById("clienteNombre");
    const inputTelefono = document.getElementById("telefono");
    const inputEmail = document.getElementById("clienteEmail");
    const filtroContainer = document.getElementById("filtroContainer");
    const contadorCliente = document.getElementById("contadorCliente");
    const tituloTabla = document.getElementById("tituloTabla");

    if (usuarioActual.rol === "admin") {
        adminEmailSection.style.display = "block";
        estadoSection.style.display = "block";
        inputNombre.readOnly = false;
        inputTelefono.readOnly = false;
        inputEmail.readOnly = false;
        
        filtroContainer.classList.remove("d-none");
        contadorCliente.classList.add("d-none");
        tituloTabla.textContent = "Gestión General de Solicitudes";
    } else {
        adminEmailSection.style.display = "none";
        estadoSection.style.display = "none";
        inputNombre.readOnly = true;
        inputTelefono.readOnly = true;
        inputEmail.readOnly = true;
        
        inputNombre.value = usuarioActual.nombre;
        inputTelefono.value = usuarioActual.telefono;
        inputEmail.value = usuarioActual.email;

        filtroContainer.classList.add("d-none");
        contadorCliente.classList.remove("d-none");
        tituloTabla.textContent = "Mis Solicitudes";
    }
}

function renderizarTabla() {
    const tbody = document.getElementById("tablaSolicitudes");
    if(!tbody) return;
    tbody.innerHTML = "";

    let solicitudesFiltradas = [];

    if (usuarioActual.rol === "admin") {
        const filtro = document.getElementById("filtroEstado").value;
        solicitudesFiltradas = filtro === "TODOS" ? solicitudes : solicitudes.filter(s => s.estado === filtro);
        
        let pendientes = solicitudes.filter(s => s.estado === "Pendiente").length;
        let enProceso = solicitudes.filter(s => s.estado === "En proceso" || s.estado === "En revisión").length;
        
        const resumen = document.getElementById("resumenAdmin");
        if(resumen) resumen.innerHTML = `
            <span class="text-secondary me-2">Total: ${solicitudes.length}</span>
            <span class="text-warning me-2">Pendientes: ${pendientes}</span>
            <span class="text-primary">En taller: ${enProceso}</span>
        `;
    } else {
        solicitudesFiltradas = solicitudes.filter(s => s.clienteEmail === usuarioActual.email);
        if(document.getElementById("contadorCliente")) {
            document.getElementById("contadorCliente").textContent = `${solicitudesFiltradas.length} registros`;
        }
    }

    if (solicitudesFiltradas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-secondary py-4">No hay solicitudes registradas.</td></tr>`;
        return;
    }

    solicitudesFiltradas.forEach(sol => {
        let accionesHTML = "<span class='text-secondary small'>Solo lectura</span>";
        
        if (usuarioActual.rol === "admin") {
            accionesHTML = `
                <button class="btn btn-sm btn-outline-primary me-1" onclick="prepararEdicion(${sol.id})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarSolicitud(${sol.id})"><i class="bi bi-trash"></i></button>
            `;
        }

        let badgeClass = "bg-secondary";
        if (sol.estado === "Pendiente") badgeClass = "bg-warning text-dark";
        if (sol.estado === "En revisión") badgeClass = "bg-info text-dark";
        if (sol.estado === "En proceso") badgeClass = "bg-primary text-white";
        if (sol.estado === "Finalizado") badgeClass = "bg-success text-white";
        if (sol.estado === "Cancelado") badgeClass = "bg-danger text-white";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="fw-bold text-primary">#${sol.id}</td>
            <td>${sol.clienteNombre}<br><small class="text-secondary">${sol.clienteEmail}</small></td>
            <td><strong>${sol.placa}</strong><br><small class="text-secondary">${sol.marca} ${sol.modelo} (${sol.anio})</small></td>
            <td>${sol.tipoServicio}<br><small class="text-secondary">Prio: ${sol.prioridad}</small></td>
            <td>${sol.fecha}<br><small class="text-secondary">${sol.hora}</small></td>
            <td><span class="badge ${badgeClass}">${sol.estado}</span></td>
            <td>${accionesHTML}</td>
        `;
        tbody.appendChild(tr);
    });
}

function manejarSubmit(e) {
    e.preventDefault();

    const id = document.getElementById("solicitudId").value;
    const placa = document.getElementById("placa").value.trim().toUpperCase();
    const anio = parseInt(document.getElementById("anio").value);
    const kilometraje = parseInt(document.getElementById("kilometraje").value);
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    
    let errores = [];

    const placaRegex = /^[A-Z]{3}-\d{3,4}$/; 
    if (!placaRegex.test(placa)) errores.push("La placa debe tener el formato ABC-1234.");

    if (anio < 1980 || anio > 2027) errores.push("El año debe estar entre 1980 y 2027.");
    if (kilometraje < 0 || kilometraje > 1000000) errores.push("Kilometraje inválido (0 a 1,000,000).");

    const hoyStr = new Date().toISOString().split('T')[0];
    if (fecha < hoyStr) errores.push("La fecha no puede ser anterior a hoy.");

    if (hora < "08:00" || hora > "17:30") errores.push("El horario de atención es de 08:00 a 17:30.");

    let clienteEmail = usuarioActual.email;
    let clienteNombre = usuarioActual.nombre;
    let telefono = usuarioActual.telefono;

    if (usuarioActual.rol === "admin") {
        clienteEmail = document.getElementById("clienteEmail").value.trim().toLowerCase();
        clienteNombre = document.getElementById("clienteNombre").value.trim();
        telefono = document.getElementById("telefono").value.trim();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clienteEmail)) errores.push("Ingrese un correo válido.");
        if (clienteNombre.length < 3) errores.push("El nombre debe tener al menos 3 letras.");
        if (!/^\d{10}$/.test(telefono)) errores.push("El teléfono debe tener 10 dígitos.");
    }

    if (errores.length > 0) {
        Swal.fire({
            icon: 'error', title: 'Errores en el formulario',
            html: `<ul class="text-start small mb-0 text-dark">${errores.map(e => `<li>${e}</li>`).join("")}</ul>`,
            background: '#fff', color: '#212529'
        });
        return;
    }

    const adicionales = Array.from(document.querySelectorAll('input[name="adicionales"]:checked')).map(chk => chk.value);
    const prioridad = document.querySelector('input[name="prioridad"]:checked').value;
    
    const nuevaSolicitud = {
        id: id ? parseInt(id) : Date.now(),
        clienteEmail, clienteNombre, telefono, placa,
        marca: document.getElementById("marca").value.trim(),
        modelo: document.getElementById("modelo").value.trim(),
        anio, kilometraje,
        tipoServicio: document.getElementById("tipoServicio").value,
        fecha, hora, prioridad, adicionales,
        estado: usuarioActual.rol === "admin" ? document.getElementById("estado").value : "Pendiente",
        observaciones: document.getElementById("comentarios").value.trim()
    };

    if (id) {
        const index = solicitudes.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            solicitudes[index] = nuevaSolicitud;
            Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Solicitud modificada.', background: '#fff', color: '#212529' });
        }
    } else {
        solicitudes.push(nuevaSolicitud);
        Swal.fire({ icon: 'success', title: 'Registrado', text: 'Solicitud guardada.', background: '#fff', color: '#212529' });
    }

    guardarDatos();
    renderizarTabla();
    limpiarFormulario();
}

function prepararEdicion(id) {
    const sol = solicitudes.find(s => s.id === id);
    if (!sol) return;

    document.getElementById("solicitudId").value = sol.id;
    document.getElementById("clienteNombre").value = sol.clienteNombre;
    document.getElementById("telefono").value = sol.telefono;
    
    if(usuarioActual.rol === 'admin') {
        document.getElementById("clienteEmail").value = sol.clienteEmail;
        document.getElementById("estado").value = sol.estado;
    }
    
    document.getElementById("placa").value = sol.placa;
    document.getElementById("marca").value = sol.marca;
    document.getElementById("modelo").value = sol.modelo;
    document.getElementById("anio").value = sol.anio;
    document.getElementById("kilometraje").value = sol.kilometraje;
    document.getElementById("tipoServicio").value = sol.tipoServicio;
    document.getElementById("fecha").value = sol.fecha;
    document.getElementById("hora").value = sol.hora;
    document.getElementById("comentarios").value = sol.observaciones || "";

    if (sol.prioridad === "Urgente") document.getElementById("prio-urgente").checked = true;
    else document.getElementById("prio-normal").checked = true;

    document.querySelectorAll('input[name="adicionales"]').forEach(chk => {
        chk.checked = sol.adicionales.includes(chk.value);
    });

    document.getElementById("formTitle").innerHTML = "<i class='bi bi-pencil-square me-2'></i>Editar Solicitud";
    document.getElementById("btnGuardar").textContent = "Actualizar Datos";
    document.getElementById("btnCancelarEdicion").style.display = "inline-block";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function eliminarSolicitud(id) {
    Swal.fire({
        title: '¿Eliminar solicitud?', text: "Esta acción es permanente.", icon: 'warning',
        showCancelButton: true, confirmButtonColor: '#dc3545', cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
        background: '#fff', color: '#212529'
    }).then((result) => {
        if (result.isConfirmed) {
            solicitudes = solicitudes.filter(s => s.id !== id);
            guardarDatos();
            renderizarTabla();
            Swal.fire({ icon: 'success', title: 'Eliminado', showConfirmButton: false, timer: 1500, background: '#fff', color: '#212529' });
        }
    });
}

function limpiarFormulario() {
    document.getElementById("solicitudForm").reset();
    document.getElementById("solicitudId").value = "";
    document.getElementById("formTitle").innerHTML = "<i class='bi bi-pencil-square me-2'></i>Registrar Nueva Solicitud";
    document.getElementById("btnGuardar").textContent = "Guardar Solicitud";
    document.getElementById("btnCancelarEdicion").style.display = "none";
    
    if(usuarioActual.rol === 'cliente') {
        document.getElementById("clienteNombre").value = usuarioActual.nombre;
        document.getElementById("telefono").value = usuarioActual.telefono;
        document.getElementById("clienteEmail").value = usuarioActual.email;
    }
}