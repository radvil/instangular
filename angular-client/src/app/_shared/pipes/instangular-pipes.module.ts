import { NgModule } from "@angular/core";
import { RelativeTimePipe } from "./relativeTime.pipe";
import { TruncatePipe } from "./truncate.pipe";

@NgModule({
  declarations: [RelativeTimePipe, TruncatePipe],
  exports: [RelativeTimePipe, TruncatePipe],
  providers: [RelativeTimePipe, TruncatePipe],
})
export class InstAngularPipesModule {}