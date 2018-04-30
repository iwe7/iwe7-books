import { Component, Compiler } from "@angular/core";
import { TestModule } from "./test/test.module";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";

  modules: any[] = [TestModule];
  constructor(public compiler: Compiler) {}
}
