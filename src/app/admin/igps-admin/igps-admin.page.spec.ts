import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgpsAdminPage } from './igps-admin.page';

describe('IgpsAdminPage', () => {
  let component: IgpsAdminPage;
  let fixture: ComponentFixture<IgpsAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgpsAdminPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgpsAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
