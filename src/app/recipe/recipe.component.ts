import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  getRecipeUrl = '';
  constructor( private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
        this.getRecipeUrl = params.recipeUrl;
    });
  }
  getRecipe() {
    this.router.navigate(['/recipe'], { queryParams: { recipeUrl: encodeURI(this.getRecipeUrl) } });
  }
}
