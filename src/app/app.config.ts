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
      50: '#f4fbfc',
      100: '#e6f5f7',
      200: '#cbeaed',
      300: '#a8d8df',
      400: '#7fc0cb',
      500: '#5ca7b5',
      600: '#3f8797',
      700: '#326d7b',
      800: '#285864',
      900: '#1d424c'
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