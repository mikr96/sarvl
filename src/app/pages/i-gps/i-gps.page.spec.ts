import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IGPSPage } from './i-gps.page';

describe('IGPSPage', () => {
  let component: IGPSPage;
  let fixture: ComponentFixture<IGPSPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IGPSPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IGPSPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
