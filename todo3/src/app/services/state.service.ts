import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { Item } from './../models/item.model';
import { mockItems } from './../models/mock.data';

class Action {
	public actionType: string;
	public payload: any;
}

@Injectable()
export class StateService {

	// item stream emits the most updated array of items
	public itemStream: Observable<Item[]>;

	// action stream is a stream of user actions
	public actionStream: Observable<any> = new Observable<any>();

	// these are the actual actions users can take, which are fed into the actionStream
	public createItemActionStream: Subject<Action> = new Subject<Action>();
	public removeItemActionStream: Subject<Action> = new Subject<Action>();

	// methods; this is somewhat redux-like syntax
	public createItem(str: string): void {
		const newItem = new Item({
			description: str,
		})
		this.createItemActionStream.next({actionType: 'create', payload: newItem});
	}

	public removeItem(itemString: string): void {
		this.removeItemActionStream.next({actionType: 'remove', payload: itemString});
	}

	public constructor() {
		// merge create and remove actions into one stream
		this.actionStream = this.createItemActionStream.merge(this.removeItemActionStream)

		this.itemStream = this.actionStream.scan((accum: Item[], action: Action) => {
				switch (action.actionType) {
					case 'create':
						return accum.concat(action.payload);
					case 'remove':
						return accum.filter((i: Item) => i.description !== action.payload)
					default:
						return accum;
				}
		}, [])

	}


}