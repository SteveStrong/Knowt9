import { Component, OnInit, Input, OnDestroy, HostListener } from "@angular/core";
import { Toast, EmitterService } from "../shared/emitter.service";

import { TeamsService } from "../models/teams.service";
import { AuthenticationService } from "../login/authentication.service";
import { LaTeamMember, LaTeam, LaUser } from "../models";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @Input() list: Array<LaUser>;
  
  constructor() { }

  ngOnInit() {
  }

}
