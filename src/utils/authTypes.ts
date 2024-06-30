// src/utils/authTypes.ts
export interface User {
    _id?: string;
    firstname:string,
    username: string;
    password: string;
    role: UserRole; 
    
  }
  
  export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
  }
  