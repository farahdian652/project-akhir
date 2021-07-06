import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loading: boolean = false;
  email: string;
  password: string;
  errorMessage?: String;
  showError: boolean = false;

  constructor(
    public auth: AngularFireAuth,
    private route: Router,
  ) { 
    auth.authState.subscribe(resp => {
      if (resp) {
        route.navigateByUrl('admin')
      }
    })
  }

  ngOnInit(): void {
  }

  tapLogin() {
    this.loading = true;
    this.auth.signInWithEmailAndPassword(
      this.email,
      this.password
    ).then((resp) => {
      this.loading = false;
      this.route.navigateByUrl('admin/')
    }).catch((err) => {
      this.loading = false;
      this.errorMessage = err['code'];
      this.showError = true;
    })
  }

  closeAlert() {
    this.showError = false;
  }

}
