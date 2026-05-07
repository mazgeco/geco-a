import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideRouter } from '@angular/router';

import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Nora from '@primeuix/themes/nora';

import { routes } from './app.routes';
import { MessageService } from 'primeng/api';

const MyNoraPreset = definePreset(Nora, {
  semantic: {
    primary: {
      50: '#eef9fb',
      100: '#d9f0f3',
      200: '#b3e0e7',
      300: '#80cad5',
      400: '#4daebe',
      500: '#1f8aa0',
      600: '#036077',
      700: '#024e61',
      800: '#023f4e',
      900: '#012f3b'
    }
  },
  components: {
    button: {
      root: {
        paddingX: '0.6rem',
        paddingY: '0.2rem'
      }
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    MessageService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    providePrimeNG({
      theme: {
        preset: MyNoraPreset,
        options: {
          darkModeSelector: 'none'
        }
      }
    }),
  ]
};