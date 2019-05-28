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
    //get recent searches
    this.recentRecipeService.recentSearches(this.setRecentRecipes);
    this.recentRecipeService.initializeSocket(this.addRecentRecipe);
    //set socketcallback to update recentrecipes
  };
  setRecentRecipes = (recentRecipesArray) => {
    this.recentRecipes = recentRecipesArray;
  };
  addRecentRecipe  = (searchObject) => {
    this.recentRecipes.unshift(searchObject)
    if(this.recentRecipes.length >= 20){
      this.recentRecipes.length = 20;
    }
  };
}
