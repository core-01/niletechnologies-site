export type Role = 'admin' | 'user'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  avatarColor: string
  joinedOn: string
  creditScore: number
  kycVerified: boolean
}

export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'closed'
export type LoanType = 'personal' | 'home' | 'auto' | 'education' | 'business'

export interface LoanApplication {
  id: string
  userId: string
  applicantName: string
  type: LoanType
  amount: number
  tenureMonths: number
  interestRate: number
  purpose: string
  status: LoanStatus
  appliedOn: string
  decidedOn?: string
  monthlyEmi: number
  rejectionReason?: string
}

export interface EmiInstallment {
  id: string
  loanId: string
  installmentNo: number
  dueDate: string
  amount: number
  principal: number
  interest: number
  status: 'paid' | 'due' | 'upcoming'
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  phone: string
  password: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}
