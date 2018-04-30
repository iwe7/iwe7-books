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
  list: any[] = [];
  @Input() element: HTMLElement;

  active: string = "inputs";
  form: FormGroup;
  constructor(
    public cd: ChangeDetectorRef,
    public fb: FormBuilder,
    public render: Renderer2
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(res => {
      for (const key in res) {
        if (this.element) {
          this.render.setAttribute(this.element, key, res[key]);
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ("item" in changes) {
      this.setActiveList();
    }
  }

  setActiveList() {
    this.reset();
    if (!this.item) {
      return;
    }
    if (this.active === "inputs") {
      if ("inputs" in this.item) {
        this.list = this.item.inputs;
        this.createForm();
        this.cd.markForCheck();
      }
    } else if (this.active === "outputs") {
      if ("outputs" in this.item) {
        this.list = this.item.outputs;
        this.createOutputs();
        this.cd.markForCheck();
      }
    } else {
      if ("contents" in this.item) {
        this.list = this.item.contents;
        console.log(this.list);
      }
    }
  }

  reset() {
    this.json = "";
  }

  onNav(type: string) {
    this.active = type;
    this.setActiveList();
  }
  json: any;
  createOutputs() {
    this.list.map((res: any) => {
      if (this.element) {
        let ngElementStrategy = (<any>this.element).ngElementStrategy;
        if (ngElementStrategy) {
          let componentRef = ngElementStrategy.componentRef;
          if (componentRef) {
            let instance = componentRef.instance;
            instance[res.propName].subscribe(res => {
              this.json = JSON.stringify(
                {
                  from: res.templateName,
                  data: res
                },
                null,
                2
              );
            });
          }
        }
      }
    });
  }

  createForm() {
    this.list.map((res: any) => {
      if (this.element) {
        let ngElementStrategy = (<any>this.element).ngElementStrategy;
        if (ngElementStrategy) {
          let componentRef = ngElementStrategy.componentRef;
          if (componentRef) {
            let instance = componentRef.instance;
            this.form.setControl(
              res.templateName,
              this.fb.control(instance[res.propName] || "")
            );
          }
        }
      }
    });
  }
}
