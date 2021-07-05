import { Injectable } from '@angular/core';

//http 
import { HttpClient, HttpHeaders } from "@angular/common/http";

//observables
import { Observable, throwError } from "rxjs";

//operators
import { map, catchError, flatMap } from "rxjs/operators";

//entry model
import { Entry } from "./entry.model";


@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "api/entries"

  constructor(private http: HttpClient) { }

  //GETALL
  getAll(): Observable<Entry[]>{
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    )
  }

  //GETBYID
  getById(id: any): Observable<Entry>{
    const url = `${this.apiPath}/${id}`;
    
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }


  //CREATE METHOD
  create(entry: Entry): Observable<Entry>{
    return this.http.post(this.apiPath, entry).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }


  //UPDATE METHOD
  update(entry: Entry): Observable<Entry>{
    const url = `${this.apiPath}/${entry.id}`;

    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry)
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

  //converting any<data> to Entry<data>
  private jsonDataToEntries(jsonData: any[]): Entry[]{
    const entries: Entry[] = [];
    //making a FOREACH of the map for each item and converting to Entry<date>
    jsonData.forEach(element => entries.push(element as Entry));
    return entries;
  }

  //converting any<data> to Entry<data>
  private jsonDataToEntry(jsonData: any): Entry{
    //return data converted to Entry<date>
    return jsonData as Entry;
  }

  //error catch
  private handleError(error: any): Observable<any>{
    console.log("ERRO NA REQUISIÇÂO =>", error);
    return throwError(error);
  }



}
