import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone : false,
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.css']   
})
export class AppComponent {
  title = signal('EduTrack_frontend');
}
