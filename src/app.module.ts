import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PricingModule } from './pricing/pricing.module';
import { DbController } from './db/db.controller';

@Module({
  imports: [
    // 📦 Moduły aplikacji
    PricingModule,
  ],
  controllers: [
    // 🌐 Kontrolery (REST API)
    DbController,
  ],
  providers: [
    // ⚙️ Serwisy globalne
    PrismaService,
  ],
  exports: [
    // 🌍 Udostępnianie serwisów do innych modułów
    PrismaService,
  ],
})
export class AppModule {}

