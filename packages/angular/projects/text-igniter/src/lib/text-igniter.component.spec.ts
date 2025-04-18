import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextIgniterComponent } from './text-igniter.component';

describe('TextIgniterComponent', () => {
  let component: TextIgniterComponent;
  let fixture: ComponentFixture<TextIgniterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextIgniterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextIgniterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
