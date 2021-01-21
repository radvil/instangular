import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { featureName } from './comment.state';
import { commentReducer } from './comment.reducer';
import { CommentEffects } from './comment.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(featureName, commentReducer),
    EffectsModule.forFeature([CommentEffects]),
  ],
})
export class CommentStoreModule { }
