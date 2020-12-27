import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { PostEffects } from "./post.effects";
import { postReducer } from "./post.reducer";

@NgModule({
  imports: [
    StoreModule.forFeature('posts', postReducer),
    EffectsModule.forFeature([PostEffects]),
  ],
})
export class PostStoreModule { }
