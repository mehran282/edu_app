import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfettiComponent } from './confetti.component';

describe('ConfettiComponent', () => {
  let component: ConfettiComponent;
  let fixture: ComponentFixture<ConfettiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfettiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfettiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
