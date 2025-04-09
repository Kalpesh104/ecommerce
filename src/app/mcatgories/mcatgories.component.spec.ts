import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McatgoriesComponent } from './mcatgories.component';

describe('McatgoriesComponent', () => {
  let component: McatgoriesComponent;
  let fixture: ComponentFixture<McatgoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [McatgoriesComponent]
    });
    fixture = TestBed.createComponent(McatgoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
