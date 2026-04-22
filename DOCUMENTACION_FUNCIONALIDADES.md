# 📄 Resumen de Funcionalidades - ControlCar

**Fecha de actualización:** 22 de Abril de 2026
**Versión:** 1.1
**Aplicación:** Gestión de Taller Mecánico "ControlCar"

---

## 1. 🛠️ Arquitectura y Tecnología
*   **Backend:** Spring Boot (Java 17+)
*   **Frontend:** Angular (TypeScript) + CSS3
*   **Seguridad:** Spring Security y JWT (Roles: `ADMIN`, `CLIENTE`), Guards de Angular
*   **Base de Datos:** (Implícita por JPA repositories)

---

## 2. 🔐 Autenticación y Seguridad
El sistema cuenta con un módulo de seguridad robusto que protege las rutas según el rol del usuario utilizando JWT (JSON Web Tokens).

*   **Login Unificado:** `/login`
    *   Detección automática de rol tras autenticación.
    *   **Redirección:**
        *   `ROLE_ADMIN` → `/admin/panel`
        *   `ROLE_CLIENTE` → `/cliente/panel`
*   **Registro de Usuarios:** `/registro`
    *   Formulario para que nuevos usuarios puedan registrarse como clientes en el sistema.
*   **Logout:** Cierre de sesión seguro y eliminación del token.
*   **Protección de Rutas (Guards):** Un cliente no puede acceder a rutas de administración y viceversa.

---

## 3. 👨‍💼 Módulo de Administración (Rol: ADMIN)
Diseñado para la gestión operativa del taller y la supervisión completa de citas y clientes.

### 3.1 Dashboard (`/admin/panel`)
*   Vista general con métricas clave del taller.
*   Acceso rápido a las diferentes áreas de gestión.

### 3.2 Gestión de Citas (`/admin/citas`)
*   **Supervisión:** Listado de las citas activas o pendientes de los clientes.
*   **Control de Estado:** El administrador puede actualizar el progreso de las citas.

### 3.3 Calendario de Citas (`/admin/calendario`)
*   Vista gráfica de la programación del taller.
*   Organización visual por fechas y horas para optimizar la carga de trabajo.

### 3.4 Historial de Citas (`/admin/historial`)
*   Registro histórico de citas finalizadas y pasadas.

### 3.5 Gestión de Clientes (`/admin/clientes`)
*   **Listado:** Visualización de todos los usuarios registrados como clientes.
*   Gestión de la base de datos de usuarios.

### 3.6 Catálogo de Servicios (`/admin/servicios`)
*   Gestión de la oferta comercial del taller (ej. "Cambio de Aceite", "Revisión General").
*   Mantenimiento del listado que los clientes pueden seleccionar al pedir cita.

---

## 4. 🚗 Módulo de Cliente (Rol: CLIENTE)
Portal de autogestión para los usuarios finales.

### 4.1 Panel Personal (`/cliente/panel`)
*   Dashboard principal del cliente al acceder.
*   Acceso rápido a funcionalidades clave.

### 4.2 Gestión de Mis Vehículos (`/cliente/mis-vehiculos`)
*   Visualización exclusiva de los vehículos propios.
*   **Gestión:** El cliente puede dar de alta y administrar sus propios coches en el sistema.

### 4.3 Mis Citas (`/cliente/mis-citas`)
*   Historial y seguimiento de las citas solicitadas (pendientes, en curso, y finalizadas).

### 4.4 Solicitar Cita (`/cliente/pedir-cita`)
*   Interfaz para la reserva de nuevos servicios.
*   **Flujo de Reserva:**
    1.  Selección de vehículo (Listado filtrado solo a sus vehículos).
    2.  Selección de servicio (Del catálogo oficial).
    3.  Elección de fecha y hora.

### 4.5 Mi Perfil (`/cliente/perfil`)
*   Gestión de la información personal de la cuenta del cliente.

---

## 5. 🗺️ Mapa de Navegación (Sitemap)

| Módulo | Ruta | Descripción |
| :--- | :--- | :--- |
| **Público** | `/` | Redirige al login o panel según sesión |
| | `/login` | Formulario de acceso |
| | `/registro` | Formulario de registro para nuevos clientes |
| **Admin** | `/admin/panel` | Cuadro de mando principal |
| | `/admin/citas` | Gestión de citas actuales |
| | `/admin/calendario` | Vista en calendario de las citas |
| | `/admin/historial` | Registro histórico de citas |
| | `/admin/clientes` | Directorio y gestión de clientes |
| | `/admin/servicios` | Catálogo de precios/servicios |
| **Cliente** | `/cliente/panel` | Área personal y dashboard |
| | `/cliente/mis-vehiculos` | Garaje virtual del cliente |
| | `/cliente/mis-citas` | Seguimiento e historial de reservas |
| | `/cliente/pedir-cita` | Formulario de solicitud de servicios |
| | `/cliente/perfil` | Gestión de datos personales de la cuenta |
