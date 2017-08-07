# State Management in Angular

In a complex SPA with many different sources of data flowing left and right, you'll probably be asking yourself *where* you should store data. For instance:

- Where do I keep track of UI state? whether this modal is open? whether user selected "light" vs "dark" theme?
- In a messaging app, where should all my messages be stored?
- If multiple components need access to the same source of data, where should I keep the data? As a property on the parent component? or as a property on a service?

Let's go over a few approaches to state management.

### 1. On Closest Relevant Component

The immediately obvious approach is to keep things on components themselves. In our `todo1` app example, task data is kept on the parent component:

```typescript
  export class AppComponent {
    // we keep track of UI data on the component itself.
    public tasks: Item[] = mockItems;

    public addTask(task: string): void {
      this.tasks.push(new Item({description: task}));
    }

  }
```

It should be clear *which* parent component the state needs to be on. For instance, if you have the following app structure:
```
  Component A
  |         |
  B         C
```
And `Component C` renders data that is changed by `Component B`, you'd want to keep the data on `Component A`. If the data were on `B`, then `A` would need a way of extracting said data from child `B`, and pass it down to child `C`.

This approach can quickly get out of hand, leading to endlessly convoluted passing of properties and methods. If you do choose this approach, plan out your data architecture carefully, and make sure data stored on a component is accessible by others that need it.

### 2. On a Service

The second approach places state on a separate service. In `todo2`, we've made this [`state.service.ts`](/todo2/src/app/services/state.service.ts):
```typescript
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
```

Furthermore, all UI mutation methods (add task, remove task, etc.) are moved onto the service. The service is then injected into the [component](/todo2/src/app/app.component.ts) as a dependency.
```typescript
export class AppComponent {

  constructor(private stateService: StateService) {}

  public tasks: Item[] = this.stateService.tasks;

  public addTask(task: string): void {
  	this.stateService.addTask(task);
  }
}
```
The above approach results in a cleaner component, and separates functional logic (service) from presentational components.

### 3. Observables [(RxJs)](https://medium.com/front-end-developers/managing-state-in-angular-2-using-rxjs-b849d6bbd5a5)
You can also use observables to manage state. In observable parlance, the `public task` property from previous examples would be a stream of observables, and the `HTML` would parse it with an `async |` pipe. This approach is pretty complicated, and I would recommend using Redux if you're going to use this approach. The upside is that there's less boilerplate than Redux, downside is that it really requires you to know `RxJS` very well.

The core of this approach is in the [`state.service.ts`](todo3/src/app/services/state.service.ts) file:

```typescript
@Injectable()
export class StateService {

	// item stream emits the most updated array of items; this is what components will subscribe to
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

    // here, we keep track of the array of tasks, and apply new actions to it
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
```

(pg. 84 of Haggerty's book gives a great overview of this approach)

The Observables + `async |` combo is pretty neat, and allows you to write more declarative code with less mutation. Reactive programming makes for cleaner and more concise code, but at the expense of its authors really needing to know `RxJS`.

Additionally, the ability to *inject* this state service wherever we want gives it Redux `store`-like properties. No more need to constantly pass properties and methods between parent and child components!


### 4. Redux/`ngrx/store`
Redux is a whole new beast, but given that the programming paradigm is same for both Angular and React, it may be worth investing in.

The key problem that Redux solves is that of state. If you revisit `todo1`, you'll recall that every component might have its own local `state`. This gets very messy and hard to maintain as apps become more complex, because you're constantly passing properties and methods between parent and child elements.

Redux's approach is to keep state in a single place, called a `store`, which can be accessed from anywhere in your SPA. It's not located on any individual component, and is most similar to having an Angular service dedicated purely to UI state. Although Redux was initially made for React, Angular has its own implementation of Redux called `ngrx/store`.

In learning how to use `ngrx/store`, it's very important to understand the philosophy behind the original Redux and how it actually works. For a true understanding of Redux's approach, I'd recommend starting out with the [free video tutorials](https://egghead.io/courses/getting-started-with-redux) on Egghead from Dan Abramov (creator of redux). The key is to understand what the `store` is, how to functionally alter state (immutable data, never any mutation), and what `actions` and `reducers` are.

Once you're familiar with how redux itself works, check out `ngrx/store` [intro](https://gist.github.com/btroncone/a6e4347326749f938510), [docs](https://github.com/ngrx/store) and an [egghead.io video tutorial](https://egghead.io/courses/build-redux-style-applications-with-angular-rxjs-and-ngrx-store) on how to create an Angular2 app using `ngrx/store` and RxJs. Once you're done with that, check out an [example app](https://github.com/ngrx/example-app) that actually uses `ngrx/store`. Feel free to structure your app after that example one!

## Additional Reading
One big question you'll have after learning `ngrx/store` is how we manage side-effects like HTTP requests. For this, read up on [`ngrx/effects`](https://github.com/ngrx/effects), refer back to the [example app](https://github.com/ngrx/example-app), and *make sure you understand Observables*.
