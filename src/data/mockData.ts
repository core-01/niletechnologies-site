import type { User, LoanApplication, EmiInstallment, LoanType } from '@/types'

export const mockUsers: User[] = [
  { id: 'u-admin', name: 'Ananya Rao', email: 'admin@lendly.io', phone: '9876543210', role: 'admin', avatarColor: '#3d63f2', joinedOn: '2023-01-10', creditScore: 810, kycVerified: true },
  { id: 'u-1', name: 'Raghu Verma', email: 'raghu@example.com', phone: '9811122233', role: 'user', avatarColor: '#17b8a6', joinedOn: '2024-02-14', creditScore: 742, kycVerified: true },
  { id: 'u-2', name: 'Priya Sharma', email: 'priya@example.com', phone: '9822233344', role: 'user', avatarColor: '#f2a93b', joinedOn: '2024-05-03', creditScore: 690, kycVerified: true },
  { id: 'u-3', name: 'Karan Mehta', email: 'karan@example.com', phone: '9833344455', role: 'user', avatarColor: '#e5566a', joinedOn: '2024-08-19', creditScore: 615, kycVerified: false },
  { id: 'u-4', name: 'Sneha Iyer', email: 'sneha@example.com', phone: '9844455566', role: 'user', avatarColor: '#8b5cf6', joinedOn: '2025-01-22', creditScore: 758, kycVerified: true },
  { id: 'u-5', name: 'Vikram Nair', email: 'vikram@example.com', phone: '9855566677', role: 'user', avatarColor: '#2941e6', joinedOn: '2025-03-11', creditScore: 701, kycVerified: true },
]

function emi(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100
  return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1))
}

export const loanTypeRates: Record<LoanType, number> = {
  personal: 13.5,
  home: 8.4,
  auto: 9.8,
  education: 7.9,
  business: 14.2,
}

export const mockLoans: LoanApplication[] = [
  { id: 'ln-1001', userId: 'u-1', applicantName: 'Raghu Verma', type: 'personal', amount: 350000, tenureMonths: 36, interestRate: 13.5, purpose: 'Home renovation', status: 'approved', appliedOn: '2025-02-01', decidedOn: '2025-02-04', monthlyEmi: emi(350000, 13.5, 36) },
  { id: 'ln-1002', userId: 'u-1', applicantName: 'Raghu Verma', type: 'auto', amount: 620000, tenureMonths: 60, interestRate: 9.8, purpose: 'New car purchase', status: 'pending', appliedOn: '2025-06-18', monthlyEmi: emi(620000, 9.8, 60) },
  { id: 'ln-1003', userId: 'u-2', applicantName: 'Priya Sharma', type: 'education', amount: 900000, tenureMonths: 84, interestRate: 7.9, purpose: 'Masters degree abroad', status: 'approved', appliedOn: '2025-01-15', decidedOn: '2025-01-20', monthlyEmi: emi(900000, 7.9, 84) },
  { id: 'ln-1004', userId: 'u-3', applicantName: 'Karan Mehta', type: 'business', amount: 1500000, tenureMonths: 48, interestRate: 14.2, purpose: 'Working capital', status: 'rejected', appliedOn: '2025-05-02', decidedOn: '2025-05-07', monthlyEmi: emi(1500000, 14.2, 48), rejectionReason: 'Insufficient credit history and unverified KYC documents.' },
  { id: 'ln-1005', userId: 'u-4', applicantName: 'Sneha Iyer', type: 'home', amount: 4200000, tenureMonths: 240, interestRate: 8.4, purpose: 'Home purchase - 2BHK', status: 'approved', appliedOn: '2025-03-09', decidedOn: '2025-03-15', monthlyEmi: emi(4200000, 8.4, 240) },
  { id: 'ln-1006', userId: 'u-5', applicantName: 'Vikram Nair', type: 'personal', amount: 200000, tenureMonths: 24, interestRate: 13.5, purpose: 'Medical emergency', status: 'pending', appliedOn: '2025-06-25', monthlyEmi: emi(200000, 13.5, 24) },
  { id: 'ln-1007', userId: 'u-2', applicantName: 'Priya Sharma', type: 'auto', amount: 480000, tenureMonths: 48, interestRate: 9.8, purpose: 'Used car purchase', status: 'pending', appliedOn: '2025-07-01', monthlyEmi: emi(480000, 9.8, 48) },
  { id: 'ln-1008', userId: 'u-3', applicantName: 'Karan Mehta', type: 'personal', amount: 150000, tenureMonths: 12, interestRate: 13.5, purpose: 'Wedding expenses', status: 'closed', appliedOn: '2024-06-01', decidedOn: '2024-06-03', monthlyEmi: emi(150000, 13.5, 12) },
]

function buildEmiSchedule(loan: LoanApplication): EmiInstallment[] {
  const schedule: EmiInstallment[] = []
  let balance = loan.amount
  const r = loan.interestRate / 12 / 100
  const start = new Date(loan.decidedOn ?? loan.appliedOn)
  for (let i = 1; i <= loan.tenureMonths; i++) {
    const interest = Math.round(balance * r)
    const principal = loan.monthlyEmi - interest
    balance = Math.max(0, balance - principal)
    const due = new Date(start)
    due.setMonth(due.getMonth() + i)
    const now = new Date()
    let status: EmiInstallment['status'] = 'upcoming'
    if (due < now) status = i % 5 === 0 ? 'due' : 'paid'
    else if (i === 1) status = 'due'
    schedule.push({
      id: `${loan.id}-emi-${i}`,
      loanId: loan.id,
      installmentNo: i,
      dueDate: due.toISOString().slice(0, 10),
      amount: loan.monthlyEmi,
      principal,
      interest,
      status,
    })
  }
  return schedule
}

export const mockEmis: EmiInstallment[] = mockLoans
  .filter((l) => l.status === 'approved' || l.status === 'closed')
  .flatMap(buildEmiSchedule)

export const monthlyLoanStats = [
  { month: 'Jan', applications: 18, approved: 12, rejected: 4 },
  { month: 'Feb', applications: 22, approved: 15, rejected: 5 },
  { month: 'Mar', applications: 27, approved: 19, rejected: 6 },
  { month: 'Apr', applications: 21, approved: 14, rejected: 5 },
  { month: 'May', applications: 30, approved: 21, rejected: 7 },
  { month: 'Jun', applications: 34, approved: 24, rejected: 6 },
  { month: 'Jul', applications: 19, approved: 11, rejected: 3 },
]

export const loanTypeDistribution = [
  { name: 'Personal', value: 28, color: '#3d63f2' },
  { name: 'Home', value: 22, color: '#17b8a6' },
  { name: 'Auto', value: 19, color: '#f2a93b' },
  { name: 'Education', value: 16, color: '#8b5cf6' },
  { name: 'Business', value: 15, color: '#e5566a' },
]
