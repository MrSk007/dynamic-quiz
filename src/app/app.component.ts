import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'dynamic-quiz';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    //this.authService.logout();
  }
}
