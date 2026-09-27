import React, { useState } from 'react';
import { Generator, PurchaseRequest } from '../types';
import { GeneratorIllustration, GeneratorVisual } from './TechnicalIllustrations';
import { GRAND_TUNIS_GOVERNORATES } from '../data/defaults';
import {
  CheckCircle,
  X,
  ShieldCheck,
  Zap,
  Info,
  SlidersHorizontal,
  FileCheck2,
  AlertCircle,
} from 'lucide-react';

interface SalesViewProps {
  generators: Generator[];
  selectedGeneratorForDetails: Generator | null;
  onSelectGeneratorDetails: (gen: Generator | null) => void;
  selectedGeneratorForPurchase: Generator | null;
  onOpenPurchaseModal: (gen: Generator | null) => void;
  onSubmitPurchaseRequest: (
    req: Omit<PurchaseRequest, 'id' | 'status' | 'createdAt'>
  ) => { success: boolean; id?: string; error?: string };
}

export const SalesView: React.FC<SalesViewProps> = ({
  generators,
  selectedGeneratorForDetails,
  onSelectGeneratorDetails,
  selectedGeneratorForPurchase,
  onOpenPurchaseModal,
  onSubmitPurchaseRequest,
}) => {
  // Filtres
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'kva_asc' | 'kva_desc' | 'price_asc' | 'price_desc'>('kva_asc');

  // Formulaire d'achat
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [governorate, setGovernorate] = useState(GRAND_TUNIS_GOVERNORATES[0]);
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [withAtsOption, setWithAtsOption] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  // Filtrage et tri
  const filteredGenerators = generators
    .filter((g) => {
      if (filterAvailability === 'all') return true;
      return g.availability === filterAvailability;
    })
    .sort((a, b) => {
      if (sortBy === 'kva_asc') return a.kva - b.kva;
      if (sortBy === 'kva_desc') return b.kva - a.kva;
      if (sortBy === 'price_asc') return a.priceTND - b.priceTND;
      if (sortBy === 'price_desc') return b.priceTND - a.priceTND;
      return 0;
    });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedGeneratorForPurchase) return;

    if (!customerName.trim()) {
      setFormError('Veuillez indiquer votre nom complet ou le nom de votre société.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Le numéro de téléphone est obligatoire pour coordonner la visite technique.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Veuillez renseigner une adresse email valide pour la réception du devis formel.');
      return;
    }

    const res = onSubmitPurchaseRequest({
      generatorId: selectedGeneratorForPurchase.id,
      generatorModel: selectedGeneratorForPurchase.model,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      governorate,
      address: address.trim() || 'À préciser lors de la confirmation',
      message: message.trim() || 'Demande de devis et disponibilité en stock.',
      estimatedAmountTND: selectedGeneratorForPurchase.priceTND,
      withAtsOption,
    });

    if (res.success && res.id) {
      setCreatedRequestId(res.id);
    } else {
      setFormError(res.error || 'Erreur lors de l’enregistrement de votre demande.');
    }
  };

  const resetForm = () => {
    setCustomerName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setMessage('');
    setWithAtsOption(true);
    setFormError(null);
    setCreatedRequestId(null);
    onOpenPurchaseModal(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* En-tête de section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">
            Gamme Domestique &amp; Résidentielle
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0D0D0D] tracking-tight mt-1">
            Groupes Électrogènes Diesel pour Maisons &amp; Villas
          </h1>
          <p className="text-sm text-[#6B7280] mt-1 max-w-2xl">
            Modèles insonorisés (64-67 dB) monophasés 230V et triphasés sur roulettes ou châssis compact.
            Alimentation sans coupure pour climatiseurs, réfrigérateurs et appareils sensibles avec inverseur ATS inclus.
          </p>
        </div>

        {/* Contrôles de filtrage & tri */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            <span>Disponibilité :</span>
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs text-neutral-800 font-medium focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
            >
              <option value="all">Tous ({generators.length})</option>
              <option value="En stock">En stock uniquement</option>
              <option value="Sur commande (7j)">Sur commande (7j)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <span>Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs text-neutral-800 font-medium focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
            >
              <option value="kva_asc">Puissance (kVA croissant)</option>
              <option value="kva_desc">Puissance (kVA décroissant)</option>
              <option value="price_asc">Prix (TND croissant)</option>
              <option value="price_desc">Prix (TND décroissant)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grille du catalogue */}
      {filteredGenerators.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
          <p className="text-neutral-500 text-sm">Aucun groupe ne correspond à vos critères de recherche.</p>
          <button
            onClick={() => setFilterAvailability('all')}
            className="mt-3 text-xs font-semibold text-amber-700 underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredGenerators.map((gen) => (
            <div
              key={gen.id}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image avec photo réelle et caractéristiques */}
              <div className="h-60 bg-neutral-900 relative border-b border-neutral-200 overflow-hidden">
                <GeneratorVisual
                  imageUrl={gen.imageUrl}
                  kva={gen.kva}
                  modelName={gen.model}
                  detailLevel="card"
                  className="w-full h-full"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      gen.availability === 'En stock'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {gen.availability}
                  </span>
                  {gen.badge && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-neutral-800 text-amber-400 border border-neutral-700">
                      {gen.badge}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-neutral-900/90 text-white font-mono text-xs px-2.5 py-1 rounded border border-neutral-700">
                  {gen.kva} kVA · {gen.kw} kW
                </div>
              </div>

              {/* Contenu et caractéristiques */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-black text-[#0D0D0D]">{gen.model}</h2>
                      <p className="text-xs text-neutral-500 font-mono mt-0.5">
                        Moteur {gen.engine} · {gen.voltage}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[#D97706] font-mono leading-none">
                        {gen.priceTND.toLocaleString('fr-FR')} <span className="text-sm font-sans">TND</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">TVA &amp; Garantie incluses</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 mt-3 leading-relaxed">{gen.shortDesc}</p>

                  {/* Tableau de spécifications compact */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 px-3 bg-neutral-50 rounded-lg border border-neutral-100 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Conso 75%</span>
                      <span className="font-semibold text-neutral-800">{gen.consumption}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Réservoir</span>
                      <span className="font-semibold text-neutral-800">{gen.tankCapacity} L</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Niveau Sonore</span>
                      <span className="font-semibold text-neutral-800">{gen.noiseLevel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Garantie</span>
                      <span className="font-semibold text-emerald-700">{gen.warranty}</span>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => onSelectGeneratorDetails(gen)}
                    className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 transition-colors"
                  >
                    Fiche technique
                  </button>
                  <button
                    onClick={() => onOpenPurchaseModal(gen)}
                    className="flex-1 py-2.5 px-4 text-xs font-bold rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-neutral-900 transition-colors shadow-xs"
                  >
                    Demander un achat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODALE DÉTAILS DU GÉNÉRATEUR ================= */}
      {selectedGeneratorForDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Header Modale */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-600 uppercase">Fiche Technique</span>
                <span className="text-neutral-300">·</span>
                <span className="text-sm font-black text-neutral-900">{selectedGeneratorForDetails.model}</span>
              </div>
              <button
                onClick={() => onSelectGeneratorDetails(null)}
                className="p-1 rounded-md text-neutral-500 hover:bg-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corps Déroulant */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Grand visuel avec photo réelle haute précision */}
              <div className="h-72 bg-neutral-950 rounded-xl overflow-hidden relative border border-neutral-800">
                <GeneratorVisual
                  imageUrl={selectedGeneratorForDetails.imageUrl}
                  kva={selectedGeneratorForDetails.kva}
                  modelName={selectedGeneratorForDetails.model}
                  detailLevel="modal"
                  className="w-full h-full"
                />
                <div className="absolute bottom-3 left-3 bg-neutral-900/90 text-amber-400 font-mono text-xs px-2.5 py-1 rounded border border-neutral-700">
                  {selectedGeneratorForDetails.voltage} · 1500 tr/min · 50 Hz
                </div>
              </div>

              {/* Présentation & Prix */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
                <div>
                  <h3 className="text-2xl font-black text-neutral-900">{selectedGeneratorForDetails.model}</h3>
                  <p className="text-xs text-neutral-500 font-medium mt-1">
                    Conforme aux normes ISO 8528, ISO 3046 et directives basse tension CE
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-3xl font-black text-[#D97706] font-mono">
                    {selectedGeneratorForDetails.priceTND.toLocaleString('fr-FR')} TND
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center sm:justify-end gap-1 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    En stock à Charguia / Ben Arous
                  </span>
                </div>
              </div>

              {/* Description détaillée */}
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Descriptif Technique &amp; Conception
                </h4>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                  {selectedGeneratorForDetails.fullDesc}
                </p>
              </div>

              {/* Grille complète des spécifications */}
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  Caractéristiques Électriques &amp; Mécaniques
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded border border-neutral-100 bg-neutral-50/50">
                    <span className="text-neutral-400 block text-[11px]">Puissance Secours (ESP)</span>
                    <span className="font-bold text-neutral-900 text-sm">{selectedGeneratorForDetails.kva} kVA</span>
                  </div>
                  <div className="p-3 rounded border border-neutral-100 bg-neutral-50/50">
                    <span className="text-neutral-400 block text-[11px]">Puissance Continue (PRP)</span>
                    <span className="font-bold text-neutral-900 text-sm">{selectedGeneratorForDetails.kw} kW</span>
                  </div>
                  <div className="p-3 rounded border border-neutral-100 bg-neutral-50/50">
                    <span className="text-neutral-400 block text-[11px]">Motorisation Diesel</span>
                    <span className="font-bold text-neutral-900">{selectedGeneratorForDetails.engine}</span>
                  </div>
                  <div className="p-3 rounded border border-neutral-100 bg-neutral-50/50">
                    <span className="text-neutral-400 block text-[11px]">Nombre de cylindres</span>
                    <span className="font-bold text-neutral-900">{selectedGeneratorForDetails.cylinderCount} en ligne</span>
                  </div>
                  <div className="p-3 rounded border border-neutral-100 bg-neutral-50/50">
                    <span className="text-neutral-400 block text-[11px]">Consommation @ 75%</span>
                    <span className="font-bold text-neutral-900">{selectedGeneratorForDetails.consumption}</span>
                  </div>
                  <div className="p-3 rounded border border-neutral-100 bg-neutral-50/50">
                    <span className="text-neutral-400 block text-[11px]">Capacité Réservoir</span>
                    <span className="font-bold text-neutral-900">{selectedGeneratorForDetails.tankCapacity} Litres</span>
                  </div>
                  <div className="p-3 rounded border border-neutral-100 bg-neutral-50/50">
                    <span className="text-neutral-400 block text-[11px]">Pression Acoustique</span>
                    <span className="font-bold text-neutral-900">{selectedGeneratorForDetails.noiseLevel}</span>
                  </div>
                  <div className="p-3 rounded border border-neutral-100 bg-neutral-50/50">
                    <span className="text-neutral-400 block text-[11px]">Dimensions (L × l × H)</span>
                    <span className="font-bold text-neutral-900">{selectedGeneratorForDetails.dimensions}</span>
                  </div>
                  <div className="p-3 rounded border border-neutral-100 bg-neutral-50/50">
                    <span className="text-neutral-400 block text-[11px]">Poids à sec</span>
                    <span className="font-bold text-neutral-900">{selectedGeneratorForDetails.weight}</span>
                  </div>
                </div>
              </div>

              {/* Inclusions de série */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs text-neutral-700 space-y-2">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Équipements inclus de série chez VOLT :</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5 list-disc text-[11px]">
                  <li>Armoire d’inversion automatique ATS avec contacteurs télémécaniques</li>
                  <li>Chargeur de batterie automatique à maintien de charge</li>
                  <li>Réchauffeur de liquide de refroidissement pour démarrage à froid instantané</li>
                  <li>Disjoncteur magnéto-thermique 4 pôles Schneider Electric</li>
                  <li>Bouton d’arrêt d’urgence extérieur étanche</li>
                  <li>Mise en service et formation du personnel par notre ingénieur</li>
                </ul>
              </div>
            </div>

            {/* Footer Modale */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
              <button
                onClick={() => onSelectGeneratorDetails(null)}
                className="py-2.5 px-4 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  const target = selectedGeneratorForDetails;
                  onSelectGeneratorDetails(null);
                  onOpenPurchaseModal(target);
                }}
                className="py-2.5 px-6 text-xs font-bold rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-neutral-900 transition-colors shadow-xs"
              >
                Demander un devis pour ce modèle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALE FORMULAIRE DE DEMANDE D'ACHAT ================= */}
      {selectedGeneratorForPurchase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 uppercase">Devis &amp; Bon de Commande</span>
                <h3 className="text-base font-black text-neutral-900">
                  {selectedGeneratorForPurchase.model} ({selectedGeneratorForPurchase.kva} kVA)
                </h3>
              </div>
              <button
                onClick={resetForm}
                className="p-1 rounded-md text-neutral-500 hover:bg-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Si déjà confirmé : écran de confirmation */}
            {createdRequestId ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <FileCheck2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-neutral-900">Demande d’achat enregistrée !</h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    Votre référence de dossier est{' '}
                    <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                      {createdRequestId}
                    </span>
                  </p>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl text-left border border-neutral-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Modèle sélectionné :</span>
                    <span className="font-bold text-neutral-900">{selectedGeneratorForPurchase.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Montant indicatif :</span>
                    <span className="font-mono font-bold text-amber-700">
                      {selectedGeneratorForPurchase.priceTND.toLocaleString('fr-FR')} TND
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Inverseur ATS :</span>
                    <span className="font-semibold text-neutral-800">
                      {withAtsOption ? 'Inclus (Schneider Electric)' : 'Non requis'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Contact :</span>
                    <span className="text-neutral-800">{customerName} ({phone})</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  Notre département commercial vous contactera dans les <strong>2 heures ouvrées</strong> pour convenir d’une visite technique sur votre site à {governorate.split(' ')[0]}.
                </p>

                <div className="pt-2">
                  <button
                    onClick={resetForm}
                    className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
                  >
                    Fermer et retourner au catalogue
                  </button>
                </div>
              </div>
            ) : (
              /* Formulaire actif */
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                {formError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Nom complet / Entreprise <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Société Maghrébine de Plasturgie"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Téléphone mobile <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+216 98 123 456"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Email professionnel <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="direction@entreprise.tn"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Gouvernorat d’implantation
                    </label>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                    >
                      {GRAND_TUNIS_GOVERNORATES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Adresse précise de livraison &amp; installation
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Z.I. Charguia 2, Rue des Entrepreneurs"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 p-3 rounded-lg border border-neutral-200 bg-neutral-50 cursor-pointer hover:bg-neutral-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={withAtsOption}
                      onChange={(e) => setWithAtsOption(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-neutral-800">
                        Inclure l’armoire d’inversion automatique ATS (Recommandé)
                      </span>
                      <p className="text-[11px] text-neutral-500">
                        Basculement mécanique sécurisé sous 8s dès coupure STEG. Évite toute coupure des frigos/serveurs.
                      </p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Détails complémentaires sur vos charges (optionnel)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ex: Nous avons 3 compresseurs de climatisation et un ascenseur. Déplacement souhaité avant mardi."
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="py-2.5 px-4 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 text-xs font-bold rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-neutral-900 transition-colors shadow-xs"
                  >
                    Envoyer ma demande d’achat
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
