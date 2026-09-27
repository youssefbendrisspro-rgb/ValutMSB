/**
 * VOLT — Groupes Électrogènes de Secours
 * Application principale SPA pour le Grand Tunis
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  Generator,
  RentalUnit,
  PurchaseRequest,
  RentalRequest,
  SupportTicket,
  PurchaseRequestStatus,
  RentalRequestStatus,
  TicketStatus,
} from './types';
import {
  getStoredGenerators,
  saveStoredGenerators,
  getStoredRentalUnits,
  saveStoredRentalUnits,
  getStoredPurchaseRequests,
  saveStoredPurchaseRequests,
  getStoredRentalRequests,
  saveStoredRentalRequests,
  getStoredSupportTickets,
  saveStoredSupportTickets,
  getNextTicketNumber,
  resetAllToDefaults,
  purgeObsoleteCache,
} from './utils/storage';

import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { SalesView } from './components/SalesView';
import { RentalView } from './components/RentalView';
import { SupportView } from './components/SupportView';
import { AdminView } from './components/AdminView';
import { Footer } from './components/Footer';

import { Lock, X, AlertCircle, KeyRound, ArrowRight, Zap, Check } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Données persistantes
  const [generators, setGenerators] = useState<Generator[]>([]);
  const [rentalUnits, setRentalUnits] = useState<RentalUnit[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);

  // Authentification Admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Modales d'interaction transversales
  const [selectedGeneratorForDetails, setSelectedGeneratorForDetails] = useState<Generator | null>(null);
  const [selectedGeneratorForPurchase, setSelectedGeneratorForPurchase] = useState<Generator | null>(null);
  const [isQuickQuoteModalOpen, setIsQuickQuoteModalOpen] = useState(false);

  // Message Toast de notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Chargement initial depuis localStorage
  useEffect(() => {
    purgeObsoleteCache();
    setGenerators(getStoredGenerators());
    setRentalUnits(getStoredRentalUnits());
    setPurchaseRequests(getStoredPurchaseRequests());
    setRentalRequests(getStoredRentalRequests());
    setSupportTickets(getStoredSupportTickets());
  }, []);

  // Défilement automatique en haut lors d'un changement d'onglet
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // ---------------- AUTHENTIFICATION ADMIN (PIN: 1234) ----------------
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1234') {
      setIsAdminLoggedIn(true);
      setIsPinModalOpen(false);
      setPinInput('');
      setPinError(null);
      setActiveTab('admin');
      showToast('Session Administrateur activée avec succès.');
    } else {
      setPinError('PIN incorrect. Pour la démonstration, utilisez le code : 1234');
      setPinInput('');
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
    showToast('Session Administrateur fermée.');
  };

  // ---------------- ACHAT : SOUMISSION D'UNE DEMANDE ----------------
  const handleSubmitPurchaseRequest = (
    req: Omit<PurchaseRequest, 'id' | 'status' | 'createdAt'>
  ): { success: boolean; id?: string; error?: string } => {
    const timestampId = `VP-${Math.floor(Date.now() / 1000)}`;
    const newRequest: PurchaseRequest = {
      ...req,
      id: timestampId,
      status: 'En attente',
      createdAt: new Date().toISOString(),
    };

    const updated = [newRequest, ...purchaseRequests];
    const saveRes = saveStoredPurchaseRequests(updated);

    if (saveRes.success) {
      setPurchaseRequests(updated);
      showToast(`Demande ${timestampId} enregistrée. Notre équipe vous contacte sous 2h.`);
      return { success: true, id: timestampId };
    } else {
      return { success: false, error: saveRes.error };
    }
  };

  // ---------------- LOCATION : SOUMISSION D'UNE DEMANDE ----------------
  const handleSubmitRentalRequest = (
    req: Omit<RentalRequest, 'id' | 'status' | 'createdAt'>
  ): { success: boolean; id?: string; error?: string } => {
    const timestampId = `VR-${Math.floor(Date.now() / 1000)}`;
    const newRequest: RentalRequest = {
      ...req,
      id: timestampId,
      status: 'En attente',
      createdAt: new Date().toISOString(),
    };

    const updated = [newRequest, ...rentalRequests];
    const saveRes = saveStoredRentalRequests(updated);

    if (saveRes.success) {
      setRentalRequests(updated);
      showToast(`Réservation ${timestampId} reçue. Préparation logistique engagée.`);
      return { success: true, id: timestampId };
    } else {
      return { success: false, error: saveRes.error };
    }
  };

  // ---------------- SUPPORT : OUVERTURE D'UN TICKET ----------------
  const handleSubmitSupportTicket = (
    ticket: Omit<SupportTicket, 'id' | 'status' | 'internalNotes' | 'createdAt'>
  ): { success: boolean; id?: string; error?: string; isQuotaExceeded?: boolean } => {
    const nextNumber = getNextTicketNumber();
    const formattedId = `VOLT-2026-${nextNumber.toString().padStart(5, '0')}`;

    const newTicket: SupportTicket = {
      ...ticket,
      id: formattedId,
      status: 'Ouvert',
      internalNotes: [],
      createdAt: new Date().toISOString(),
    };

    const updated = [newTicket, ...supportTickets];
    const saveRes = saveStoredSupportTickets(updated);

    if (saveRes.success) {
      setSupportTickets(updated);
      showToast(`Ticket d'astreinte ${formattedId} transmis aux équipes d'urgence.`);
      return { success: true, id: formattedId };
    } else {
      return { success: false, error: saveRes.error, isQuotaExceeded: saveRes.isQuotaExceeded };
    }
  };

  // ---------------- OPÉRATIONS ADMIN (CRUD & STATUTS) ----------------
  const handleSaveGenerator = (gen: Generator) => {
    const exists = generators.some((g) => g.id === gen.id);
    let updated: Generator[];
    if (exists) {
      updated = generators.map((g) => (g.id === gen.id ? gen : g));
    } else {
      updated = [gen, ...generators];
    }
    const res = saveStoredGenerators(updated);
    if (res.success) {
      setGenerators(updated);
      showToast(`Générateur ${gen.model} sauvegardé.`);
    } else {
      showToast(res.error || 'Erreur lors de la sauvegarde.', 'error');
    }
  };

  const handleDeleteGenerator = (id: string) => {
    const target = generators.find((g) => g.id === id);
    const updated = generators.filter((g) => g.id !== id);
    const res = saveStoredGenerators(updated);
    if (res.success) {
      setGenerators(updated);
      showToast(`Générateur ${target?.model || id} supprimé.`);
    }
  };

  const handleSaveRentalUnit = (unit: RentalUnit) => {
    const exists = rentalUnits.some((u) => u.id === unit.id);
    let updated: RentalUnit[];
    if (exists) {
      updated = rentalUnits.map((u) => (u.id === unit.id ? unit : u));
    } else {
      updated = [unit, ...rentalUnits];
    }
    const res = saveStoredRentalUnits(updated);
    if (res.success) {
      setRentalUnits(updated);
      showToast(`Unité de location ${unit.name} enregistrée.`);
    } else {
      showToast(res.error || 'Erreur lors de la sauvegarde.', 'error');
    }
  };

  const handleDeleteRentalUnit = (id: string) => {
    const target = rentalUnits.find((u) => u.id === id);
    const updated = rentalUnits.filter((u) => u.id !== id);
    const res = saveStoredRentalUnits(updated);
    if (res.success) {
      setRentalUnits(updated);
      showToast(`Unité ${target?.name || id} retirée du parc.`);
    }
  };

  const handleUpdatePurchaseStatus = (id: string, status: PurchaseRequestStatus, notes?: string) => {
    const updated = purchaseRequests.map((r) => {
      if (r.id === id) {
        return { ...r, status, notes: notes !== undefined ? notes : r.notes };
      }
      return r;
    });
    saveStoredPurchaseRequests(updated);
    setPurchaseRequests(updated);
    showToast(`Demande ${id} mise à jour (${status}).`);
  };

  const handleUpdateRentalStatus = (id: string, status: RentalRequestStatus, notes?: string) => {
    const updated = rentalRequests.map((r) => {
      if (r.id === id) {
        return { ...r, status, notes: notes !== undefined ? notes : r.notes };
      }
      return r;
    });
    saveStoredRentalRequests(updated);
    setRentalRequests(updated);
    showToast(`Contrat de location ${id} mis à jour (${status}).`);
  };

  const handleUpdateTicketStatus = (id: string, status: TicketStatus) => {
    const updated = supportTickets.map((t) => {
      if (t.id === id) {
        return { ...t, status, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    saveStoredSupportTickets(updated);
    setSupportTickets(updated);
    showToast(`Ticket ${id} passé en statut : ${status}.`);
  };

  const handleAssignTechnician = (ticketId: string, techName: string) => {
    const updated = supportTickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          assignedTechnician: techName,
          status: t.status === 'Ouvert' ? ('Assigné' as TicketStatus) : t.status,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    saveStoredSupportTickets(updated);
    setSupportTickets(updated);
    showToast(`Technicien assigné au ticket ${ticketId}.`);
  };

  const handleAddTicketNote = (ticketId: string, noteText: string, author: string) => {
    const noteObj = {
      id: `note-${Date.now()}`,
      author,
      text: noteText,
      createdAt: new Date().toISOString(),
    };
    const updated = supportTickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          internalNotes: [...(t.internalNotes || []), noteObj],
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    saveStoredSupportTickets(updated);
    setSupportTickets(updated);
    showToast('Note technique consignée dans le journal d’intervention.');
  };

  const handleResetDefaults = () => {
    resetAllToDefaults();
    setGenerators(getStoredGenerators());
    setRentalUnits(getStoredRentalUnits());
    setPurchaseRequests(getStoredPurchaseRequests());
    setRentalRequests(getStoredRentalRequests());
    setSupportTickets(getStoredSupportTickets());
    showToast('Données réinitialisées aux valeurs usine.');
  };

  const pendingPurchasesCount = purchaseRequests.filter((r) => r.status === 'En attente').length;
  const openTicketsCount = supportTickets.filter((t) => t.status !== 'Fermé' && t.status !== 'Résolu').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#0D0D0D]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 ${
              toastMessage.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-neutral-900 text-white border-neutral-700'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Navbar Principale */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openPinModal={() => setIsPinModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={handleLogoutAdmin}
        openQuickQuoteModal={() => setIsQuickQuoteModalOpen(true)}
        pendingPurchasesCount={pendingPurchasesCount}
        openTicketsCount={openTicketsCount}
      />

      {/* Corps dynamique des vues */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            generators={generators}
            setActiveTab={setActiveTab}
            onSelectGeneratorDetails={(gen) => {
              setSelectedGeneratorForDetails(gen);
              setActiveTab('sales');
            }}
            onOpenPurchaseModal={(gen) => {
              setSelectedGeneratorForPurchase(gen);
              setActiveTab('sales');
            }}
          />
        )}

        {activeTab === 'sales' && (
          <SalesView
            generators={generators}
            selectedGeneratorForDetails={selectedGeneratorForDetails}
            onSelectGeneratorDetails={setSelectedGeneratorForDetails}
            selectedGeneratorForPurchase={selectedGeneratorForPurchase}
            onOpenPurchaseModal={setSelectedGeneratorForPurchase}
            onSubmitPurchaseRequest={handleSubmitPurchaseRequest}
          />
        )}

        {activeTab === 'rental' && (
          <RentalView
            rentalUnits={rentalUnits}
            onSubmitRentalRequest={handleSubmitRentalRequest}
          />
        )}

        {activeTab === 'support' && (
          <SupportView
            tickets={supportTickets}
            onSubmitTicket={handleSubmitSupportTicket}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            generators={generators}
            rentalUnits={rentalUnits}
            purchaseRequests={purchaseRequests}
            rentalRequests={rentalRequests}
            supportTickets={supportTickets}
            onSaveGenerator={handleSaveGenerator}
            onDeleteGenerator={handleDeleteGenerator}
            onSaveRentalUnit={handleSaveRentalUnit}
            onDeleteRentalUnit={handleDeleteRentalUnit}
            onUpdatePurchaseStatus={handleUpdatePurchaseStatus}
            onUpdateRentalStatus={handleUpdateRentalStatus}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onAssignTechnician={handleAssignTechnician}
            onAddTicketNote={handleAddTicketNote}
            onResetDefaults={handleResetDefaults}
            onLogoutAdmin={handleLogoutAdmin}
          />
        )}
      </main>

      {/* Pied de page */}
      <Footer
        setActiveTab={setActiveTab}
        openPinModal={() => setIsPinModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* ================= BOUTON FIXE ADMIN EN BAS À DROITE ================= */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => {
            if (isAdminLoggedIn) {
              setActiveTab('admin');
            } else {
              setIsPinModalOpen(true);
            }
          }}
          className={`p-3.5 rounded-full shadow-xl transition-all duration-200 flex items-center justify-center group ${
            isAdminLoggedIn
              ? 'bg-[#F59E0B] text-neutral-950 hover:bg-[#D97706]'
              : 'bg-neutral-900 text-white hover:bg-neutral-800'
          }`}
          title={isAdminLoggedIn ? 'Accéder à la console Admin' : 'Connexion Admin (Code PIN : 1234)'}
          aria-label="Accès Administration"
        >
          <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="sr-only">Mode Administrateur</span>
        </button>
      </div>

      {/* ================= MODALE CODE PIN ADMIN ================= */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-amber-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-neutral-900">Console Collaborateur</h3>
                  <span className="text-[10px] text-neutral-500">Accès sécurisé VOLT</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPinModalOpen(false);
                  setPinInput('');
                  setPinError(null);
                }}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note d'information de démo explicite */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block">Mode Démonstration Prototype :</span>
              <p className="text-[11px] text-amber-800">
                Saisissez le code PIN par défaut : <strong className="font-mono text-neutral-950 font-black">1234</strong>
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              {pinError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Code PIN d’accès (4 chiffres)
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="• • • •"
                  className="w-full text-center tracking-widest text-lg font-mono px-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPinModalOpen(false);
                    setPinInput('');
                    setPinError(null);
                  }}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 text-xs font-bold bg-[#F59E0B] hover:bg-[#D97706] text-neutral-900 rounded-lg transition-colors shadow-xs"
                >
                  Déverrouiller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODALE D'ORIENTATION RAPIDE "OBTENIR UN GÉNÉRATEUR" ================= */}
      {isQuickQuoteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-amber-400 flex items-center justify-center">
                  <Zap className="w-4 h-4 fill-amber-400 text-neutral-900" />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-900">Votre besoin énergétique</h3>
                  <p className="text-[11px] text-neutral-500">Orientation immédiate sur Grand Tunis</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickQuoteModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Quel type de solution recherchez-vous pour sécuriser votre installation contre les coupures STEG ?
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsQuickQuoteModalOpen(false);
                  setActiveTab('sales');
                }}
                className="w-full p-4 rounded-xl border border-neutral-200 hover:border-amber-500 hover:bg-amber-50/30 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-black text-neutral-900 group-hover:text-amber-700">
                    Acheter un générateur domestique (6.5 à 15 kVA)
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Pour maison ou villa : insonorisé, inverseur automatique ATS, protection climatiseurs et frigos.
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-600 shrink-0 ml-2" />
              </button>

              <button
                onClick={() => {
                  setIsQuickQuoteModalOpen(false);
                  setActiveTab('rental');
                }}
                className="w-full p-4 rounded-xl border border-neutral-200 hover:border-amber-500 hover:bg-amber-50/30 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-black text-neutral-900 group-hover:text-amber-700">
                    Louer un groupe domestique sur roulettes (Dès 75 DT/j)
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Dépannage temporaire pour maison, villa ou événement familial avec livraison à domicile.
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-600 shrink-0 ml-2" />
              </button>

              <button
                onClick={() => {
                  setIsQuickQuoteModalOpen(false);
                  setActiveTab('support');
                }}
                className="w-full p-4 rounded-xl border border-rose-200 bg-rose-50/30 hover:bg-rose-50 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-black text-rose-900">
                    Panne urgente / Dépannage STEG immédiat
                  </div>
                  <div className="text-[11px] text-rose-700 mt-0.5">
                    Intervention garantie sous 2h ou 8h avec camionnette atelier.
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
