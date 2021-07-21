import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  loading: boolean = true;

  username: string;
  listEvent: any = {};

  totalPengajar: number = 0;
  totalEvent: number = 0;
  totalPeserta: number = 0;

  emptyEvent: boolean = true;

  constructor(
    private auth: AngularFireAuth,
    private fire: AngularFirestore
  ) { 
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.auth.authState.subscribe(resp => {
      this.fire.collection('user').ref.where('email', '==', resp!.email).onSnapshot(snapshot => {
        snapshot.forEach(ref => {
          var _data = ref.data()
          this.username = _data['username'];

          this.getListEvent();
        })
      })
    })
  }

  getLength() {
    this.fire.collection('pengajar').snapshotChanges().subscribe((resp) => {
      this.totalPengajar = resp.length;
    })

    this.fire.collection('peserta-didik').snapshotChanges().subscribe((resp) => {
      this.totalPeserta = resp.length;
    })

    this.fire.collection('events').snapshotChanges().subscribe((resp) => {
      this.totalEvent = resp.length;
    })
  }

  getListEvent() {
    this.fire.collection('events', ref => (
      ref.orderBy('created_at', 'desc'),
      ref.limit(5)
    )).snapshotChanges().subscribe((resp) => {
      this.listEvent = resp;
      this.getLength();

      if(resp.length != 0) this.emptyEvent = false;
      else this.emptyEvent = true;

      this.loading = false;
    })
  }
}
