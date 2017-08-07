import { Component } from '@angular/core';
import { Item } from './models/item.model';
import { mockItems } from './models/mock.data';
import { Observable } from 'rxjs';

import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private stateService: StateService) {
    this.stateService.itemStream.subscribe(console.log);
  }

  public tasks: Observable<Item[]> = this.stateService.itemStream;

  public addTask(str: string): void {
  	this.stateService.createItem(str);
  }
}
