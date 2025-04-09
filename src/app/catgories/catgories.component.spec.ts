import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatgoriesComponent } from './catgories.component';

describe('CatgoriesComponent', () => {
  let component: CatgoriesComponent;
  let fixture: ComponentFixture<CatgoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatgoriesComponent]
    });
    fixture = TestBed.createComponent(CatgoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
