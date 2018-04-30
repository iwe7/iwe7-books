import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  Renderer2
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-books-helper",
  templateUrl: "./books-helper.component.html",
  styleUrls: ["./books-helper.component.scss"]
})
export class BooksHelperComponent implements OnInit, OnChanges {
  @Input() item: any;
  form: FormGroup;
  constructor(public cd: ChangeDetectorRef, public fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if ("item" in changes) {
      let current = changes.item.currentValue;
      for (let key in current) {
        if ({}.toString.call(current[key]) === "[object Object]") {
          this.form.setControl(
            key,
            this.fb.control(JSON.stringify(current[key], null, 2))
          );
        } else if ({}.toString.call(current[key] === "[object Array]")) {
          this.form.setControl(
            key,
            this.fb.control(JSON.stringify(current[key], null, 2))
          );
        } else {
          this.form.setControl(key, this.fb.control(current[key]));
        }
      }
    }
  }
}
