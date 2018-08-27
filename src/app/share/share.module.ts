import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DateFormatPipe } from "./date-format.pipe";
import { HighLightDirective } from "./high-light.directive";
@NgModule({
  imports: [CommonModule],
  declarations: [HighLightDirective, DateFormatPipe],
  exports: [
    CommonModule,
    FormsModule,
    HighLightDirective,
    DateFormatPipe
  ]
})
export class ShareModule {}
