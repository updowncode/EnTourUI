import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DateFormatPipe } from "./date-format.pipe";
import { SimpleHighLightDirective } from "./high-light.directive";
import { KeysPipe } from './keys.pipe';
@NgModule({
  imports: [CommonModule],
  declarations: [SimpleHighLightDirective, DateFormatPipe, KeysPipe],
  exports: [
    CommonModule,
    FormsModule,
    SimpleHighLightDirective,
    DateFormatPipe,
    KeysPipe
  ]
})
export class ShareModule {}
