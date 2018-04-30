import { Component, OnInit, Input, Output } from "@angular/core";

@Component({
  selector: "app-test-button",
  templateUrl: "./test-button.component.html",
  styleUrls: ["./test-button.component.css"]
})
export class TestButtonComponent implements OnInit {
  @Input() title: string = "我是一个button";
  constructor() {}

  ngOnInit() {}
}
