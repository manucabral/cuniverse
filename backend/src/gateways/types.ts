import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  data: {
    user: {
      sub: string;
      email?: string;
      iat?: number;
      exp?: number;
      [k: string]: any;
    };
    [k: string]: any;
  };
}
