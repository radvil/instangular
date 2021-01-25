import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { featureName, featureReducers } from './comment-feature.state';
import { CommentEffects } from './effects/comment.effects';
import { ReplyEffects } from './effects/reply.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(featureName, featureReducers),
    EffectsModule.forFeature([CommentEffects, ReplyEffects]),
  ],
})
export class CommentStoreModule { }
