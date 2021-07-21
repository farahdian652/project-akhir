import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-pengajar',
  templateUrl: './pengajar.component.html',
  styleUrls: ['./pengajar.component.scss']
})
export class PengajarComponent implements OnInit {
  dataForm: any = {}
  listData: any = {}

  imgSrc: string = "assets/add-image.png";
  imgUrl: string = "";
  idPengajar?: string;
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
    this.checkUser();
    this.getData();
  }

  ngOnInit(): void {
  }

  checkUser() {
    this.auth.authState.subscribe(resp => {
      if (!resp) this.router.navigateByUrl('/auth')
    })
  }

  cleanData() {
    this.dataForm = {};
    this.idPengajar = null;
    this.imgSrc = "assets/add-image.png";
    this.loading = false;
    this.selectedImage!;
  }

  tambah() {
    this.loading = true;
    this.dataForm['created_at'] = this.datePipe.transform(this.now, 'MMM d, y, h:mm:ss a');

    if(this.imgUrl == "" && this.idPengajar != null) {
      this.fire.collection('pengajar').doc(this.idPengajar).update(this.dataForm);
      this.cleanData();
      this.showMessage = true;
    } else {
      console.log('tambah')
      var path = `pengajar/${this.imgUrl.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      var file = this.storage.ref(path);

      this.storage.upload(path, this.selectedImage).snapshotChanges().pipe(
        finalize(() => (
          file.getDownloadURL().subscribe((url) => {
            this.dataForm['image_url'] = url;

            if(this.idPengajar != null) {
              console.log('edit')

              this.fire.collection('pengajar').doc(this.idPengajar).update(this.dataForm);
            }
            else {
              console.log('tambah')
              this.fire.collection('pengajar').add(this.dataForm);
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
    this.fire.collection('pengajar', ref => ref.orderBy('created_at', 'desc')).snapshotChanges().subscribe((resp) => {
      this.listData = resp
      this.loadData = false;

      if (this.listData.length === 0) this.isEmpty = true;
      else this.isEmpty = false;
      
    })
  }

  detail(data: any, id: string) {
    this.idPengajar = id;
    this.dataForm = data;
    this.imgSrc = data['image_url'];
  }

  delete() {
    var _confirm = confirm("Yakin menghapus data ?");
    this.loading = true;
    
    if(_confirm) {
      this.fire
      .collection("pengajar")
      .doc(this.idPengajar)
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
