import React from 'react';
import { ActiveTab } from '../types';
import { Zap, PhoneCall, ShieldCheck, MapPin, Lock } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  openPinModal: () => void;
  isAdminLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, openPinModal, isAdminLoggedIn }) => {
  return (
    <footer className="bg-neutral-950 text-white border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marque & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F59E0B] text-neutral-950 flex items-center justify-center font-black">
                <Zap className="w-5 h-5 fill-neutral-950" />
              </div>
              <span className="text-xl font-black tracking-wider text-white">VOLT</span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Société tunisienne spécialisée dans les groupes électrogènes diesel de secours. Vente, location,
              installation et maintenance préventive contre les coupures du réseau STEG.
            </p>
            <div className="flex items-center gap-2 text-neutral-400 text-[11px] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Conforme aux normes ISO 8528 &amp; CE</span>
            </div>
          </div>

          {/* Zones d'intervention Grand Tunis */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Couverture Grand Tunis
            </h3>
            <ul className="space-y-1.5 text-neutral-400 text-xs">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Tunis (Berges du Lac, Centre, La Marsa)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Ariana (Ennasr, Soukra, Raoued)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Ben Arous (Megrine, Rades, Z.I. Mghira)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Manouba (Denden, Oued Ellil)</span>
              </li>
            </ul>
          </div>

          {/* Navigation Rapide */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Services &amp; Produits
            </h3>
            <ul className="space-y-1.5 text-neutral-400 text-xs">
              <li>
                <button onClick={() => setActiveTab('sales')} className="hover:text-white transition-colors">
                  Vente de groupes 6.5 à 15 kVA (Maisons &amp; Villas)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('rental')} className="hover:text-white transition-colors">
                  Location &amp; Calculateur de tarif
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('support')} className="hover:text-white transition-colors">
                  Dépannage d’urgence sous 2h / 8h
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  Armoires d’inversion ATS Schneider
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Urgence 24/7 */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Standard Technique &amp; Astreinte
            </h3>
            <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 space-y-1">
              <span className="text-[10px] text-neutral-400 block font-mono">ASTREINTE CRITIQUE</span>
              <a
                href="tel:+21671234567"
                className="text-base font-black text-[#F59E0B] font-mono hover:underline flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>+216 71 234 567</span>
              </a>
              <span className="text-[10px] text-neutral-400 block">Dépôt principal : Z.I. Charguia 2, Tunis</span>
            </div>

            <div className="pt-1">
              <button
                onClick={openPinModal}
                className="text-[11px] text-neutral-500 hover:text-neutral-300 flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAdminLoggedIn ? 'Console Admin (Active)' : 'Accès Direction & Techniciens (PIN)'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-[11px]">
          <div>&copy; 2026 VOLT Tunisie. Tous droits réservés. Motorisations Perkins, Cummins, Baudouin, Volvo Penta.</div>
          <div className="flex items-center gap-4">
            <span>Dépannage réseau STEG Grand Tunis</span>
            <span>·</span>
            <span>Garantie constructeur certifiée</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
