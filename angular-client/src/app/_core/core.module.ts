import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
  ],
  exports: [
    HttpClientModule,
    AppStateModule,
  ],
  providers: [...CUSTOM_PROVIDERS],
})
export class CoreModule { }
