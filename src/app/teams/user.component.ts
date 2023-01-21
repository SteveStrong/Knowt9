import { Component, OnInit, Input } from '@angular/core';
import { LaUser } from '../models';

import { AuthenticationService } from "../login/authentication.service";
import { Toast, EmitterService } from "../shared/emitter.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() user: LaUser;
  confirmDelete = false;

  constructor(
   private aService: AuthenticationService) {
  }

  ngOnInit() {
    var s = this.aService.getIsUserAdmin$(this.user).subscribe(_ => {
      EmitterService.broadcastCommand(this, "ReplaceUser",[this.user]);
      s.unsubscribe();
    })
  }

  isAdmin(){
    return this.user.isAdmin();
  }

  doRemoveMember() {
    this.confirmDelete = !this.confirmDelete;
  }
  
  deleteText(){
    return this.confirmDelete ? "Save": "Delete";
  }

  doDeleteMember() {
    this.confirmDelete = !this.confirmDelete;
  }

  doConfirmDelete() {
    this.confirmDelete = false;
    var s = this.aService.getDeleteUser$(this.user).subscribe(_ => {
      EmitterService.broadcastCommand(this, "RemoveUser",[this.user]);
      s.unsubscribe();
      this.user = undefined;
    })
  }
}
