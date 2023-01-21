import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Toast, EmitterService } from "../shared/emitter.service";

import { HealthService } from "./health.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy  {
  list: Array<any>;

  constructor(private hService:HealthService) { }

  ngOnInit() {
    const s = this.hService.getHealth$().subscribe(data => {
      this.list = data;
      s.unsubscribe()
    })
  }

  ngOnDestroy() {
  }

}
