import { format, parse } from "date-fns";
import { 
  Gender, 
  MaritalStatus, 
  ProfileData, 
  FamilyHead, 
  Spouse, 
  Dependent,
  Religion,
  LivingStatus,
  DependentType
} from "../types";

// Generate mock profile data berdasarkan userID
export function generateMockProfile(userId: number): ProfileData {
  // Data keluarga untuk user umat dengan ID 1
  if (userId === 1) {
    return {
      familyHead: {
        id: 1,
        fullName: "Budi Santoso",
        gender: Gender.MALE,
        birthPlace: "Jakarta",
        birthDate: new Date(1980, 5, 15),
        nik: "3171091506800004",
        maritalStatus: MaritalStatus.MARRIED,
        address: "Jl. Anggrek No. 123, RT 01/RW 02, Kelurahan Melati, Kecamatan Bunga, Jakarta Selatan",
        city: "Jakarta Selatan",
        phoneNumber: "081234567890",
        email: "budi.santoso@example.com",
        occupation: "Wiraswasta",
        education: "D4/S1",
        religion: Religion.CATHOLIC,
        livingStatus: LivingStatus.ALIVE,
        bidukNumber: "12345",
        baptismDate: new Date(1980, 8, 15),
        confirmationDate: new Date(1992, 5, 20),
        deathDate: null,
        imageUrl: "https://i.pravatar.cc/300?img=12"
      },
      spouse: {
        id: 101,
        fullName: "Siti Rahma",
        gender: Gender.FEMALE,
        birthPlace: "Bandung",
        birthDate: new Date(1982, 8, 20),
        nik: "3171092009820003",
        address: "Jl. Anggrek No. 123, RT 01/RW 02, Kelurahan Melati, Kecamatan Bunga, Jakarta Selatan",
        city: "Jakarta Selatan",
        phoneNumber: "081234567891",
        email: "siti.rahma@example.com",
        occupation: "Guru",
        education: "D4/S1",
        religion: Religion.CATHOLIC,
        livingStatus: LivingStatus.ALIVE,
        bidukNumber: "12346",
        baptismDate: new Date(1982, 10, 5),
        confirmationDate: new Date(1994, 7, 12),
        deathDate: null,
        imageUrl: "https://i.pravatar.cc/300?img=5"
      },
      dependents: [
        {
          id: 201,
          name: "Agus Santoso",
          gender: Gender.MALE,
          birthPlace: "Jakarta",
          birthDate: new Date(2005, 3, 10),
          education: "SMA/SMK",
          religion: Religion.CATHOLIC,
          maritalStatus: MaritalStatus.SINGLE,
          dependentType: DependentType.CHILD,
          baptismDate: new Date(2005, 5, 20),
          confirmationDate: new Date(2017, 8, 15),
          imageUrl: "https://i.pravatar.cc/300?img=10"
        },
        {
          id: 202,
          name: "Dewi Santoso",
          gender: Gender.FEMALE,
          birthPlace: "Jakarta",
          birthDate: new Date(2008, 7, 22),
          education: "SMP",
          religion: Religion.CATHOLIC,
          maritalStatus: MaritalStatus.SINGLE,
          dependentType: DependentType.CHILD,
          baptismDate: new Date(2008, 9, 10),
          confirmationDate: null,
          imageUrl: "https://i.pravatar.cc/300?img=9"
        }
      ]
    };
  }
  
  // Data keluarga lain (contoh untuk SuperUser)
  return {
    familyHead: {
      id: userId,
      fullName: "Administrator",
      gender: Gender.MALE,
      birthPlace: "Jakarta",
      birthDate: new Date(1975, 0, 1),
      nik: "3171010101750001",
      maritalStatus: MaritalStatus.MARRIED,
      address: "Jl. Admin No. 1, Jakarta",
      city: "Jakarta Pusat",
      phoneNumber: "081234567899",
      email: "admin@example.com",
      occupation: "Administrator",
      education: "D4/S1",
      religion: Religion.CATHOLIC,
      livingStatus: LivingStatus.ALIVE,
      bidukNumber: "12347",
      baptismDate: new Date(1975, 2, 15),
      confirmationDate: new Date(1987, 5, 20),
      deathDate: null,
      imageUrl: "https://i.pravatar.cc/300?img=70"
    },
    spouse: null,
    dependents: []
  };
}

// Format tanggal untuk ditampilkan
export function formatDate(date: Date | null): string {
  if (!date) return "-";
  return format(date, "dd MMMM yyyy");
}

// Format tanggal untuk input date
export function formatDateForInput(date: Date | null): string {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
}

// Parse string date menjadi object Date
export function parseDate(dateString: string): Date {
  return parse(dateString, "yyyy-MM-dd", new Date());
}

// Convert form values menjadi objek profil data
export function convertFormValuesToProfileData(
  currentProfile: ProfileData,
  familyHeadData: any,
  spouseData: any | null,
  dependentsData: Dependent[]
): ProfileData {
  return {
    familyHead: {
      ...currentProfile.familyHead,
      ...familyHeadData
    },
    spouse: spouseData ? {
      ...(currentProfile.spouse || { id: 0 }),
      ...spouseData
    } : null,
    dependents: dependentsData.map((dependent, index) => ({
      ...(currentProfile.dependents[index] || { id: 0 }),
      ...dependent
    }))
  };
} 