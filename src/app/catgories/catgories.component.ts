import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { FileService } from './file.service';

export interface UserData {
  id: string;
  catgoriesName: string;
  catgoriesPrice: string;
}

@Component({
  selector: 'app-catgories',
  templateUrl: './catgories.component.html',
  styleUrls: ['./catgories.component.css']
})
export class CatgoriesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'catgoriesName', 'catgoriesPrice', 'actions'];
  dataSource = new MatTableDataSource<UserData>();
  selectedFile!: File;
  newUser: Partial<UserData> = { catgoriesName: '', catgoriesPrice: '' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fileService: FileService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDataFromAPI();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchDataFromAPI(): void {
    this.http.get<UserData[]>('http://localhost:3000/api/catgories').subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('API fetch error:', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      this.selectedFile = fileInput.files[0];
    }
  }

  onUpload() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:3000/upload', formData).subscribe({
      next: (res) => console.log('Upload success', res),
      error: (err) => console.error('Upload error', err)
    });
  }

  download() {
    this.fileService.downloadFile().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
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
    this.newUser = { catgoriesName: '', catgoriesPrice: '' };
  }
}
