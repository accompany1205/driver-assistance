export interface Customer {
  id: string;
  address1?: string;
  address2?: string;
  avatar?: string;
  balance?: number;
  city?: string;
  country?: string;
  currency?: string;
  email: string;
  hasAcceptedMarketing?: boolean;
  hasDiscount?: boolean;
  isProspect?: boolean;
  isReturning?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  name: string;
  phone?: string;
  state?: string;
  totalAmountSpent?: number;
  totalOrders?: number;
  updatedAt?: number;
  vatRate?: number;
  zipCode?: string;
}

export interface CustomerLog {
  id: string;
  createdAt: number;
  description: string;
  ip: string;
  method: string;
  route: string;
  status: number;
}

export interface CustomerEmail {
  id: string;
  description: string;
  createdAt: number;
}

export interface CustomerInvoice {
  id: string;
  issueDate: number;
  status: string;
  amount: number;
}
