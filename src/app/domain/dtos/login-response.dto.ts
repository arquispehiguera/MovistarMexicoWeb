export interface AuthResponse {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  usuarioID: number;
  rolID: number;
  nombres: string;
  apellidoPaterno: string;
  token: string;
  refreshToken: string;
  expiresIn: number;
  grantDelete: number;
  isLogged?: boolean;
  lastConnection?: string | null;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  usuarioID: number;
  username: string;
  expiresIn: number;
}
