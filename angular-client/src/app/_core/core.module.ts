import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// 3rd parties
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { InstAngularPipesModule } from 'src/app/_shared/pipes';
import { AppStateModule } from './reducers';
import { AppErrorHandler } from './handlers';
import { TokenInterceptor, HttpErrorInterceptor } from './inteceptors';

const CUSTOM_PROVIDERS = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  { provide: ErrorHandler, useClass: AppErrorHandler },
];

@NgModule({
  imports: [
    HttpClientModule,
    AppStateModule,
    InstAngularPipesModule,
    // 3rd parties
    LazyLoadImageModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  exports: [
    HttpClientModule,
    AppStateModule,
    InstAngularPipesModule,
  ],
  providers: [...CUSTOM_PROVIDERS],
})
export class CoreModule { }
