"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PetugasLiturgiData {
  pemimpin: string;
  rosario: string;
  lagu: string;
  bacaan: string;
}

interface PetugasLiturgiSectionProps {
  petugasLiturgi: PetugasLiturgiData;
  onPetugasLiturgiChange: (field: keyof PetugasLiturgiData, value: string) => void;
}

export function PetugasLiturgiSection({
  petugasLiturgi,
  onPetugasLiturgiChange,
}: PetugasLiturgiSectionProps) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-md font-medium mb-2">Petugas Liturgi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pemimpin">Pemimpin</Label>
          <Input
            id="pemimpin"
            name="pemimpin"
            value={petugasLiturgi.pemimpin}
            onChange={(e) => onPetugasLiturgiChange("pemimpin", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rosario">Petugas Rosario</Label>
          <Input
            id="rosario"
            name="rosario"
            value={petugasLiturgi.rosario}
            onChange={(e) => onPetugasLiturgiChange("rosario", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lagu">Petugas Lagu</Label>
          <Input
            id="lagu"
            name="lagu"
            value={petugasLiturgi.lagu}
            onChange={(e) => onPetugasLiturgiChange("lagu", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bacaan">Petugas Bacaan</Label>
          <Input
            id="bacaan"
            name="bacaan"
            value={petugasLiturgi.bacaan}
            onChange={(e) => onPetugasLiturgiChange("bacaan", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
} 