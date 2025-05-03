import { PrismaClient, Gender, Religion, MaritalStatus, LivingStatus, Role, DependentType, TransactionType, StatusPembayaran, StatusPublikasi, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker/locale/id_ID';

// Mengatur seed untuk konsistensi
faker.seed(123);

const prisma = new PrismaClient();

// Helper functions
function getRandomEnum<T>(enumObject: T): T[keyof T] {
  const enumValues = Object.values(enumObject as object) as Array<T[keyof T]>;
  return enumValues[Math.floor(Math.random() * enumValues.length)];
}

const getRandomDate = (start: Date, end: Date) => {
  // Pastikan tanggal awal tidak lebih besar dari tanggal akhir
  if (start > end) {
    // Tukar posisi start dan end jika start > end
    [start, end] = [end, start];
  }
  return faker.date.between({ from: start, to: end });
};

const createPassword = (plain: string) => {
  return bcrypt.hashSync(plain, 10);
};

async function main() {
  console.log('🌱 Memulai proses seed database...');

  // ======================== DATA STATIS ========================
  // Membuat data statis untuk user dengan berbagai role
  console.log('🌱 Membuat data statis untuk user dengan berbagai role...');
  
  const staticUsers = [
    { 
      fullName: 'Admin Utama', 
      username: 'superuser', 
      password: 'admin123', 
      role: Role.SuperUser,
      gender: Gender.MALE,
      birthDate: new Date(1985, 3, 12),
      birthPlace: 'Jakarta',
      nik: '1234567890123456',
      maritalStatus: MaritalStatus.MARRIED,
      address: 'Jl. Utama No. 1',
      city: 'Jakarta',
      phoneNumber: '081234567890',
      occupation: 'Administrator',
      education: 'S1',
      religion: Religion.CATHOLIC,
      livingStatus: LivingStatus.ALIVE,
      joinDate: new Date(2015, 0, 1),
      status: 'active'
    },
    { 
      fullName: 'Ketua Lingkungan', 
      username: 'ketua', 
      password: 'ketua123', 
      role: Role.ketuaLingkungan,
      gender: Gender.MALE,
      birthDate: new Date(1980, 5, 15),
      birthPlace: 'Bandung',
      nik: '1234567890123457',
      maritalStatus: MaritalStatus.MARRIED,
      address: 'Jl. Lingkungan No. 1',
      city: 'Jakarta',
      phoneNumber: '081234567891',
      occupation: 'Wiraswasta',
      education: 'S1',
      religion: Religion.CATHOLIC,
      livingStatus: LivingStatus.ALIVE,
      joinDate: new Date(2016, 2, 1),
      status: 'active'
    },
    { 
      fullName: 'Wakil Ketua', 
      username: 'wakilketua', 
      password: 'wakil123', 
      role: Role.wakilKetua,
      gender: Gender.MALE,
      birthDate: new Date(1982, 7, 20),
      birthPlace: 'Surabaya',
      nik: '1234567890123458',
      maritalStatus: MaritalStatus.MARRIED,
      address: 'Jl. Wakil No. 1',
      city: 'Jakarta',
      phoneNumber: '081234567892',
      occupation: 'Karyawan',
      education: 'S1',
      religion: Religion.CATHOLIC,
      livingStatus: LivingStatus.ALIVE,
      joinDate: new Date(2017, 3, 1),
      status: 'active'
    },
    { 
      fullName: 'Sekretaris Lingkungan', 
      username: 'sekretaris', 
      password: 'sekretaris123', 
      role: Role.sekretaris,
      gender: Gender.FEMALE,
      birthDate: new Date(1988, 9, 25),
      birthPlace: 'Semarang',
      nik: '1234567890123459',
      maritalStatus: MaritalStatus.MARRIED,
      address: 'Jl. Sekretariat No. 1',
      city: 'Jakarta',
      phoneNumber: '081234567893',
      occupation: 'Guru',
      education: 'S1',
      religion: Religion.CATHOLIC,
      livingStatus: LivingStatus.ALIVE,
      joinDate: new Date(2018, 4, 1),
      status: 'active'
    },
    { 
      fullName: 'Wakil Sekretaris', 
      username: 'wakilsekretaris', 
      password: 'wakilsekre123', 
      role: Role.wakilSekretaris,
      gender: Gender.FEMALE,
      birthDate: new Date(1990, 11, 5),
      birthPlace: 'Yogyakarta',
      nik: '1234567890123460',
      maritalStatus: MaritalStatus.SINGLE,
      address: 'Jl. Wakil Sekre No. 1',
      city: 'Jakarta',
      phoneNumber: '081234567894',
      occupation: 'Designer',
      education: 'S1',
      religion: Religion.CATHOLIC,
      livingStatus: LivingStatus.ALIVE,
      joinDate: new Date(2019, 5, 1),
      status: 'active'
    },
    { 
      fullName: 'Bendahara Lingkungan', 
      username: 'bendahara', 
      password: 'bendahara123', 
      role: Role.bendahara,
      gender: Gender.FEMALE,
      birthDate: new Date(1985, 2, 10),
      birthPlace: 'Medan',
      nik: '1234567890123461',
      maritalStatus: MaritalStatus.MARRIED,
      address: 'Jl. Bendahara No. 1',
      city: 'Jakarta',
      phoneNumber: '081234567895',
      occupation: 'Akuntan',
      education: 'S1',
      religion: Religion.CATHOLIC,
      livingStatus: LivingStatus.ALIVE,
      joinDate: new Date(2018, 6, 1),
      status: 'active'
    },
    { 
      fullName: 'Wakil Bendahara', 
      username: 'wakilbendahara', 
      password: 'wakilbend123', 
      role: Role.wakilBendahara,
      gender: Gender.MALE,
      birthDate: new Date(1987, 4, 15),
      birthPlace: 'Palembang',
      nik: '1234567890123462',
      maritalStatus: MaritalStatus.MARRIED,
      address: 'Jl. Wakil Bendahara No. 1',
      city: 'Jakarta',
      phoneNumber: '081234567896',
      occupation: 'Karyawan Bank',
      education: 'S1',
      religion: Religion.CATHOLIC,
      livingStatus: LivingStatus.ALIVE,
      joinDate: new Date(2019, 7, 1),
      status: 'active'
    },
    { 
      fullName: 'Umat Lingkungan', 
      username: 'umat', 
      password: 'umat123', 
      role: Role.umat,
      gender: Gender.MALE,
      birthDate: new Date(1992, 6, 20),
      birthPlace: 'Jakarta',
      nik: '1234567890123463',
      maritalStatus: MaritalStatus.SINGLE,
      address: 'Jl. Umat No. 1',
      city: 'Jakarta',
      phoneNumber: '081234567897',
      occupation: 'Mahasiswa',
      education: 'SMA',
      religion: Religion.CATHOLIC,
      livingStatus: LivingStatus.ALIVE,
      joinDate: new Date(2020, 1, 1),
      status: 'active'
    },
  ];

  const staticFamilyHeads = [];
  
  // Membuat family head statis untuk tiap user
  for (const userData of staticUsers) {
    const familyHeadData = {
      fullName: userData.fullName,
      gender: userData.gender,
      birthPlace: userData.birthPlace,
      birthDate: userData.birthDate,
      nik: userData.nik,
      maritalStatus: userData.maritalStatus,
      address: userData.address,
      city: userData.city,
      phoneNumber: userData.phoneNumber,
      email: `${userData.username}@example.com`,
      occupation: userData.occupation,
      education: userData.education,
      religion: userData.religion,
      livingStatus: userData.livingStatus,
      bidukNumber: faker.string.numeric(8),
      baptismDate: getRandomDate(new Date(1970, 0, 1), new Date(2010, 0, 1)),
      confirmationDate: getRandomDate(new Date(1980, 0, 1), new Date(2015, 0, 1)),
      joinDate: userData.joinDate,
      status: userData.status,
    };

    const createdFamilyHead = await prisma.familyHead.create({ data: familyHeadData });
    staticFamilyHeads.push(createdFamilyHead);

    // Buat user untuk family head statis
    await prisma.user.create({
      data: {
        username: userData.username,
        password: createPassword(userData.password),
        passphrase: createPassword(`phrase-${userData.username}`),
        role: userData.role,
        familyHeadId: createdFamilyHead.id,
      }
    });
  }

  console.log(`✅ Berhasil membuat ${staticUsers.length} user statis dengan berbagai role`);
  
  // ======================== KELUARGA DINAMIS ========================
  // Membuat keluarga dinamis dengan berbagai status: aktif, baru bergabung, pindah, meninggal
  console.log('🌱 Membuat data keluarga dengan berbagai status...');
  
  // 1. Keluarga Aktif (5 keluarga)
  const keluargaAktifPromises = Array.from({ length: 5 }).map(async () => {
    const gender = getRandomEnum(Gender);
    const isMarried = Math.random() > 0.3; // 70% chance married

    // Informasi dasar kepala keluarga aktif
    const kkData: any = {
      fullName: faker.person.fullName({ sex: gender === Gender.MALE ? 'male' : 'female' }),
      gender,
      birthPlace: faker.location.city(),
      birthDate: faker.date.birthdate({ min: 30, max: 70, mode: 'age' }),
      nik: faker.string.numeric(16),
      maritalStatus: isMarried ? MaritalStatus.MARRIED : getRandomEnum(MaritalStatus),
      address: faker.location.streetAddress(true),
      city: faker.location.city(),
      phoneNumber: faker.phone.number(),
      email: faker.internet.email(),
      occupation: faker.person.jobTitle(),
      education: ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'][Math.floor(Math.random() * 7)],
      religion: faker.helpers.arrayElement([Religion.CATHOLIC, Religion.CATHOLIC, Religion.CATHOLIC, Religion.CATHOLIC, Religion.PROTESTANT]), // Mayoritas katolik
      livingStatus: LivingStatus.ALIVE,
      bidukNumber: faker.string.numeric(8),
      baptismDate: getRandomDate(new Date(1970, 0, 1), new Date(2010, 0, 1)),
      confirmationDate: getRandomDate(new Date(1980, 0, 1), new Date(2015, 0, 1)),
      joinDate: getRandomDate(new Date(2015, 0, 1), new Date(2020, 0, 1)),
      status: 'active',
    };

    // Tambahkan pasangan jika status menikah
    if (isMarried) {
      const spouseGender = gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
      kkData.spouse = {
        create: {
          fullName: faker.person.fullName({ sex: spouseGender === Gender.MALE ? 'male' : 'female' }),
          gender: spouseGender,
          birthPlace: faker.location.city(),
          birthDate: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }),
          nik: faker.string.numeric(16),
          address: kkData.address, // Alamat sama dengan kepala keluarga
          city: kkData.city,
          phoneNumber: faker.phone.number(),
          occupation: faker.person.jobTitle(),
          education: ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2'][Math.floor(Math.random() * 6)],
          religion: kkData.religion,
          livingStatus: LivingStatus.ALIVE,
          bidukNumber: faker.string.numeric(8),
          baptismDate: getRandomDate(new Date(1970, 0, 1), new Date(2010, 0, 1)),
          confirmationDate: getRandomDate(new Date(1975, 0, 1), new Date(2015, 0, 1)),
        }
      };
    }

    // Tambahkan tanggungan (anak dan kerabat)
    const numDependents = Math.floor(Math.random() * 3) + 1; // 1-3 tanggungan
      kkData.dependents = {
        create: Array.from({ length: numDependents }).map(() => {
          const dependentGender = getRandomEnum(Gender);
          const isChild = Math.random() > 0.2; // 80% chance child, 20% relative
          const age = isChild ? { min: 1, max: 25 } : { min: 15, max: 70 };
          
          return {
            name: faker.person.fullName({ sex: dependentGender === Gender.MALE ? 'male' : 'female' }),
            dependentType: isChild ? DependentType.CHILD : DependentType.RELATIVE,
            gender: dependentGender,
            birthPlace: faker.location.city(),
            birthDate: faker.date.birthdate({ min: age.min, max: age.max, mode: 'age' }),
            education: ['BELUM SEKOLAH', 'SD', 'SMP', 'SMA', 'D3', 'S1'][Math.floor(Math.random() * 6)],
            religion: kkData.religion,
            maritalStatus: Math.random() > 0.8 ? MaritalStatus.MARRIED : MaritalStatus.SINGLE,
            baptismDate: Math.random() > 0.2 ? getRandomDate(new Date(2000, 0, 1), new Date()) : null,
            confirmationDate: Math.random() > 0.5 ? getRandomDate(new Date(2010, 0, 1), new Date()) : null,
          };
        })
    };

    return await prisma.familyHead.create({ data: kkData });
  });

  // 2. Keluarga Baru Bergabung (3 keluarga)
  const keluargaBaruPromises = Array.from({ length: 3 }).map(async () => {
    const gender = getRandomEnum(Gender);
    const isMarried = Math.random() > 0.3; // 70% chance married
    
    // Informasi dasar kepala keluarga baru
    const kkData: any = {
      fullName: faker.person.fullName({ sex: gender === Gender.MALE ? 'male' : 'female' }),
      gender,
      birthPlace: faker.location.city(),
      birthDate: faker.date.birthdate({ min: 25, max: 45, mode: 'age' }),
      nik: faker.string.numeric(16),
      maritalStatus: isMarried ? MaritalStatus.MARRIED : getRandomEnum(MaritalStatus),
      address: faker.location.streetAddress(true),
      city: faker.location.city(),
      phoneNumber: faker.phone.number(),
      email: faker.internet.email(),
      occupation: faker.person.jobTitle(),
      education: ['SMA', 'D3', 'S1', 'S2'][Math.floor(Math.random() * 4)],
      religion: Religion.CATHOLIC,
      livingStatus: LivingStatus.ALIVE,
      bidukNumber: faker.string.numeric(8),
      baptismDate: getRandomDate(new Date(1990, 0, 1), new Date(2015, 0, 1)),
      confirmationDate: getRandomDate(new Date(2000, 0, 1), new Date(2020, 0, 1)),
      joinDate: getRandomDate(new Date(2023, 6, 1), new Date()), // Bergabung 6 bulan terakhir
      status: 'active',
    };

    // Tambahkan pasangan jika status menikah
    if (isMarried) {
      const spouseGender = gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
      kkData.spouse = {
        create: {
          fullName: faker.person.fullName({ sex: spouseGender === Gender.MALE ? 'male' : 'female' }),
          gender: spouseGender,
          birthPlace: faker.location.city(),
          birthDate: faker.date.birthdate({ min: 25, max: 45, mode: 'age' }),
          nik: faker.string.numeric(16),
          address: kkData.address, // Alamat sama dengan kepala keluarga
          city: kkData.city,
          phoneNumber: faker.phone.number(),
          occupation: faker.person.jobTitle(),
          education: ['SMA', 'D3', 'S1'][Math.floor(Math.random() * 3)],
          religion: Religion.CATHOLIC,
          livingStatus: LivingStatus.ALIVE,
          bidukNumber: faker.string.numeric(8),
          baptismDate: getRandomDate(new Date(1990, 0, 1), new Date(2015, 0, 1)),
          confirmationDate: getRandomDate(new Date(2000, 0, 1), new Date(2020, 0, 1)),
        }
      };
    }

    // Tambahkan tanggungan (anak)
    const numDependents = Math.floor(Math.random() * 2); // 0-1 tanggungan
    if (numDependents > 0) {
      kkData.dependents = {
        create: Array.from({ length: numDependents }).map(() => {
          const dependentGender = getRandomEnum(Gender);
          return {
            name: faker.person.fullName({ sex: dependentGender === Gender.MALE ? 'male' : 'female' }),
            dependentType: DependentType.CHILD,
            gender: dependentGender,
            birthPlace: faker.location.city(),
            birthDate: faker.date.birthdate({ min: 1, max: 15, mode: 'age' }),
            education: ['BELUM SEKOLAH', 'SD', 'SMP'][Math.floor(Math.random() * 3)],
            religion: Religion.CATHOLIC,
            maritalStatus: MaritalStatus.SINGLE,
            baptismDate: Math.random() > 0.2 ? getRandomDate(new Date(2015, 0, 1), new Date()) : null,
            confirmationDate: null,
          };
        })
      };
    }

    return await prisma.familyHead.create({ data: kkData });
  });

  // 3. Keluarga Pindah (2 keluarga)
  const keluargaPindahPromises = Array.from({ length: 2 }).map(async () => {
    const gender = getRandomEnum(Gender);
    const isMarried = Math.random() > 0.3; // 70% chance married
    
    // Informasi dasar kepala keluarga pindah
    const kkData: any = {
      fullName: faker.person.fullName({ sex: gender === Gender.MALE ? 'male' : 'female' }),
      gender,
      birthPlace: faker.location.city(),
      birthDate: faker.date.birthdate({ min: 30, max: 60, mode: 'age' }),
      nik: faker.string.numeric(16),
      maritalStatus: isMarried ? MaritalStatus.MARRIED : getRandomEnum(MaritalStatus),
      address: faker.location.streetAddress(true),
      city: faker.location.city(),
      phoneNumber: faker.phone.number(),
      email: faker.internet.email(),
      occupation: faker.person.jobTitle(),
      education: ['SD', 'SMP', 'SMA', 'D3', 'S1'][Math.floor(Math.random() * 5)],
      religion: Religion.CATHOLIC,
      livingStatus: LivingStatus.ALIVE,
      bidukNumber: faker.string.numeric(8),
      baptismDate: getRandomDate(new Date(1980, 0, 1), new Date(2010, 0, 1)),
      confirmationDate: getRandomDate(new Date(1990, 0, 1), new Date(2015, 0, 1)),
      joinDate: getRandomDate(new Date(2016, 0, 1), new Date(2020, 0, 1)),
      status: 'moved',
      scheduledDeleteDate: getRandomDate(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
    };

    // Tambahkan pasangan jika status menikah
    if (isMarried) {
      const spouseGender = gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
      kkData.spouse = {
        create: {
          fullName: faker.person.fullName({ sex: spouseGender === Gender.MALE ? 'male' : 'female' }),
          gender: spouseGender,
          birthPlace: faker.location.city(),
          birthDate: faker.date.birthdate({ min: 30, max: 60, mode: 'age' }),
          nik: faker.string.numeric(16),
          address: kkData.address, // Alamat sama dengan kepala keluarga
          city: kkData.city,
          phoneNumber: faker.phone.number(),
          occupation: faker.person.jobTitle(),
          education: ['SD', 'SMP', 'SMA', 'D3', 'S1'][Math.floor(Math.random() * 5)],
          religion: Religion.CATHOLIC,
          livingStatus: LivingStatus.ALIVE,
          bidukNumber: faker.string.numeric(8),
          baptismDate: getRandomDate(new Date(1980, 0, 1), new Date(2010, 0, 1)),
          confirmationDate: getRandomDate(new Date(1990, 0, 1), new Date(2015, 0, 1)),
        }
      };
    }

    return await prisma.familyHead.create({ data: kkData });
  });

  // 4. Keluarga dengan KK Meninggal (2 keluarga)
  const keluargaMeninggalPromises = Array.from({ length: 4 }).map(async () => {
    const gender = getRandomEnum(Gender);
    const isMarried = Math.random() > 0.3; // 70% chance married
    
    // Informasi dasar kepala keluarga meninggal
    const fullName = faker.person.fullName({ sex: gender === Gender.MALE ? 'male' : 'female' });
    const kkData: any = {
      fullName,
      gender,
      birthPlace: faker.location.city(),
      birthDate: faker.date.birthdate({ min: 50, max: 80, mode: 'age' }),
      nik: faker.string.numeric(16),
      maritalStatus: isMarried ? MaritalStatus.MARRIED : getRandomEnum(MaritalStatus),
      address: faker.location.streetAddress(true),
      city: faker.location.city(),
      phoneNumber: faker.phone.number(),
      email: faker.internet.email(),
      occupation: faker.person.jobTitle(),
      education: ['SD', 'SMP', 'SMA', 'D3', 'S1'][Math.floor(Math.random() * 5)],
      religion: Religion.CATHOLIC,
      livingStatus: LivingStatus.DECEASED,
      bidukNumber: faker.string.numeric(8),
      baptismDate: getRandomDate(new Date(1960, 0, 1), new Date(1990, 0, 1)),
      confirmationDate: getRandomDate(new Date(1970, 0, 1), new Date(2000, 0, 1)),
      joinDate: getRandomDate(new Date(2010, 0, 1), new Date(2020, 0, 1)),
      status: 'deceased',
      deathDate: getRandomDate(new Date(2022, 0, 1), new Date()),
      deceasedMemberName: fullName,
    };

    // Tambahkan pasangan jika status menikah
    if (isMarried) {
      const spouseGender = gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;
      kkData.spouse = {
        create: {
          fullName: faker.person.fullName({ sex: spouseGender === Gender.MALE ? 'male' : 'female' }),
          gender: spouseGender,
          birthPlace: faker.location.city(),
          birthDate: faker.date.birthdate({ min: 50, max: 75, mode: 'age' }),
          nik: faker.string.numeric(16),
          address: kkData.address, // Alamat sama dengan kepala keluarga
          city: kkData.city,
          phoneNumber: faker.phone.number(),
          occupation: faker.person.jobTitle(),
          education: ['SD', 'SMP', 'SMA', 'D3', 'S1'][Math.floor(Math.random() * 5)],
          religion: Religion.CATHOLIC,
          livingStatus: LivingStatus.ALIVE,
          bidukNumber: faker.string.numeric(8),
          baptismDate: getRandomDate(new Date(1960, 0, 1), new Date(1990, 0, 1)),
          confirmationDate: getRandomDate(new Date(1970, 0, 1), new Date(2000, 0, 1)),
        }
      };
    }

    return await prisma.familyHead.create({ data: kkData });
  });

  const keluargaAktif = await Promise.all(keluargaAktifPromises);
  const keluargaBaru = await Promise.all(keluargaBaruPromises);
  const keluargaPindah = await Promise.all(keluargaPindahPromises);
  const keluargaMeninggal = await Promise.all(keluargaMeninggalPromises);
  
  const keluarga = [...staticFamilyHeads, ...keluargaAktif, ...keluargaBaru, ...keluargaPindah, ...keluargaMeninggal];
  
  console.log(`✅ Berhasil membuat keluarga dengan berbagai status:`);
  console.log(`   - ${keluargaAktif.length} keluarga aktif`);
  console.log(`   - ${keluargaBaru.length} keluarga baru bergabung`);
  console.log(`   - ${keluargaPindah.length} keluarga pindah`);
  console.log(`   - ${keluargaMeninggal.length} keluarga dengan KK meninggal`);

  // Buat user untuk semua keluarga yang belum memiliki user (kecuali static users yang sudah dibuat)
  // Hanya buat untuk keluarga aktif dan baru bergabung
  const keluargaButuhUser = [...keluargaAktif, ...keluargaBaru];
  const userPromises = keluargaButuhUser.map(kk => {
      const username = faker.internet.username({ firstName: kk.fullName.split(' ')[0], lastName: kk.fullName.split(' ')[1] || '' }).toLowerCase();
      const password = `password123`;
      
      return prisma.user.create({
        data: {
          username,
          password: createPassword(password),
        passphrase: createPassword(`phrase-${username}`),
        role: Role.umat,
          familyHeadId: kk.id,
        }
      });
  });

  const users = await Promise.all(userPromises);
  console.log(`✅ Berhasil membuat ${users.length} user tambahan dengan role umat`);

  // ======================== DATA TRANSAKSI ========================
  // Buat transaksi kas lingkungan
  const transactionTypes = [
    { type: TransactionType.debit, subtype: 'kolekte_1', description: 'Kolekte Doa Lingkungan' },
    { type: TransactionType.debit, subtype: 'kolekte_2', description: 'Kolekte Hari Raya' },
    { type: TransactionType.debit, subtype: 'sumbangan', description: 'Sumbangan' },
    { type: TransactionType.credit, subtype: 'kegiatan', description: 'Biaya Kegiatan' },
    { type: TransactionType.credit, subtype: 'pembelian', description: 'Pembelian Perlengkapan' },
    { type: TransactionType.credit, subtype: 'konsumsi', description: 'Konsumsi Rapat' },
  ];

  const transactions = [];
  for (let i = 0; i < 30; i++) {
    const familyHead = keluarga[Math.floor(Math.random() * keluarga.length)];
    const transType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const amount = Math.floor(Math.random() * 5 + 1) * 100000; // 100rb - 500rb
    const isLocked = Math.random() > 0.7; // 30% terkunci
    
    transactions.push({
      date: getRandomDate(new Date(2023, 0, 1), new Date()),
      description: `${transType.description} ${faker.date.month()}`,
      debit: transType.type === TransactionType.debit ? amount : 0,
      credit: transType.type === TransactionType.credit ? amount : 0,
      locked: isLocked,
      transactionType: transType.type,
      transactionSubtype: transType.subtype,
      familyHeadId: familyHead.id,
    });
  }

  await prisma.transaction.createMany({ data: transactions });
  console.log(`✅ Berhasil membuat ${transactions.length} transaksi kas lingkungan`);

  // Buat transaksi Dana Mandiri
  // Pilih KK yang akan menjadi penunggak Dana Mandiri
  // Static users tidak akan menjadi penunggak
  const staticUserIds = staticFamilyHeads.map(kk => kk.id);
  const keluargaNonStatic = keluarga.filter(kk => !staticUserIds.includes(kk.id) && kk.status !== 'deceased');
  
  // Ambil beberapa KK untuk menjadi penunggak Dana Mandiri 2025 (tahun ini)
  const penunggakDM2025 = faker.helpers.arrayElements(keluargaNonStatic, 5);
  const penunggakDM2025Ids = penunggakDM2025.map(kk => kk.id);

  // Jumlah iuran yang sudah di-set oleh bendahara/ketua lingkungan
  // Sesuai README: Tombol set iuran Dana Mandiri
  const iuranDanaMandiri = 500000; // Nilai default

  const danaMandiriData = [];
  for (const kk of keluarga) {
    if (kk.status !== 'deceased') { // KK yang masih hidup
      const statusPaid2025 = !penunggakDM2025Ids.includes(kk.id);
      
      // Jika tidak membayar, buat array bulan-bulan yang belum dibayar (Januari-April secara random)
      let periodeBayar = '';
      if (!statusPaid2025) {
        // Generate random bulan-bulan yang belum dibayar (1-4)
        const bulanBelumBayar: number[] = [];
        // Ini bulan Mei 2025, jadi kemungkinan tunggakan dari Januari-April
        for (let bulan = 1; bulan <= 4; bulan++) {
          // 60% kemungkinan bulan tersebut belum dibayar
          if (Math.random() < 0.6) {
            bulanBelumBayar.push(bulan);
          }
        }
        
        // Jika tidak ada bulan yang terpilih, pilih minimal 1 bulan
        if (bulanBelumBayar.length === 0) {
          bulanBelumBayar.push(Math.floor(Math.random() * 4) + 1);
        }
        
        // Format menjadi string dengan format YYYY-MM,MM,MM
        periodeBayar = `2025-${bulanBelumBayar.join(',')}`;
      }
      
      danaMandiriData.push({
        familyHeadId: kk.id,
        year: 2025,
        amount: statusPaid2025 ? iuranDanaMandiri : 0, // Jumlah iuran yang ditentukan oleh bendahara/ketua lingkungan
        status: statusPaid2025 ? 'paid' : 'pending',
        paymentDate: statusPaid2025 ? getRandomDate(new Date(2025, 0, 1), new Date(2025, 4, 1)) : new Date(),
        isLocked: false,
        notes: statusPaid2025 ? 'Lunas' : 'Belum membayar',
        paymentStatus: statusPaid2025 ? 'Lunas' : 'Belum Lunas',
        periodeBayar: statusPaid2025 ? null : periodeBayar, // Format: 2025-1,3,4 jika belum bayar Januari, Maret, April
      });
    }
  }

  await prisma.danaMandiriTransaction.createMany({ data: danaMandiriData });
  console.log(`✅ Berhasil membuat ${danaMandiriData.length} transaksi Dana Mandiri`);
  console.log(`   - ${penunggakDM2025.length} KK penunggak Dana Mandiri tahun 2025`);

  // Buat transaksi IKATA
  // Pilih KK yang akan menjadi penunggak IKATA
  const penunggakIkata = faker.helpers.arrayElements(keluargaNonStatic, 5);
  const penunggakIkataIds = penunggakIkata.map(kk => kk.id);

  // Jumlah iuran IKATA yang sudah di-set oleh pengurus IKATA
  // Sesuai README: Tombol set iuran IKATA
  const iuranIkata = 100000; // Nilai default per bulan

  const ikataData = [];
  type JenisIkata = 'uang_masuk' | 'uang_keluar';
  const ikataJenis: JenisIkata[] = ['uang_masuk', 'uang_keluar'];
  const ikataTipe: Record<JenisIkata, string[]> = {
    'uang_masuk': ['iuran_anggota', 'sumbangan', 'lain_lain'],
    'uang_keluar': ['pembelian', 'konsumsi', 'kegiatan', 'lain_lain']
  };

  // Iuran IKATA untuk semua anggota - hanya buat untuk yang penunggak
  // Untuk menghindari duplikasi, kita hanya membuat satu entri per anggota
  for (const kk of penunggakIkata) {
    if (kk.status !== 'deceased') { // KK yang masih hidup
      // Generate random bulan-bulan yang belum dibayar (1-4)
      const bulanBelumBayar: number[] = [];
      // Ini bulan Mei 2025, jadi kemungkinan tunggakan dari Januari-April
      for (let bulan = 1; bulan <= 4; bulan++) {
        // 60% kemungkinan bulan tersebut belum dibayar
        if (Math.random() < 0.6) {
          bulanBelumBayar.push(bulan);
        }
      }
      
      // Jika tidak ada bulan yang terpilih, pilih minimal 1 bulan
      if (bulanBelumBayar.length === 0) {
        bulanBelumBayar.push(Math.floor(Math.random() * 4) + 1);
      }
      
      // Format menjadi string dengan format YYYY-MM,MM,MM
      const periodeBayar = `2025-${bulanBelumBayar.join(',')}`;
      
      // Hitung jumlah tunggakan berdasarkan jumlah bulan yang belum dibayar
      const jumlahTunggakan = bulanBelumBayar.length * iuranIkata;
      
      ikataData.push({
        tanggal: new Date(),
        keterangan: `Iuran IKATA 2025`,
        jumlah: jumlahTunggakan, // Jumlah disesuaikan dengan bulan yang belum dibayar
        jenis: 'uang_masuk',
        tipeTransaksi: 'iuran_anggota',
        debit: 0, // Belum dibayar, jadi debit 0
        kredit: 0,
        statusPembayaran: StatusPembayaran.belum_ada_pembayaran,
        periodeBayar: periodeBayar,
        anggotaId: kk.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
        locked: false,
      });
    }
  }

  // Buat pembayaran lunas untuk anggota lain (non-penunggak)
  // Filter KK yang bukan penunggak dan bukan meninggal
  const nonPenunggakIds = keluargaNonStatic
    .filter(kk => !penunggakIkataIds.includes(kk.id) && kk.status !== 'deceased')
    .slice(0, 10); // Batasi hanya 10 anggota saja yang sudah lunas
  
  for (const kk of nonPenunggakIds) {
    const jumlahBayar = iuranIkata * 4; // Bayar penuh 4 bulan (Jan-Apr)
    
    ikataData.push({
      tanggal: getRandomDate(new Date(2025, 0, 1), new Date(2025, 3, 30)),
      keterangan: `Iuran IKATA 2025 (Januari-April)`,
      jumlah: jumlahBayar,
      jenis: 'uang_masuk',
      tipeTransaksi: 'iuran_anggota',
      debit: jumlahBayar, // Sudah dibayar penuh
      kredit: 0,
      statusPembayaran: StatusPembayaran.lunas,
      periodeBayar: null, // Tidak ada periode tertunggak
      anggotaId: kk.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      updatedBy: 'system',
      locked: false,
    });
  }

  await prisma.iKATATransaction.createMany({ data: ikataData });
  console.log(`✅ Berhasil membuat ${ikataData.length} transaksi IKATA`);
  console.log(`   - ${penunggakIkata.length} KK penunggak iuran IKATA`);

  // ======================== DATA TINGKAT PARTISIPASI UMAT ========================
  // Buat jadwal doa lingkungan dengan data kehadiran untuk menunjukkan tingkat partisipasi
  const jadwalStatuses = ['terjadwal', 'selesai', 'dibatalkan', 'ditunda'];
  const jadwalDolingPromises = [];

  // Umat yang sangat aktif (high participation)
  const umatAktif = faker.helpers.arrayElements(keluarga.filter(kk => kk.status === 'active'), 5);
  // Umat dengan partisipasi sedang (medium participation)
  const umatSedang = faker.helpers.arrayElements(
    keluarga.filter(kk => kk.status === 'active' && !umatAktif.includes(kk)), 
    7
  );
  // Sisanya akan menjadi umat dengan partisipasi rendah

  // Buat 15 jadwal doa lingkungan dengan absensi untuk menunjukkan tingkat partisipasi
  for (let i = 0; i < 15; i++) {
    // Sebagian besar jadwal sudah selesai untuk menunjukkan data partisipasi
    const isCompleted = i < 12; // 12 jadwal sudah selesai, 3 masih terjadwal
    
    const tglMulai = new Date(2024, 0, 1); // 1 Jan 2024
    const tglAkhir = isCompleted ? new Date() : new Date(new Date().setMonth(new Date().getMonth() + 2));
    
    const tanggal = getRandomDate(tglMulai, tglAkhir);
    const tuanRumah = keluarga.filter(kk => kk.status === 'active')[Math.floor(Math.random() * keluarga.filter(kk => kk.status === 'active').length)];
    const status = isCompleted ? 'selesai' : 'terjadwal';
    
    const jadwalData: any = {
      tanggal,
      waktu: `${18 + Math.floor(Math.random() * 3)}:${Math.random() > 0.5 ? '00' : '30'}`,
      tuanRumahId: tuanRumah.id,
      tuanRumah: tuanRumah.fullName,
      alamat: tuanRumah.address,
      noTelepon: tuanRumah.phoneNumber,
      catatan: Math.random() > 0.5 ? faker.lorem.sentence(10) : null,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Tambahkan detil doling jika status selesai
    if (status === 'selesai') {
      jadwalData.detilDoling = {
        create: {
          tanggal: jadwalData.tanggal,
          tuanRumah: jadwalData.tuanRumah,
          jumlahHadir: Math.floor(Math.random() * 25) + 10, // 10-35 orang
          jenisIbadat: faker.helpers.arrayElement(['doa-lingkungan', 'pendalaman-iman', 'adorasi']),
          subIbadat: faker.helpers.arrayElement(['ibadat-sabda', 'rosario', 'tobat']),
          temaIbadat: faker.lorem.words(3),
          kegiatan: 'doa-lingkungan',
          biaya: Math.floor(Math.random() * 5 + 1) * 50000,
          koleksi: Math.floor(Math.random() * 10 + 5) * 50000,
          keterangan: faker.lorem.paragraph(1),
          status: 'selesai',
          sudahDiapprove: Math.random() > 0.3, // 70% sudah di-approve
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      };

      // Tambahkan absensi berdasarkan tingkat partisipasi
      const absensiData = [];
      
      // Umat aktif (hadir 80-100%)
      for (const kk of umatAktif) {
        if (kk.status === 'active') {
          absensiData.push({
          tanggalKehadiran: jadwalData.tanggal,
          nama: kk.fullName,
          kepalaKeluarga: true,
            kehadiran: Math.random() > 0.2 ? 'hadir' : 'izin', // 80% hadir
          keterangan: Math.random() > 0.7 ? faker.lorem.sentence(5) : null,
          });
        }
      }
      
      // Umat partisipasi sedang (hadir 40-60%)
      for (const kk of umatSedang) {
        if (kk.status === 'active') {
          absensiData.push({
            tanggalKehadiran: jadwalData.tanggal,
            nama: kk.fullName,
            kepalaKeluarga: true,
            kehadiran: Math.random() > 0.5 ? 'hadir' : (Math.random() > 0.5 ? 'izin' : 'tidak hadir'), // 50% hadir
            keterangan: Math.random() > 0.5 ? faker.lorem.sentence(5) : null,
          });
        }
      }
      
      // Umat partisipasi rendah (sisanya - hadir 10-20%)
      const umatLainnya = keluarga.filter(kk => 
        kk.status === 'active' && 
        !umatAktif.includes(kk) && 
        !umatSedang.includes(kk)
      );
      
      for (const kk of umatLainnya) {
        if (Math.random() > 0.7) { // Hanya 30% dari mereka bahkan muncul di absensi
          absensiData.push({
            tanggalKehadiran: jadwalData.tanggal,
            nama: kk.fullName,
            kepalaKeluarga: true,
            kehadiran: Math.random() > 0.85 ? 'hadir' : (Math.random() > 0.5 ? 'izin' : 'tidak hadir'), // 15% hadir
            keterangan: Math.random() > 0.3 ? faker.lorem.sentence(5) : null,
          });
        }
      }
      
      jadwalData.absensiDoling = {
        create: absensiData
      };
    }

    jadwalDolingPromises.push(prisma.jadwalDoling.create({ data: jadwalData }));
  }

  const jadwalDoling = await Promise.all(jadwalDolingPromises);
  console.log(`✅ Berhasil membuat ${jadwalDoling.length} jadwal doa lingkungan dengan data partisipasi umat`);
  console.log(`   - ${umatAktif.length} umat dengan tingkat partisipasi tinggi`);
  console.log(`   - ${umatSedang.length} umat dengan tingkat partisipasi sedang`);
  console.log(`   - ${keluarga.filter(kk => kk.status === 'active').length - umatAktif.length - umatSedang.length} umat dengan tingkat partisipasi rendah`);

  // ======================== DATA PUBLIKASI DAN LAINNYA ========================
  // Buat publikasi
  const publikasiData = [];
  for (let i = 0; i < 10; i++) {
    const date = getRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31));
    const isExpired = date < new Date();
    const isLocked = Math.random() > 0.7; // 30% terkunci
    
    publikasiData.push({
      judul: faker.lorem.sentence(5).replace('.', ''),
      tanggal: date,
      waktu: `${16 + Math.floor(Math.random() * 6)}:${Math.random() > 0.5 ? '00' : '30'}`,
      lokasi: faker.helpers.arrayElement(['Gereja St. Agatha', 'Aula Paroki', 'Rumah Keluarga', 'Gedung Serba Guna']),
      targetPenerima: faker.helpers.arrayElement(['Semua Pengguna', 'Umat', 'Pengurus', 'Khusus']),
      status: isExpired ? StatusPublikasi.kedaluwarsa : StatusPublikasi.aktif,
      pembuat: 'ketua', // Default pembuat adalah ketua lingkungan
      lampiran: Math.random() > 0.5,
      locked: isLocked,
      kategori: faker.helpers.arrayElement(['Penting', 'Umum', 'Segera', 'Umum']),
    });
  }

  const publikasi = await prisma.publikasi.createMany({ data: publikasiData });
  console.log(`✅ Berhasil membuat ${publikasiData.length} publikasi`);

  // Buat laporan
  const laporanPromises = [];
  for (let i = 0; i < 8; i++) {
    // Pilih publikasi secara acak
    const pubIndex = Math.floor(Math.random() * publikasiData.length);
    const pub = publikasiData[pubIndex];
    
    if (Math.random() > 0.5) { // 50% publikasi memiliki laporan
      laporanPromises.push(
        prisma.laporan.create({
          data: {
            judul: `Laporan ${pub.judul}`,
            jenis: faker.helpers.arrayElement(['Kegiatan', 'Evaluasi', 'Keuangan', 'Kepanitiaan']),
            tanggal: getRandomDate(new Date(pub.tanggal), new Date(new Date(pub.tanggal).setDate(new Date(pub.tanggal).getDate() + 14))),
            keterangan: faker.lorem.paragraph(2),
            lampiran: Math.random() > 0.3 ? `laporan-${faker.string.alphanumeric(8)}.pdf` : '',
            publikasiId: i + 1, // Asumsi: IDs publikasi mulai dari 1
          }
        })
      );
    }
  }

  await Promise.all(laporanPromises);
  console.log(`✅ Berhasil membuat ${laporanPromises.length} laporan`);

  // Buat approval items
  const approvalData: Array<{
    itemType: string;
    itemId: number;
    status: string;
    approvedBy: string;
    approvedAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }> = [];

  // Approval untuk DetilDoling yang sudah selesai
  jadwalDoling.forEach((jadwal, index) => {
    if (jadwal.status === 'selesai' && Math.random() > 0.3) { // 70% doling selesai sudah diapprove
      approvalData.push({
        itemType: 'DetilDoling',
        itemId: index + 1,
        status: faker.helpers.arrayElement(['approved', 'approved', 'approved', 'pending', 'rejected']),
        approvedBy: 'ketua',
        approvedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  });

  await prisma.approvalItem.createMany({ data: approvalData });
  console.log(`✅ Berhasil membuat ${approvalData.length} approval items`);

  // Buat agenda
  const agendaData = [];
  for (let i = 0; i < 12; i++) {
    const date = getRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31));
    agendaData.push({
      title: faker.lorem.words(4),
      description: faker.lorem.paragraph(1),
      date,
      location: faker.helpers.arrayElement(['Gereja St. Agatha', 'Aula Paroki', 'Rumah Keluarga', 'Gedung Serba Guna']),
      target: faker.helpers.arrayElement(['lingkungan', 'paroki', 'umum', 'pengurus']),
      status: date < new Date() ? 'closed' : 'open',
      createdBy: keluarga[Math.floor(Math.random() * keluarga.length)].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await prisma.agenda.createMany({ data: agendaData });
  console.log(`✅ Berhasil membuat ${agendaData.length} agenda`);

  // Buat notifikasi
  const notifikasiData = [];
  
  // Notifikasi untuk penunggak Dana Mandiri
  for (const kk of penunggakDM2025) {
    notifikasiData.push({
      title: 'Pengingat Dana Mandiri',
      message: `Mohon segera melunasi Dana Mandiri tahun 2025`,
      type: 'warning',
      timestamp: getRandomDate(new Date(2025, 3, 1), new Date()),
      isRead: Math.random() > 0.5,
      recipientId: kk.id,
      senderId: staticFamilyHeads[0].id, // Super user sebagai sender
      relatedItemId: 1,
      relatedItemType: 'DanaMandiri',
    });
  }
  
  // Notifikasi untuk penunggak IKATA
  for (const kk of penunggakIkata) {
    notifikasiData.push({
      title: 'Pengingat Iuran IKATA',
      message: `Mohon segera melunasi iuran IKATA triwulan 1 dan 2 tahun 2025`,
      type: 'warning',
      timestamp: new Date(), // Menggunakan tanggal saat ini
      isRead: Math.random() > 0.5,
      recipientId: kk.id,
      senderId: staticFamilyHeads[1].id, // Ketua lingkungan sebagai sender
      relatedItemId: 1,
      relatedItemType: 'IKATA',
    });
  }
  
  // Notifikasi lainnya
  for (let i = 0; i < 10; i++) {
    const recipient = keluarga[Math.floor(Math.random() * keluarga.length)];
    const sender = staticFamilyHeads[Math.floor(Math.random() * staticFamilyHeads.length)];
    
    notifikasiData.push({
      title: faker.helpers.arrayElement(['Pengumuman', 'Reminder', 'Informasi', 'Peringatan']),
      message: faker.lorem.sentence(10),
      type: faker.helpers.arrayElement(['info', 'warning', 'success', 'error']),
      timestamp: getRandomDate(new Date(2025, 0, 1), new Date(2025, 4, 1)), // Januari-April 2025
      isRead: Math.random() > 0.5,
      recipientId: recipient.id,
      senderId: sender.id,
      relatedItemId: Math.floor(Math.random() * 10) + 1,
      relatedItemType: faker.helpers.arrayElement(['Publikasi', 'JadwalDoling', 'Transaksi', 'DanaMandiri']),
    });
  }

  await prisma.notification.createMany({ data: notifikasiData });
  console.log(`✅ Berhasil membuat ${notifikasiData.length} notifikasi`);

  console.log('🎉 Seeding selesai! Database telah terisi dengan data yang bervariasi.');
  console.log('Ringkasan data yang dibuat:');
  console.log(`- ${staticUsers.length} user statis dengan berbagai role`);
  console.log(`- Total ${keluarga.length} keluarga dengan berbagai status`);
  console.log(`- ${penunggakDM2025.length} penunggak Dana Mandiri tahun 2025`);
  console.log(`- ${penunggakIkata.length} penunggak iuran IKATA`);
  console.log(`- Data partisipasi umat: ${umatAktif.length} tinggi, ${umatSedang.length} sedang, sisanya rendah`);
}

main()
  .catch((e) => {
    console.error('❌ Error selama proses seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 