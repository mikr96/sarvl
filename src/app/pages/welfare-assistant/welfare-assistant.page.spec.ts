import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelfareAssistantPage } from './welfare-assistant.page';

describe('WelfareAssistantPage', () => {
  let component: WelfareAssistantPage;
  let fixture: ComponentFixture<WelfareAssistantPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelfareAssistantPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelfareAssistantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
