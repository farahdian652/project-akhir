import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PengajarComponent } from './pengajar.component';

describe('PengajarComponent', () => {
  let component: PengajarComponent;
  let fixture: ComponentFixture<PengajarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PengajarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PengajarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
