import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualcanvasComponent } from './actualcanvas.component';

describe('ActualcanvasComponent', () => {
  let component: ActualcanvasComponent;
  let fixture: ComponentFixture<ActualcanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualcanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
