import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { name: 'Apple' },
      { name: 'Orange' },
      { name: 'Banana' },
      { name: 'Strawberry' },
      { name: 'Blueberry' },
      { name: 'Lemon' },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
