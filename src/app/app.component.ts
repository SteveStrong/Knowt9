import { Component, OnInit } from "@angular/core";
import { RouterOutlet, Router } from '@angular/router';


import { ToastrService } from "ngx-toastr";
import { EmitterService, Toast } from "./shared/emitter.service";

import { LegalCaseService } from "./models/legal-case.service";
import { TextToLSJsonService } from "./models/text-to-lsjson.service";
import { AuthenticationService } from "./login/authentication.service";
import { TeamsService } from "./models/teams.service";

import { ConfigService } from "./config.service";
import { environment } from "../environments/environment";
import { LaTeamMember, LaUser, LaTeam } from './models';

// https://medium.com/@jinalshah999/hosting-angular-application-on-azure-with-ci-cd-2afcb66d84bd

// https://code-maze.com/angular-material-navigation/

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "KnowtShare";
  version = environment.version;
  hasConfig = false;

  showFiller = false;

  constructor(
    private configService: ConfigService,
    private tService: TeamsService,
    private aService: AuthenticationService,
    private lService: LegalCaseService,
    private parser: TextToLSJsonService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  get currentUser():LaUser {
    const user = this.aService.currentUserValue;
    return user ? user : undefined;
  } 

  get currentTeam():LaTeam {
    const team = this.tService.activeTeam;
    return team ? team : undefined;
  } 

  doLogout(){
    this.aService.logout();
    location.reload(true);
  }

  isDirty(){
    return this.lService.isDirty() && this.autoSaveCountdown() > 0;
  }

  autoSaveCountdown(){
    return this.lService.autoSaveCountdown();
  }

  applyAutoSave(e:Event){
    let name = this.lService.getCurrentFile().name;
    name = name.replace('.txt','.json')
    EmitterService.broadcastCommand(this, "AutoSave", name);
  }

  onFileSave(e: any) {
    let name = this.currentFileName;
    EmitterService.broadcastCommand(this, "FileSave", name);

  }

  onOpenOrImport(file:File){
    let name = file.name.toLowerCase()
    if ( name.includes('.json')) {
      this.lService.setCurrentFile(file);
      EmitterService.broadcastCommand(this, "FileOpen", file);
    }
    if ( name.includes('.txt')) {
      this.parser.setCurrentFile(file);
      EmitterService.broadcastCommand(this, "ImportCase", file);
    }
  }

  onFileOpen(e: any) {
    this.router.navigate(['/reader']);

    let file = e.target.files[0];
    this.onOpenOrImport(file);
  }


  get currentFileName(){
    let file = this.lService.getCurrentFile();
    return file ? file.name : "";
  }



  openToast(type, title, message) {
    const options = {
      toastLife: 3000,
      showCloseButton: true,
      tapToDismiss: true,
      enableHTML: true,
      autoDismiss: false,
      dismiss: "click",
      newestOnTop: true,
      positionClass: "toast-bottom-right" //// "toast-bottom-left"  toast-top-full-width
    };

    setTimeout(_ => {
      this.toastr[type](title, message, options);
    }, 10);

    // this.toastrService.custom('<span style="color: red">Message in red.</span>', message,this.options);
    // $(".toast-bottom-right").attr("role", "dialog");
  }

  ngOnInit() {
    EmitterService.displayToast(this, this.openToast);

    setTimeout(_=>{
      this.aService.getIsUserAdmin$(this.currentUser).subscribe();
    }, 100)

    this.configService.getConfig().subscribe((data: any) => {
      const host = window.location.hostname;

      data && Object.keys(data).forEach(key => {
        environment[key] = data[key];
      });

      //local testing feature flags
      if ( environment.localDebug ) {

        this.lService.getSampleCase().subscribe()

      }

      // replace localhost name to use the service in the cloud, can remove/ignore if also running container locally
      if (host === "localhost") {
        // update with private ip of currently deployed awfclient
        // host = '10.194.60.94';
      }


      this.hasConfig = true;
      if ( this.currentUser) {
        this.tService.getActiveTeamFor$(this.currentUser.email).subscribe();
      }
      Toast.info("services are connected", "services config");
    });
  }
}
