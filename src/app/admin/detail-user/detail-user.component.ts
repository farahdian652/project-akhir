import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent implements OnInit {

  loading: boolean = true;
  showMessage: boolean = false;
  isCollapsed: boolean = true;
  idUser: string;

  user: any = {};

  constructor(
    public auth: AngularFireAuth,
    private fire: AngularFirestore,
    private router: Router
  ) {
    // this.checkAuth();
   }

  ngOnInit(): void {
    this.checkAuth();
  }

  checkAuth() {
    this.auth.authState.subscribe(resp => {
      if (!resp) {
        this.router.navigateByUrl('/auth')
      } else {
        this.fire.collection('user', ref => ref.where('email', '==', resp.email)).snapshotChanges().subscribe((data) => {
          this.user = data[0].payload.doc.data();
          this.idUser = data[0].payload.doc.id;
          this.loading = false;
        })
      }
    })
  }

  simpan() {
    this.loading = true;
    this.fire.collection('user').doc(this.idUser).update(this.user).then((resp) => {
      this.loading = false;
      this.showMessage = true;
    });
  }

  closeAlert() {
    this.showMessage = false;
  }

}
