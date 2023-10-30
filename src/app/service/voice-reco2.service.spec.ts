import { TestBed } from '@angular/core/testing';

import { VoiceReco2Service } from './voice-reco2.service';

describe('VoiceReco2Service', () => {
  let service: VoiceReco2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceReco2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
