import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'Github - Info';

  toasts = [
    { message: 'teste' },
    { message: 'teste1' },
    { message: 'teste2' },
    { message: 'teste3' },
    { message: 'teste4' },
    { message: 'teste5' },
  ];
}
