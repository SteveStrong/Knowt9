import { Component, OnInit, Input } from '@angular/core';
import { Toast, EmitterService } from "../shared/emitter.service";
import { RouterOutlet, Router } from '@angular/router';

import { LegalCaseService } from "../models/legal-case.service";
import { LaCaseDirectoryItem } from "../models";

@Component({
  selector: 'app-directory-item',
  templateUrl: './directory-item.component.html',
  styleUrls: ['./directory-item.component.scss']
})
export class DirectoryItemComponent implements OnInit {
  @Input() item: LaCaseDirectoryItem;
  @Input() showWorkspace: boolean = false;

  constructor(
    private lcService: LegalCaseService, 
    private router: Router) {}

  ngOnInit() {
  }

  doLoadItem(obj:LaCaseDirectoryItem) {
    this.lcService.onOpenCaseFromServer(obj);
    this.router.navigate(['/reader'])
  }
}
