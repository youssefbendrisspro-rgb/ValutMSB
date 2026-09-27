import React, { useState } from 'react';
import {
  Generator,
  RentalUnit,
  PurchaseRequest,
  RentalRequest,
  SupportTicket,
  PurchaseRequestStatus,
  RentalRequestStatus,
  TicketStatus,
} from '../types';
import { TECHNICIANS_LIST } from '../data/defaults';
import { GeneratorIllustration } from './TechnicalIllustrations';
import {
  ShieldAlert,
  Zap,
  Truck,
  FileText,
  LifeBuoy,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Search,
  Check,
  ChevronDown,
  UserCheck,
} from 'lucide-react';

interface AdminViewProps {
  generators: Generator[];
  rentalUnits: RentalUnit[];
  purchaseRequests: PurchaseRequest[];
  rentalRequests: RentalRequest[];
  supportTickets: SupportTicket[];
  onSaveGenerator: (gen: Generator) => void;
  onDeleteGenerator: (id: string) => void;
  onSaveRentalUnit: (unit: RentalUnit) => void;
  onDeleteRentalUnit: (id: string) => void;
  onUpdatePurchaseStatus: (id: string, status: PurchaseRequestStatus, notes?: string) => void;
  onUpdateRentalStatus: (id: string, status: RentalRequestStatus, notes?: string) => void;
  onUpdateTicketStatus: (id: string, status: TicketStatus) => void;
  onAssignTechnician: (ticketId: string, techName: string) => void;
  onAddTicketNote: (ticketId: string, noteText: string, author: string) => void;
  onResetDefaults: () => void;
  onLogoutAdmin: () => void;
}

type AdminSection = 'dashboard' | 'generators' | 'rental_units' | 'purchases' | 'rentals' | 'tickets';

export const AdminView: React.FC<AdminViewProps> = ({
  generators,
  rentalUnits,
  purchaseRequests,
  rentalRequests,
  supportTickets,
  onSaveGenerator,
  onDeleteGenerator,
  onSaveRentalUnit,
  onDeleteRentalUnit,
  onUpdatePurchaseStatus,
  onUpdateRentalStatus,
  onUpdateTicketStatus,
  onAssignTechnician,
  onAddTicketNote,
  onResetDefaults,
  onLogoutAdmin,
}) => {
  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');

  // Modale CRUD Générateur
  const [editingGenerator, setEditingGenerator] = useState<Generator | null>(null);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);

  // Modale CRUD Unité de location
  const [editingRentalUnit, setEditingRentalUnit] = useState<RentalUnit | null>(null);
  const [isRentalUnitModalOpen, setIsRentalUnitModalOpen] = useState(false);

  // Modale Confirmation Suppression
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'generator' | 'rental';
    id: string;
    name: string;
  } | null>(null);

  // Modale Détail Ticket Support
  const [selectedTicketDetail, setSelectedTicketDetail] = useState<SupportTicket | null>(null);
  const [newTicketNote, setNewTicketNote] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Superviseur VOLT');

  // Filtres
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('all');
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState<string>('all');

  // Statistiques calculées
  const pendingPurchases = purchaseRequests.filter((r) => r.status === 'En attente');
  const openTickets = supportTickets.filter((t) => t.status !== 'Fermé' && t.status !== 'Résolu');
  const activeRentals = rentalRequests.filter((r) => r.status === 'Actif' || r.status === 'Confirmé');

  // ---------------- GESTION GÉNÉRATEURS ----------------
  const handleOpenAddGenerator = () => {
    setEditingGenerator({
      id: `gen-${Date.now()}`,
      model: 'VOLT Home ',
      kva: 7.5,
      kw: 6.0,
      engine: 'Diesel 4-temps insonorisé',
      cylinderCount: 1,
      speed: '3000 tr/min',
      voltage: '230V Monophasé 50Hz',
      tankCapacity: 18,
      consumption: '1.4 L/h @ 75%',
      noiseLevel: '65 dB(A) @ 7m',
      dimensions: '960 × 560 × 750 mm',
      weight: '165 kg',
      warranty: '2 ans / 1 500 h',
      fuelType: 'Diesel',
      availability: 'En stock',
      priceTND: 5200,
      shortDesc: 'Modèle domestique insonorisé sur roulettes pour maison ou villa.',
      fullDesc: 'Caisson silencieux pour usage résidentiel, démarrage électrique et connecteur inverseur ATS pour tableau de maison.',
      atsIncluded: true,
      voltageType: 'Monophasé',
      imageUrl: '/src/assets/images/gen_dom_6k_1790540205486.jpg',
    });
    setIsGeneratorModalOpen(true);
  };

  const handleSaveGeneratorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGenerator) return;
    onSaveGenerator(editingGenerator);
    setIsGeneratorModalOpen(false);
    setEditingGenerator(null);
  };

  // ---------------- GESTION UNITÉS DE LOCATION ----------------
  const handleOpenAddRentalUnit = () => {
    setEditingRentalUnit({
      id: `rent-${Date.now()}`,
      name: 'VOLT Rent Home ',
      kva: 7.5,
      kw: 6.0,
      engine: 'Diesel Insonorisé 4-temps',
      dailyRate: 85,
      weeklyRate: 425,
      availability: 'Disponible',
      tankCapacity: 18,
      fuelConsumption: '1.4 L/h @ 75%',
      soundproof: 'Insonorisé 65 dB(A)',
      features: ['Câbles 20m inclus', 'Sur roulettes maniables', 'Assistance 24/7'],
      suitableFor: 'Maison, villa, petit commerce',
      isMobileTrailer: false,
      imageUrl: '/src/assets/images/gen_rent_dom_1790540264659.jpg',
    });
    setIsRentalUnitModalOpen(true);
  };

  const handleSaveRentalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRentalUnit) return;
    onSaveRentalUnit(editingRentalUnit);
    setIsRentalUnitModalOpen(false);
    setEditingRentalUnit(null);
  };

  // ---------------- CONFIRMATION SUPPRESSION SÉCURISÉE ----------------
  const handleConfirmDelete = () => {
    if (!deleteConfirmation) return;
    if (deleteConfirmation.type === 'generator') {
      onDeleteGenerator(deleteConfirmation.id);
    } else {
      onDeleteRentalUnit(deleteConfirmation.id);
    }
    setDeleteConfirmation(null);
  };

  // ---------------- AJOUT NOTE TECHNIQUE TICKET ----------------
  const handleAddNoteToTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketDetail || !newTicketNote.trim()) return;
    onAddTicketNote(selectedTicketDetail.id, newTicketNote.trim(), noteAuthor.trim() || 'Astreinte VOLT');
    setNewTicketNote('');
    // Mettre à jour l'objet local affiché
    const updated = supportTickets.find((t) => t.id === selectedTicketDetail.id);
    if (updated) setSelectedTicketDetail(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Barre de navigation supérieure Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-amber-400">
              CONSOLE ADMIN VOLT
            </span>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Connecté (PIN Vérifié)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1">
            Supervision Opérationnelle Grand Tunis
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Vider tout le cache et recharger les images et données propres ?'
                )
              ) {
                try {
                  localStorage.clear();
                } catch (e) {
                  console.error(e);
                }
                onResetDefaults();
              }
            }}
            className="px-3 py-2 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Purger le cache et recharger les images fraîches"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Vider le cache</span>
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(
                  'Réinitialiser toutes les données aux valeurs par défaut de démonstration ? Vos modifications actuelles seront écrasées.'
                )
              ) {
                onResetDefaults();
              }
            }}
            className="px-3 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Restaurer les générateurs, unités de location et tickets initiaux"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Données d’exemple</span>
          </button>

          <button
            onClick={onLogoutAdmin}
            className="px-3 py-2 text-xs font-bold text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Navigation par onglets de la console */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 border-b border-neutral-200 text-xs font-bold">
        <button
          onClick={() => setCurrentSection('dashboard')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
            currentSection === 'dashboard'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          Vue Globale (KPIs)
        </button>

        <button
          onClick={() => setCurrentSection('generators')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            currentSection === 'generators'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Générateurs Vente ({generators.length})</span>
        </button>

        <button
          onClick={() => setCurrentSection('rental_units')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            currentSection === 'rental_units'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-amber-400" />
          <span>Parc Location ({rentalUnits.length})</span>
        </button>

        <button
          onClick={() => setCurrentSection('purchases')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            currentSection === 'purchases'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Demandes Vente</span>
          {pendingPurchases.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-neutral-900 text-[10px]">
              {pendingPurchases.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentSection('rentals')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            currentSection === 'rentals'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Contrats Location ({rentalRequests.length})</span>
        </button>

        <button
          onClick={() => setCurrentSection('tickets')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            currentSection === 'tickets'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <LifeBuoy className="w-3.5 h-3.5 text-rose-400" />
          <span>Tickets Support</span>
          {openTickets.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px]">
              {openTickets.length}
            </span>
          )}
        </button>
      </div>

      {/* ================= SECTION : TABLEAU DE BORD (4 STATS CLIQUABLES) ================= */}
      {currentSection === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Stat 1 : Générateurs en vente */}
            <button
              onClick={() => setCurrentSection('generators')}
              className="bg-white p-5 rounded-xl border border-neutral-200 text-left hover:border-amber-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-neutral-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Catalogue Vente</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-neutral-900 transition-colors">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-neutral-900 font-mono">{generators.length}</div>
              <div className="text-xs text-neutral-500 mt-1">
                {generators.filter((g) => g.availability === 'En stock').length} modèles en stock immédiat
              </div>
            </button>

            {/* Stat 2 : Unités en location */}
            <button
              onClick={() => setCurrentSection('rental_units')}
              className="bg-white p-5 rounded-xl border border-neutral-200 text-left hover:border-amber-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-neutral-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Parc de Location</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-neutral-900 transition-colors">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-neutral-900 font-mono">{rentalUnits.length}</div>
              <div className="text-xs text-neutral-500 mt-1">
                {rentalUnits.filter((u) => u.availability === 'Disponible').length} unités disponibles immédiatement
              </div>
            </button>

            {/* Stat 3 : Demandes d'achat en attente */}
            <button
              onClick={() => setCurrentSection('purchases')}
              className="bg-white p-5 rounded-xl border border-neutral-200 text-left hover:border-amber-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-neutral-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Demandes d'Achat</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-neutral-900 transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-neutral-900 font-mono">
                {pendingPurchases.length}
                <span className="text-xs font-normal text-neutral-400 ml-1">/ {purchaseRequests.length}</span>
              </div>
              <div className="text-xs text-amber-700 font-semibold mt-1">
                {pendingPurchases.length} dossier(s) à contacter sous 2h
              </div>
            </button>

            {/* Stat 4 : Tickets de support ouverts */}
            <button
              onClick={() => setCurrentSection('tickets')}
              className="bg-white p-5 rounded-xl border border-neutral-200 text-left hover:border-rose-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-neutral-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Tickets Support</span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <LifeBuoy className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-rose-600 font-mono">
                {openTickets.length}
                <span className="text-xs font-normal text-neutral-400 ml-1">/ {supportTickets.length}</span>
              </div>
              <div className="text-xs text-rose-700 font-semibold mt-1">
                {supportTickets.filter((t) => t.urgency === 'urgence_critique' && t.status !== 'Fermé').length} urgence(s) critique(s) active(s)
              </div>
            </button>
          </div>

          {/* Alertes d'astreinte prioritaires */}
          <div className="bg-neutral-900 text-white rounded-2xl p-6 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">
                  Interventions Critiques STEG en Cours sur le Grand Tunis
                </h2>
              </div>
              <button
                onClick={() => setCurrentSection('tickets')}
                className="text-xs font-bold text-amber-400 hover:underline"
              >
                Gérer les tickets &rarr;
              </button>
            </div>

            <div className="divide-y divide-neutral-800 text-xs">
              {supportTickets
                .filter((t) => t.status !== 'Fermé')
                .slice(0, 3)
                .map((ticket) => (
                  <div key={ticket.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-400 font-bold">{ticket.id}</span>
                        <span className="text-neutral-400">·</span>
                        <span className="text-neutral-200 font-bold">{ticket.customerName}</span>
                        <span className="text-neutral-500">({ticket.governorate.split(' ')[0]})</span>
                      </div>
                      <p className="text-neutral-400 text-[11px] mt-0.5 line-clamp-1">{ticket.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ticket.urgency === 'urgence_critique'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300'
                        }`}
                      >
                        {ticket.slaText}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedTicketDetail(ticket);
                          setCurrentSection('tickets');
                        }}
                        className="px-2.5 py-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded"
                      >
                        Ouvrir
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION : CRUD GÉNÉRATEURS VENTE ================= */}
      {currentSection === 'generators' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-neutral-900">Générateurs en Vente</h2>
              <p className="text-xs text-neutral-500">
                Gérez les spécifications, prix et disponibilités affichés sur le catalogue public.
              </p>
            </div>
            <button
              onClick={handleOpenAddGenerator}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-neutral-900 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau générateur</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 uppercase font-mono text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3">Aperçu</th>
                    <th className="px-4 py-3">Modèle / Puissance</th>
                    <th className="px-4 py-3">Motorisation</th>
                    <th className="px-4 py-3">Prix (TND)</th>
                    <th className="px-4 py-3">Disponibilité</th>
                    <th className="px-4 py-3">Réservoir / Conso</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {generators.map((gen) => (
                    <tr key={gen.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="w-14 h-10 rounded overflow-hidden bg-neutral-900 border border-neutral-200">
                          {gen.imageUrl ? (
                            <img
                              src={gen.imageUrl}
                              alt={gen.model}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-amber-500 font-mono">
                              {gen.kva}kVA
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-neutral-900">{gen.model}</div>
                        <div className="text-[11px] text-amber-700 font-mono">
                          {gen.kva} kVA / {gen.kw} kW
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-700">
                        <div>{gen.engine}</div>
                        <div className="text-[11px] text-neutral-400">{gen.voltage}</div>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-neutral-900">
                        {gen.priceTND.toLocaleString('fr-FR')} TND
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            gen.availability === 'En stock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {gen.availability}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-600 text-[11px]">
                        {gen.tankCapacity}L ({gen.consumption})
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1">
                        <button
                          onClick={() => {
                            setEditingGenerator(gen);
                            setIsGeneratorModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-amber-700 hover:bg-neutral-100 rounded"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'generator',
                              id: gen.id,
                              name: gen.model,
                            })
                          }
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION : CRUD UNITÉS LOCATION ================= */}
      {currentSection === 'rental_units' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-neutral-900">Unités de Location</h2>
              <p className="text-xs text-neutral-500">
                Tarifs journaliers et hebdomadaires pris en compte automatiquement par le calculateur.
              </p>
            </div>
            <button
              onClick={handleOpenAddRentalUnit}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-neutral-900 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle unité</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 uppercase font-mono text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3">Aperçu</th>
                    <th className="px-4 py-3">Unité / Puissance</th>
                    <th className="px-4 py-3">Moteur</th>
                    <th className="px-4 py-3">Tarif Jour</th>
                    <th className="px-4 py-3">Tarif Semaine</th>
                    <th className="px-4 py-3">Disponibilité</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {rentalUnits.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="w-14 h-10 rounded overflow-hidden bg-neutral-900 border border-neutral-200">
                          {u.imageUrl ? (
                            <img
                              src={u.imageUrl}
                              alt={u.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-amber-500 font-mono">
                              {u.kva}kVA
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-neutral-900">{u.name}</div>
                        <div className="text-[11px] text-amber-700 font-mono">{u.kva} kVA</div>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-700">{u.engine}</td>
                      <td className="px-4 py-3.5 font-mono font-bold text-neutral-900">{u.dailyRate} TND / j</td>
                      <td className="px-4 py-3.5 font-mono font-bold text-amber-700">{u.weeklyRate} TND / sem</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.availability === 'Disponible'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {u.availability}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1">
                        <button
                          onClick={() => {
                            setEditingRentalUnit(u);
                            setIsRentalUnitModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-amber-700 hover:bg-neutral-100 rounded"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'rental',
                              id: u.id,
                              name: u.name,
                            })
                          }
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION : GESTION DES DEMANDES D'ACHAT ================= */}
      {currentSection === 'purchases' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-neutral-900">Demandes d'Achat &amp; Devis</h2>
              <p className="text-xs text-neutral-500">
                Suivez le cycle de prospection : En attente &rarr; Contacté &rarr; Confirmé &rarr; Terminé
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">Statut :</span>
              <select
                value={purchaseStatusFilter}
                onChange={(e) => setPurchaseStatusFilter(e.target.value)}
                className="bg-white border border-neutral-300 rounded px-2.5 py-1 text-xs"
              >
                <option value="all">Tous ({purchaseRequests.length})</option>
                <option value="En attente">En attente ({pendingPurchases.length})</option>
                <option value="Contacté">Contacté</option>
                <option value="Confirmé">Confirmé</option>
                <option value="Terminé">Terminé</option>
                <option value="Rejeté">Rejeté</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 uppercase font-mono text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3">Réf / Date</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Générateur</th>
                    <th className="px-4 py-3">ATS</th>
                    <th className="px-4 py-3">Statut Actuel</th>
                    <th className="px-4 py-3">Action Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {purchaseRequests
                    .filter((r) => purchaseStatusFilter === 'all' || r.status === purchaseStatusFilter)
                    .map((req) => (
                      <tr key={req.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-mono font-bold text-neutral-900">{req.id}</div>
                          <div className="text-[10px] text-neutral-400">
                            {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-neutral-900">{req.customerName}</div>
                          <div className="text-[11px] text-neutral-500">{req.phone} · {req.email}</div>
                          <div className="text-[10px] text-neutral-400">{req.governorate.split(' ')[0]}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-neutral-800">{req.generatorModel}</div>
                          <div className="font-mono text-amber-700 text-[11px]">
                            {req.estimatedAmountTND?.toLocaleString('fr-FR')} TND
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          {req.withAtsOption ? (
                            <span className="text-emerald-700 font-bold text-[11px]">Oui (ATS)</span>
                          ) : (
                            <span className="text-neutral-400 text-[11px]">Non</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              req.status === 'En attente'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : req.status === 'Contacté'
                                ? 'bg-blue-100 text-blue-800'
                                : req.status === 'Confirmé'
                                ? 'bg-emerald-100 text-emerald-800'
                                : req.status === 'Terminé'
                                ? 'bg-neutral-200 text-neutral-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={req.status}
                            onChange={(e) =>
                              onUpdatePurchaseStatus(req.id, e.target.value as PurchaseRequestStatus)
                            }
                            className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs font-semibold text-neutral-800"
                          >
                            <option value="En attente">En attente</option>
                            <option value="Contacté">Contacté</option>
                            <option value="Confirmé">Confirmé</option>
                            <option value="Terminé">Terminé</option>
                            <option value="Rejeté">Rejeté</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION : GESTION DES CONTRATS DE LOCATION ================= */}
      {currentSection === 'rentals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-neutral-900">Demandes &amp; Contrats de Location</h2>
              <p className="text-xs text-neutral-500">
                Réservations de générateurs mobiles sur le Grand Tunis.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 uppercase font-mono text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3">Réf</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Unité Louée</th>
                    <th className="px-4 py-3">Période &amp; Durée</th>
                    <th className="px-4 py-3">Total TTC</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3">Changer Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {rentalRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-neutral-900">{r.id}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-neutral-900">{r.customerName}</div>
                        <div className="text-[11px] text-neutral-500">{r.phone}</div>
                        <div className="text-[10px] text-neutral-400">{r.deliveryAddress}</div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-neutral-800">{r.unitName}</td>
                      <td className="px-4 py-3.5 font-mono text-[11px]">
                        <div>{r.startDate} &rarr; {r.endDate}</div>
                        <div className="text-neutral-500">{r.durationDays} jour(s)</div>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-amber-700">
                        {r.totalPriceTND.toLocaleString('fr-FR')} TND
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.status === 'En attente'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : r.status === 'Confirmé'
                              ? 'bg-blue-100 text-blue-800'
                              : r.status === 'Actif'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'Terminé'
                              ? 'bg-neutral-200 text-neutral-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={r.status}
                          onChange={(e) =>
                            onUpdateRentalStatus(r.id, e.target.value as RentalRequestStatus)
                          }
                          className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs font-semibold text-neutral-800"
                        >
                          <option value="En attente">En attente</option>
                          <option value="Confirmé">Confirmé</option>
                          <option value="Actif">Actif (Sur site)</option>
                          <option value="Terminé">Terminé (Restitué)</option>
                          <option value="Rejeté">Rejeté</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION : GESTION DES TICKETS SUPPORT ================= */}
      {currentSection === 'tickets' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-neutral-900">Tickets Support &amp; Urgences STEG</h2>
              <p className="text-xs text-neutral-500">
                Assignez des techniciens, ajoutez des comptes-rendus d’intervention et clôturez les dossiers.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">Filtrer par état :</span>
              <select
                value={ticketStatusFilter}
                onChange={(e) => setTicketStatusFilter(e.target.value)}
                className="bg-white border border-neutral-300 rounded px-2.5 py-1 text-xs"
              >
                <option value="all">Tous les tickets ({supportTickets.length})</option>
                <option value="Ouvert">Ouverts</option>
                <option value="Assigné">Assignés</option>
                <option value="En cours">En cours d'intervention</option>
                <option value="Résolu">Résolus</option>
                <option value="Fermé">Fermés</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 uppercase font-mono text-[10px] border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3">Réf / Heure</th>
                    <th className="px-4 py-3">Client &amp; Lieu</th>
                    <th className="px-4 py-3">Modèle / Panne</th>
                    <th className="px-4 py-3">Urgence &amp; SLA</th>
                    <th className="px-4 py-3">Technicien</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 text-right">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {supportTickets
                    .filter((t) => ticketStatusFilter === 'all' || t.status === ticketStatusFilter)
                    .map((t) => (
                      <tr key={t.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-mono font-bold text-neutral-900">{t.id}</div>
                          <div className="text-[10px] text-neutral-400">
                            {new Date(t.createdAt).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-neutral-900">{t.customerName}</div>
                          <div className="text-[11px] text-neutral-500">{t.phone}</div>
                          <div className="text-[10px] text-neutral-400">{t.governorate.split(' ')[0]}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-neutral-800">{t.generatorModel}</div>
                          <div className="text-[10px] text-amber-700 font-medium">{t.category}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.urgency === 'urgence_critique'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : t.urgency === 'urgent'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {t.slaText}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {t.assignedTechnician ? (
                            <span className="font-semibold text-neutral-800 text-[11px]">
                              {t.assignedTechnician.split('—')[0]}
                            </span>
                          ) : (
                            <span className="text-rose-600 font-bold text-[11px]">Non assigné</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={t.status}
                            onChange={(e) => onUpdateTicketStatus(t.id, e.target.value as TicketStatus)}
                            className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs font-semibold text-neutral-800"
                          >
                            <option value="Ouvert">Ouvert</option>
                            <option value="Assigné">Assigné</option>
                            <option value="En cours">En cours</option>
                            <option value="Résolu">Résolu</option>
                            <option value="Fermé">Fermé</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => setSelectedTicketDetail(t)}
                            className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded transition-colors"
                          >
                            Inspecter
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALE INSPECTION DÉTAILLÉE D'UN TICKET ================= */}
      {selectedTicketDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-700">{selectedTicketDetail.id}</span>
                <span className="text-neutral-400">·</span>
                <span className="text-sm font-black text-neutral-900">{selectedTicketDetail.customerName}</span>
              </div>
              <button
                onClick={() => setSelectedTicketDetail(null)}
                className="p-1 rounded text-neutral-500 hover:bg-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Infos générales */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <div>
                  <span className="text-neutral-400 text-[10px] block">Téléphone</span>
                  <a href={`tel:${selectedTicketDetail.phone}`} className="font-bold text-neutral-900 hover:underline">
                    {selectedTicketDetail.phone}
                  </a>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">Gouvernorat</span>
                  <span className="font-semibold text-neutral-800">{selectedTicketDetail.governorate.split(' ')[0]}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">Modèle de groupe</span>
                  <span className="font-semibold text-neutral-800">{selectedTicketDetail.generatorModel}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">SLA d’intervention</span>
                  <span className="font-bold text-rose-700">{selectedTicketDetail.slaText}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">Statut Actuel</span>
                  <span className="font-bold text-amber-800">{selectedTicketDetail.status}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] block">Ouvert le</span>
                  <span className="font-mono text-neutral-700">
                    {new Date(selectedTicketDetail.createdAt).toLocaleDateString('fr-FR')} à{' '}
                    {new Date(selectedTicketDetail.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Description panne */}
              <div>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                  Description du client :
                </span>
                <p className="text-xs sm:text-sm text-neutral-800 bg-amber-50/50 p-3.5 rounded-lg border border-amber-200 leading-relaxed">
                  {selectedTicketDetail.description}
                </p>
              </div>

              {/* Photo jointe */}
              {selectedTicketDetail.photoBase64 && (
                <div>
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    Photo transmise par le client :
                  </span>
                  <div className="p-2 bg-neutral-900 rounded-lg inline-block">
                    <img
                      src={selectedTicketDetail.photoBase64}
                      alt="Preuve incident"
                      className="max-h-60 rounded object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Assignation du technicien */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <span>Assignation du technicien d’astreinte :</span>
                </span>
                <select
                  value={selectedTicketDetail.assignedTechnician || ''}
                  onChange={(e) => {
                    onAssignTechnician(selectedTicketDetail.id, e.target.value);
                    setSelectedTicketDetail({
                      ...selectedTicketDetail,
                      assignedTechnician: e.target.value,
                      status: selectedTicketDetail.status === 'Ouvert' ? 'Assigné' : selectedTicketDetail.status,
                    });
                  }}
                  className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="">-- Aucun technicien assigné --</option>
                  {TECHNICIANS_LIST.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>

              {/* Journal des notes internes */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                  Journal d’intervention &amp; Notes d’astreinte ({selectedTicketDetail.internalNotes?.length || 0})
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedTicketDetail.internalNotes && selectedTicketDetail.internalNotes.length > 0 ? (
                    selectedTicketDetail.internalNotes.map((note) => (
                      <div key={note.id} className="p-3 bg-neutral-100 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-neutral-500">
                          <span className="font-bold text-neutral-800">{note.author}</span>
                          <span className="font-mono">
                            {new Date(note.createdAt).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-neutral-700">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-neutral-400 italic">Aucune note enregistrée sur ce ticket.</div>
                  )}
                </div>

                {/* Formulaire ajout de note */}
                <form onSubmit={handleAddNoteToTicket} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    required
                    value={newTicketNote}
                    onChange={(e) => setNewTicketNote(e.target.value)}
                    placeholder="Ajouter une note technique (ex: pièces requises, arrivée sur site...)"
                    className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors"
                  >
                    Ajouter note
                  </button>
                </form>
              </div>
            </div>

            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500">Statut :</span>
                <select
                  value={selectedTicketDetail.status}
                  onChange={(e) => {
                    const nextSt = e.target.value as TicketStatus;
                    onUpdateTicketStatus(selectedTicketDetail.id, nextSt);
                    setSelectedTicketDetail({ ...selectedTicketDetail, status: nextSt });
                  }}
                  className="bg-white border border-neutral-300 rounded px-2 py-1 font-bold text-neutral-800"
                >
                  <option value="Ouvert">Ouvert</option>
                  <option value="Assigné">Assigné</option>
                  <option value="En cours">En cours</option>
                  <option value="Résolu">Résolu</option>
                  <option value="Fermé">Fermé</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedTicketDetail(null)}
                className="py-2 px-4 text-xs font-bold rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALE CRUD GÉNÉRATEUR (AJOUT / ÉDITION) ================= */}
      {isGeneratorModalOpen && editingGenerator && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <h3 className="text-base font-black text-neutral-900">
                {editingGenerator.id.startsWith('gen-') && !generators.some((g) => g.id === editingGenerator.id)
                  ? 'Nouveau Générateur'
                  : `Modifier ${editingGenerator.model}`}
              </h3>
              <button
                onClick={() => setIsGeneratorModalOpen(false)}
                className="p-1 rounded text-neutral-500 hover:bg-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGeneratorSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Nom du modèle</label>
                  <input
                    type="text"
                    required
                    value={editingGenerator.model}
                    onChange={(e) => setEditingGenerator({ ...editingGenerator, model: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Puissance kVA</label>
                  <input
                    type="number"
                    required
                    value={editingGenerator.kva}
                    onChange={(e) => {
                      const kvaVal = Number(e.target.value);
                      setEditingGenerator({
                        ...editingGenerator,
                        kva: kvaVal,
                        kw: Math.round(kvaVal * 0.8 * 10) / 10,
                      });
                    }}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Prix (TND)</label>
                  <input
                    type="number"
                    required
                    value={editingGenerator.priceTND}
                    onChange={(e) => setEditingGenerator({ ...editingGenerator, priceTND: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Disponibilité</label>
                  <select
                    value={editingGenerator.availability}
                    onChange={(e) => setEditingGenerator({ ...editingGenerator, availability: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  >
                    <option value="En stock">En stock</option>
                    <option value="Sur commande (7j)">Sur commande (7j)</option>
                    <option value="Rupture temporaire">Rupture temporaire</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Motorisation</label>
                  <input
                    type="text"
                    required
                    value={editingGenerator.engine}
                    onChange={(e) => setEditingGenerator({ ...editingGenerator, engine: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Garantie</label>
                  <input
                    type="text"
                    value={editingGenerator.warranty}
                    onChange={(e) => setEditingGenerator({ ...editingGenerator, warranty: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Courte description</label>
                <textarea
                  rows={2}
                  value={editingGenerator.shortDesc}
                  onChange={(e) => setEditingGenerator({ ...editingGenerator, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Chemin / URL de la photo réelle du générateur
                </label>
                <input
                  type="text"
                  value={editingGenerator.imageUrl || ''}
                  onChange={(e) => setEditingGenerator({ ...editingGenerator, imageUrl: e.target.value })}
                  placeholder="/src/assets/images/gen_dom_6k_1790540205486.jpg"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                />
                {editingGenerator.imageUrl && (
                  <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-neutral-300 bg-neutral-900">
                    <img
                      src={editingGenerator.imageUrl}
                      alt="Aperçu"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGeneratorModalOpen(false)}
                  className="py-2 px-4 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 text-xs font-bold rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-neutral-900 transition-colors shadow-xs"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODALE CRUD UNITÉ LOCATION ================= */}
      {isRentalUnitModalOpen && editingRentalUnit && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <h3 className="text-base font-black text-neutral-900">
                {editingRentalUnit.name || 'Unité de location'}
              </h3>
              <button
                onClick={() => setIsRentalUnitModalOpen(false)}
                className="p-1 rounded text-neutral-500 hover:bg-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRentalSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Nom de l’unité</label>
                  <input
                    type="text"
                    required
                    value={editingRentalUnit.name}
                    onChange={(e) => setEditingRentalUnit({ ...editingRentalUnit, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Puissance kVA</label>
                  <input
                    type="number"
                    required
                    value={editingRentalUnit.kva}
                    onChange={(e) => setEditingRentalUnit({ ...editingRentalUnit, kva: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Tarif Jour (TND)</label>
                  <input
                    type="number"
                    required
                    value={editingRentalUnit.dailyRate}
                    onChange={(e) =>
                      setEditingRentalUnit({
                        ...editingRentalUnit,
                        dailyRate: Number(e.target.value),
                        weeklyRate: Number(e.target.value) * 5,
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Tarif Semaine (TND)</label>
                  <input
                    type="number"
                    required
                    value={editingRentalUnit.weeklyRate}
                    onChange={(e) =>
                      setEditingRentalUnit({ ...editingRentalUnit, weeklyRate: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Disponibilité</label>
                  <select
                    value={editingRentalUnit.availability}
                    onChange={(e) => setEditingRentalUnit({ ...editingRentalUnit, availability: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En cours de location">En cours de location</option>
                    <option value="En révision">En révision</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Type de châssis</label>
                  <label className="flex items-center gap-2 mt-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingRentalUnit.isMobileTrailer}
                      onChange={(e) =>
                        setEditingRentalUnit({ ...editingRentalUnit, isMobileTrailer: e.target.checked })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Remorque routière tractable</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Chemin / URL de la photo réelle de l’unité de location
                </label>
                <input
                  type="text"
                  value={editingRentalUnit.imageUrl || ''}
                  onChange={(e) => setEditingRentalUnit({ ...editingRentalUnit, imageUrl: e.target.value })}
                  placeholder="/src/assets/images/gen_trailer_1790539982331.jpg"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                />
                {editingRentalUnit.imageUrl && (
                  <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-neutral-300 bg-neutral-900">
                    <img
                      src={editingRentalUnit.imageUrl}
                      alt="Aperçu unité"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRentalUnitModalOpen(false)}
                  className="py-2 px-4 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 text-xs font-bold rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-neutral-900 transition-colors shadow-xs"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODALE CONFIRMATION DE SUPPRESSION ================= */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-black text-neutral-900">Confirmation de suppression</h3>
              <p className="text-xs text-neutral-600 mt-2">
                Supprimer <strong>{deleteConfirmation.name}</strong> ? Cette action est irréversible.
              </p>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
