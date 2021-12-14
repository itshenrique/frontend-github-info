import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../service/users.service';
import { User } from '../models/user';
import { Repository } from '../models/repository';
import { HttpParams } from '@angular/common/http';
import { RepositoriesModalConfig } from '../models/repositories-modal';
import { Meta, Title } from '@angular/platform-browser';

declare let $: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass'],
})
export class UsersComponent implements OnInit {
  public form: FormGroup;
  public user: User = null;
  public page: number;
  public itemsPerPage: number;
  public repositoriesModalConfig: RepositoriesModalConfig;
  public repositories: Repository[] = null;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      { name: 'description', content: 'Search github user profile' },
      { name: 'keywords', content: 'Angular, Git, Profile, Github' },
      { name: 'author', content: 'Henrique Pereira' },
    ]);
    this.setTitle('Git Hub - Home Page');
  }

  ngOnInit(): void {
    this.route.params.subscribe(({ login }) => {
      this.createForm();
      this.getUserInformation(login);
    });
  }

  public setTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }

  private createForm(user?: User) {
    this.form = this.formBuilder.group({
      login: [user ? user.login : '', Validators.required],
    });
  }

  public getUserInformation(login?: string) {
    if (login) {
      this.usersService.listUser(login).subscribe({
        next: (result) => {
          this.user = result as User;
        },
        error: (e) => {
          this.user = { login: login };
        },
        complete: () => {
          console.info(this.user);
        },
      });
    }
  }

  public getUserRepositories(page: number, itemsPerPage: number) {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('page', page);
    httpParams = httpParams.set('per_page', itemsPerPage);
    this.usersService.get(this.user.repos_url, httpParams).subscribe({
      next: (result) => {
        const repositories = result as Repository[];
        if (repositories.length) {
          this.setPagination(page, itemsPerPage);
          this.repositories = repositories;
        }
      },
      error: (e) => console.error(e),
    });
  }

  public getUserStarred(page: number, itemsPerPage: number) {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('page', page);
    httpParams = httpParams.set('per_page', itemsPerPage);
    this.usersService
      .listUserStarredRepository(this.user.login, httpParams)
      .subscribe({
        next: (result) => {
          const repositories = result as Repository[];
          if (repositories.length) {
            this.setPagination(page, itemsPerPage);
            this.repositories = repositories;
          }
        },
        error: (e) => console.error(e),
      });
  }

  public requestPageByRepoType(
    repoType: string,
    page: number,
    itemsPerPage: number
  ) {
    if (repoType === 'REPOS') {
      this.getUserRepositories(page, itemsPerPage);
    }
    if (repoType === 'STARRED') {
      this.getUserStarred(page, itemsPerPage);
    }
  }

  public changePage(direction: string) {
    if (direction === 'PREVIOUS' && this.page > 1) {
      this.requestPageByRepoType(
        this.repositoriesModalConfig.config,
        this.page - 1,
        this.itemsPerPage
      );
    }
    if (direction === 'NEXT') {
      this.requestPageByRepoType(
        this.repositoriesModalConfig.config,
        this.page + 1,
        this.itemsPerPage
      );
    }
  }

  public formatString(text: string, maxLength: number) {
    if (text && text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  }

  public setPagination(page: number, itemsPerPage: number) {
    this.page = page ? page : 1;
    this.itemsPerPage = itemsPerPage ? itemsPerPage : 5;
  }

  public openModalWithConfig(modalMode: string) {
    this.repositories = [];
    this.setPagination(1, 5);

    if (modalMode === 'STARRED') {
      this.getUserStarred(this.page, this.itemsPerPage);
      this.repositoriesModalConfig = {
        title: 'Starred',
        config: 'STARRED',
        repositories: this.repositories,
      };
    }
    if (modalMode === 'REPOS') {
      this.getUserRepositories(this.page, this.itemsPerPage);
      this.repositoriesModalConfig = {
        title: 'Repositórios',
        config: 'REPOS',
        repositories: this.repositories,
      };
    }
    this.openModal();
  }

  private openModal() {
    $('#repositoriesModal').modal('show');
  }

  public closeModal() {
    $('#repositoriesModal').modal('hide');
  }
}
