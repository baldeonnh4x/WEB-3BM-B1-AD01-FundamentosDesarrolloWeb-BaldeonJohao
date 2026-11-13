// js/auth.js

const usuariosDB = [
    { email: "admin@taller.com", password: "admin123", nombre: "Johao Admin", rol: "admin", activo: true, telefono: "0969539726" },
    { email: "cliente1@test.com", password: "123", nombre: "Alexis Gavilima", rol: "cliente", activo: true, telefono: "0987654321" },
    { email: "cliente2@test.com", password: "123", nombre: "María Quiña", rol: "cliente", activo: true, telefono: "0998765432" },
    { email: "bloqueado@test.com", password: "123", nombre: "Pedro Bloqueado", rol: "cliente", activo: false, telefono: "0970000000" }
];

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value.trim().toLowerCase();
            const password = document.getElementById("password").value.trim();

            const usuario = usuariosDB.find(u => u.email === email && u.password === password);

            if (!usuario) {
                Swal.fire({ icon: 'error', title: 'Acceso denegado', text: 'Credenciales incorrectas.', background: '#fff', color: '#212529' });
                return;
            }

            if (!usuario.activo) {
                Swal.fire({ icon: 'error', title: 'Cuenta deshabilitada', text: 'Tu usuario está bloqueado.', background: '#fff', color: '#212529' });
                return;
            }

            localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
            Swal.fire({
                icon: 'success', title: `Bienvenido, ${usuario.nombre}`, timer: 1500, showConfirmButton: false, background: '#fff', color: '#212529'
            }).then(() => {
                window.location.href = "admin.html";
            });
        });
    }
});

function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "index.html";
}
