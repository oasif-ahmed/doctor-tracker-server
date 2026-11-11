export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  phone?: string;
  bio?: string;
}