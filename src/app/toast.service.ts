import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  sendToast(text: String) {
    console.log(text);
  }
}
