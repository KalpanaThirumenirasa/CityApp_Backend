// src/utils/authTypes.ts
export interface User {
    _id?: string;
    firstname:string,
    username: string;
    password: string;
    role: UserRole; 
    
  }

  export interface Hotel {
    _id?: string;
    hotelName:string,
    desc: string;
    address: string;
    image: string; 
    
  }
  
  export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
  }
  