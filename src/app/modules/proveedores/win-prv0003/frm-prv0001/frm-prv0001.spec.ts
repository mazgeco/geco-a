import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmPrv0001 } from './frm-prv0001';

describe('FrmPrv0001', () => {
  let component: FrmPrv0001;
  let fixture: ComponentFixture<FrmPrv0001>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrmPrv0001],
    }).compileComponents();

    fixture = TestBed.createComponent(FrmPrv0001);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
