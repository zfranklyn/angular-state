import { Component, OnInit, Input } from '@angular/core';
import { Item } from './../models/item.model';
import { StateService } from './../services/state.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input() public task: Item;

  constructor(private stateService: StateService) { }

  public ngOnInit(): void {
  }

  public removeItem(e: Event): void {
    this.stateService.removeItem(this.task.description);
  }

}
