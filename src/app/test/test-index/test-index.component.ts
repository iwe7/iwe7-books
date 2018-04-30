import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  HostListener
} from "@angular/core";

@Component({
  selector: "app-test-index",
  templateUrl: "./test-index.component.html",
  styleUrls: ["./test-index.component.css"]
})
export class TestIndexComponent implements OnInit {
  @Input() title: string;
  @Output("onChange") change: EventEmitter<any> = new EventEmitter();

  @HostListener("click", ["$event"])
  _click() {
    this.change.emit({
      type: "click"
    });
  }
  constructor() {}

  ngOnInit() {}
}
