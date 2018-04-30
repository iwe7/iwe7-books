import { Component, Compiler } from "@angular/core";
import { TestModule } from "./test/test.module";
import { MaterialModule } from './material/material.module';
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";

  modules: any[] = [MaterialModule];
  constructor(public compiler: Compiler) {}
}
