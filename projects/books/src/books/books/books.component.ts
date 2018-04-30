import {
  Component,
  OnInit,
  Input,
  Compiler,
  Type,
  OnChanges,
  SimpleChanges,
  Injector,
  ComponentFactory,
  ViewContainerRef,
  ViewChild,
  Renderer2,
  ElementRef
} from "@angular/core";
import { fromPromise } from "rxjs/observable/fromPromise";
import { forkJoin } from "rxjs";
import { createCustomElement, NgElementConstructor } from "@angular/elements";
import { element } from "protractor";
const elementMap: Map<string, HTMLElement> = new Map();

let repeatCount = 0;
let cTimeout;
let timeoutIntervals = new Array();
let timeoutIntervalSpeed;
@Component({
  selector: "app-books",
  templateUrl: "./books.component.html",
  styleUrls: ["./books.component.scss"]
})
export class BooksComponent implements OnInit, OnChanges {
  @Input() modules: Type<any>[] = [];
  list: any[] = [];

  @ViewChild("container") view: ElementRef;
  constructor(
    public compiler: Compiler,
    public injector: Injector,
    public render: Renderer2
  ) {}

  ngOnInit() {
    this.modules.map(res => {
      this.getComponents(res);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ("modules" in changes) {
      const isFirst = changes.modules.firstChange;
      if (!isFirst) {
        const currents = changes.modules.currentValue;
        currents.map((res: Type<any>) => {
          this.getComponents(res);
        });
      }
    }
  }
  activeItem: any;
  activeInstance: HTMLElement;
  handlerClick(item) {
    this.activeItem = item;
    this.createElement(item.name);
    this.activeInstance = elementMap.get(item.name);
  }

  getComponents(res: Type<any>) {
    const ngModuleFactory = this.compiler.compileModuleSync(res);
    const ngModuleRef = ngModuleFactory.create(this.injector);
    const componentFactoryResolver = ngModuleRef.componentFactoryResolver;
    const moduleWithComponentFactories = this.compiler.compileModuleAndAllComponentsSync(
      res
    );
    const componentFactories: ComponentFactory<any>[] =
      moduleWithComponentFactories.componentFactories;
    const obsers: any[] = [];
    componentFactories.map((componentFactory: ComponentFactory<any>) => {
      const element: NgElementConstructor<any> = createCustomElement(
        componentFactory.componentType,
        {
          injector: ngModuleRef.injector
        }
      );
      customElements.define(componentFactory.selector, element);
      obsers.push(
        fromPromise(
          customElements.whenDefined(componentFactory.selector).then(() => {
            return componentFactory.selector;
          })
        )
      );
      this.list.push({
        name: componentFactory.selector,
        inputs: componentFactory.inputs,
        outputs: componentFactory.outputs,
        contents: componentFactory.ngContentSelectors
      });
    });
    // list
    forkJoin(...obsers).subscribe((res: any) => {
      if (res.length > 0) {
        this.createElement(res[0]);
      }
    });
  }
  insertElement: any;
  createElement(selector: string) {
    const item = elementMap.get(selector);
    if (!item) {
      const element = document.createElement(selector);
      this.render.appendChild(this.view.nativeElement, element);
      element.onmouseover = () => {
        this.activeInstance = element;
        const items = this.list.filter(item => {
          return item.name === selector;
        });
        this.activeItem = items[0];
      };
      elementMap.set(selector, element);
    } else {
      this.ScrollToControl(item);
    }
  }

  ScrollToControl(elem) {
    let scrollPos = this.elementPosition(elem).y;
    scrollPos = scrollPos - document.documentElement.scrollTop;
    let remainder = scrollPos % 50;
    let repeatTimes = (scrollPos - remainder) / 50;
    this.ScrollSmoothly(scrollPos, repeatTimes);
    window.scrollBy(0, remainder);
  }

  ScrollSmoothly(scrollPos, repeatTimes) {
    if (repeatCount < repeatTimes) {
      window.scrollBy(0, 50);
    } else {
      repeatCount = 0;
      clearTimeout(cTimeout);
      return;
    }
    repeatCount++;
    cTimeout = setTimeout(
      "ScrollSmoothly('" + scrollPos + "','" + repeatTimes + "')",
      10
    );
  }

  elementPosition(obj) {
    let curleft = 0,
      curtop = 0;
    if (obj.offsetParent) {
      curleft = obj.offsetLeft;
      curtop = obj.offsetTop;
      while ((obj = obj.offsetParent)) {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      }
    }
    return { x: curleft, y: curtop };
  }
}
