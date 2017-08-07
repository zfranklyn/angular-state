import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Task } from './../models/task.model';
import { ADD_TASK, REMOVE_TASK } from './../actions/task.action';

@Injectable()
export class TaskEffects {

  constructor(private actions$: Actions) { }

  @Effect({dispatch: false}) // {dispatch: false} is necessary to prevent infinite loop
  public addTask: Observable<Action> = this.actions$
    .ofType(ADD_TASK)
    .map((action: Action) => {
      console.log(`Side Effect can be configured here (e.g., API call)`);
      return action;
    });

  @Effect({dispatch: false})
  public removeTask: Observable<Action> = this.actions$
    .ofType(REMOVE_TASK)
    .map(toPayload) // extracts the payload
    .do((payload: string) => {
      console.log(`Removing '${payload}'; possible side effect can be configured (e.g., API)`)
    }); // then you can do what you want with it
}