export interface Admin {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'super_admin' | 'admin' | 'support';
    permissions: Record<string, boolean>;
    isActive: boolean;
    lastLogin: string;
    createdAt: string;
}

export interface Partner {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    businessName: string;
    businessType: string;
    partnerType: 'accommodation' | 'restaurant' | 'transport';
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
}

export interface Customer {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    createdAt: string;
}

export interface Transaction {
    _id: string;
    customer: Customer;
    amount: number;
    currency: string;
    method: string;
    type: string;
    status: string;
    createdAt: string;
}

export interface Dispute {
    _id: string;
    raisedBy: string;
    customer: Customer;
    partner: Partner;
    subject: string;
    description: string;
    status: 'open' | 'investigating' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    resolution?: string;
    createdAt: string;
}

export interface DashboardStats {
    totalCustomers: number;
    totalPartners: number;
    totalProperties: number;
    totalBookings: number;
    totalRevenue: number;
}