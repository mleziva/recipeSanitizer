import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentRecipesComponent } from './recent-recipes.component';

describe('RecentRecipesComponent', () => {
  let component: RecentRecipesComponent;
  let fixture: ComponentFixture<RecentRecipesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentRecipesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
