import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @ViewChild('input') public input: ElementRef;
  @Output() public onTaskAddition: EventEmitter<string>;

  constructor() {
  	this.onTaskAddition = new EventEmitter<string>();
  }

  public ngOnInit() {
  }

  public addTask(e: any): void {
  	e.preventDefault();

  	const taskDescription: string = this.input.nativeElement.value;

  	if (taskDescription) {
  		console.log(`Adding Task: ${taskDescription}`);
  		this.input.nativeElement.value = '';
  		this.onTaskAddition.emit(taskDescription);
  	}
  }

}
