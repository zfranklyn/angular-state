import { Component, OnInit } from '@angular/core';
import { Item } from './models/item.model';
import { Store } from '@ngrx/store';
import { mockItems } from './models/mock.data';
import { Observable } from 'Rxjs/rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private store: Store<Item[]>) {}

  public tasks: Observable<any>;

  public ngOnInit(): void {
  	this.tasks = this.store.select<any>('tasks');
  }
}
