import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Toast, EmitterService } from "../shared/emitter.service";

import { LibraryService } from "../models/library.service";
import { AuthenticationService } from "../login/authentication.service";

import { LaCaseDirectoryItem, LaTeam } from "../models";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  @Input() team: LaTeam;
  list: Array<LaCaseDirectoryItem>;

  constructor(
    private lService: LibraryService, 
    private aService: AuthenticationService) {

    EmitterService.registerCommand(this, "Saved", this.doRefreshCases);
    EmitterService.processCommands(this);
  }

  public doRefreshCases() {
    const workspace = this.team.workspace;
    let s1 = this.lService.getCasesInWorkspace$(workspace).subscribe(data => {
      this.list = data;

      s1.unsubscribe()
    })
  }

  ngOnInit() {
    this.doRefreshCases();
  }

}
