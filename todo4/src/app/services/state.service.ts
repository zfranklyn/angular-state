import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { Task } from './../models/task.model';
import { mockTasks } from './../models/mock.data';

@Injectable()
export class StateService {
	public tasks: Task[] = mockTasks;

	public addTask(task: string): void {
		const newTask: Task = new Task({
			description: task,
		});

		// Mutation Approach; must approach in order for angular to propogate change
		this.tasks.push(newTask);

		// Functional Approach will require use of observables
		// this.tasks = Object.assign([], [...this.tasks, newTask]);
	}

	public removeTask(taskDescription: string): void {
		this.tasks = this.tasks.filter((task: Task): void => {
			task.description !== taskDescription;
		})
	}

}