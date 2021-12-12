export interface User {
  id?: number;
  login: string;
  avatar_url?: string;
  name?: string;
  bio?: string;
  followers?: number;
  following?: number;
  repos_url?: string;
  starred_url?: string;
  public_repos?: number;
  public_gists?: number;
}
