import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { UserEffects } from "./user.effects";
import { userReducer } from "./user.reducer";

@NgModule({
  imports: [
    StoreModule.forFeature('users', userReducer),
    EffectsModule.forFeature([UserEffects]),
  ],
})
export class UserStoreModule {}
