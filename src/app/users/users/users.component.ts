import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../service/users.service';
import { User } from '../models/user';
import { Repository } from '../models/repository';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass'],
})
export class UsersComponent implements OnInit {
  public form: FormGroup;
  private user: User = null;
  private repositories: Repository[] = null;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ username }) => {
      this.createForm(username);
    });
  }

  private createForm(username?: string) {
    this.form = this.formBuilder.group({
      usernameSearch: [username ? username : '', Validators.required],
    });
    this.getUserInformation();
  }

  public getUserInformation() {
    const username = this.form.get('usernameSearch').value;
    if (username) {
      this.usersService.listUser(username).subscribe({
        next: (result) => {
          this.user = result as User;
        },
        error: (e) => console.error(e),
        complete: () => {
          console.info('Completed');
          console.info(this.user);
        },
      });
    }
  }

  public getUserRepositories() {
    this.usersService.listUser(this.user.repos_url).subscribe({
      next: (result) => {
        this.repositories = result as Repository[];
      },
      error: (e) => console.error(e),
      complete: () => {
        console.info('Completed');
        console.log(this.repositories);
      },
    });
  }

  public getUserStarred() {
    this.usersService.listUser(this.user.starred_url).subscribe({
      next: (result) => {
        this.repositories = result as Repository[];
      },
      error: (e) => console.error(e),
      complete: () => {
        console.info('Completed');
        console.info(this.repositories);
      },
    });
  }
}
