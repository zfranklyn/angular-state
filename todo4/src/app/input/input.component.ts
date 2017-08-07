import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter} from '@angular/core';
import { AddTaskAction } from './../actions/task.action';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @ViewChild('input') public input: ElementRef;
  @Output() public onTaskAddition: EventEmitter<string>;

  constructor(private store: Store<any>) {
  	this.onTaskAddition = new EventEmitter<string>();
  }

  public ngOnInit() {
  }

  public addTask(e: any): void {
  	e.preventDefault();

  	const taskDescription: string = this.input.nativeElement.value;

  	if (taskDescription) {
  		this.input.nativeElement.value = '';
  		this.store.dispatch(new AddTaskAction(taskDescription));
  	}
  }

}
