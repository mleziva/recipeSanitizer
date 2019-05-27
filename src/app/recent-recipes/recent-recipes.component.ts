import { Component, OnInit } from '@angular/core';

import { RecentRecipesService } from '../recent-recipes.service';

@Component({
  selector: 'app-recent-recipes',
  templateUrl: './recent-recipes.component.html',
  styleUrls: ['./recent-recipes.component.css']
})
export class RecentRecipesComponent implements OnInit {
  recentRecipes = [];

  constructor(private recentRecipeService: RecentRecipesService) { }

  ngOnInit() {
    this.recentRecipes = this.recentRecipeService.messages;
  }

}
