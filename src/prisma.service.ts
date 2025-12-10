import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // standardowy konstruktor – bez adaptera
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL!,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('🟢 Połączono z bazą danych PostgreSQL (Prisma klasyczne połączenie)');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔴 Rozłączono z bazą danych.');
  }
}

