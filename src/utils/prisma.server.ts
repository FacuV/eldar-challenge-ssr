import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient = global.prisma || new PrismaClient();

if (!global.prisma) {
  global.prisma = new PrismaClient({ errorFormat: 'minimal', log: ['info'] });
}

export default prisma;
