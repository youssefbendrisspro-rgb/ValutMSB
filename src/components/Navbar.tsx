import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { Zap, PhoneCall, ShieldAlert, Menu, X, Lock } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openPinModal: () => void;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
  openQuickQuoteModal: () => void;
  pendingPurchasesCount: number;
  openTicketsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openPinModal,
  isAdminLoggedIn,
  onLogoutAdmin,
  openQuickQuoteModal,
  pendingPurchasesCount,
  openTicketsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; badge?: number }[] = [
    { id: 'home', label: 'Accueil' },
    { id: 'sales', label: 'Vente' },
    { id: 'rental', label: 'Location & Calculateur' },
    { id: 'support', label: 'Support & Urgence STEG', badge: openTicketsCount > 0 ? openTicketsCount : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs">
      {/* Bandeau d'urgence Grand Tunis */}
      <div className="bg-[#111827] text-white text-xs px-4 py-1.5 flex items-center justify-between border-b border-neutral-800">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F59E0B] text-neutral-900">
              GRAND TUNIS
            </span>
            <span className="hidden sm:inline text-neutral-300">
              Intervention d’urgence coupure STEG 24/7 sur Tunis, Ariana, Ben Arous &amp; Manouba
            </span>
            <span className="sm:hidden text-neutral-300">Dépannage 24/7 Grand Tunis</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-300 font-mono text-[11px]">
            <a
              href="tel:+21671234567"
              className="flex items-center gap-1.5 text-[#F59E0B] hover:text-[#D97706] font-semibold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Astreinte : +216 71 234 567</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marque */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 group text-left focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-lg bg-[#111827] flex items-center justify-center text-[#F59E0B] shadow-sm group-hover:bg-neutral-800 transition-colors">
                <Zap className="w-6 h-6 fill-[#F59E0B] stroke-neutral-900" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-wider text-[#0D0D0D]">VOLT</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-[#D97706] uppercase tracking-wide">
                    Diesel
                  </span>
                </div>
                <span className="text-[11px] text-[#6B7280] font-medium leading-none">
                  Groupes Électrogènes de Secours
                </span>
              </div>
            </button>
          </div>

          {/* Onglets Desktop */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3.5 py-2 text-sm font-semibold transition-colors rounded-md ${
                    isActive
                      ? 'text-[#0D0D0D] bg-neutral-100/80'
                      : 'text-[#6B7280] hover:text-[#0D0D0D] hover:bg-neutral-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#F59E0B] rounded-full" />
                  )}
                </button>
              );
            })}

            {isAdminLoggedIn && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`relative px-3 py-2 text-sm font-semibold transition-colors rounded-md flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'text-amber-800 bg-amber-50'
                    : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50/60'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Console Admin</span>
                {(pendingPurchasesCount > 0 || openTicketsCount > 0) && (
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                )}
              </button>
            )}
          </nav>

          {/* Action droite */}
          <div className="hidden md:flex items-center gap-3">
            {isAdminLoggedIn ? (
              <button
                onClick={onLogoutAdmin}
                className="text-xs text-neutral-500 hover:text-neutral-800 px-2.5 py-1.5 rounded border border-neutral-200 hover:border-neutral-300 transition-colors"
                title="Quitter le mode administrateur"
              >
                Déconnexion Admin
              </button>
            ) : null}

            <button
              onClick={openQuickQuoteModal}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold rounded-lg text-neutral-900 bg-[#F59E0B] hover:bg-[#D97706] transition-all shadow-xs hover:shadow active:scale-98"
            >
              Obtenir un générateur
            </button>
          </div>

          {/* Bouton Hamburger Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 focus:outline-hidden"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-amber-50 text-amber-900 font-bold'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-rose-100 text-rose-700 font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {isAdminLoggedIn ? (
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold bg-amber-100/70 text-amber-900 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Tableau de bord Admin</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openPinModal();
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Accès Collaborateur / Admin (PIN 1234)</span>
            </button>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openQuickQuoteModal();
              }}
              className="w-full py-2.5 rounded-lg text-sm font-bold text-center text-neutral-900 bg-[#F59E0B] hover:bg-[#D97706]"
            >
              Obtenir un générateur
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
