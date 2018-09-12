import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DateFormatPipe } from "./date-format.pipe";
import { SimpleHighLightDirective } from "./high-light.directive";
@NgModule({
  imports: [CommonModule],
  declarations: [SimpleHighLightDirective, DateFormatPipe],
  exports: [
    CommonModule,
    FormsModule,
    SimpleHighLightDirective,
    DateFormatPipe
  ]
})
export class ShareModule {}
