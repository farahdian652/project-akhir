import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-peserta-didik',
  templateUrl: './peserta-didik.component.html',
  styleUrls: ['./peserta-didik.component.scss']
})
export class PesertaDidikComponent implements OnInit {
  dataForm: any = {}
  listData: any = {}

  imgSrc: string = "assets/add-image.png";
  imgUrl: string = "";
  idPesertaDidik?: string;
  selectedImage?: string;
  now: number = Date.now();

  isEmpty: boolean = true;
  loading: boolean = false;
  loadData: boolean = true;
  isCollapsed: boolean = true;
  showMessage: boolean = false;

  constructor(
    public auth: AngularFireAuth,
    public router: Router,
    private storage: AngularFireStorage,
    private fire: AngularFirestore,
    private datePipe: DatePipe
  ) { 
    this.getData();
  }

  ngOnInit(): void {
  }

  cleanData() {
    this.dataForm = {};
    this.idPesertaDidik = null;
    this.imgSrc = "assets/add-image.png";
    this.loading = false;
    this.selectedImage!;
  }

  tambah() {
    this.loading = true;
    this.dataForm['created_at'] = this.datePipe.transform(this.now, 'MMM d, y, h:mm:ss a');

    if(this.imgUrl == "" && this.idPesertaDidik != null) {
      this.fire.collection('peserta-didik').doc(this.idPesertaDidik).update(this.dataForm);
      this.cleanData();
      this.showMessage = true;
    } else {
      console.log('tambah')
      var path = `peserta-didik/${this.imgUrl.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      var file = this.storage.ref(path);

      this.storage.upload(path, this.selectedImage).snapshotChanges().pipe(
        finalize(() => (
          file.getDownloadURL().subscribe((url) => {
            this.dataForm['image_url'] = url;

            if(this.idPesertaDidik != null) {
              this.fire.collection('peserta-didik').doc(this.idPesertaDidik).update(this.dataForm);
            }
            else {
              this.fire.collection('peserta-didik').add(this.dataForm);
            }
            this.showMessage = true;
            this.cleanData();
          })
        ))
      ).subscribe()
    }
  }

  getImage(url: any) {
    if(url.target.files && url.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (u: any) => this.imgSrc = u.target.result;
      reader.readAsDataURL(url.target.files[0]);
      this.selectedImage! = url.target.files[0];
      this.imgUrl = url.target.files[0]['name'];
    } else {
      this.cleanData();
    }
  }

  getData() {
    this.fire.collection('peserta-didik', ref => ref.orderBy('created_at', 'desc')).snapshotChanges().subscribe((resp) => {
      this.listData = resp
      this.loadData = false;

      if (this.listData.length === 0) this.isEmpty = true;
      else this.isEmpty = false;
      
    })
  }

  detail(data: any, id: string) {
    this.idPesertaDidik = id;
    this.dataForm = data;
    this.imgSrc = data['image_url'];
  }

  delete() {
    var _confirm = confirm("Yakin menghapus data ?");
    this.loading = true;
    
    if(_confirm) {
      this.fire
      .collection("peserta-didik")
      .doc(this.idPesertaDidik)
      .delete().then(mod => {
        this.loading = false;
      });
    } else {
      this.loading = true;
    }
    this.cleanData();
  }

  closeAlert() {
    this.showMessage = false;
  }

}
