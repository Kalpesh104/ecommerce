import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FileService } from '../catgories/file.service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

export interface UserData {
  id: string;
  name: string;
  image: string;
  price: string;
  categoryId: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements AfterViewInit {
  displayedColumns: string[] = ['uniqueId', 'name', 'image', 'price', 'category', 'actions'];
  dataSource = new MatTableDataSource<UserData>();
  selectedFile!: File;
  newUser: Partial<UserData> = { name: '', price: '' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fileService: FileService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDataFromAPI();
  }
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => this.fetchDataFromAPI());
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0; // reset page index on sort
      this.fetchDataFromAPI();
    });
  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  fetchDataFromAPI(): void {

    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 5;
    const sortActive = this.sort?.active ?? 'id';
    const sortDirection = this.sort?.direction ?? 'asc';
    const filter = this.dataSource.filter || '';

    
  const params = {
    _page: (pageIndex + 1).toString(),
    _limit: pageSize.toString(),
    _sort: sortActive,
    _order: sortDirection,
    q: filter
  };
  this.http.get<UserData[]>('http://localhost:3000/api/products', { observe: 'response' })
  .subscribe({
    next: (response: HttpResponse<UserData[]>) => {
      const data = response.body || [];
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // You can now also access: response.headers, response.status, etc.
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
    this.http.get('http://localhost:3000/download-products-report', { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'product-file.xlsx'; // or the actual file name you expect
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Download failed', err)
    });
  }

  addOrUpdateUser() {
    if (this.newUser.id) {
      // Update category
      this.http.put(`http://localhost:3000/api/products/${this.newUser.id}`, this.newUser).subscribe({
        next: () => {
          this.fetchDataFromAPI();
          this.resetForm();
        },
        error: (err) => console.error('Update error:', err)
      });
    } else {
      // Add new category
      this.http.post('http://localhost:3000/api/products', this.newUser).subscribe({
        next: () => {
          this.fetchDataFromAPI();
          this.resetForm();
        },
        error: (err) => console.error('Add error:', err)
      });
    }
  }
  

  deleteUser(id: string) {
    this.http.delete(`http://localhost:3000/api/products/${id}`).subscribe({
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
    this.newUser = {
      name: '',
      price: '',
      image: '',
      categoryId: ''
    };
  }
}
