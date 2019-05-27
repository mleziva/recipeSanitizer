import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class RecentRecipesService {
  messages: string[] = ["test1", "test2", "test3"];
  socket = io.connect('http://localhost:3000');
  
  constructor() {
    this.socket.on('newstest', function (data) {
      console.log(data);
    });
   }
}
