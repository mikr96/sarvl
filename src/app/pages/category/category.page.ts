import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  category: string = ''

  constructor() { }

  ngOnInit() {
    this.category = localStorage.getItem('category');
  }

}
