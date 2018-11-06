import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders
} from "@angular/core";
import { CommonModule } from "@angular/common";
// import { UserServiceConfig } from "./user-service-config";
import { EnTourCoreService } from "./en-tour-core.service";
import { NavComponent } from './nav.component';
class UserServiceConfig {
  nav: string;
}
@NgModule({
  imports: [CommonModule],
  providers: [EnTourCoreService],
  declarations: [NavComponent],
  exports: [NavComponent]
})
export class EnTourCoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: EnTourCoreModule
  ) {
    if (parentModule) {
      throw new Error(
        "CoreModule is already loaded. Import it in the AppModule only"
      );
    }
  }
  static forRoot(config: UserServiceConfig): ModuleWithProviders {
    return {
      ngModule: EnTourCoreModule,
      providers: [{ provide: UserServiceConfig, useValue: config }]
    };
  }
}
