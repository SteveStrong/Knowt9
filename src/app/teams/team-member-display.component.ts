import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Toast, EmitterService, iPayloadWrapper } from "../shared";

import { TeamsService } from "../models/teams.service";
import { LaTeamMember, LaUser } from "../models";

@Component({
  selector: 'app-team-member-display',
  templateUrl: './team-member-display.component.html',
  styleUrls: ['./team-member-display.component.scss']
})
export class TeamMemberDisplayComponent implements OnInit {
  @Input() user: LaUser;
  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.user = null;
  }

}
