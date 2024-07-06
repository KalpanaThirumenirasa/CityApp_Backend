// src/utils/authTypes.ts
export interface User {
    _id?: string;
    firstname:string,
    email: string;
    password: string;
    role: UserRole; 
    
  }
  
  export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
  }
  