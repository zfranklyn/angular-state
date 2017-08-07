import { Task } from './../models/task.model';
import { mockTasks } from './../models/mock.data';

export const initialState: Task[] = mockTasks;

export function taskReducer(state: Task[] = mockTasks, action: {type: any, payload: any}) {
	switch (action.type) {
		case 'ADD_TASK':
			let taskDescription = action.payload;
			const newTask = new Task({description: taskDescription});
			return Object.assign([], [...state, newTask]);
		case 'REMOVE_TASK':
			let taskToRemove = action.payload;
			return Object.assign([], state.filter((t: Task) => t.description !== taskToRemove));
		default:
			return state;
	}
}
