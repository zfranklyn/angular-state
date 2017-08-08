# State Management in Angular

In a complex SPA with many sources of data flowing left and right, you may be wondering *where* you should store data. For instance:

- Where do I keep track of UI state? whether this modal is open? whether user selected "light" vs "dark" theme?
- In a messaging app, where should all my messages be stored?
- If multiple components need access to the same source of data, where should I keep the data? As a property on the parent component? or as a property on a service?

Let's go over a few approaches to state management.

### 1. On Closest Relevant Component

The immediately obvious approach is to keep things on components themselves -- specifically, the closest relevant component.

```typescript
  export class AppComponent {
    // we keep track of UI data on the component itself.
    public tasks: Item[] = mockItems;

    public addTask(task: string): void {
      this.tasks.push(new Item({description: task}));
    }

  }
```

When choosing the 'closest relevant component', you should consider whether the data needs to be shared. Consider the following scenario:
```
  Component A
 / \       \ /
  |         |
  B         C
```
If `Component C` renders data that is changed by `Component B`, you'd want to keep the data on the parent `Component A`. This way, `B` passes data up to `A`, and `C` gets its data from `A`. Think of this as an algorithm looking for the most central node in a graph, which edges being the flow of data. This requires you to use Angular2 `@Input()` and `@Output()` decorators, and can quickly get out of hand if you have deeply nested elements. Therefore if you do choose this approach, plan out your data architecture carefully, and make sure data stored on a component is accessible by others that need it.

### 2. On a Service
The second approach places state on a separate service. Since services can be injected wherever they are needed, this approach allow sharing state between components without convoluted `@Input()` `@Output()` relationships.

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

Furthermore, all UI mutation methods (add task, remove task, etc.) are moved onto the service. The service is then injected into the component as a dependency.
```typescript
export class AppComponent {
  // uses the state.service.ts to access and mutate state.
  constructor(private stateService: StateService) {}

  public tasks: Item[] = this.stateService.tasks;

  public addTask(task: string): void {
  	this.stateService.addTask(task);
  }
}
```
The above approach results in a cleaner component, and separates functional logic (service) from presentational components. This approach is very similar to Redux.

### 3. Observables [(RxJs)](https://medium.com/front-end-developers/managing-state-in-angular-2-using-rxjs-b849d6bbd5a5)
You can also use observables to manage state. In observable parlance, the `public task` property from previous examples would be a stream of observables, and the `HTML` would parse it with an `async |` pipe. This approach is pretty complicated, and I'd personally recommend using Redux if you're going to use this approach. The upside is that there's less boilerplate than Redux, downside is that it involves a lot of tricky work with `RxJS`.

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

The Observables + `async |` combo is pretty neat, and allows you to write more declarative code with less mutation. Reactive programming makes for cleaner and more concise code, but at the expense of its authors really needing to know `RxJS`.

Like the previous approach, the ability to *inject* this state service wherever we want gives the rpesent approach Redux-like properties. No more need to constantly pass properties and methods between parent and child components!

### 4. Redux/`ngrx/store`

#### Learning Redux
Redux is a whole new beast, but given that the programming paradigm is same for both Angular and React, it may be worth investing in.

The key problem that Redux solves is that of state. If you revisit our first approach, you'll recall that every component might have its own local `state`. This gets very messy and hard to maintain as apps become more complex, because you're constantly passing properties and methods between parent and child elements.

Redux's approach is to keep state in a single place, called a `store`, which can be accessed from anywhere in your SPA. It's not located on any individual component, and is most similar to having an Angular service dedicated purely to UI state. Although Redux was initially made for React, Angular has its own implementation of Redux called `ngrx/store`.

In learning how to use `ngrx/store`, it's very important to understand the philosophy behind the original Redux and how it actually works. For a true understanding of Redux's approach, I'd recommend starting out with the [free video tutorials](https://egghead.io/courses/getting-started-with-redux) on Egghead from Dan Abramov (creator of redux). The key is to understand what the `store` is, how to functionally alter state (immutable data, never any mutation), and what `actions` and `reducers` are.

Once you're familiar with how redux itself works, check out `ngrx/store` [intro](https://gist.github.com/btroncone/a6e4347326749f938510), [docs](https://github.com/ngrx/store) and an [egghead.io video tutorial](https://egghead.io/courses/build-redux-style-applications-with-angular-rxjs-and-ngrx-store) on how to create an Angular2 app using `ngrx/store` and RxJs. Once you're done with that, check out an [example app](https://github.com/ngrx/example-app) that actually uses `ngrx/store`. Feel free to structure your app after that example one!

#### A Redux Example
I'll assume that you've taken a good look at the tutorials above. In the following section, I'll provide a brief overview of how our `todolist` app from previous examples would look like in Redux. 

First, our file structure would contain folders and files for `actions`, `reducers`, and `effects`.

```
- src
  - actions
    - task.action.ts
  - effects
    - task.effect.ts
  - reducers
    - task.reducer.ts
```
##### Actions
*Actions* define the range of possible actions we can execute upon our `store`:
```typescript
import { Action } from '@ngrx/store';

export const ADD_TASK = 'ADD_TASK';
export const REMOVE_TASK = 'REMOVE_TASK';

export class AddTaskAction implements Action {
  public type = ADD_TASK;
  constructor(public payload: string) {}
}

export class RemoveTaskAction implements Action {
  public type = REMOVE_TASK;
  constructor(public payload: string) {}
}
```

Why do we want to use `Action` from `@ngrx/store`? Because we need it in order to use `@ngrx/effects`, which is a crucial side-effect library for making API calls in conjunction with action dispatches.

If you wanted to add a task, you would simple create a new instance of the `action` and dispatch it to the store:
```typescript
export class InputComponent implements OnInit {

  @ViewChild('input') public input: ElementRef;

  constructor(private store: Store<any>) {
  }

  public ngOnInit() {
  }

  public addTask(e: any): void {
  	e.preventDefault();

  	const taskDescription: string = this.input.nativeElement.value;

  	if (taskDescription) {
  		this.input.nativeElement.value = '';
  		this.store.dispatch(new AddTaskAction(taskDescription)); // dispatch a new action to the store
  	}
  }
}
```

Predefining the range of possible `actions` this way makes our codebase cleaner. If subsequent developers wanted to add actions or state properties, they would simply add more code conforming to this style.

##### Reducers
So what happens to an `action` after it is dispatched to the `store`? It goes through to its corresponding `reducer`:
```typescript
export const initialState: Task[] = mockTasks;

export function taskReducer(state: Task[] = mockTasks, action: {type: any, payload: any}) {
	switch (action.type) {
		case ADD_TASK:
			let taskDescription = action.payload;
			const newTask = new Task({description: taskDescription});
			return Object.assign([], [...state, newTask]);
		case REMOVE_TASK:
			let taskToRemove = action.payload;
			return Object.assign([], state.filter((t: Task) => t.description !== taskToRemove));
		default:
			return state;
	}
}
```

If you look at the above `reducer` code in conjunction with the `action` code, you'll see that `ADD_TASK` and `REMOVE_TASK` are imported directly from the `actions` file; the switch statement corresponds exactly with the range of possible actions. In the `reducer` file, you define how you want your actions to affect the `store` state.

##### Effects
Documentation on `@ngrx/effects` are sparse, so they're worth mentioning here. `effects` can 'latch on' to any action you specify, and run any additional code you want it to. Remember how we have two actions, `ADD_TASK` and `REMOVE_TASK`? If you look at our `task.effects.ts`, you'll see that we've defined side-effects for both actions. This means everytime either action is dispatched, the associated `effect` code will run:

```typescript
import { ADD_TASK, REMOVE_TASK } from './../actions/task.action';

@Injectable()
export class TaskEffects {

  constructor(private actions$: Actions) { }

  @Effect({dispatch: false}) // {dispatch: false} is necessary to prevent infinite loop
  public addTask: Observable<Action> = this.actions$
    .ofType(ADD_TASK)
    .map((action: Action) => {
      // there could easily be an API call in here
      console.log(`Side Effect can be configured here (e.g., API call)`);
      return action;
    });

  @Effect({dispatch: false})
  public removeTask: Observable<Action> = this.actions$
    .ofType(REMOVE_TASK)
    .map(toPayload) // extracts the payload
    .do((payload: string) => {
      // there could easily be an API call in here
      console.log(`Removing '${payload}'; possible side effect can be configured (e.g., API)`)
    });
}
```

`effects` can be confusing, and require a deeper understanding of Observables.

##### `app.module`
Finally, you'll need to add some code into `app.module`:
```typescript
import { StoreModule } from '@ngrx/store';
import { taskReducer } from './reducers/task.reducer';
import { TaskEffects } from './effects/tasks.effect';

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    InputComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ tasks: taskReducer }),
    EffectsModule.forRoot([TaskEffects]),
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Final Thoughts
I'd recommend using `@ngrx/store` when developing in Angular2, especially when bootstrapping applications on a team. It's an opinionated, unified approach to state management. Once members on the team understand its best practices, adding/removing/changing actions on state becomes easy. No more need to do UI restructurings mid-project!