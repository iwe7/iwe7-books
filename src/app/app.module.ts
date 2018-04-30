import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BooksModule } from "../../projects/books/src/public_api";
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BooksModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
