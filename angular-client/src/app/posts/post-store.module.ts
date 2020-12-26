import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { PostEffects } from "./store/post.effects";
import { postReducer } from "./store/post.reducer";

@NgModule({
  imports: [
    StoreModule.forFeature('posts', postReducer),
    EffectsModule.forFeature([PostEffects]),
  ],
})
export class PostStoreModule { }
