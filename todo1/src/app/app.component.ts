import { Component } from '@angular/core';
import { Item } from './models/item.model';
import { mockItems } from './models/mock.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public tasks: Item[] = mockItems;

  public addTask(task: string): void {
  	this.tasks.push(new Item({description: task}));
  }
}
