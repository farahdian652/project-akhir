import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PengajarComponent } from './pengajar/pengajar.component';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { PesertaDidikComponent } from './peserta-didik/peserta-didik.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from './../../environments/environment';
import { DashboardComponent } from './dashboard/dashboard.component';

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EventsComponent } from './events/events.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'peserta-didik',
        component: PesertaDidikComponent
      },
      {
        path: 'detail-user',
        component: DetailUserComponent
      },
      {
        path: 'pengajar',
        component: PengajarComponent
      },
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      }
    ]
  },
]

@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    PesertaDidikComponent,
    DetailUserComponent,
    PengajarComponent,
    EventsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FlexLayoutModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [
    DatePipe
  ],
})
export class AdminModule { }
