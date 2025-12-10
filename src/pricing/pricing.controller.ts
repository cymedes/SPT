import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PricingService } from './pricing.service';
import { CreatePricingDto } from './dto/create-pricing.dto';
import { PrismaService } from '../prisma.service';

@Controller('pricing')
export class PricingController {
  constructor(
    private readonly pricingService: PricingService,
    private readonly prisma: PrismaService,
  ) {}

  /** 🔧 Główna wycena serwisowa */
  @Post('estimate')
  async estimate(@Body() dto: CreatePricingDto) {
    try {
      const result = await this.pricingService.estimate(
        dto.modelId,
        dto.engineId,
        dto.transmissionId,
        dto.serviceId,
      );

      return {
        success: true,
        message: 'Wycena została pomyślnie wygenerowana.',
        timestamp: new Date().toISOString(),
        data: result,
      };
    } catch (error: any) {
      console.error('❌ Błąd w PricingController:', error);

      throw new HttpException(
        {
          success: false,
          message: 'Nie udało się wygenerować wyceny.',
          error: error?.message || 'Nieznany błąd serwera',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** 🚗 Lista modeli Subaru */
  @Get('models')
  async getModels() {
    return await this.prisma.model.findMany({
      include: { generations: true },
      orderBy: { id: 'asc' },
    });
  }

  /** 🧠 Lista silników dla danego modelu */
  @Get('engines/:modelId')
  async getEngines(@Param('modelId') modelId: string) {
    const generations = await this.prisma.generation.findMany({
      where: { modelId: Number(modelId) },
      include: { engines: true },
    });
    return generations.flatMap((g: any) => g.engines);
  }

  /** ⚙️ Lista skrzyń biegów dla danego silnika */
  @Get('transmissions/:engineId')
  async getTransmissions(@Param('engineId') engineId: string) {
    return await this.prisma.transmission.findMany({
      where: { engineId: Number(engineId) },
    });
  }

  /** 🧰 Lista usług serwisowych */
  @Get('services')
  async getServices() {
    return await this.prisma.service.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
