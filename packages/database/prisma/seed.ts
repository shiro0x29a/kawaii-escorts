import { PrismaClient, Gender } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Cities from Israel (based on old site structure)
const cities = [
  { nameEn: 'Tel Aviv', nameRu: 'Тель-Авив', slug: 'tel-aviv' },
  { nameEn: 'Jerusalem', nameRu: 'Иерусалим', slug: 'jerusalem' },
  { nameEn: 'Haifa', nameRu: 'Хайфа', slug: 'haifa' },
  { nameEn: 'Eilat', nameRu: 'Эйлат', slug: 'eilat' },
  { nameEn: 'Ashdod', nameRu: 'Ашдод', slug: 'ashdod' },
  { nameEn: 'Netanya', nameRu: 'Нетания', slug: 'netanya' },
  { nameEn: 'Beer Sheva', nameRu: 'Беэр-Шева', slug: 'beer-sheva' },
  { nameEn: 'Rishon LeZion', nameRu: 'Ришон-ле-Цион', slug: 'rishon-lezion' },
  { nameEn: 'Petah Tikva', nameRu: 'Петах-Тиква', slug: 'petah-tikva' },
  { nameEn: 'Holon', nameRu: 'Холон', slug: 'holon' },
  { nameEn: 'Bat Yam', nameRu: 'Бат-Ям', slug: 'bat-yam' },
  { nameEn: 'Bnei Brak', nameRu: 'Бней-Брак', slug: 'bnei-brak' },
  { nameEn: 'Ashkelon', nameRu: 'Ашкелон', slug: 'ashkelon' },
  { nameEn: 'Rehovot', nameRu: 'Реховот', slug: 'rehovot' },
  { nameEn: 'Beit Shemesh', nameRu: 'Бейт-Шемеш', slug: 'beit-shemesh' },
];

// Sample profiles based on old site structure (ankety table)
const profiles = [
  {
    name: 'Anna',
    age: 25,
    gender: Gender.FEMALE,
    citySlug: 'tel-aviv',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500',
    ],
    tel: '+972-50-123-4567',
    email: 'anna@example.com',
    height: 168,
    weight: 52,
    about: 'Friendly and outgoing, love to meet new people',
    languages: JSON.stringify(['english', 'russian', 'hebrew']),
    services: JSON.stringify(['dinner', 'travel', 'events']),
    workType: JSON.stringify(['incall', 'outcall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  },
  {
    name: 'Maria',
    age: 28,
    gender: Gender.FEMALE,
    citySlug: 'jerusalem',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
    ],
    tel: '+972-52-234-5678',
    email: 'maria@example.com',
    height: 172,
    weight: 55,
    about: 'Elegant and sophisticated companion',
    languages: JSON.stringify(['english', 'russian', 'spanish']),
    services: JSON.stringify(['dinner', 'travel', 'vip']),
    workType: JSON.stringify(['incall', 'outcall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Sofia',
    age: 23,
    gender: Gender.FEMALE,
    citySlug: 'haifa',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500',
    ],
    tel: '+972-54-345-6789',
    email: 'sofia@example.com',
    height: 165,
    weight: 50,
    about: 'Young and energetic, always ready for adventure',
    languages: JSON.stringify(['hebrew', 'english', 'russian']),
    services: JSON.stringify(['dinner', 'parties', 'travel']),
    workType: JSON.stringify(['outcall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Victoria',
    age: 30,
    gender: Gender.FEMALE,
    citySlug: 'eilat',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
    photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'],
    tel: '+972-55-456-7890',
    email: 'victoria@example.com',
    height: 175,
    weight: 58,
    about: 'Mature and experienced, perfect for special occasions',
    languages: JSON.stringify(['english', 'hebrew', 'french']),
    services: JSON.stringify(['dinner', 'travel', 'vip', 'events']),
    workType: JSON.stringify(['incall', 'outcall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Natalie',
    age: 26,
    gender: Gender.FEMALE,
    citySlug: 'netanya',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500',
    ],
    tel: '+972-56-567-8901',
    email: 'natalie@example.com',
    height: 170,
    weight: 54,
    about: 'Natural beauty with a warm personality',
    languages: JSON.stringify(['russian', 'english', 'hebrew']),
    services: JSON.stringify(['dinner', 'travel']),
    workType: JSON.stringify(['incall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'David',
    age: 32,
    gender: Gender.MALE,
    citySlug: 'tel-aviv',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500',
    photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500'],
    tel: '+972-57-678-9012',
    email: 'david@example.com',
    height: 182,
    weight: 78,
    about: 'Fit and active, great companion for any occasion',
    languages: JSON.stringify(['hebrew', 'english']),
    services: JSON.stringify(['dinner', 'travel', 'fitness']),
    workType: JSON.stringify(['outcall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Olga',
    age: 24,
    gender: Gender.FEMALE,
    citySlug: 'bat-yam',
    avatar: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=500',
    photos: [
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=500',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
    ],
    tel: '+972-58-789-0123',
    email: 'olga@example.com',
    height: 169,
    weight: 53,
    about: 'Sweet and caring, love long conversations',
    languages: JSON.stringify(['russian', 'hebrew', 'english']),
    services: JSON.stringify(['dinner', 'parties', 'vip']),
    workType: JSON.stringify(['incall', 'outcall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Katerina',
    age: 27,
    gender: Gender.FEMALE,
    citySlug: 'rishon-lezion',
    avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a37b1a9?w=500',
    photos: ['https://images.unsplash.com/photo-1520813792240-56fc4a37b1a9?w=500'],
    tel: '+972-59-890-1234',
    email: 'katerina@example.com',
    height: 174,
    weight: 56,
    about: 'Confident and charming, perfect for events',
    languages: JSON.stringify(['russian', 'english', 'ukrainian']),
    services: JSON.stringify(['dinner', 'travel', 'events', 'vip']),
    workType: JSON.stringify(['incall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Elena',
    age: 29,
    gender: Gender.FEMALE,
    citySlug: 'ashdod',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500',
    photos: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
    ],
    tel: '+972-50-901-2345',
    email: 'elena@example.com',
    height: 171,
    weight: 54,
    about: 'Passionate and romantic, love sunsets',
    languages: JSON.stringify(['russian', 'hebrew', 'english']),
    services: JSON.stringify(['dinner', 'travel', 'romantic']),
    workType: JSON.stringify(['outcall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Irina',
    age: 22,
    gender: Gender.FEMALE,
    citySlug: 'petah-tikva',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
    photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500'],
    tel: '+972-51-012-3456',
    email: 'irina@example.com',
    height: 166,
    weight: 51,
    about: 'Young and playful, always smiling',
    languages: JSON.stringify(['russian', 'hebrew']),
    services: JSON.stringify(['dinner', 'parties']),
    workType: JSON.stringify(['incall', 'outcall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Alexandra',
    age: 31,
    gender: Gender.FEMALE,
    citySlug: 'holon',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500',
    photos: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500',
    ],
    tel: '+972-52-123-4567',
    email: 'alexandra@example.com',
    height: 176,
    weight: 59,
    about: 'Elegant lady for sophisticated gentlemen',
    languages: JSON.stringify(['russian', 'english', 'french']),
    services: JSON.stringify(['dinner', 'travel', 'vip', 'events']),
    workType: JSON.stringify(['incall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Diana',
    age: 25,
    gender: Gender.TRANSGENDER,
    citySlug: 'tel-aviv',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
    ],
    tel: '+972-53-234-5678',
    email: 'diana@example.com',
    height: 173,
    weight: 55,
    about: 'Unique and captivating personality',
    languages: JSON.stringify(['hebrew', 'english', 'russian']),
    services: JSON.stringify(['dinner', 'parties', 'vip']),
    workType: JSON.stringify(['incall', 'outcall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Kristina',
    age: 26,
    gender: Gender.FEMALE,
    citySlug: 'beer-sheva',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500',
    photos: ['https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500'],
    tel: '+972-54-345-6780',
    email: 'kristina@example.com',
    height: 168,
    weight: 52,
    about: 'Wild and free spirit, adventure awaits',
    languages: JSON.stringify(['russian', 'english']),
    services: JSON.stringify(['dinner', 'travel', 'adventure']),
    workType: JSON.stringify(['outcall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Michael',
    age: 28,
    gender: Gender.MALE,
    citySlug: 'jerusalem',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500',
    photos: ['https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500'],
    tel: '+972-55-456-7891',
    email: 'michael@example.com',
    height: 185,
    weight: 82,
    about: 'Athletic build, charming personality',
    languages: JSON.stringify(['hebrew', 'english', 'russian']),
    services: JSON.stringify(['dinner', 'fitness', 'travel']),
    workType: JSON.stringify(['incall', 'outcall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Yulia',
    age: 23,
    gender: Gender.FEMALE,
    citySlug: 'bnei-brak',
    avatar: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=500',
    photos: [
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=500',
    ],
    tel: '+972-56-567-8902',
    email: 'yulia@example.com',
    height: 164,
    weight: 49,
    about: 'Petite and adorable, love to please',
    languages: JSON.stringify(['russian', 'hebrew']),
    services: JSON.stringify(['dinner', 'parties']),
    workType: JSON.stringify(['incall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Veronika',
    age: 30,
    gender: Gender.FEMALE,
    citySlug: 'ashkelon',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500',
    ],
    tel: '+972-57-678-9013',
    email: 'veronika@example.com',
    height: 172,
    weight: 56,
    about: 'Mature and experienced, GFE specialist',
    languages: JSON.stringify(['russian', 'english', 'hebrew']),
    services: JSON.stringify(['dinner', 'travel', 'vip', 'gfe']),
    workType: JSON.stringify(['incall', 'outcall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Tatiana',
    age: 27,
    gender: Gender.FEMALE,
    citySlug: 'rehovot',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500',
    photos: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500'],
    tel: '+972-58-789-0124',
    email: 'tatiana@example.com',
    height: 170,
    weight: 54,
    about: 'Sensual and attentive, your desires matter',
    languages: JSON.stringify(['russian', 'hebrew', 'english']),
    services: JSON.stringify(['dinner', 'romantic', 'vip']),
    workType: JSON.stringify(['incall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    name: 'Ekaterina',
    age: 24,
    gender: Gender.FEMALE,
    citySlug: 'beit-shemesh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
    ],
    tel: '+972-59-890-1235',
    email: 'ekaterina@example.com',
    height: 167,
    weight: 51,
    about: 'Gentle soul with a passionate heart',
    languages: JSON.stringify(['russian', 'english']),
    services: JSON.stringify(['dinner', 'travel', 'romantic']),
    workType: JSON.stringify(['outcall']),
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
];

async function main() {
  console.log('Starting database seeding...\n');

  // Seed cities
  console.log('Seeding cities...');
  const cityMap = new Map<string, number>();
  for (const city of cities) {
    const created = await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: city,
    });
    cityMap.set(city.slug, created.id);
  }
  console.log(`  ✓ Seeded ${cities.length} cities\n`);

  // Seed admin user
  console.log('Seeding admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kawaii.com' },
    update: {},
    create: {
      email: 'admin@kawaii.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`  ✓ Created admin user: ${admin.email} (ID: ${admin.id})\n`);

  // Seed profiles
  console.log('Seeding profiles...');
  for (const profile of profiles) {
    const cityId = cityMap.get(profile.citySlug);
    if (!cityId) {
      console.error(`  ✗ City not found: ${profile.citySlug}`);
      continue;
    }

    await prisma.profile.create({
      data: {
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        cityId,
        userId: admin.id,
        avatar: profile.avatar,
        photos: profile.photos,
        tel: profile.tel,
        email: profile.email,
        height: profile.height,
        weight: profile.weight,
        about: profile.about,
        languages: profile.languages,
        services: profile.services,
        workType: profile.workType,
        isActive: profile.isActive,
        expiresAt: profile.expiresAt,
      },
    });
    console.log(`  ✓ Created profile: ${profile.name} (${profile.age}) - ${profile.citySlug}`);
  }

  console.log('\n✅ Seeding completed successfully!');
  console.log('\nAdmin credentials:');
  console.log('  Email: admin@kawaii.com');
  console.log('  Password: admin123');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
