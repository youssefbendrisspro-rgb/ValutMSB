/**
 * VOLT — Gestionnaire de persistance localStorage robuste
 * Gère les quotas, erreurs de parsing, compteurs distincts et fallbacks
 */

import {
  Generator,
  RentalUnit,
  PurchaseRequest,
  RentalRequest,
  SupportTicket,
} from '../types';
import {
  DEFAULT_GENERATORS,
  DEFAULT_RENTAL_UNITS,
  DEFAULT_PURCHASE_REQUESTS,
  DEFAULT_RENTAL_REQUESTS,
  DEFAULT_SUPPORT_TICKETS,
} from '../data/defaults';

const KEYS = {
  CACHE_VERSION: 'volt_cache_version_v3',
  GENERATORS: 'volt_generators',
  RENTAL_UNITS: 'volt_rental_units',
  PURCHASE_REQUESTS: 'volt_purchase_requests',
  RENTAL_REQUESTS: 'volt_rental_requests',
  SUPPORT_TICKETS: 'volt_support_tickets',
  TICKET_COUNTER: 'volt_ticket_counter',
};

// Nettoyage automatique du cache navigateur pour supprimer toutes les anciennes données obsolètes
export function purgeObsoleteCache(): void {
  try {
    const currentVer = localStorage.getItem(KEYS.CACHE_VERSION);
    if (currentVer !== 'v3') {
      localStorage.removeItem(KEYS.GENERATORS);
      localStorage.removeItem(KEYS.RENTAL_UNITS);
      localStorage.removeItem(KEYS.PURCHASE_REQUESTS);
      localStorage.removeItem(KEYS.RENTAL_REQUESTS);
      localStorage.setItem(KEYS.GENERATORS, JSON.stringify(DEFAULT_GENERATORS));
      localStorage.setItem(KEYS.RENTAL_UNITS, JSON.stringify(DEFAULT_RENTAL_UNITS));
      localStorage.setItem(KEYS.PURCHASE_REQUESTS, JSON.stringify(DEFAULT_PURCHASE_REQUESTS));
      localStorage.setItem(KEYS.RENTAL_REQUESTS, JSON.stringify(DEFAULT_RENTAL_REQUESTS));
      localStorage.setItem(KEYS.CACHE_VERSION, 'v3');
    }
  } catch (e) {
    console.error('Erreur lors du nettoyage de cache', e);
  }
}

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  isQuotaExceeded?: boolean;
}

// Helper pour tester l'écriture avec gestion fine du dépassement de quota
function safeSetItem(key: string, value: string): { success: boolean; isQuotaExceeded?: boolean; error?: string } {
  try {
    localStorage.setItem(key, value);
    return { success: true };
  } catch (err: unknown) {
    console.error(`Erreur d'écriture localStorage pour la clé "${key}":`, err);
    const isQuota =
      err instanceof DOMException &&
      (err.code === 22 ||
        err.code === 1014 ||
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED');

    return {
      success: false,
      isQuotaExceeded: isQuota,
      error: isQuota
        ? 'Mémoire locale saturée (quota localStorage atteint). Veuillez réduire la taille de l’image ou supprimer d’anciennes demandes.'
        : 'Impossible d’enregistrer les données sur votre navigateur.',
    };
  }
}

function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Erreur de lecture/parsing pour "${key}", rétablissement des données par défaut.`, err);
    return defaultValue;
  }
}

// ----------------- GÉNÉRATEURS -----------------
export function getStoredGenerators(): Generator[] {
  const items = safeGetItem<Generator[]>(KEYS.GENERATORS, DEFAULT_GENERATORS);
  // Si les anciennes données industrielles (30-220 kVA) sont stockées, basculer sur les modèles domestiques
  const isOldIndustrial = items.some((g) => g.model.includes('Power 30') || g.model.includes('Power 200') || g.kva > 25);
  if (isOldIndustrial) {
    saveStoredGenerators(DEFAULT_GENERATORS);
    return DEFAULT_GENERATORS;
  }

  // Assurer la présence des vraies images même sur des données déjà en cache local
  return items.map((g) => {
    if (!g.imageUrl) {
      const match = DEFAULT_GENERATORS.find((d) => d.id === g.id || d.kva === g.kva);
      if (match?.imageUrl) {
        return { ...g, imageUrl: match.imageUrl };
      }
    }
    return g;
  });
}

export function saveStoredGenerators(generators: Generator[]): StorageResult<Generator[]> {
  const serialized = JSON.stringify(generators);
  const res = safeSetItem(KEYS.GENERATORS, serialized);
  return {
    success: res.success,
    data: generators,
    error: res.error,
    isQuotaExceeded: res.isQuotaExceeded,
  };
}

// ----------------- UNITÉS DE LOCATION -----------------
export function getStoredRentalUnits(): RentalUnit[] {
  const items = safeGetItem<RentalUnit[]>(KEYS.RENTAL_UNITS, DEFAULT_RENTAL_UNITS);
  const isOldIndustrial = items.some((u) => u.name.includes('Rent 45') || u.name.includes('Rent 250') || u.kva > 25);
  if (isOldIndustrial) {
    saveStoredRentalUnits(DEFAULT_RENTAL_UNITS);
    return DEFAULT_RENTAL_UNITS;
  }

  return items.map((u) => {
    if (!u.imageUrl) {
      const match = DEFAULT_RENTAL_UNITS.find((d) => d.id === u.id || d.kva === u.kva);
      if (match?.imageUrl) {
        return { ...u, imageUrl: match.imageUrl };
      }
    }
    return u;
  });
}

export function saveStoredRentalUnits(units: RentalUnit[]): StorageResult<RentalUnit[]> {
  const serialized = JSON.stringify(units);
  const res = safeSetItem(KEYS.RENTAL_UNITS, serialized);
  return {
    success: res.success,
    data: units,
    error: res.error,
    isQuotaExceeded: res.isQuotaExceeded,
  };
}

// ----------------- DEMANDES D'ACHAT -----------------
export function getStoredPurchaseRequests(): PurchaseRequest[] {
  return safeGetItem<PurchaseRequest[]>(KEYS.PURCHASE_REQUESTS, DEFAULT_PURCHASE_REQUESTS);
}

export function saveStoredPurchaseRequests(requests: PurchaseRequest[]): StorageResult<PurchaseRequest[]> {
  const serialized = JSON.stringify(requests);
  const res = safeSetItem(KEYS.PURCHASE_REQUESTS, serialized);
  return {
    success: res.success,
    data: requests,
    error: res.error,
    isQuotaExceeded: res.isQuotaExceeded,
  };
}

// ----------------- DEMANDES DE LOCATION -----------------
export function getStoredRentalRequests(): RentalRequest[] {
  return safeGetItem<RentalRequest[]>(KEYS.RENTAL_REQUESTS, DEFAULT_RENTAL_REQUESTS);
}

export function saveStoredRentalRequests(requests: RentalRequest[]): StorageResult<RentalRequest[]> {
  const serialized = JSON.stringify(requests);
  const res = safeSetItem(KEYS.RENTAL_REQUESTS, serialized);
  return {
    success: res.success,
    data: requests,
    error: res.error,
    isQuotaExceeded: res.isQuotaExceeded,
  };
}

// ----------------- COMPTEUR DE TICKETS SÉPARÉ -----------------
export function getNextTicketNumber(): number {
  try {
    const raw = localStorage.getItem(KEYS.TICKET_COUNTER);
    let counter = raw ? parseInt(raw, 10) : 4; // Démarre à 4 car 3 tickets par défaut existent déjà
    if (isNaN(counter) || counter < 1) {
      counter = 4;
    }
    const nextVal = counter + 1;
    localStorage.setItem(KEYS.TICKET_COUNTER, nextVal.toString());
    return counter;
  } catch (err) {
    console.error('Erreur lecture compteur tickets:', err);
    return Math.floor(1000 + Math.random() * 9000);
  }
}

// ----------------- TICKETS DE SUPPORT -----------------
export function getStoredSupportTickets(): SupportTicket[] {
  return safeGetItem<SupportTicket[]>(KEYS.SUPPORT_TICKETS, DEFAULT_SUPPORT_TICKETS);
}

export function saveStoredSupportTickets(tickets: SupportTicket[]): StorageResult<SupportTicket[]> {
  const serialized = JSON.stringify(tickets);
  const res = safeSetItem(KEYS.SUPPORT_TICKETS, serialized);
  return {
    success: res.success,
    data: tickets,
    error: res.error,
    isQuotaExceeded: res.isQuotaExceeded,
  };
}

// ----------------- RÉINITIALISATION TOTALE (DÉMO) -----------------
export function resetAllToDefaults(): void {
  try {
    localStorage.setItem(KEYS.GENERATORS, JSON.stringify(DEFAULT_GENERATORS));
    localStorage.setItem(KEYS.RENTAL_UNITS, JSON.stringify(DEFAULT_RENTAL_UNITS));
    localStorage.setItem(KEYS.PURCHASE_REQUESTS, JSON.stringify(DEFAULT_PURCHASE_REQUESTS));
    localStorage.setItem(KEYS.RENTAL_REQUESTS, JSON.stringify(DEFAULT_RENTAL_REQUESTS));
    localStorage.setItem(KEYS.SUPPORT_TICKETS, JSON.stringify(DEFAULT_SUPPORT_TICKETS));
    localStorage.setItem(KEYS.TICKET_COUNTER, '4');
  } catch (e) {
    console.error('Erreur reset defaults', e);
  }
}

// ----------------- UTILITAIRE DE COMPRESSION D'IMAGE CANVAS -----------------
/**
 * Redimensionne côté client via HTML5 Canvas (max 800px de large, JPEG qualité 0.6)
 * Évite de saturer le quota de 5MB du localStorage
 */
export async function compressImageFile(file: File, maxWidth = 800, quality = 0.6): Promise<string> {
  return new Promise((resolve, reject) => {
    // Si ce n'est pas une image
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Le fichier sélectionné doit être une image.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier image.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Impossible de décoder l’image.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Contexte Canvas 2D non disponible.'));
        }

        // Rendu net
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (canvasErr) {
          reject(canvasErr);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
