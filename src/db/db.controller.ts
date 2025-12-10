import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('db')
export class DbController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('test')
  async testConnection() {
    try {
      // próbujemy odczytać modele Subaru
      const models = await this.prisma.model.findMany();
      return {
        status: '🟢 OK',
        message: 'Połączenie z bazą działa poprawnie!',
        count: models.length,
        models,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Nieznany błąd podczas operacji na bazie danych.',
      };
    }
  }
}

