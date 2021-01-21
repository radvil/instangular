import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// 3rd parties
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// local classes
import { CoreModule } from './_core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // 3rd parties
    MatButtonModule,
    MatIconModule,
    // local classes
    CoreModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
