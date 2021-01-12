import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// local classes
import { AppStateModule } from './reducers/app-state.module';
import { TokenInterceptor, HttpErrorInterceptor } from './interceptors';
import { AppErrorHandler } from './services';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TruncatePipe } from './utils';

const CUSTOM_PROVIDERS = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  { provide: ErrorHandler, useClass: AppErrorHandler },
]

@NgModule({
  declarations: [
    AppComponent,
    TruncatePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppStateModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  providers: [...CUSTOM_PROVIDERS, TruncatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
