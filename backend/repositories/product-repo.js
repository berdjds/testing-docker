import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllProducts = async () => {
  return prisma.product.findMany();
};

export const createProduct = async (name) => {
  return prisma.product.create({
    data: { name },
  });
};
