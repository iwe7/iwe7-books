# 用于展示某模块下的组件，帮助调试或团队合作
> 在开发模式下预览组件使用

```sh
yarn add iwe7-books
```

```ts
import { BooksModule } from "iwe7-books";
@NgModule({
  imports: [BooksModule],
})
```

```ts
<app-books [modules]="modules"></app-books>
```
