import { TestBed } from '@angular/core/testing';

import { MoleService } from './mole.service';

describe('MoleService', () => {
  let service: MoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
