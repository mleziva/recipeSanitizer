import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  url = '';
  clickMessage = '';
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  onClickMe() {

    this.http.get('http://localhost:3000/api/recipe/?recipeUrl=' + encodeURI(this.url))
    .subscribe(res => {
      this.clickMessage = res.toString();
      }, (err) => {
        console.log(err);
      }
    );
    }
}
