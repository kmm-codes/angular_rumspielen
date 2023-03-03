import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GolsettingsComponent } from './golsettings.component';

describe('GolsettingsComponent', () => {
  let component: GolsettingsComponent;
  let fixture: ComponentFixture<GolsettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GolsettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GolsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
