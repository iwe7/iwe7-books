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
import { forkJoin, from, of, Subject } from "rxjs";
import {
  map,
  tap,
  switchMap,
  filter,
  takeLast,
  debounceTime
} from "rxjs/operators";

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
  listMap: Map<string, any> = new Map();

  @ViewChild("container") view: ElementRef;

  listMap$: Subject<any> = new Subject();
  constructor(
    public compiler: Compiler,
    public injector: Injector,
    public render: Renderer2
  ) {
    this.listMap$.pipe(debounceTime(300)).subscribe(res => {
      this.list = [];
      this.listMap.forEach(res => {
        this.list.push(res);
      });
    });
  }

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
  handlerClick(item) {
    this.activeItem = item;
  }

  getComponents(res: Type<any>) {
    const ngModuleFactory = this.compiler.compileModuleSync(res);
    of(res)
      .pipe(
        map(res => this.compiler.compileModuleSync(res)),
        filter(res => !!res),
        map(res => res.moduleType),
        filter(res => !!res),
        switchMap((res: any) =>
          from(res.decorators).pipe(
            filter(res => !!res),
            map((res: any) => res.args),
            filter(res => !!res),
            switchMap(res =>
              from(res).pipe(
                map((res: any) => res.exports),
                filter(res => !!res),
                switchMap(res =>
                  from(res).pipe(
                    filter(res => !!res),
                    switchMap((res: any) => {
                      let { name, propDecorators } = res;
                      return from(res.decorators).pipe(
                        filter(res => !!res),
                        map((res: any) => res.args),
                        filter(res => !!res),
                        switchMap((res: any) => {
                          return from(res).pipe(
                            switchMap((res: any) => {
                              if (res && res.selector) {
                                res.name = name;
                                res.props = this.converProps(propDecorators);
                                return of(res);
                              } else {
                                return this.conver(res);
                              }
                            })
                          );
                        })
                      );
                    })
                  )
                )
              )
            )
          )
        ),
        map((res: any) => {
          this.listMap.set(res.name, res);
          return this.listMap;
        })
      )
      .subscribe(
        res => {},
        () => {},
        () => {
          this.listMap$.next(this.listMap);
        }
      );
  }

  converProps(props: any) {
    if (props) {
      let res = {};
      for (let key in props) {
        let value = [];
        props[key].map(res => {
          let args = res.args;
          if (args) {
            args.map(arg => {
              if ({}.toString.call(arg) === "[object String]") {
                value.push(arg);
              } else if ({}.toString.call(arg) === "[object Function]") {
                value.push(arg.name);
              } else {
                let { read } = arg;
                if (read) {
                  value.push(read.name);
                } else {
                  value.push('')
                }
              }
            });
          } else {
            value.push("");
          }
        });
        res[key] = value;
      }
      return res;
    } else {
      return {};
    }
  }

  conver(res: any) {
    return of(res).pipe(
      map(res => res.exports),
      switchMap(res => {
        return from(res).pipe(
          switchMap((res: any) => {
            let { name, propDecorators } = res;
            return from(res.decorators).pipe(
              map((res: any) => res.args),
              switchMap(res =>
                from(res).pipe(
                  switchMap((res: any) => {
                    if (res && res.selector) {
                      res.name = name;
                      res.props = this.converProps(propDecorators);
                      return of(res);
                    } else {
                      return this.conver(res);
                    }
                  })
                )
              )
            );
          })
        );
      })
    );
  }
}
