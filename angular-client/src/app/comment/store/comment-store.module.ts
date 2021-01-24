import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { CommentEffects } from "./comment.effects";
import { commentReducer } from "./comment.reducer";

@NgModule({
  imports: [
    StoreModule.forFeature('comments', commentReducer),
    EffectsModule.forFeature([CommentEffects]),
  ],
})
export class CommentStoreModule { }
