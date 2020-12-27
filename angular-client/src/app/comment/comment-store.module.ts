import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { CommentEffects } from "./store/comment.effects";
import { commentReducer } from "./store/comment.reducer";

@NgModule({
  imports: [
    StoreModule.forFeature('comments', commentReducer),
    EffectsModule.forFeature([CommentEffects]),
  ],
})
export class CommentStoreModule { }
