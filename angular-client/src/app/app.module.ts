import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// 3rd parties
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LazyLoadImageModule } from 'ng-lazyload-image';
// local classes
import { InstAngularPipesModule } from 'src/app/_shared/pipes';
import { CoreModule } from './_core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // 3rd parties
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    LazyLoadImageModule,
    // local classes
    CoreModule,
    AppRoutingModule,
    InstAngularPipesModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
