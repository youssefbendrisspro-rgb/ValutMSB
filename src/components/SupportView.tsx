import React, { useState } from 'react';
import {
  SupportTicket,
  TicketCategory,
  TicketUrgency,
} from '../types';
import { GRAND_TUNIS_GOVERNORATES } from '../data/defaults';
import { compressImageFile } from '../utils/storage';
import {
  AlertTriangle,
  Clock,
  PhoneCall,
  Search,
  Upload,
  CheckCircle2,
  FileText,
  User,
  MapPin,
  MessageSquare,
  AlertCircle,
  X,
  Camera,
} from 'lucide-react';

interface SupportViewProps {
  tickets: SupportTicket[];
  onSubmitTicket: (
    ticket: Omit<SupportTicket, 'id' | 'status' | 'internalNotes' | 'createdAt'>
  ) => { success: boolean; id?: string; error?: string; isQuotaExceeded?: boolean };
}

export const SupportView: React.FC<SupportViewProps> = ({ tickets, onSubmitTicket }) => {
  // Formulaire de ticket
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [generatorModel, setGeneratorModel] = useState('VOLT Power 60 (ou autre)');
  const [governorate, setGovernorate] = useState(GRAND_TUNIS_GOVERNORATES[0]);
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<TicketCategory>('DemarrageImpossible');
  const [urgency, setUrgency] = useState<TicketUrgency>('urgent');
  const [description, setDescription] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const [photoCompressing, setPhotoCompressing] = useState(false);

  // Messages d'état
  const [formError, setFormError] = useState<string | null>(null);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  // Recherche "Mes Tickets" par email
  const [searchEmail, setSearchEmail] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const filteredClientTickets = searchEmail.trim()
    ? tickets.filter((t) => t.email.toLowerCase().includes(searchEmail.trim().toLowerCase()))
    : [];

  // Gestion de la photo compressée
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoCompressing(true);
    setFormError(null);

    try {
      const compressed = await compressImageFile(file, 800, 0.6);
      setPhotoBase64(compressed);
      setPhotoFileName(file.name);
    } catch (err: any) {
      console.error('Erreur compression image:', err);
      setFormError('Impossible de traiter la photo. Vous pouvez soumettre votre ticket sans photo.');
      setPhotoBase64(undefined);
      setPhotoFileName(null);
    } finally {
      setPhotoCompressing(false);
    }
  };

  const removePhoto = () => {
    setPhotoBase64(undefined);
    setPhotoFileName(null);
  };

  // Soumission du ticket
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName.trim()) {
      setFormError('Veuillez renseigner votre nom ou raison sociale.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Le numéro de téléphone est obligatoire pour l’astreinte.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Une adresse email valide est indispensable pour le suivi du ticket.');
      return;
    }
    if (description.trim().length < 20) {
      setFormError(`La description doit contenir au moins 20 caractères (actuellement : ${description.trim().length}).`);
      return;
    }

    let slaText = 'Intervention garantie sous 48h';
    if (urgency === 'urgence_critique') slaText = 'Intervention d’urgence sous 2h';
    if (urgency === 'urgent') slaText = 'Intervention garantie sous 8h';

    const res = onSubmitTicket({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      generatorModel: generatorModel.trim(),
      governorate,
      address: address.trim() || 'À confirmer au standard',
      category,
      urgency,
      slaText,
      description: description.trim(),
      photoBase64,
    });

    if (res.success && res.id) {
      setCreatedTicketId(res.id);
      // Auto-remplir la recherche pour faciliter la consultation
      setSearchEmail(email.trim());
      setHasSearched(true);
    } else {
      if (res.isQuotaExceeded && photoBase64) {
        setFormError(
          'La mémoire locale de votre navigateur est saturée par la photo. Réessayez sans joindre de photo.'
        );
      } else {
        setFormError(res.error || 'Erreur lors de l’ouverture du ticket.');
      }
    }
  };

  const resetForm = () => {
    setCustomerName('');
    setPhone('');
    setEmail('');
    setDescription('');
    setPhotoBase64(undefined);
    setPhotoFileName(null);
    setCreatedTicketId(null);
    setFormError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* En-tête */}
      <div className="border-b border-neutral-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Astreinte Technique &amp; Dépannage STEG
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0D0D0D] tracking-tight mt-1">
            Support Technique &amp; Gestion des Incidents
          </h1>
          <p className="text-sm text-[#6B7280] mt-1 max-w-2xl">
            Panne au démarrage, inverseur ATS non enclenché ou alarme de niveau ? Nos équipes d’intervention
            se déploient sur l’ensemble du Grand Tunis selon des délais d’engagement stricts.
          </p>
        </div>

        {/* Appel d'urgence direct */}
        <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-rose-800 font-bold uppercase">Ligne Urgence 24/7</div>
            <a href="tel:+21671234567" className="text-base font-black text-rose-950 font-mono hover:underline">
              +216 71 234 567
            </a>
          </div>
        </div>
      </div>

      {/* ================= 2 COLONNES : FORMULAIRE À GAUCHE / MES TICKETS À DROITE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= FORMULAIRE DE TICKET ================= */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
          <div className="mb-6 pb-4 border-b border-neutral-100">
            <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Signaler une panne ou ouvrir un ticket</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Tous les champs signalés par un astérisque sont indispensables pour mobiliser le bon technicien.
            </p>
          </div>

          {createdTicketId ? (
            <div className="p-6 text-center space-y-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-900">Ticket d’intervention créé avec succès</h3>
                <div className="mt-2 inline-block bg-white px-3 py-1 rounded-lg border border-neutral-300 font-mono font-bold text-amber-700 text-base shadow-xs">
                  {createdTicketId}
                </div>
              </div>

              <div className="text-xs text-neutral-600 max-w-md mx-auto space-y-2 text-left bg-white p-4 rounded-lg border border-neutral-200">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Urgence :</span>
                  <span className="font-bold text-neutral-900 capitalize">{urgency.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Délai d’intervention :</span>
                  <span className="font-semibold text-rose-700">
                    {urgency === 'urgence_critique'
                      ? 'Sous 2h max'
                      : urgency === 'urgent'
                      ? 'Sous 8h'
                      : 'Sous 48h'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Client / Contact :</span>
                  <span className="text-neutral-800">{customerName} ({phone})</span>
                </div>
              </div>

              <p className="text-xs text-neutral-500">
                Vous pouvez suivre l’état d’avancement dans l’encart « Mes tickets » à droite grâce à votre email.
              </p>

              <button
                type="button"
                onClick={resetForm}
                className="mt-2 py-2 px-5 text-xs font-bold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
              >
                Ouvrir un autre ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              {formError && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Sélection du niveau d'urgence */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Niveau d’urgence de l’intervention <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency('normal')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      urgency === 'normal'
                        ? 'bg-neutral-900 border-neutral-900 text-white'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Normal</div>
                    <div className={`text-[11px] mt-0.5 ${urgency === 'normal' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Sous 48h max
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-1">Maintenance courante</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUrgency('urgent')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      urgency === 'urgent'
                        ? 'bg-amber-600 border-amber-600 text-white'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Urgent</div>
                    <div className={`text-[11px] mt-0.5 ${urgency === 'urgent' ? 'text-amber-100' : 'text-neutral-500'}`}>
                      Sous 8h garanti
                    </div>
                    <div className={`text-[10px] ${urgency === 'urgent' ? 'text-amber-200' : 'text-neutral-400'} mt-1`}>
                      Commerces, bureaux
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUrgency('urgence_critique')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      urgency === 'urgence_critique'
                        ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>Urgence Critique</span>
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    </div>
                    <div className={`text-[11px] mt-0.5 ${urgency === 'urgence_critique' ? 'text-rose-100 font-bold' : 'text-rose-600 font-bold'}`}>
                      Sous 2h chrono
                    </div>
                    <div className={`text-[10px] ${urgency === 'urgence_critique' ? 'text-rose-200' : 'text-neutral-400'} mt-1`}>
                      Cliniques, usines, frigos
                    </div>
                  </button>
                </div>
              </div>

              {/* Coordonnées Client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Nom / Entreprise <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Polyclinique Ennasr"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Téléphone direct de contact <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+216 71 000 000"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Email pour le suivi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="technique@domaine.tn"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Modèle ou puissance du groupe
                  </label>
                  <input
                    type="text"
                    value={generatorModel}
                    onChange={(e) => setGeneratorModel(e.target.value)}
                    placeholder="Ex: VOLT Power 60 kVA"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Gouvernorat de l’intervention
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

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Catégorie de la panne constatée <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TicketCategory)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                  >
                    <option value="DemarrageImpossible">Démarrage impossible lors coupure STEG</option>
                    <option value="InverseurATS">Inverseur automatique ATS bloqué</option>
                    <option value="FuiteFluide">Fuite de fluide (Gasoil, Huile, Liquide)</option>
                    <option value="Surchauffe">Surchauffe moteur / Alarme température</option>
                    <option value="AlarmeTableau">Alarme affichée sur tableau ComAp / DeepSea</option>
                    <option value="Autre">Autre anomalie électromécanique</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Adresse précise du local groupe
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Rue du Lac Constance, Sous-sol 2, Les Berges du Lac"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Description avec compteur de caractères en direct (min 20) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-neutral-700">
                    Description du problème <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      description.trim().length >= 20 ? 'text-emerald-600 font-bold' : 'text-neutral-400'
                    }`}
                  >
                    {description.trim().length} / 20 car. min.
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Expliquez les symptômes : bruits anormaux, fumée, voyants allumés, heure de la coupure STEG..."
                  className={`w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:outline-hidden ${
                    description.trim().length > 0 && description.trim().length < 20
                      ? 'border-amber-400 focus:ring-amber-500 bg-amber-50/20'
                      : 'border-neutral-300 focus:ring-amber-500'
                  }`}
                />
              </div>

              {/* Upload photo compressée par Canvas (optionnel) */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-neutral-500" />
                    <span>Photo du panneau ou de la pièce (Optionnel)</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">Compression auto &lt; 100 Ko</span>
                </div>

                {photoBase64 ? (
                  <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-neutral-200">
                    <img
                      src={photoBase64}
                      alt="Aperçu panne"
                      className="w-14 h-14 object-cover rounded border border-neutral-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-neutral-800 truncate">
                        {photoFileName || 'Photo enregistrée'}
                      </div>
                      <span className="text-[11px] text-emerald-600 font-medium">Image prête à l’envoi</span>
                    </div>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="p-1 rounded text-neutral-400 hover:text-rose-600"
                      title="Supprimer la photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-neutral-300 hover:border-amber-500 rounded-lg cursor-pointer bg-white text-xs text-neutral-600 hover:text-neutral-900 transition-colors">
                    <Upload className="w-4 h-4 text-neutral-400" />
                    <span>
                      {photoCompressing ? 'Compression de l’image...' : 'Prendre une photo ou sélectionner un fichier'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={photoCompressing}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={photoCompressing}
                  className="w-full py-3 px-4 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-neutral-900 font-bold text-xs transition-colors shadow-xs active:scale-98 flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Transmettre l’alerte au chef d’équipe d’astreinte</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ================= RECHERCHE & SUIVI "MES TICKETS" ================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-lg font-black text-neutral-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-600" />
                <span>Mes Tickets en Cours</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Consultez en temps réel l’assignation du technicien et les comptes-rendus d’intervention.
              </p>
            </div>

            {/* Barre de recherche email */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Rechercher par adresse email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={searchEmail}
                  onChange={(e) => {
                    setSearchEmail(e.target.value);
                    setHasSearched(true);
                  }}
                  placeholder="Ex: technique@labocentral.tn"
                  className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
                {searchEmail && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchEmail('');
                      setHasSearched(false);
                    }}
                    className="p-2 text-neutral-400 hover:text-neutral-600 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Liste des résultats */}
            <div className="space-y-3 pt-2">
              {filteredClientTickets.length > 0 ? (
                filteredClientTickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 transition-colors space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-neutral-900">{t.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.status === 'En cours'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : t.status === 'Assigné'
                            ? 'bg-blue-100 text-blue-800'
                            : t.status === 'Résolu'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-neutral-800">{t.generatorModel}</div>

                    <p className="text-xs text-neutral-600 line-clamp-2">{t.description}</p>

                    <div className="pt-2 border-t border-neutral-200 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-neutral-500">
                        <span>Engagement SLA :</span>
                        <span className="font-semibold text-rose-700">{t.slaText}</span>
                      </div>
                      {t.assignedTechnician && (
                        <div className="flex items-center justify-between text-neutral-700 font-medium">
                          <span>Technicien assigné :</span>
                          <span className="text-neutral-900 font-bold">{t.assignedTechnician.split('—')[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Dernières notes internes */}
                    {t.internalNotes && t.internalNotes.length > 0 && (
                      <div className="mt-2 p-2.5 rounded bg-white border border-neutral-200 text-[11px] space-y-1">
                        <span className="font-bold text-neutral-700 block">Dernier journal technique :</span>
                        <p className="text-neutral-600 italic">
                          « {t.internalNotes[t.internalNotes.length - 1].text} »
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : hasSearched && searchEmail.trim() ? (
                <div className="p-6 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-200 text-xs text-neutral-500">
                  Aucun ticket trouvé pour « {searchEmail} ». Vérifiez l’adresse ou ouvrez un nouveau ticket.
                </div>
              ) : (
                <div className="p-6 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-200 text-xs text-neutral-400">
                  Saisissez votre email ci-dessus (ex: <code className="text-amber-700 font-mono">technique@labocentral.tn</code>) pour afficher vos dossiers d’astreinte.
                </div>
              )}
            </div>
          </div>

          {/* Rappel du protocole STEG */}
          <div className="bg-neutral-900 text-white rounded-2xl p-5 border border-neutral-800 text-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Clock className="w-4 h-4" />
              <span>Consignes immédiates en cas de panne STEG :</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-neutral-300 text-[11px]">
              <li>Vérifiez que le disjoncteur général de l'armoire est sur <strong>AUTO</strong>.</li>
              <li>N'actionnez pas manuellement l'inverseur si le voyant réseau est encore sous tension.</li>
              <li>Consultez l'écran digital ComAp : si le voyant rouge clignote, notez le code défaut.</li>
              <li>Transmettez le ticket ci-contre ou contactez le +216 71 234 567.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
