import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FileService } from './file.service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';

export interface UserData {
  id: number;
  name: string;
  price?: string;
}

export interface ProductApiResponse {
  data: UserData[];
  total: number;
  page: number;
  limit: number;
}

@Component({
  selector: 'app-catgories',
  templateUrl: './catgories.component.html',
  styleUrls: ['./catgories.component.css']
})
export class CatgoriesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'price', 'actions'];
  dataSource = new MatTableDataSource<UserData>();
  selectedFile!: File;
  newUser: Partial<UserData> = { name: '', price: '' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fileService: FileService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDataFromAPI();
  }
  totalItems = 0;
pageSize = 5;
currentPage = 0;


onPageChange(event: PageEvent) {
  this.pageSize = event.pageSize;
  this.currentPage = event.pageIndex;
  this.fetchDataFromAPI();
}

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => this.fetchDataFromAPI());
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0; // reset page index on sort
      this.fetchDataFromAPI();
    });
  
    //this.dataSource.paginator = this.paginator;
   // this.dataSource.sort = this.sort;
  }
  
  fetchDataFromAPI(): void {
    const pageIndex = this.currentPage;
    const pageSize = this.pageSize;
    const sortActive = this.sort?.active ?? 'id';
    const sortDirection = this.sort?.direction ?? 'asc';
    const filter = this.dataSource.filter || '';
  
    const params = new HttpParams()
      .set('page', (pageIndex + 1).toString())
      .set('limit', pageSize.toString())
      .set('sortBy', sortActive)
      .set('sort', sortDirection)
      .set('search', filter);
  
    this.http.get<ProductApiResponse>('http://localhost:3000/api/catgories', { 
      observe: 'response',
      params: params
    }).subscribe({
      next: (response: HttpResponse<ProductApiResponse>) => {
        const res = response.body!;
        this.dataSource.data = res.data;
        this.totalItems = response.body?.total || 0;;
      },
      error: (err) => console.error('API fetch error:', err)
    });
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  
    this.paginator.pageIndex = 0;
    this.fetchDataFromAPI();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      this.selectedFile = fileInput.files[0];
    }
  }

  onUpload() {
    const formData = new FormData();
    formData.append('excelFile', this.selectedFile);

    this.http.post('http://localhost:3000/upload', formData).subscribe({
      next: (res) => console.log('Upload success', res),
      error: (err) => console.error('Upload error', err)
    });
  }

  download() {
    this.http.get('http://localhost:3000/download-catgories-report', { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'categories-file.xlsx'; // or the actual file name you expect
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Download failed', err)
    });
  }

  addOrUpdateUser() {
    if (this.newUser.id) {
      // Update category
      this.http.put(`http://localhost:3000/api/categories/${this.newUser.id}`, this.newUser).subscribe({
        next: () => {
          this.fetchDataFromAPI();
          this.resetForm();
        },
        error: (err) => console.error('Update error:', err)
      });
    } else {
      // Add new category
      this.http.post('http://localhost:3000/api/categories', this.newUser).subscribe({
        next: () => {
          this.fetchDataFromAPI();
          this.resetForm();
        },
        error: (err) => console.error('Add error:', err)
      });
    }
  }
  

  deleteUser(id: string) {
    this.http.delete(`http://localhost:3000/api/categories/${id}`).subscribe({
      next: () => {
        this.fetchDataFromAPI();
      },
      error: (err) => console.error('Delete error:', err)
    });
  }

  editUser(user: UserData) {
    this.newUser = { ...user };
  }

  resetForm() {
     this.newUser = { name: '', price: '' };
  }
}
