export type AgendaStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface Agenda {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  status: AgendaStatus;
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
} 