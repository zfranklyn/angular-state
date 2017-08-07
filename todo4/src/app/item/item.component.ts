import { Component, OnInit, Input } from '@angular/core';
import { Task } from './../models/task.model';
import { RemoveTaskAction } from './../actions/task.action';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input() public task: Task;

  constructor(private store: Store<any>) { }

  public ngOnInit() {
  }

  public removeTask(): void {
    this.store.dispatch(new RemoveTaskAction(this.task.description));
  }

}
