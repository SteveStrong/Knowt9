import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Toast, EmitterService } from "../shared/emitter.service";

import { LibraryService } from "../models/library.service";
import { TeamsService } from "../models/teams.service";
import { AuthenticationService } from "../login/authentication.service";

import { LaCaseDirectoryItem, LaTeam } from "../models";

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  list: Array<LaCaseDirectoryItem>;
  listAllFiles: Array<LaCaseDirectoryItem>;
  teams: Array<LaTeam>;
  currentWorkspace:string = "";

  constructor(
    private lService: LibraryService, 
    private aService: AuthenticationService,
    private tService: TeamsService) {

    EmitterService.registerCommand(this, "Saved", this.doRefreshWorkspaces);
    EmitterService.processCommands(this);
  }

  doSelectDefaultTeam(team:LaTeam){
    this.tService.setActiveTeam(team);
    EmitterService.broadcastCommand(this, "SelectTeam", team);
  }

  public doRefreshWorkspaces() {
    const leader = this.aService.currentUserValue.email;
    let s1 = this.tService.getTeamMembersFor$(leader).subscribe(data => {
      this.teams = data;

      s1.unsubscribe()
    })
  }

  public doRefreshAllFiles() {
    const admin = this.aService.currentUserValue.isAdmin();
    if (admin == true) {
      let s1 = this.lService.getAllCases$().subscribe(data => {
        this.listAllFiles = data;
        s1.unsubscribe()
      })
    }
  }

  ngOnInit() {
    this.doRefreshWorkspaces();
    this.doRefreshAllFiles();
  }


}
