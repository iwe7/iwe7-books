import { NgModule } from "@angular/core";
import { BooksSiderComponent } from "./books-sider/books-sider.component";
import { BooksComponent } from "./books/books.component";
import { BooksHelperComponent } from "./books-helper/books-helper.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [BooksComponent],
  declarations: [BooksSiderComponent, BooksComponent, BooksHelperComponent],
  entryComponents: [BooksComponent],
  providers: []
})
export class BooksModule {}
