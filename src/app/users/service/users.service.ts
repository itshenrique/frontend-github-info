import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly usersEndpoint = `${environment.apiUrl}/users`;

  constructor(private httpClient: HttpClient) {}

  listUser(username: string) {
    return this.httpClient.get(`${this.usersEndpoint}/${username}`);
  }

  listUserStarredRepository(username: string, params?: HttpParams) {
    return this.httpClient.get(`${this.usersEndpoint}/${username}/starred`, {
      params,
    });
  }

  get(url: string, params?: HttpParams) {
    return this.httpClient.get(url, { params });
  }
}
