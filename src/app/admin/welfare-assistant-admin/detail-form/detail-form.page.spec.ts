import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFormPage } from './detail-form.page';

describe('DetailFormPage', () => {
  let component: DetailFormPage;
  let fixture: ComponentFixture<DetailFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
