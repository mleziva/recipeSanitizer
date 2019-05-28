import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecentRecipesService {
  socket = io.connect('http://localhost:3000');
  
  constructor(private http: HttpClient) { }
   initializeSocket = function(callback){
    this.socket.on('newSearch', function (searchedObject) {
      console.log(searchedObject.name);
      callback(searchedObject);
    });
   };
   recentSearches = function(callback){
    this.http.get('http://localhost:3000/api/recipe/recentSearches')
      .subscribe(res => {
        callback(res);
        return res;
      }, (err) => {
        console.log(err);
      }
      );
   }
}
