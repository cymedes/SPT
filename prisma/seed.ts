import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚗 Trwa dodawanie pełnych danych Subaru...');

  // --- MODELE, GENERACJE, SILNIKI, SKRZYNIE --- //
  const modelsData = [
    {
      name: 'Legacy',
      description: 'Subaru Legacy – sedan i kombi klasy średniej.',
      generations: [
        {
          name: 'V (2009–2014)',
          engines: [
            { name: '2.0D Boxer Diesel', transmissions: ['6MT'] },
            { name: '2.5i (FB25)', transmissions: ['CVT'] },
          ],
        },
      ],
    },
    {
      name: 'Outback',
      description: 'Subaru Outback – kombi terenowe klasy średniej.',
      generations: [
        {
          name: 'V (2015–2019)',
          engines: [
            { name: '2.5i (FB25)', transmissions: ['CVT'] },
            { name: '3.6R (EZ36)', transmissions: ['CVT'] },
          ],
        },
      ],
    },
    {
      name: 'Forester',
      description: 'Subaru Forester – SUV z napędem AWD.',
      generations: [
        {
          name: 'SK (2019–2024)',
          engines: [{ name: '2.0 e-Boxer (FB20)', transmissions: ['CVT'] }],
        },
      ],
    },
  ];

  for (const model of modelsData) {
    const createdModel = await prisma.model.upsert({
      where: { name: model.name },
      update: {},
      create: { name: model.name, description: model.description },
    });

    for (const gen of model.generations) {
      const createdGen = await prisma.generation.create({
        data: { name: gen.name, modelId: createdModel.id },
      });

      for (const engine of gen.engines) {
        const createdEngine = await prisma.engine.create({
          data: { name: engine.name, generationId: createdGen.id },
        });

        for (const tr of engine.transmissions) {
          await prisma.transmission.create({
            data: { name: tr, engineId: createdEngine.id },
          });
        }
      }
    }
  }

  console.log('✅ Modele, generacje, silniki i skrzynie zostały zapisane.');

  // --- CZĘŚCI --- //
  const parts = await prisma.part.createMany({
    data: [
      { name: 'Filtr oleju', priceNet: 45 },
      { name: 'Olej silnikowy 5W30 (5L)', priceNet: 180 },
      { name: 'Filtr kabinowy', priceNet: 65 },
      { name: 'Filtr powietrza', priceNet: 55 },
      { name: 'Zestaw klocków hamulcowych (przód)', priceNet: 350 },
      { name: 'Płyn hamulcowy DOT4 (1L)', priceNet: 40 },
      { name: 'Zestaw rozrządu (pasek + rolki)', priceNet: 720 },
      { name: 'Pompa wody', priceNet: 290 },
      { name: 'Świece zapłonowe (komplet)', priceNet: 160 },
    ],
  });

  console.log('✅ Części zostały dodane.');

  // --- USŁUGI SERWISOWE --- //
  const serviceOilChange = await prisma.service.create({
    data: {
      name: 'Wymiana oleju silnikowego',
      laborTime: 0.8, // godziny
    },
  });

  const serviceBrakes = await prisma.service.create({
    data: {
      name: 'Wymiana klocków hamulcowych (przód)',
      laborTime: 1.2,
    },
  });

  const serviceTiming = await prisma.service.create({
    data: {
      name: 'Wymiana rozrządu (pasek)',
      laborTime: 3.5,
    },
  });

  const serviceSparkPlugs = await prisma.service.create({
    data: {
      name: 'Wymiana świec zapłonowych',
      laborTime: 1.0,
    },
  });

  console.log('✅ Usługi zostały dodane.');

  // --- POWIĄZANIA USŁUG Z CZĘŚCIAMI --- //
  const oilFilter = await prisma.part.findFirst({ where: { name: 'Filtr oleju' } });
  const oil = await prisma.part.findFirst({ where: { name: 'Olej silnikowy 5W30 (5L)' } });
  const brakePads = await prisma.part.findFirst({ where: { name: 'Zestaw klocków hamulcowych (przód)' } });
  const timingBelt = await prisma.part.findFirst({ where: { name: 'Zestaw rozrządu (pasek + rolki)' } });
  const waterPump = await prisma.part.findFirst({ where: { name: 'Pompa wody' } });
  const sparkPlugs = await prisma.part.findFirst({ where: { name: 'Świece zapłonowe (komplet)' } });

  // powiązania
  await prisma.servicePart.createMany({
    data: [
      { serviceId: serviceOilChange.id, partId: oilFilter!.id, quantity: 1 },
      { serviceId: serviceOilChange.id, partId: oil!.id, quantity: 1 },
      { serviceId: serviceBrakes.id, partId: brakePads!.id, quantity: 1 },
      { serviceId: serviceTiming.id, partId: timingBelt!.id, quantity: 1 },
      { serviceId: serviceTiming.id, partId: waterPump!.id, quantity: 1 },
      { serviceId: serviceSparkPlugs.id, partId: sparkPlugs!.id, quantity: 1 },
    ],
  });

  console.log('✅ Usługi zostały powiązane z częściami.');

  // --- USTAWIENIA SERWISU --- //
  await prisma.setting.createMany({
    data: [
      { key: 'labor_rate', value: '250' }, // stawka robocizny za godzinę (PLN)
      { key: 'currency', value: 'PLN' },
      { key: 'vat_rate', value: '23' },
    ],
  });

  console.log('✅ Ustawienia serwisowe zostały zapisane.');
  console.log('🎉 SEED ZAKOŃCZONY – baza jest gotowa!');
}

main()
  .catch((e) => {
    console.error('❌ Błąd podczas seedowania:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

