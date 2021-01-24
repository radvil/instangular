import { NgModule, SkipSelf, Optional } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from 'src/environments/environment';
import { AuthEffects } from '../../auth/store/auth.effects';
import { reducers, metaReducers } from './app.state';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([AuthEffects]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      name: 'instAngular',
      logOnly: environment.production
    }),
  ]
})
export class AppStateModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppStateModule
  ) {
    if (parentModule) {
      throw new Error('AppStateModule is already loaded. Import only in AppModule');
    }
  }
}