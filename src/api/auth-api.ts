import type { User } from '../types/user';
import axios from '../utils/axios';
//import axios from 'axios';
import { createResourceId } from '../utils/create-resource-id';
import { decode, JWT_EXPIRES_IN, JWT_SECRET, sign } from '../utils/jwt';
import { wait } from '../utils/wait';
import { setSession } from '../utils/jwt';




type LoginRequest = {
  email: string;
  password: string;
}

type LoginResponse = Promise<{
  accessToken: string;
  user: User;
}>;

type RegisterRequest = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

type RegisterResponse = Promise<{
  accessToken: string;
  user: User;
}>;

type UpdateResponse = Promise<{
  accessToken: string;
  user: User;
}>;

type MeRequest = {
  accessToken: string
};

type MeResponse = Promise<User>;

class AuthApi {
  async login(request: LoginRequest): LoginResponse {
    const { email, password } = request;

    const response = await axios.post('/api/auth/login', {
        email,
        password
      });

    const { accessToken, user } = response.data;
    if(accessToken)
        setSession(accessToken);
    return {accessToken, user}
  }

  async register(request: RegisterRequest): RegisterResponse {
    const { email, firstname, lastname, password } = request;

    const response = await axios.post('/api/auth/register', {
        email,
        password,
        firstname,
        lastname,
      });

    const { accessToken, user } = response.data;
    if(accessToken)
        setSession(accessToken);
    return {accessToken, user};
  }

  async update(id: string): UpdateResponse {

    const response = await axios.post('/api/auth/updateUser', {
        id
      });

    const { accessToken, user } = response.data;

    return {accessToken, user};
  }

  
}

export const authApi = new AuthApi();
