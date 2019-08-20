import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqAdminPage } from './faq-admin.page';

describe('FaqAdminPage', () => {
  let component: FaqAdminPage;
  let fixture: ComponentFixture<FaqAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqAdminPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
