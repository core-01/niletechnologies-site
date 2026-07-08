export async function mockLogin({ email }) {
  await new Promise((resolve) => setTimeout(resolve, 450))

  return {
    id: 'mock-user-1',
    name: email.split('@')[0] || 'Nile Operator',
    email,
  }
}
