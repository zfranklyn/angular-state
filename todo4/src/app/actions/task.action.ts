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

export class ToggleTaskState implements Action {
  public type = REMOVE_TASK;
  constructor(public payload: string) {}
}