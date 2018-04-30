import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-books-sider",
  templateUrl: "./books-sider.component.html",
  styleUrls: ["./books-sider.component.scss"]
})
export class BooksSiderComponent implements OnInit {
  @Input() list: any[] = [];

  @Output() handlerClick: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  onClick(item) {
    this.handlerClick.emit(item);
  }
}
