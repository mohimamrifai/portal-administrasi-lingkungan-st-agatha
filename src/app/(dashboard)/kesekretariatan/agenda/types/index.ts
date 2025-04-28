export type AgendaStatus = 
  'open' | 
  'processing_lingkungan' | 
  'processing_stasi' | 
  'processing_paroki' | 
  'forwarded_to_paroki' | 
  'rejected' | 
  'completed';

export type ProcessTarget = 'lingkungan' | 'stasi' | 'paroki';

export interface Agenda {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  target: ProcessTarget;
  status: AgendaStatus;
  rejectionReason?: string;
  createdBy: {
    id: number;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface AgendaFormValues {
  title: string;
  description: string;
  date: Date;
  location: string;
  target: ProcessTarget;
}

export interface RejectionFormValues {
  reason: string;
} 