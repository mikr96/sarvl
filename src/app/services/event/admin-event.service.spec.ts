import { TestBed } from '@angular/core/testing';

import { AdminEventService } from './admin-event.service';

describe('AdminEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminEventService = TestBed.get(AdminEventService);
    expect(service).toBeTruthy();
  });
});
