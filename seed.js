const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const databaseUrl = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/postgres';
const pgAdapter = new PrismaPg({ connectionString: databaseUrl });

const prisma = new PrismaClient({
  adapter: pgAdapter,
});

async function main() {
  const catOriental = await prisma.category.upsert({
    where: { name: 'Luxo Oriental' },
    update: {},
    create: {
      name: 'Luxo Oriental',
      description: 'Fragrâncias intensas e marcantes do Oriente Médio, com notas amadeiradas profundas e toques de especiarias orientais',
      isActive: true,
    }
  });

  const catGrifes = await prisma.category.upsert({
    where: { name: 'Grandes Grifes' },
    update: {},
    create: {
      name: 'Grandes Grifes',
      description: 'Fragrâncias clássicas e sofisticadas das melhores casas de perfumaria europeias',
      isActive: true,
    }
  });

  await prisma.product.upsert({
    where: { id: 'prod-tester-1' },
    update: {},
    create: {
      id: 'prod-tester-1',
      name: 'Oud Wood Intense',
      description: 'Um perfume luxuoso com notas de Oud.',
      price: 850.00,
      categoryId: catOriental.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1541643600914-78b084683601']),
    }
  });

  await prisma.product.upsert({
    where: { id: 'prod-tester-2' },
    update: {},
    create: {
      id: 'prod-tester-2',
      name: 'Classic European',
      description: 'O auge da sofisticação parisiense.',
      price: 520.00,
      categoryId: catGrifes.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1594035910387-fea47794261f']),
    }
  });

  await prisma.perfumeStory.upsert({
    where: { id: 'oriental-luxury-intro' },
    update: {},
    create: {
      id: 'oriental-luxury-intro',
      title: 'O Luxo Oriental: Uma Jornada Sensorial',
      content: 'Os perfumes orientais representam uma tradição milenar de fragrâncias intensas e marcantes. Originários do Oriente Médio, esses aromas são caracterizados por notas amadeiradas profundas, como sândalo, patchouli e oud, combinadas com toques de especiarias orientais como cardamomo, canela e cravo. A fixação excepcional desses perfumes, que pode ultrapassar 12 horas na pele, garante presença marcante onde quer que você vá.',
      category: 'ORIENTAL_LUXURY'
    }
  });

  await prisma.perfumeStory.upsert({
    where: { id: 'great-brands-intro' },
    update: {},
    create: {
      id: 'great-brands-intro',
      title: 'Grandes Grifes: Sofisticação Europeia',
      content: 'As fragrâncias das grandes grifes europeias representam o ápice da arte perfumária ocidental. Criadas por mestres perfumistas das casas mais renomadas como Chanel, Dior, Gucci e Yves Saint Laurent, essas composições harmonizam notas florais delicadas, frutas frescas e toques amadeirados suaves. A elegância e o equilíbrio são as marcas registradas dessas criações atemporais.',
      category: 'GREAT_BRANDS'
    }
  });

  await prisma.perfumeStory.upsert({
    where: { id: 'perfume-history' },
    update: {},
    create: {
      id: 'perfume-history',
      title: 'A História dos Perfumes',
      content: 'A perfumaria tem raízes antigas, remontando aos egípcios que usavam óleos essenciais para rituais religiosos. Os árabes preservaram e desenvolveram essas técnicas durante a Idade Média, criando métodos de destilação que revolucionaram a produção de fragrâncias. Hoje, a fusão entre tradições orientais e técnicas europeias cria perfumes únicos que contam histórias através dos sentidos.',
      category: 'GENERAL_CURIOSITIES'
    }
  });

  const adminEmail = 'admin@decoimports.com';
  const adminPassword = '123456';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedAdminPassword,
      role: 'ADMIN',
      name: 'Admin Master',
    },
    create: {
      name: 'Admin Master',
      email: adminEmail,
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin master criado com sucesso:', adminEmail, '(senha: 123456)');
  console.log('Dados iniciais cadastrados com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
