# 📄 Resumen de Funcionalidades - ControlCar

**Fecha de actualización:** 30 de Enero de 2026
**Versión:** 1.0
**Aplicación:** Gestión de Taller Mecánico "ControlCar"

---

## 1. 🛠️ Arquitectura y Tecnología
*   **Backend:** Spring Boot (Java 17+)
*   **Frontend:** Thymeleaf + CSS3 (Variables CSS para tematización)
*   **Seguridad:** Spring Security (Roles: `ADMIN`, `CLIENTE`)
*   **Base de Datos:** (Implícita por JPA repositories)

---

## 2. 🔐 Autenticación y Seguridad
El sistema cuenta con un módulo de seguridad robusto que protege las rutas según el rol del usuario.

*   **Login Unificado:** `/login`
    *   Detección automática de rol tras autenticación.
    *   **Redirección:**
        *   `ROLE_ADMIN` → `/admin/panel`
        *   `ROLE_CLIENTE` → `/cliente/panel`
*   **Logout:** Cierre de sesión seguro.
*   **Protección de Rutas:** Un cliente no puede acceder a rutas de administración y viceversa.

---

## 3. 👨‍💼 Módulo de Administración (Rol: ADMIN)
Diseñado para la gestión operativa del taller.

### 3.1 Dashboard (`/admin/panel`)
*   Vista general con métricas clave:
    *   Total de Citas registradas.
    *   Total de Clientes registrados.
*   Tabla resumen de citas recientes.

### 3.2 Gestión de Clientes (`/admin/clientes`)
*   **Listado:** Visualización de todos los usuarios registrados como clientes.
*   **Alta Manual:** Formulario para registrar nuevos clientes desde administración.
*   **Baja:** Eliminación de usuarios clientes.

### 3.3 Gestión de Vehículos (`/admin/vehiculos`)
*   **Inventario Global:** Visualización de todos los vehículos del sistema.
*   **Asignación:** Registro de vehículos vinculados a un cliente específico.
*   **Eliminar:** Retiro de vehículos del inventario.

### 3.4 Catálogo de Servicios (`/admin/servicios`)
*   Gestión de la oferta comercial del taller (ej. "Cambio de Aceite", "Revisión General").
*   Funcionalidad CRUD completa (Crear, Leer, Actualizar, Borrar).

### 3.5 Gestión de Citas (`/admin/citas`)
*   **Supervisión:** Listado completo de todas las citas.
*   **Control de Estado:** El administrador actualiza el progreso del servicio:
    *   `PENDIENTE` 🟡
    *   `EN_CURSO` 🔵
    *   `FINALIZADA` 🟢

---

## 4. 🚗 Módulo de Cliente (Rol: CLIENTE)
Portal de autogestión para los usuarios finales.

### 4.1 Panel Personal (`/cliente/panel`)
*   Resumen de "Mis Citas" (Historial y Próximas).
*   Resumen de "Mis Vehículos".

### 4.2 Gestión de Mis Vehículos (`/cliente/mis-vehiculos`)
*   Visualización exclusiva de los vehículos propios.
*   **Nuevo Vehículo:** El cliente puede dar de alta sus propios coches en el sistema.

### 4.3 Solicitar Cita (`/cliente/pedir-cita`)
*   Interfaz simplificada para reserva de servicios.
*   **Flujo de Reserva:**
    1.  Selección de vehículo (Listado filtrado solo a sus vehículos).
    2.  Selección de servicio (Del catálogo oficial).
    3.  Elección de fecha y hora.
*   *Nota:* Las citas se crean por defecto en estado `PENDIENTE`.

---

## 5. 🗺️ Mapa de Navegación (Sitemap)

| Módulo | Ruta | Descripción |
| :--- | :--- | :--- |
| **Público** | `/` | Redirige al login o panel según sesión |
| | `/login` | Formulario de acceso |
| **Admin** | `/admin/panel` | Cuadro de mando principal |
| | `/admin/clientes` | Directorio de clientes |
| | `/admin/vehiculos` | Inventario de vehículos |
| | `/admin/servicios` | Catálogo de precios/servicios |
| | `/admin/citas` | Agenda del taller |
| **Cliente** | `/cliente/panel` | Área personal |
| | `/cliente/mis-vehiculos` | Garaje virtual del cliente |
| | `/cliente/pedir-cita` | Formulario de reserva |
