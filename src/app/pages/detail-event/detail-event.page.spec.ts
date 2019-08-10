import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEventPage } from './detail-event.page';

describe('DetailEventPage', () => {
  let component: DetailEventPage;
  let fixture: ComponentFixture<DetailEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailEventPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
