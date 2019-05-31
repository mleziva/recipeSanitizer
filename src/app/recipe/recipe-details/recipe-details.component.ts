import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-recipe-details',
    templateUrl: './recipe-details.component.html'
})
export class RecipeDetailsComponent implements OnInit {
    recipeDetails = '';

    constructor(private route: ActivatedRoute, private http: HttpClient) { }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.getRecipe(params.recipeUrl);
                console.log(params.recipeUrl);
            });
    };

    getRecipe = (url) => {
        if(url == null || url == ''){
            this.recipeDetails = '';
            return;
        }
        this.http.get('http://localhost:3000/api/recipe/?recipeUrl=' + url)
            .subscribe(res => {
                this.recipeDetails = res.toString();
            }, (err) => {
                console.log(err);
            }
            );
    };
}