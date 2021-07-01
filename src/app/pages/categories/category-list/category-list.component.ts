import { CategoryService } from './../shared/category.service';
import { Component, OnInit } from '@angular/core';

import { Category } from "../shared/category.model";


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  providers: [CategoryService]
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoService: CategoryService) { }

  ngOnInit(): void {
    this.categoService.getAll().subscribe(
      categories => this.categories = categories,
      error => alert('Erro ao carregar a lista')
    )
  }


  deleteCategory(category: any){
    const mustDelete = confirm("Deseja realmente excluir esse item?");

    if(mustDelete){
      this.categoService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(element => element != category),
        () => alert("Erro ao excluir")
      )
    }

  }

}
