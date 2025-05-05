import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users';
import { seedKeluargaUmat } from './seeds/keluarga-umat';
import { seedKasLingkungan } from './seeds/kas-lingkungan';
import { seedDanaMandiri } from './seeds/dana-mandiri';
import { seedKasIkata } from './seeds/kas-ikata';
import { seedDoaLingkungan } from './seeds/doa-lingkungan';
import { seedPengajuan } from './seeds/pengajuan';
import { seedPublikasi } from './seeds/publikasi';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Seed users first
  await seedUsers(prisma);
  console.log('Users seeded');
  
  // Seed keluarga umat
  await seedKeluargaUmat(prisma);
  console.log('Keluarga umat seeded');
  
  // Seed kas lingkungan
  await seedKasLingkungan(prisma);
  console.log('Kas lingkungan seeded');
  
  // Seed dana mandiri
  await seedDanaMandiri(prisma);
  console.log('Dana mandiri seeded');
  
  // Seed kas ikata
  await seedKasIkata(prisma);
  console.log('Kas ikata seeded');
  
  // Seed doa lingkungan
  await seedDoaLingkungan(prisma);
  console.log('Doa lingkungan seeded');
  
  // Seed pengajuan
  await seedPengajuan(prisma);
  console.log('Pengajuan seeded');
  
  // Seed publikasi
  await seedPublikasi(prisma);
  console.log('Publikasi seeded');
  
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
