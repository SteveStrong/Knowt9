import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Toast, EmitterService } from "./shared/emitter.service";

@Component({
  selector: 'app-policymap',
  templateUrl: './policymap.component.html',
  styleUrls: ['./policymap.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translate3d(0, 0, 0)'
        })
      ),
      state(
        'out',
        style({
          transform: 'translate3d(100%, 0, 0)'
        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class PolicymapComponent implements OnInit {

  sliderState: string = 'out';

  constructor() { }

  ngOnInit() {
    EmitterService.processCommands(this);

    EmitterService.registerCommand(this, "Redraw", (args, source) => {
      this.sliderState = 'out';
    });

    // EmitterService.registerCommand(this, "Search", (args, source) => {
    //   this.sliderState = 'in';
    // });

    EmitterService.registerCommand(this, "InitSearch", (args, source) => {
      this.sliderState = 'in';
    });
  }

}
