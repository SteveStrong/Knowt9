import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoryGridComponent } from './directory-grid.component';

describe('DirectoryGridComponent', () => {
  let component: DirectoryGridComponent;
  let fixture: ComponentFixture<DirectoryGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectoryGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
