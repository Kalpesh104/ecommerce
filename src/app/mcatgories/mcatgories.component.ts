import {AfterViewInit, Component,OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../catgories/catgories.service';
import { User } from '../catgories/model';

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
  selector: 'app-mcatgories',
  templateUrl: './mcatgories.component.html',
  styleUrls: ['./mcatgories.component.css']
})
export class McatgoriesComponent implements OnInit {
  userForm: FormGroup;
  users: User[] = [];
  editing: boolean = false;
  selectedFile: File | null = null;
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 5;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      fileName: [''],
      fileData: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  submitForm() {
    const user: User = this.userForm.value;
    if (this.editing) {
      this.userService.updateUser(user).subscribe(() => {
        this.loadUsers();
        this.resetForm();
      });
    } else {
      this.userService.addUser(user).subscribe(() => {
        this.loadUsers();
        this.resetForm();
      });
    }
  }

  edit(user: User) {
    this.userForm.setValue(user);
    this.editing = true;
  }

  delete(id: number) {
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
  }

  resetForm() {
    this.userForm.reset({ id: 0, name: '', email: '', fileName: '', fileData: '' });
    this.editing = false;
    this.selectedFile = null;
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.userForm.patchValue({
          fileName: this.selectedFile?.name,
          fileData: reader.result as string
        });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  startIndex(): number {
    return (this.page - 1) * this.pageSize;
  }

  endIndex(): number {
    return this.page * this.pageSize;
  }

  nextPage() {
    if (this.endIndex() < this.filteredUsers.length) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  get filteredUsers(): User[] {
    let filtered = this.users;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }
    return filtered.slice(this.startIndex(), this.endIndex());
  }
}