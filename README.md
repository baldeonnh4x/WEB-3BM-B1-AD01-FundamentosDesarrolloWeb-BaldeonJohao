# 🚗 MotorFix - Sistema de Mantenimiento Automotriz

**Práctica:** AD01 - Fundamentos de Desarrollo Web
**Institución:** Instituto Superior Tecnológico Cordillera
**Carrera:** Desarrollo de Software
**Estudiante:** Baldeón Johao
**Nivel/Paralelo:** 3BM

---

🌐 Demostración en vivo: https://baldeonnh4x.github.io/WEB-3BM-B1-AD01-FundamentosDesarrolloWeb-BaldeonJohao/

## 📝 Descripción del Proyecto
Este proyecto es el frontend de un sistema web para el taller mecánico **MotorFix**. Permite a los usuarios registrar solicitudes de mantenimiento para sus vehículos y consultar su estado en tiempo real. El sistema cuenta con un control de acceso basado en roles (Cliente y Administrador) y utiliza el almacenamiento local del navegador (`localStorage`) para simular una base de datos, sin necesidad de un backend.

El diseño implementa un estilo **Minimalista en Modo Claro (Light Mode)**, utilizando una capa de transparencia sobre una imagen de fondo del taller para mantener la legibilidad, ofreciendo una experiencia de usuario limpia, profesional y totalmente adaptable a dispositivos móviles y PC.

## 🛠️ Tecnologías Utilizadas
* **HTML5:** Estructura semántica (`header`, `nav`, `main`, `section`, `footer`).
* **CSS3:** Diseño personalizado, transiciones, *overlays* con gradientes y utilidades.
* **Bootstrap 5:** Diseño responsive y componentes de interfaz (grid, cards, tables, modals).
* **Bootstrap Icons:** Iconografía vectorial integrada.
* **JavaScript (Vanilla):** Lógica de negocio, validaciones, manipulación del DOM y CRUD.
* **SweetAlert2:** Alertas personalizadas y confirmaciones de seguridad.
* **LocalStorage:** Persistencia de datos en el navegador.

## ⚙️ Características y Funcionalidades

### 👤 Roles del Sistema
1. **Cliente:**
   * Puede consultar la página institucional (Inicio, Acerca de, Servicios).
   * Puede iniciar sesión y ver su perfil.
   * Puede registrar sus propias solicitudes de mantenimiento.
   * **Restricción:** Solo puede ver el estado de *sus propias* solicitudes. No puede editar ni eliminar registros.
2. **Administrador:**
   * Puede ver todas las solicitudes de todos los clientes en el sistema.
   * Puede crear solicitudes a nombre de cualquier cliente.
   * **CRUD Completo:** Puede editar, eliminar y actualizar el estado de cualquier solicitud (Pendiente, En revisión, En proceso, Finalizado, Cancelado).
   * Cuenta con filtros y un resumen estadístico rápido.

### ✅ Validaciones Implementadas (Casos de Prueba)
* **Cuentas deshabilitadas:** El sistema bloquea el acceso a usuarios inactivos (Prueba #2).
* **Formato estricto de placa:** Regex `ABC-1234` o `ABC-123` (Prueba #3).
* **Validación de año:** Entre 1980 y 2027.
* **Validación de kilometraje:** Rango permitido (0 - 1,000,000 km).
* **Validación de fechas:** No permite agendar citas en el pasado.
* **Validación de horario:** Bloquea citas fuera del horario de atención (08:00 a 17:30).
* **Validación de teléfono:** Exactamente 10 dígitos numéricos.
* **Protección de rutas:** Redirección automática al login si no hay sesión activa o si un cliente intenta acceder a la vista de administración (Prueba #5).

### 💻 Métodos de JavaScript Aplicados (Rúbrica)
Se hizo uso intensivo de los siguientes métodos para la manipulación de arrays de objetos:
* `find()`: Para buscar usuarios en el login y solicitudes al editar.
* `filter()`: Para mostrar solo las solicitudes del cliente logueado, filtrar por estados y para eliminar registros.
* `forEach()`: Para recorrer y renderizar la tabla de solicitudes.
* `findIndex()`: Para actualizar objetos dentro del array principal.

---

## 🔐 Credenciales de Prueba
El sistema cuenta con usuarios predefinidos en el código (`js/auth.js`) para probar ambos roles. Se han añadido botones en el login para autocompletar los datos:

| Rol | Correo Electrónico | Contraseña | Estado |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@taller.com` | `admin123` | Activo |
| **Cliente 1** | `cliente1@test.com` | `123` | Activo |
| **Cliente 2** | `cliente2@test.com` | `123` | Activo |
| **Cliente Bloqueado** | `bloqueado@test.com` | `123` | Inactivo (Prueba) |

---

## 📂 Estructura del Proyecto
```text
WEB-3BM-B1-AD01-FundamentosDesarrolloWeb-BaldeonJohao/
│
├── index.html          # Página institucional (Inicio, Acerca de, Servicios)
├── login.html          # Formulario de inicio de sesión
├── admin.html          # Dashboard (Formulario de registro, tabla y perfil)
│
├── css/
│   └── styles.css      # Estilos personalizados, Light Mode y fondo con overlay
│
├── js/
│   ├── auth.js         # Lógica de autenticación, roles y sesión
│   └── app.js          # Lógica del CRUD, validaciones y manejo de la tabla
│
├── img/
│   └── Imagen.jpg      # Imagen de fondo del taller
│
├── Registro_IA.md      # Bitácora de uso de Inteligencia Artificial
└── README.md           # Documentación del proyecto
