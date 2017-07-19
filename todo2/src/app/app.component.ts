import { Component } from '@angular/core';
import { Item } from './models/item.model';
import { mockItems } from './models/mock.data';

import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private stateService: StateService) {}

  public tasks: Item[] = this.stateService.tasks;

  public addTask(task: string): void {
  	this.stateService.addTask(task);
  }
}
