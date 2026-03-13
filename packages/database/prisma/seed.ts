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
  console.log(`  ✓ Created admin user: ${admin.email}\n`);

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
