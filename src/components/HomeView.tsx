import React from 'react';
import { Generator, ActiveTab } from '../types';
import { GeneratorIllustration, GeneratorVisual, StegAtsDiagram } from './TechnicalIllustrations';
import {
  ShieldCheck,
  Clock,
  Wrench,
  Truck,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  PhoneCall,
} from 'lucide-react';

interface HomeViewProps {
  generators: Generator[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectGeneratorDetails: (gen: Generator) => void;
  onOpenPurchaseModal: (gen: Generator) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  generators,
  setActiveTab,
  onSelectGeneratorDetails,
  onOpenPurchaseModal,
}) => {
  const featuredGenerators = generators.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* ================= HERO SECTION INDUSTRIEL ================= */}
      <section className="relative bg-gradient-to-b from-[#111827] via-[#1F2937] to-[#111827] text-white overflow-hidden py-16 lg:py-24 border-b border-neutral-800">
        {/* Motif vectoriel industriel technique en arrière-plan */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F59E0B" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroGrid)" />
          </svg>
        </div>

        {/* Lueur d'ambiance ambre */}
        <div className="absolute -top-24 right-0 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Colonne texte Hero */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                <span>Protection Énergétique Résidentielle · Grand Tunis</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Une énergie fiable. <br />
                <span className="text-[#F59E0B]">Pour votre maison &amp; villa.</span>
              </h1>

              <p className="text-lg text-neutral-300 max-w-2xl leading-relaxed">
                VOLT installe et maintient des groupes électrogènes diesel <strong>domestiques et individuels insonorisés</strong> de 6.5 à 15 kVA
                pour maisons, villas, appartements et commerces du <strong>Grand Tunis</strong>{' '}
                (Tunis, Ariana, Ben Arous, Manouba) avec inverseur automatique ATS pour continuer à alimenter vos climatiseurs, réfrigérateurs et appareils essentiels lors des coupures STEG.
              </p>

              {/* 3 CTAs principaux */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('sales')}
                  className="px-6 py-3.5 rounded-lg bg-[#F59E0B] text-neutral-900 font-bold text-sm hover:bg-[#D97706] transition-all shadow-md hover:shadow-lg flex items-center gap-2 active:scale-98"
                >
                  <span>Acheter un générateur</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('rental')}
                  className="px-6 py-3.5 rounded-lg bg-neutral-800 text-white font-bold text-sm border border-neutral-700 hover:bg-neutral-700 transition-all flex items-center gap-2 active:scale-98"
                >
                  <span>Louer une unité</span>
                  <span className="text-amber-400 font-mono text-xs">Dès 75 DT/j</span>
                </button>

                <button
                  onClick={() => setActiveTab('support')}
                  className="px-5 py-3.5 rounded-lg bg-transparent text-rose-300 hover:text-rose-200 border border-rose-500/40 hover:bg-rose-500/10 font-semibold text-sm transition-all flex items-center gap-2 active:scale-98"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Dépannage d’urgence</span>
                </button>
              </div>

              {/* Badges de conformité & rapidité */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-neutral-800/80 text-xs">
                <div>
                  <div className="text-amber-400 font-bold font-mono text-base">&lt; 4h</div>
                  <div className="text-neutral-400">Intervention Grand Tunis</div>
                </div>
                <div>
                  <div className="text-white font-bold font-mono text-base">Insonorisé 64 dB</div>
                  <div className="text-neutral-400">Silencieux pour jardin/garage</div>
                </div>
                <div>
                  <div className="text-white font-bold font-mono text-base">ATS Automatique</div>
                  <div className="text-neutral-400">Basculement sous 6 sec</div>
                </div>
              </div>
            </div>

            {/* Colonne visuelle Hero : Illustration technique grand format */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-neutral-900/90 rounded-xl p-4 border border-neutral-700/80 shadow-2xl">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 pb-2 border-b border-neutral-800">
                  <span className="font-mono text-amber-400 font-bold">
                    {generators[1]?.model || 'VOLT Villa 8.5'} · {generators[1]?.kva || 8.5} kVA
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Prêt au démarrage
                  </span>
                </div>

                <div className="h-64 sm:h-72 w-full flex items-center justify-center overflow-hidden rounded-lg">
                  <GeneratorVisual
                    imageUrl={generators[1]?.imageUrl || generators[0]?.imageUrl}
                    kva={generators[1]?.kva || 8.5}
                    modelName={generators[1]?.model || 'VOLT Villa 8.5'}
                    detailLevel="hero"
                    className="w-full h-full"
                  />
                </div>

                <div className="mt-3 bg-neutral-950/80 p-3 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-neutral-300 font-medium">Insonorisation Résidentielle 66 dB(A)</div>
                    <div className="text-[11px] text-neutral-400">Monophasé 230V · Coffret ATS maison inclus</div>
                  </div>
                  <button
                    onClick={() => {
                      const g = generators[1] || generators[0];
                      if (g) onSelectGeneratorDetails(g);
                    }}
                    className="text-xs font-semibold text-[#F59E0B] hover:underline"
                  >
                    Fiche technique &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BANDEAU DE CONFIANCE (4 CARTES) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Carte 1 : Vente */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-xs hover:border-[#F59E0B] transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-[#D97706] mb-3 group-hover:bg-[#F59E0B] group-hover:text-neutral-900 transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#0D0D0D] mb-1">Vente Maisons &amp; Villas</h2>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Groupes diesel insonorisés 6.5 à 15 kVA en stock à Tunis. Parfaits pour climatiseurs, frigos et domotique.
            </p>
          </div>

          {/* Carte 2 : Location */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-xs hover:border-[#F59E0B] transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-[#D97706] mb-3 group-hover:bg-[#F59E0B] group-hover:text-neutral-900 transition-colors">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#0D0D0D] mb-1">Location Particuliers &amp; Pros</h2>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Unités compactes sur roulettes livrées à domicile dès 75 DT/jour. Formules semaine avantageuses.
            </p>
          </div>

          {/* Carte 3 : Installation Clé en Main */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-xs hover:border-[#F59E0B] transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-[#D97706] mb-3 group-hover:bg-[#F59E0B] group-hover:text-neutral-900 transition-colors">
              <Wrench className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#0D0D0D] mb-1">Raccordement Tableau &amp; ATS</h2>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Pose sécurisée d’un boîtier d’inversion automatique empêchant tout retour dangereux sur le réseau STEG.
            </p>
          </div>

          {/* Carte 4 : Maintenance & Urgence */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-xs hover:border-[#F59E0B] transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-[#D97706] mb-3 group-hover:bg-[#F59E0B] group-hover:text-neutral-900 transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-[#0D0D0D] mb-1">Dépannage Réactif 4h</h2>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Assistance technique 24/7 pour les résidences et villas sur Tunis, Ariana, Ben Arous et Manouba.
            </p>
          </div>
        </div>
      </section>

      {/* ================= POURQUOI CHOISIR VOLT (3 COLONNES) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold text-[#D97706] uppercase tracking-wider mb-2">
            Ingénierie &amp; Sécurité Industrielle
          </div>
          <h2 className="text-3xl font-black text-[#0D0D0D] tracking-tight">
            Pourquoi les entreprises du Grand Tunis font confiance à VOLT
          </h2>
          <p className="mt-3 text-sm text-[#6B7280]">
            Une coupure d’électricité n’est pas qu’une gêne : en milieu médical ou industriel, c’est une perte d’activité critique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] relative">
            <div className="w-12 h-12 rounded-lg bg-neutral-900 text-[#F59E0B] flex items-center justify-center font-black text-lg mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0D] mb-2">Intervention Rapide sous 4h</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Nos camions ateliers sont basés stratégiquement à Charguia, Ben Arous et Ariana pour contourner le trafic urbain et intervenir dès la première alerte.
            </p>
            <ul className="space-y-2 text-xs text-neutral-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Astreinte 24h/24 y compris week-ends et fériés</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Véhicules équipés de bancs de test et carburant</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] relative">
            <div className="w-12 h-12 rounded-lg bg-neutral-900 text-[#F59E0B] flex items-center justify-center font-black text-lg mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0D] mb-2">Motorisations Certifiées</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Zéro contrefaçon. Moteurs Perkins (Royaume-Uni), Cummins (USA), Baudouin (France) et Volvo Penta (Suède) avec numéros de série vérifiables.
            </p>
            <ul className="space-y-2 text-xs text-neutral-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Alternateurs Stamford &amp; Leroy-Somer bobinage cuivre</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Filtres décanteurs renforcés anti-impuretés gasoil</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] relative">
            <div className="w-12 h-12 rounded-lg bg-neutral-900 text-[#F59E0B] flex items-center justify-center font-black text-lg mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-[#0D0D0D] mb-2">Service Technique Clé en Main</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Nous ne livrons pas simplement une caisse : nos ingénieurs mesurent votre courant d’appel (cosinus phi) et configurent l’automatisme de A à Z.
            </p>
            <ul className="space-y-2 text-xs text-neutral-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Régulateurs AVR électroniques &plusmn;1% pour matériel sensible</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Contrats de maintenance avec test mensuel en charge</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= SECTION SCHÉMA TECHNIQUE ATS & STEG ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-xl">
          <div className="max-w-3xl mb-6">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              Technologie Anti-Coupure
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Comment fonctionne le basculement automatique VOLT lors d’une panne STEG ?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2">
              L’inverseur de source motorisé (ATS) détecte instantanément l’absence de tension du réseau électrique public, démarre le groupe et commute les circuits en toute sécurité.
            </p>
          </div>

          <StegAtsDiagram />
        </div>
      </section>

      {/* ================= GÉNÉRATEURS EN VEDETTE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-[#D97706] uppercase tracking-wider">
              Catalogue Vente &amp; Disponibilité Immédiate
            </div>
            <h2 className="text-3xl font-black text-[#0D0D0D] tracking-tight mt-1">
              Nos Groupes Électrogènes en Vedette
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Testés sur banc de charge avant expédition. Disponibles sur notre dépôt de Tunis.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('sales')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0D0D0D] hover:text-[#D97706] transition-colors self-start sm:self-auto"
          >
            <span>Voir tout le catalogue ({generators.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredGenerators.map((gen) => (
            <div
              key={gen.id}
              className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
            >
              {/* En-tête visuel avec photo réelle */}
              <div className="h-52 bg-neutral-900 relative border-b border-neutral-200 overflow-hidden">
                <GeneratorVisual
                  imageUrl={gen.imageUrl}
                  kva={gen.kva}
                  modelName={gen.model}
                  detailLevel="card"
                  className="w-full h-full"
                />
                <div className="absolute top-3 left-3 bg-neutral-900/90 text-amber-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-neutral-700">
                  {gen.badge || `${gen.kva} kVA`}
                </div>
              </div>

              {/* Corps de la carte */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-black text-[#0D0D0D]">{gen.model}</h3>
                    <div className="text-base font-black text-[#D97706] font-mono">
                      {gen.priceTND.toLocaleString('fr-FR')} DT
                    </div>
                  </div>

                  <p className="text-xs text-[#6B7280] mt-2 line-clamp-2">{gen.shortDesc}</p>

                  {/* Caractéristiques clés */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-xs text-neutral-600">
                    <div>
                      <span className="text-neutral-400">Moteur:</span>{' '}
                      <span className="font-semibold text-neutral-800">{gen.engine.split(' ')[0]}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Puissance:</span>{' '}
                      <span className="font-bold text-neutral-900">{gen.kva} kVA / {gen.kw} kW</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Bruit:</span>{' '}
                      <span className="font-medium text-neutral-800">{gen.noiseLevel}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Garantie:</span>{' '}
                      <span className="font-semibold text-emerald-700">{gen.warranty}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => onSelectGeneratorDetails(gen)}
                    className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#0D0D0D] transition-colors"
                  >
                    Fiche détaillée
                  </button>
                  <button
                    onClick={() => onOpenPurchaseModal(gen)}
                    className="flex-1 py-2 px-3 text-xs font-bold rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-neutral-900 transition-colors"
                  >
                    Demander devis
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BANNIÈRE D'APPEL DIRECT ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-6 sm:p-10 border border-neutral-700 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Bureau d’études &amp; Dimensionnement gratuit
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Vous hésitez sur la puissance kVA nécessaire pour votre site ?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              Nos ingénieurs électriciens effectuent un relevé de vos récepteurs et compresseurs afin de vous préconiser la puissance exacte sans surcoût.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="tel:+21671234567"
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#F59E0B] text-neutral-900 font-bold text-sm hover:bg-[#D97706] transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>+216 71 234 567</span>
            </a>
            <button
              onClick={() => setActiveTab('support')}
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white font-semibold text-sm transition-colors"
            >
              Ouvrir un ticket technique
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
