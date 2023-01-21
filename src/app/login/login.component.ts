import { Component, OnInit } from "@angular/core";
import { Toast, EmitterService } from "../shared/emitter.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { AuthenticationService } from "./authentication.service";
import { TeamsService } from "../models/teams.service";

@Component({ templateUrl: "login.component.html" })
export class LoginComponent implements OnInit {


  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tService: TeamsService,
    private aService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.aService.currentUserValue) {

      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.aService.login(this.loginForm.value, () => this.loading = false).subscribe(
        user => {
          if ( user ){
            Toast.success(`Hello, ${user.fullName()}`, "welcome back");
            this.aService.getIsUserAdmin$(user).subscribe(_ => {
              this.router.navigate([this.returnUrl]);
            });

            //lets get the current team to display as well
            this.tService.getActiveTeamFor$(user.email).subscribe();
          }
        });
  }
}
