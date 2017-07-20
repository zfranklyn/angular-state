import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Task } from './../models/task.model';
import { ADD_TASK } from './../actions/task.action';

@Injectable()
export class TaskEffects {

  constructor(private actions$: Actions) { }

  @Effect()
  addTask: Observable<Action> = this.actions$
    .ofType(ADD_TASK)
    .do(console.log);

}