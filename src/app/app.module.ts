import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PageEvent } from '@angular/material/paginator';

import { RouterModule, Routes } from '@angular/router';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProductsComponent } from './products/products.component';
import { CatgoriesComponent } from './catgories/catgories.component';
import { UsersComponent } from './users/users.component';
import { UploadComponent } from './upload/upload.component';
import { UserlistComponent } from './userlist/userlist.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'catgories', component: CatgoriesComponent },
  { path: 'product', component: ProductsComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UsersComponent },
  { path: 'userlist', component: UserlistComponent },

  // Add more routes here as needed
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProductsComponent,
    CatgoriesComponent,
    UsersComponent,
    UploadComponent,
    UserlistComponent,
  ],
  imports: [
    BrowserModule,
    MatFormFieldModule,
    MatPaginatorModule,
    AppRoutingModule,MatPaginatorModule,
    BrowserModule, ReactiveFormsModule, FormsModule, HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule
    
,MatInputModule, MatTableModule, MatSortModule, 
    [RouterModule.forRoot(routes)],
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
