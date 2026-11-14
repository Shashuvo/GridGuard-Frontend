export interface RegistrationPayload {
    name: string;
    email: string;
    password: string;
    customer: {
      contactNumber?: string;
    };
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }