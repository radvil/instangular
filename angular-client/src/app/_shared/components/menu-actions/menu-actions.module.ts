import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { MenuActionsComponent } from './menu-actions.component';

@NgModule({
  declarations: [MenuActionsComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  exports: [MenuActionsComponent],
})
export class MenuActionsModule {}
