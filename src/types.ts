/**
 * VOLT — Types & Data Contracts
 * Systèmes de secours diesel industriels pour le Grand Tunis
 */

export type AvailabilityStatus = 'En stock' | 'Sur commande (7j)' | 'Rupture temporaire';
export type RentalAvailabilityStatus = 'Disponible' | 'En cours de location' | 'En révision';

export interface Generator {
  id: string;
  model: string;
  kva: number;
  kw: number;
  engine: string;
  cylinderCount: number;
  speed: string;
  voltage: string;
  tankCapacity: number; // Litres
  consumption: string;
  noiseLevel: string;
  dimensions: string;
  weight: string;
  warranty: string;
  fuelType: string;
  availability: AvailabilityStatus;
  priceTND: number;
  shortDesc: string;
  fullDesc: string;
  atsIncluded: boolean;
  badge?: string;
  voltageType: 'Triphasé' | 'Monophasé';
  imageUrl?: string;
}

export interface RentalUnit {
  id: string;
  name: string;
  kva: number;
  kw: number;
  engine: string;
  dailyRate: number; // TND/jour
  weeklyRate: number; // TND/semaine (<7j: tarif jour; >=7j: tarif semaine + jours restants)
  availability: RentalAvailabilityStatus;
  tankCapacity: number;
  fuelConsumption: string;
  soundproof: string;
  features: string[];
  suitableFor: string;
  isMobileTrailer?: boolean;
  imageUrl?: string;
}

export type PurchaseRequestStatus = 'En attente' | 'Contacté' | 'Confirmé' | 'Terminé' | 'Rejeté';

export interface PurchaseRequest {
  id: string; // VP-[timestamp]
  generatorId: string;
  generatorModel: string;
  customerName: string;
  phone: string;
  email: string;
  governorate: string; // Tunis, Ariana, Ben Arous, Manouba, Autre
  address: string;
  message: string;
  status: PurchaseRequestStatus;
  createdAt: string;
  estimatedAmountTND: number;
  withAtsOption: boolean;
  notes?: string;
}

export type RentalRequestStatus = 'En attente' | 'Confirmé' | 'Actif' | 'Terminé' | 'Rejeté';

export interface RentalRequest {
  id: string; // VR-[timestamp]
  unitId: string;
  unitName: string;
  customerName: string;
  phone: string;
  email: string;
  governorate: string;
  deliveryAddress: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  calculationBreakdown: string;
  totalPriceTND: number;
  options: {
    externalTank: boolean;
    technicianOnDuty: boolean;
    cabling25m: boolean;
  };
  message: string;
  status: RentalRequestStatus;
  createdAt: string;
  notes?: string;
}

export type TicketCategory =
  | 'DemarrageImpossible'
  | 'InverseurATS'
  | 'FuiteFluide'
  | 'Surchauffe'
  | 'AlarmeTableau'
  | 'Autre';

export type TicketUrgency = 'normal' | 'urgent' | 'urgence_critique';

export type TicketStatus = 'Ouvert' | 'Assigné' | 'En cours' | 'Résolu' | 'Fermé';

export interface TicketInternalNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string; // VOLT-2026-[compteur 5 chiffres]
  customerName: string;
  phone: string;
  email: string;
  generatorModel: string;
  governorate: string;
  address: string;
  category: TicketCategory;
  urgency: TicketUrgency;
  slaText: string;
  description: string;
  photoBase64?: string;
  status: TicketStatus;
  assignedTechnician?: string;
  internalNotes: TicketInternalNote[];
  createdAt: string;
  updatedAt?: string;
}

export type ActiveTab = 'home' | 'sales' | 'rental' | 'support' | 'admin';
