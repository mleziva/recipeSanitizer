import { TestBed } from '@angular/core/testing';

import { RecentRecipesService } from './recent-recipes.service';

describe('RecentRecipesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecentRecipesService = TestBed.get(RecentRecipesService);
    expect(service).toBeTruthy();
  });
});
