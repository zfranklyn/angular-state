import { Item } from './../models/item.model';
import { mockItems } from './../models/mock.data';

export const initialState: Item[] = mockItems;

export function taskReducer(state: Item[] = mockItems, action: {type: any, payload: any}) {
	switch (action.type) {
		case 'ADD_TASK':
			const taskDescription = action.payload;
			const newTask = new Item({description: taskDescription});
			return Object.assign([], [...state, newTask]);
		default:
			return state;
	}
}
