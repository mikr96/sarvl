import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareAssistantAdminPage } from './welfare-assistant-admin.page';

describe('WelfareAssistantAdminPage', () => {
  let component: WelfareAssistantAdminPage;
  let fixture: ComponentFixture<WelfareAssistantAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelfareAssistantAdminPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelfareAssistantAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
