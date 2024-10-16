import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <a routerLink="/"></a>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title: string;
}
