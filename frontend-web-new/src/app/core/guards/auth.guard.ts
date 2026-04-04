import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: ('ADMIN' | 'CLIENTE')[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.getCurrentUserValue();

    if (!user) {
      return router.createUrlTree(['/login']);
    }

    if (allowedRoles.includes(user.rol)) {
      return true;
    }

    // Role not allowed, redirect based on role
    if (user.rol === 'ADMIN') {
      return router.createUrlTree(['/admin/panel']);
    } else {
      return router.createUrlTree(['/cliente/panel']);
    }
  };
};

export const adminGuard = roleGuard(['ADMIN']);
export const clienteGuard = roleGuard(['CLIENTE']);
export const authGuard = roleGuard(['ADMIN', 'CLIENTE']); // Para páginas genéricas que requieren login
