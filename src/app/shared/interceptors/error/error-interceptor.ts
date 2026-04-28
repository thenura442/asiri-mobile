import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError(err => {
      const message: string =
        err.error?.message ?? err.error?.error ?? 'Something went wrong';

      switch (true) {
        case err.status === 0:
          toast.showError('Cannot reach server — check your connection');
          break;
        case err.status === 400:
          toast.showError(message);
          break;
        case err.status === 403:
          toast.showError('Access denied');
          break;
        case err.status === 404:
          toast.showError('Not found');
          break;
        case err.status === 409:
          toast.showError(message);
          break;
        case err.status === 422:
          toast.showError(message);
          break;
        case err.status >= 500:
          toast.showError('Server error — please try again');
          break;
      }

      return throwError(() => err);
    })
  );
};