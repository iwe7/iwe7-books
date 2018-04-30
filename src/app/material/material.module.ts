import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatCardModule,
  MatCard,
  MatCardHeader,
  MatCardTitleGroup
} from "@angular/material";

@NgModule({
  imports: [CommonModule, MatCardModule],
  declarations: [],
  entryComponents: [MatCard, MatCardHeader, MatCardTitleGroup]
})
export class MaterialModule {}
