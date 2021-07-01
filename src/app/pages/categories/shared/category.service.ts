import { Injectable } from '@angular/core';

//http 
import { HttpClient, HttpHeaders } from "@angular/common/http";

//observables
import { Observable, throwError } from "rxjs";

//operators
import { map, catchError, flatMap } from "rxjs/operators";

//category model
import { Category } from "./category.model";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath: string = "api/categories"

  constructor(private http: HttpClient) { }

  //GETALL
  getAll(): Observable<Category[]>{
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    )
  }

  //GETBYID
  getById(id: number): Observable<Category>{
    const url = `${this.apiPath}/${id}`;
    
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }


  //CREATE METHOD
  create(category: Category): Observable<Category>{
    return this.http.post(this.apiPath, category).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }


  //UPDATE METHOD
  update(category: Category): Observable<Category>{
    const url = `${this.apiPath}/${category.id}`;

    return this.http.put(url, category).pipe(
      catchError(this.handleError),
      map(() => category)
    )
  }


  //DELETE METHOD
  delete(id:number): Observable<any>{
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  //PRIVATE METHODS

  //converting any<data> to Category<data>
  private jsonDataToCategories(jsonData: any[]): Category[]{
    const categories: Category[] = [];
    //making a FOREACH of the map for each item and converting to Category<date>
    jsonData.forEach(element => categories.push(element as Category));
    return categories;
  }

  //converting any<data> to Category<data>
  private jsonDataToCategory(jsonData: any): Category{
    //return data converted to Category<date>
    return jsonData as Category;
  }

  //error catch
  private handleError(error: any): Observable<any>{
    console.log("ERRO NA REQUISIÇÂO =>", error);
    return throwError(error);
  }



}
