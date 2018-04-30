import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TestIndexComponent } from "./test-index/test-index.component";
import { TestButtonComponent } from "./test-button/test-button.component";

@NgModule({
  imports: [CommonModule],
  declarations: [TestIndexComponent, TestButtonComponent],
  exports: [TestIndexComponent, TestButtonComponent],
  entryComponents: [TestIndexComponent, TestButtonComponent]
})
export class TestModule {}
