import type { LoanApplication, LoanType, EmiInstallment } from '@/types'
import { mockLoans, mockEmis, loanTypeRates } from '@/data/mockData'
import { USE_MOCK_API, httpClient, delay } from './httpClient'

let loans: LoanApplication[] = [...mockLoans]
const emis: EmiInstallment[] = [...mockEmis]

function computeEmi(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100
  return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1))
}

export interface NewLoanInput {
  userId: string
  applicantName: string
  type: LoanType
  amount: number
  tenureMonths: number
  purpose: string
}

export const loanService = {
  async listAll(): Promise<LoanApplication[]> {
    if (USE_MOCK_API) return delay([...loans], 300)
    return httpClient.get('/loans')
  },

  async listByUser(userId: string): Promise<LoanApplication[]> {
    if (USE_MOCK_API) return delay(loans.filter((l) => l.userId === userId), 300)
    return httpClient.get(`/loans?userId=${userId}`)
  },

  async getById(id: string): Promise<LoanApplication | undefined> {
    if (USE_MOCK_API) return delay(loans.find((l) => l.id === id), 200)
    return httpClient.get(`/loans/${id}`)
  },

  async apply(input: NewLoanInput): Promise<LoanApplication> {
    if (USE_MOCK_API) {
      const rate = loanTypeRates[input.type]
      const loan: LoanApplication = {
        id: `ln-${1000 + loans.length + Math.floor(Math.random() * 900)}`,
        userId: input.userId,
        applicantName: input.applicantName,
        type: input.type,
        amount: input.amount,
        tenureMonths: input.tenureMonths,
        interestRate: rate,
        purpose: input.purpose,
        status: 'pending',
        appliedOn: new Date().toISOString().slice(0, 10),
        monthlyEmi: computeEmi(input.amount, rate, input.tenureMonths),
      }
      loans = [loan, ...loans]
      return delay(loan, 500)
    }
    return httpClient.post('/loans', input)
  },

  async updateStatus(id: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<LoanApplication> {
    if (USE_MOCK_API) {
      loans = loans.map((l) =>
        l.id === id
          ? { ...l, status, decidedOn: new Date().toISOString().slice(0, 10), rejectionReason }
          : l
      )
      const updated = loans.find((l) => l.id === id)!
      return delay(updated, 400)
    }
    return httpClient.patch(`/loans/${id}/status`, { status, rejectionReason })
  },

  async emiScheduleForLoan(loanId: string): Promise<EmiInstallment[]> {
    if (USE_MOCK_API) return delay(emis.filter((e) => e.loanId === loanId), 250)
    return httpClient.get(`/loans/${loanId}/emis`)
  },

  async emiScheduleForUser(userId: string): Promise<EmiInstallment[]> {
    if (USE_MOCK_API) {
      const userLoanIds = loans.filter((l) => l.userId === userId).map((l) => l.id)
      return delay(emis.filter((e) => userLoanIds.includes(e.loanId)), 250)
    }
    return httpClient.get(`/users/${userId}/emis`)
  },
}
