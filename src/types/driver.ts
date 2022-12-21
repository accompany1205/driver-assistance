export interface Driver {
  id: string;
  name: string;
  lastName:string;
  phone?: string;
  email: string;
  dob?: string;
  ssn?: string;
  address?: string;
  cdlNumber?: string;
  cdlAddress?: string;
  cdlClass?: string;
  cdlState?: string;
  cdlExpiration?: string;
  medExpiration?: string;
  driverLicense?: Blob;
  avatar?: string;
  isActive?: boolean;
  updatedAt?: number;
  
  balance?: number;
 
}

export interface DriverLog {
  id: string;
  createdAt: number;
  description: string;
  ip: string;
  method: string;
  route: string;
  status: number;
}

export interface DriverEmail {
  id: string;
  description: string;
  createdAt: number;
}

export interface DriverInvoice {
  id: string;
  issueDate: number;
  status: string;
  amount: number;
}
