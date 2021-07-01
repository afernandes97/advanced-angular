import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesRoutingModule } from './pages/categories/categories-routing.module';
import { CategoryFormComponent } from './pages/categories/category-form/category-form.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';

const routes: Routes = [
  { path: 'categories', component: CategoryListComponent},
  { path: 'categories/new', component: CategoryFormComponent},
  { path: 'categories/:id/edit', component: CategoryFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
