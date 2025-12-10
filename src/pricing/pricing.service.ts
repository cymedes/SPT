import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Główna funkcja wyceny serwisowej
   */
  async estimate(
    modelId: number,
    engineId: number,
    transmissionId: number,
    serviceId: number
  ) {
    // Pobierz usługę wraz z częściami
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        parts: {
          include: {
            part: true,
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Nie znaleziono usługi serwisowej.');
    }

    // Oblicz koszt części
    const partsCost = service.parts.reduce(
      (sum: number, p) => sum + p.part.priceNet * p.quantity,
      0
    );

    // Pobierz stawkę roboczogodziny
    const laborSetting = await this.prisma.setting.findUnique({
      where: { key: 'labor_rate' },
    });

    const vatSetting = await this.prisma.setting.findUnique({
      where: { key: 'vat_rate' },
    });

    const laborRate = laborSetting ? parseFloat(laborSetting.value) : 250;
    const vatRate = vatSetting ? parseFloat(vatSetting.value) / 100 : 0.23;

    const laborCost = service.laborTime * laborRate;
    const totalNet = partsCost + laborCost;
    const totalGross = totalNet * (1 + vatRate);

    // Zwrot wyniku
    return {
      modelId,
      engineId,
      transmissionId,
      serviceId,
      parts: service.parts.map((p) => ({
        name: p.part.name,
        priceNet: p.part.priceNet,
        quantity: p.quantity,
        subtotal: p.part.priceNet * p.quantity,
      })),
      summary: {
        partsCost,
        laborRate,
        laborCost,
        totalNet,
        vatRate: vatRate * 100,
        totalGross,
      },
    };
  }
}
