import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { Item } from './../models/item.model';
import { mockItems } from './../models/mock.data';

@Injectable()
export class StateService {
	public tasks: Item[] = mockItems;

	public addTask(task: string): void {
		const newTask: Item = new Item({
			description: task,
		});

		// Mutation Approach; must approach in order for angular to propogate change
		this.tasks.push(newTask);

		// Functional Approach will require use of observables
		// this.tasks = Object.assign([], [...this.tasks, newTask]);
	}

	public removeTask(task: string): void {
		this.tasks = this.tasks.filter((item: Item): void => {
			item.description !== task;
		})
	}

}