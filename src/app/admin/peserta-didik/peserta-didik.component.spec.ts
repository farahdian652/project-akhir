import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesertaDidikComponent } from './peserta-didik.component';

describe('PesertaDidikComponent', () => {
  let component: PesertaDidikComponent;
  let fixture: ComponentFixture<PesertaDidikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PesertaDidikComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PesertaDidikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
