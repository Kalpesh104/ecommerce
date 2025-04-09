import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FileService {
  constructor(private http: HttpClient) {}

  downloadFile() {
    return this.http.get('http://localhost:3000/download/sample.pdf', {
      responseType: 'blob' // important for files
    });
  }
}
