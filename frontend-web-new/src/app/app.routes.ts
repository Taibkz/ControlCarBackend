import { Routes } from '@angular/router';
import { LoginComponent } from './features/public/login/login.component';
import { RegistroComponent } from './features/public/registro/registro.component';
import { authGuard, adminGuard, clienteGuard } from './core/guards/auth.guard';

// Módulo Cliente
import { ClientePanelComponent } from './features/cliente/components/cliente-panel/cliente-panel.component';
import { MisVehiculosComponent } from './features/cliente/components/mis-vehiculos/mis-vehiculos.component';
import { MisCitasComponent } from './features/cliente/components/mis-citas/mis-citas.component';
import { PedirCitaComponent } from './features/cliente/components/pedir-cita/pedir-cita.component';
import { MiPerfilComponent } from './features/cliente/components/mi-perfil/mi-perfil.component';

// Módulo Admin
import { AdminPanelComponent } from './features/admin/components/admin-panel/admin-panel.component';
import { GestionCitasComponent } from './features/admin/components/gestion-citas/gestion-citas.component';
import { CalendarioCitasComponent } from './features/admin/components/calendario-citas/calendario-citas.component';
import { HistorialCitasComponent } from './features/admin/components/historial-citas/historial-citas.component';
import { GestionClientesComponent } from './features/admin/components/gestion-clientes/gestion-clientes.component';
import { GestionServiciosComponent } from './features/admin/components/gestion-servicios/gestion-servicios.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  
  // Cliente Routes
  { path: 'cliente/panel', component: ClientePanelComponent, canActivate: [clienteGuard] },
  { path: 'cliente/mis-vehiculos', component: MisVehiculosComponent, canActivate: [clienteGuard] },
  { path: 'cliente/mis-citas', component: MisCitasComponent, canActivate: [clienteGuard] },
  { path: 'cliente/pedir-cita', component: PedirCitaComponent, canActivate: [clienteGuard] },
  { path: 'cliente/perfil', component: MiPerfilComponent, canActivate: [clienteGuard] },
  
  // Admin Routes
  { path: 'admin/panel', component: AdminPanelComponent, canActivate: [adminGuard] },
  { path: 'admin/citas', component: GestionCitasComponent, canActivate: [adminGuard] },
  { path: 'admin/calendario', component: CalendarioCitasComponent, canActivate: [adminGuard] },
  { path: 'admin/historial', component: HistorialCitasComponent, canActivate: [adminGuard] },
  { path: 'admin/clientes', component: GestionClientesComponent, canActivate: [adminGuard] },
  { path: 'admin/servicios', component: GestionServiciosComponent, canActivate: [adminGuard] },
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // catch-all redirect
  { path: '**', redirectTo: 'login' }
];
