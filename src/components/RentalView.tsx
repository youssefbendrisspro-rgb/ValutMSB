import React, { useState, useMemo } from 'react';
import { RentalUnit, RentalRequest } from '../types';
import { GeneratorIllustration, GeneratorVisual } from './TechnicalIllustrations';
import { GRAND_TUNIS_GOVERNORATES } from '../data/defaults';
import {
  Calendar,
  Calculator,
  CheckCircle2,
  Clock,
  Truck,
  Shield,
  X,
  FileCheck2,
  AlertCircle,
  Fuel,
  Volume2,
} from 'lucide-react';

interface RentalViewProps {
  rentalUnits: RentalUnit[];
  onSubmitRentalRequest: (
    req: Omit<RentalRequest, 'id' | 'status' | 'createdAt'>
  ) => { success: boolean; id?: string; error?: string };
}

export const RentalView: React.FC<RentalViewProps> = ({
  rentalUnits,
  onSubmitRentalRequest,
}) => {
  // Calculateur state
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  }, []);

  const [selectedUnitId, setSelectedUnitId] = useState<string>(rentalUnits[0]?.id || 'rent-1');
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(tomorrowStr);

  // Modale de réservation
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingUnit, setBookingUnit] = useState<RentalUnit | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [governorate, setGovernorate] = useState(GRAND_TUNIS_GOVERNORATES[0]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cabling25m, setCabling25m] = useState(true);
  const [externalTank, setExternalTank] = useState(false);
  const [technicianOnDuty, setTechnicianOnDuty] = useState(false);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  // Unité actuellement sélectionnée dans le calculateur
  const activeUnit = rentalUnits.find((u) => u.id === selectedUnitId) || rentalUnits[0];

  // Calcul rigoureux des jours et tarifs
  const rentalCalculation = useMemo(() => {
    if (!activeUnit || !startDate || !endDate) {
      return { days: 0, totalPrice: 0, breakdown: 'Sélectionnez des dates valides', isValid: false };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Même jour = 1 jour de location minimum
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) {
      return {
        days: 0,
        totalPrice: 0,
        breakdown: 'La date de fin doit être postérieure à la date de début.',
        isValid: false,
      };
    }

    // Calcul du nombre de jours inclusifs (ex: du lundi au lundi = 7 jours ou 8 selon convention, ici durée = Math.ceil(diff/day) + 1 ou standard)
    const rawDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const days = rawDays === 0 ? 1 : rawDays;

    if (days < 7) {
      const price = days * activeUnit.dailyRate;
      return {
        days,
        totalPrice: price,
        breakdown: `${days} jour${days > 1 ? 's' : ''} × ${activeUnit.dailyRate} TND/j`,
        isValid: true,
      };
    } else {
      const fullWeeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      const weeklyCost = fullWeeks * activeUnit.weeklyRate;
      const dailyCost = remainingDays * activeUnit.dailyRate;
      const price = weeklyCost + dailyCost;

      let breakdownStr = `${fullWeeks} semaine${fullWeeks > 1 ? 's' : ''} (${weeklyCost} TND)`;
      if (remainingDays > 0) {
        breakdownStr += ` + ${remainingDays} jour${remainingDays > 1 ? 's' : ''} (${dailyCost} TND)`;
      }

      return {
        days,
        totalPrice: price,
        breakdown: breakdownStr,
        isValid: true,
      };
    }
  }, [activeUnit, startDate, endDate]);

  const handleOpenBooking = (unit: RentalUnit) => {
    setSelectedUnitId(unit.id);
    setBookingUnit(unit);
    setIsBookingModalOpen(true);
    setCreatedRequestId(null);
    setFormError(null);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const targetUnit = bookingUnit || activeUnit;
    if (!targetUnit) return;

    if (!rentalCalculation.isValid) {
      setFormError('Veuillez sélectionner des dates de location cohérentes.');
      return;
    }
    if (!customerName.trim()) {
      setFormError('Le nom du contact ou de l’entreprise est requis.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Le téléphone est obligatoire pour planifier le transporteur.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Email valide requis pour la transmission du contrat de mise à disposition.');
      return;
    }

    const res = onSubmitRentalRequest({
      unitId: targetUnit.id,
      unitName: targetUnit.name,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      governorate,
      deliveryAddress: deliveryAddress.trim() || 'À convenir lors de l’appel de confirmation',
      startDate,
      endDate,
      durationDays: rentalCalculation.days,
      calculationBreakdown: rentalCalculation.breakdown,
      totalPriceTND: rentalCalculation.totalPrice,
      options: {
        cabling25m,
        externalTank,
        technicianOnDuty,
      },
      message: message.trim() || 'Demande de réservation location.',
    });

    if (res.success && res.id) {
      setCreatedRequestId(res.id);
    } else {
      setFormError(res.error || 'Erreur lors de l’enregistrement de votre réservation.');
    }
  };

  const resetBookingModal = () => {
    setIsBookingModalOpen(false);
    setBookingUnit(null);
    setCustomerName('');
    setPhone('');
    setEmail('');
    setDeliveryAddress('');
    setMessage('');
    setCreatedRequestId(null);
    setFormError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* En-tête */}
      <div className="border-b border-neutral-200 pb-6">
        <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">
          Flotte Résidentielle &amp; Dépannage Temporaire
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0D0D0D] tracking-tight mt-1">
          Location de Groupes Électrogènes Domestiques &amp; Calculateur
        </h1>
        <p className="text-sm text-[#6B7280] mt-1 max-w-3xl">
          Pour votre maison, villa, commerce ou événement familial face aux coupures STEG.
          Unités diesel super-insonorisées sur roulettes maniables livrées et branchées directement à domicile sur le Grand Tunis.
        </p>
      </div>

      {/* ================= CALCULATEUR EN DIRECT ================= */}
      <section className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Calculateur de Tarif en Direct</h2>
            <p className="text-xs text-neutral-400">
              Barème dégressif automatique : 7 jours loués = tarif préférentiel semaine appliqué.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Formulaire des paramètres de calcul */}
          <div className="lg:col-span-7 space-y-5">
            {/* Choix de l'unité */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                1. Choisissez la puissance requise
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {rentalUnits.map((unit) => {
                  const isSelected = unit.id === selectedUnitId;
                  return (
                    <button
                      key={unit.id}
                      type="button"
                      onClick={() => setSelectedUnitId(unit.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-white shadow-sm'
                          : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black">{unit.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            unit.availability === 'Disponible'
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          {unit.availability}
                        </span>
                      </div>
                      <div className="text-base font-black text-amber-400 font-mono mt-1">
                        {unit.kva} kVA
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1">
                        {unit.dailyRate} DT/j · {unit.weeklyRate} DT/sem
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Période de location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  2. Date de début (Livraison)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  3. Date de fin (Restitution)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={startDate || todayStr}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Inclusions & garanties */}
            <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
              <div className="text-neutral-200 font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Ce tarif comprend :</span>
              </div>
              <p>Mise en service initiale · Assurance RC machine · Câbles standard · Assistance 24/7 sur Grand Tunis</p>
            </div>
          </div>

          {/* Récapitulatif du coût en direct */}
          <div className="lg:col-span-5 bg-neutral-950 p-6 rounded-xl border border-neutral-800 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Estimation Location TTC
              </span>
              <div className="text-sm font-bold text-neutral-200 mt-1">
                {activeUnit ? activeUnit.name : 'Groupe'} ({activeUnit?.kva} kVA)
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Durée calculée :</span>
                  <span className="font-bold text-white font-mono">
                    {rentalCalculation.isValid ? `${rentalCalculation.days} jours` : '—'}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Détail formule :</span>
                  <span className="text-amber-400 font-mono text-right text-[11px]">
                    {rentalCalculation.breakdown}
                  </span>
                </div>

                <div className="pt-3 border-t border-neutral-800">
                  <span className="text-xs text-neutral-400 block">Total estimé :</span>
                  <div className="text-3xl font-black text-amber-400 font-mono tracking-tight mt-0.5">
                    {rentalCalculation.isValid
                      ? `${rentalCalculation.totalPrice.toLocaleString('fr-FR')} TND`
                      : 'Dates invalides'}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={!rentalCalculation.isValid || activeUnit?.availability === 'En révision'}
              onClick={() => activeUnit && handleOpenBooking(activeUnit)}
              className="w-full py-3 px-4 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-900 font-bold text-xs transition-colors shadow-md active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Réserver ce groupe pour cette période</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= CATALOGUE DES UNITÉS DE LOCATION ================= */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-[#0D0D0D]">Notre Parc de Générateurs Domestiques &amp; Individuels en Location</h2>
          <p className="text-xs text-[#6B7280]">
            Matériel révisé à chaque retour : vidange, filtres neufs, test sous charge et batterie 100% chargée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rentalUnits.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Visual avec photo réelle */}
                <div className="h-52 bg-neutral-900 relative border-b border-neutral-200 overflow-hidden">
                  <GeneratorVisual
                    imageUrl={unit.imageUrl}
                    kva={unit.kva}
                    modelName={unit.name}
                    isMobileTrailer={unit.isMobileTrailer}
                    detailLevel="card"
                    className="w-full h-full"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        unit.availability === 'Disponible'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {unit.availability}
                    </span>
                  </div>
                  {unit.isMobileTrailer && (
                    <div className="absolute top-3 right-3 bg-neutral-950/90 text-amber-400 font-mono text-[10px] px-2 py-0.5 rounded border border-neutral-700">
                      Sur Remorque Routière
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h3 className="text-lg font-black text-neutral-900">{unit.name}</h3>
                      <p className="text-xs text-neutral-500 font-mono">
                        {unit.kva} kVA ({unit.kw} kW) · {unit.engine}
                      </p>
                    </div>
                  </div>

                  {/* Tarification */}
                  <div className="grid grid-cols-2 gap-2 py-2 px-3 rounded-lg bg-neutral-50 border border-neutral-100 font-mono text-center">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-sans">Tarif Jour</span>
                      <span className="text-sm font-bold text-neutral-900">{unit.dailyRate} TND</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-sans">Tarif Semaine</span>
                      <span className="text-sm font-bold text-amber-700">{unit.weeklyRate} TND</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2">{unit.suitableFor}</p>

                  <div className="space-y-1.5 pt-2 border-t border-neutral-100 text-[11px] text-neutral-700">
                    {unit.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => handleOpenBooking(unit)}
                  disabled={unit.availability === 'En révision'}
                  className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-[#F59E0B] hover:bg-[#D97706] disabled:bg-neutral-200 disabled:text-neutral-400 text-neutral-900 transition-colors shadow-xs"
                >
                  {unit.availability === 'En révision' ? 'En maintenance' : 'Louer ce générateur'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODALE DE DEMANDE DE LOCATION ================= */}
      {isBookingModalOpen && (bookingUnit || activeUnit) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 uppercase">Demande de Location</span>
                <h3 className="text-base font-black text-neutral-900">
                  {(bookingUnit || activeUnit).name} ({(bookingUnit || activeUnit).kva} kVA)
                </h3>
              </div>
              <button
                onClick={resetBookingModal}
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
                  <h4 className="text-xl font-black text-neutral-900">Réservation de location transmise !</h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    Référence de dossier :{' '}
                    <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                      {createdRequestId}
                    </span>
                  </p>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl text-left border border-neutral-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Unité :</span>
                    <span className="font-bold text-neutral-900">{(bookingUnit || activeUnit).name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Période :</span>
                    <span className="font-mono text-neutral-800">
                      {startDate} &rarr; {endDate} ({rentalCalculation.days}j)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Tarif estimé :</span>
                    <span className="font-mono font-bold text-amber-700">
                      {rentalCalculation.totalPrice.toLocaleString('fr-FR')} TND
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Lieu de livraison :</span>
                    <span className="text-neutral-800">{governorate.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 text-amber-900 text-xs flex items-center gap-2 text-left">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Délai d’engagement : notre responsable parc vous rappelle sous <strong>2 heures ouvrées</strong> pour confirmer le créneau du camion grue.
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={resetBookingModal}
                    className="w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              /* Formulaire actif */
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                {formError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Rappel du calcul */}
                <div className="p-3 rounded-lg bg-neutral-100 border border-neutral-200 text-xs flex justify-between items-center">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Durée de location sélectionnée</span>
                    <span className="font-bold text-neutral-900">
                      Du {startDate} au {endDate} ({rentalCalculation.days} jours)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-neutral-500 block">Total estimé</span>
                    <span className="font-mono font-black text-amber-700 text-sm">
                      {rentalCalculation.totalPrice.toLocaleString('fr-FR')} TND
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Nom / Société <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Entreprise de BTP"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Téléphone mobile de contact <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+216 22 123 456"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="logistique@btp.tn"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Gouvernorat de livraison
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
                    Adresse ou repère sur site
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Ex: Chantier face au rond-point La Goulette"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                {/* Options de location */}
                <div className="space-y-2 pt-1">
                  <span className="block text-xs font-bold text-neutral-700">Options opérationnelles :</span>
                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cabling25m}
                      onChange={(e) => setCabling25m(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Fourniture de 25m de câbles puissance souples (Inclus sans supplément)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={externalTank}
                      onChange={(e) => setExternalTank(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Cuve additionnelle 1 000L pour autonomie prolongée</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={technicianOnDuty}
                      onChange={(e) => setTechnicianOnDuty(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Astreinte d’un électrotechnicien dédié sur site pendant l’événement</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Instructions particulières (optionnel)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Préciser contraintes d'accès pour le camion grue, horaires de livraison, etc."
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetBookingModal}
                    className="py-2.5 px-4 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 text-xs font-bold rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-neutral-900 transition-colors shadow-xs"
                  >
                    Confirmer la demande de location
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
