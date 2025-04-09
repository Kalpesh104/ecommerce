import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FileService } from '../catgories/file.service';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];


@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements  AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];
  dataSource: MatTableDataSource<UserData>;

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fileService: FileService,private http: HttpClient) {
    // Create 100 users
    const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }
  onUpload() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    this.http.post('http://localhost:3000/upload', formData).subscribe({
      next: (res) => console.log('Upload success', res),
      error: (err) => console.error('Upload error', err)
    });
  }
  selectedFile!: File;
  
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      this.selectedFile = fileInput.files[0];
    }
  }

  download() {
    this.fileService.downloadFile().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample.pdf'; // You can change the filename
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  newUser: Partial<UserData> = { name: '', progress: '', fruit: '' };

  addOrUpdateUser() {
    if (this.newUser.id) {
      // Update existing user
      const index = this.dataSource.data.findIndex(u => u.id === this.newUser.id);
      if (index !== -1) {
        this.dataSource.data[index] = { ...this.newUser } as UserData;
        this.dataSource._updateChangeSubscription();
      }
    } else {
      // Clear all old data and add new user only
      const newId = '1'; // Start from ID 1
      const newUser: UserData = {
        id: newId,
        name: this.newUser.name || '',
        progress: this.newUser.progress || '',
        fruit: this.newUser.fruit || ''
      };
      this.dataSource.data = [newUser]; // Replace existing data
      this.dataSource._updateChangeSubscription();
    }
  
    this.resetForm(); // Clear form after submit
  }
  
  
  editUser(user: UserData) {
    this.newUser = { ...user }; // Populate form with selected row
  }
  
  deleteUser(id: string) {
    this.dataSource.data = this.dataSource.data.filter(user => user.id !== id);
    this.dataSource._updateChangeSubscription(); // Refresh table
  }
  
  resetForm() {
    this.newUser = { name: '', progress: '', fruit: '' };
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  };
}

