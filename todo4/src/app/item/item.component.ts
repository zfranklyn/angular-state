import { Component, OnInit, Input } from '@angular/core';
import { Task } from './../models/task.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input() public task: Task;

  constructor() { }

  public ngOnInit() {
  }

}
