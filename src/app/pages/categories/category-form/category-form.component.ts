
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";
import { switchMap } from "rxjs/operators";

import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  
  //verifica se esta criando ou editando evento
  currentAction!: string;
  //
  categoryForm!: FormGroup;
  //identifica o title da pag
  pageTitle!: string;
  //guarda as mensagens de erro do servidor
  serverErrorMessages!: string[] ;
  //verifica clicao enviado para desabilitar
  submittingForm: boolean = false;
  //objeto de recurso da pag
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder,
    private toastr: ToastrService
    
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  
  ngAfterContentChecked(){
    this.setPageTitle();
  }


  submitForm(){
    this.submittingForm = true;

    if(this.currentAction == "new"){
      this.createCategory()
      
    }else{
      //currentaction == edit
      this.updateCategory()
    }
  }

  //PRIVATES METHODS
  private setCurrentAction(){
    
    if(this.route.snapshot.url[1].path == "new"){
      this.currentAction = "new"
    }else{
      this.currentAction = "edit"
    }
  }

  private buildCategoryForm(){
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null,[Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }


  private loadCategory(){

    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
      
        switchMap(
          params =>       
          this.categoryService.getById(params.get('id'))
          )
          
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category)// binds loaded category data to categoryform
        },
        (error) => alert('Ocorreu um erro no Servidor, tente novamente mais tarde')
      )
    }
  }


  private setPageTitle(){
    if(this.currentAction == "new"){
      this.pageTitle = "Cadastro de Nova Categoria"
    }else{
      const categoryName = this.category.name || ""
      this.pageTitle = "Editando Categoria: " + categoryName

    }
  }

  private createCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category)
      .subscribe(
        (category) => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )
  }

  private actionsForSuccess(category: Category){
    this.toastr.success("Item Adicionado com sucesso")
    //redirect/reload component page
    this.router.navigateByUrl("categories", {skipLocationChange: true}).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    )
  }

  private actionsForError(error: string){
   this.toastr.error("Ocorreu um erro ao processar a solicitação");
    this.submittingForm = false;
  }
  
  private updateCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    
    this.categoryService.update(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )
  }
}
