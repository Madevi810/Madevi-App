// Data generator untuk pengujian stabilitas
export async function generateTestSeed(count: number) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({ id: `user-${i}`, name: `Test User ${i}` });
  }
  return { users, total: count };
}
