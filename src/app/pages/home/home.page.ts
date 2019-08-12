import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // var $grid = $('div.grid').isotope();
    // $(document).ready(function(){
    //   console.log("test")
    // })

    // // filter items on button click
    // $('.list-group').on('click', 'li', function () {
    //   var filterValue = $(this).attr('data-filter');
    //   $(this).toggleClass('is-checked');
    //   $grid.isotope({ filter: filterValue });
    // });

    $('.list-group').on('click', 'ion-col', function () {
      console.log('test')
      //this.pagesService.getListByCategory()
    });

    $(".sticky").click(()=>{
      this.router.navigateByUrl('/pages/create-event')
    })
  }

  
}
