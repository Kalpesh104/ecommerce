import { Injectable } from '@angular/core';
import { User } from './model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [];
  private idCounter = 1;

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  addUser(user: User): Observable<User> {
    user.id = this.idCounter++;
    this.users.push(user);
    return of(user);
  }

  updateUser(user: User): Observable<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) this.users[index] = user;
    return of(user);
  }

  deleteUser(id: number): Observable<boolean> {
    this.users = this.users.filter(u => u.id !== id);
    return of(true);
  }
}