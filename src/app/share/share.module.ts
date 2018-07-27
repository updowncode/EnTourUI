import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MessageBarComponent } from "./message-bar/message-bar.component";
import { DateFormatPipe } from "./date-format.pipe";
import { HighLightDirective } from "./high-light.directive";
@NgModule({
  imports: [CommonModule],
  declarations: [MessageBarComponent, HighLightDirective, DateFormatPipe],
  exports: [
    CommonModule,
    FormsModule,
    MessageBarComponent,
    HighLightDirective,
    DateFormatPipe
  ]
})
export class ShareModule {}
