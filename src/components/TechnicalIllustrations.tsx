import React from 'react';

interface GeneratorIllustrationProps {
  kva: number;
  modelName?: string;
  isMobileTrailer?: boolean;
  className?: string;
  detailLevel?: 'card' | 'hero' | 'modal';
}

/**
 * Représentation technique vectorielle SVG haute précision d’un groupe électrogène industriel VOLT.
 * Conçu avec capotage insonorisé ambre industriel (#F59E0B / #D97706), acier gris graphite (#1F2937 / #111827),
 * ouïes de ventilation acoustiques, panneau ComAp/DeepSea éclairé, anneaux de levage et châssis réservoir.
 */
export const GeneratorIllustration: React.FC<GeneratorIllustrationProps> = ({
  kva,
  modelName = 'VOLT Power',
  isMobileTrailer = false,
  className = 'w-full h-full',
  detailLevel = 'card',
}) => {
  // Variations visuelles en fonction du calibre kVA
  const isHeavy = kva >= 150;
  const isMid = kva >= 60 && kva < 150;
  const isCompact = kva < 60;

  return (
    <div className={`relative overflow-hidden flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 600 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain filter drop-shadow-md"
      >
        <defs>
          {/* Dégradés capotage VOLT */}
          <linearGradient id="amberCanopyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="metalDarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="60%" stopColor="#1F2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>

          <linearGradient id="skidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="50%" stopColor="#374151" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="lcdScreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064E3B" />
            <stop offset="100%" stopColor="#022C22" />
          </linearGradient>

          {/* Motif de grille acoustique pour ouïes */}
          <pattern id="louverGrid" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3" x2="6" y2="3" stroke="#111827" strokeWidth="1.5" />
            <line x1="0" y1="5" x2="6" y2="5" stroke="#374151" strokeWidth="0.8" />
          </pattern>

          {/* Motif hachures de sécurité jaune/noir */}
          <pattern id="hazardStripes" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#F59E0B" strokeWidth="6" />
            <line x1="6" y1="0" x2="6" y2="12" stroke="#111827" strokeWidth="6" />
          </pattern>

          {/* Grille technique d'arrière-plan */}
          <pattern id="techGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1="20" y1="0" x2="20" y2="20" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="1 3" />
            <line x1="0" y1="20" x2="20" y2="20" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="1 3" />
          </pattern>
        </defs>

        {/* Grille d'ingénierie d'arrière-plan subtile */}
        <rect width="600" height="360" fill="url(#techGrid)" opacity="0.4" />

        {/* Lignes techniques de cote industrielle */}
        <g opacity="0.25" stroke="#6B7280" strokeWidth="0.8">
          <line x1="40" y1="40" x2="560" y2="40" strokeDasharray="3 3" />
          <line x1="40" y1="320" x2="560" y2="320" strokeDasharray="3 3" />
          <line x1="40" y1="40" x2="40" y2="320" strokeDasharray="3 3" />
          <line x1="560" y1="40" x2="560" y2="320" strokeDasharray="3 3" />
        </g>

        {/* Ombre portée au sol */}
        <ellipse cx="300" cy="305" rx="230" ry="14" fill="#000000" opacity="0.18" />

        {/* ================= CHÂSSIS DE REMORQUE MOBILE (Si applicable) ================= */}
        {isMobileTrailer && (
          <g id="trailer-assembly">
            {/* Flèche d'attelage */}
            <path d="M 50 280 L 120 280 L 120 260 L 50 270 Z" fill="#374151" stroke="#111827" strokeWidth="1.5" />
            <circle cx="45" cy="275" r="7" fill="#6B7280" stroke="#111827" strokeWidth="2" />
            {/* Roues remorque */}
            <g id="wheels">
              {/* Roue gauche */}
              <circle cx="210" cy="290" r="28" fill="#1F2937" stroke="#000000" strokeWidth="4" />
              <circle cx="210" cy="290" r="16" fill="#9CA3AF" stroke="#374151" strokeWidth="3" />
              <circle cx="210" cy="290" r="6" fill="#111827" />
              {/* Roue droite */}
              <circle cx="390" cy="290" r="28" fill="#1F2937" stroke="#000000" strokeWidth="4" />
              <circle cx="390" cy="290" r="16" fill="#9CA3AF" stroke="#374151" strokeWidth="3" />
              <circle cx="390" cy="290" r="6" fill="#111827" />
              {/* Garde-boues */}
              <path d="M 175 285 A 35 35 0 0 1 245 285" fill="none" stroke="#D97706" strokeWidth="6" />
              <path d="M 355 285 A 35 35 0 0 1 425 285" fill="none" stroke="#D97706" strokeWidth="6" />
            </g>
          </g>
        )}

        {/* ================= CHÂSSIS SKID EN ACIER AVEC RÉSERVOIR ================= */}
        <g id="skid-base">
          {/* Base principale */}
          <rect x="100" y="260" width="400" height="28" rx="3" fill="url(#skidGrad)" stroke="#111827" strokeWidth="1.5" />
          {/* Trous de passage de fourches élévateur */}
          <rect x="190" y="268" width="45" height="13" rx="2" fill="#0A0E17" stroke="#4B5563" strokeWidth="1" />
          <rect x="365" y="268" width="45" height="13" rx="2" fill="#0A0E17" stroke="#4B5563" strokeWidth="1" />
          {/* Bande d'avertissement réfléchissante sur le skid */}
          <rect x="100" y="285" width="400" height="3" fill="#F59E0B" />
          {/* Bouchon de vidange d'huile / purge carburant */}
          <circle cx="120" cy="274" r="4" fill="#9CA3AF" stroke="#374151" />
        </g>

        {/* ================= CAPOTAGE INSONORISÉ VOLT (CANOPY) ================= */}
        <g id="canopy-body">
          {/* Corps principal jaune/ambre industriel */}
          <rect x="110" y="90" width="380" height="170" rx="6" fill="url(#amberCanopyGrad)" stroke="#B45309" strokeWidth="2" />

          {/* Bande supérieure d'étanchéité et toiture profilée */}
          <path d="M 106 94 L 115 84 L 485 84 L 494 94 Z" fill="#B45309" stroke="#92400E" strokeWidth="1" />
          <rect x="115" y="80" width="370" height="7" rx="2" fill="url(#metalDarkGrad)" />

          {/* Anneaux de levage sur le toit */}
          <g id="lifting-lugs" stroke="#1F2937" strokeWidth="3" fill="#D97706">
            <path d="M 180 80 C 180 68, 200 68, 200 80 Z" />
            <circle cx="190" cy="74" r="4" fill="#F3F4F6" stroke="#1F2937" strokeWidth="2" />
            <path d="M 400 80 C 400 68, 420 68, 420 80 Z" />
            <circle cx="410" cy="74" r="4" fill="#F3F4F6" stroke="#1F2937" strokeWidth="2" />
          </g>

          {/* Silencieux d'échappement industriel sur le toit */}
          <g id="exhaust-system">
            <rect x="135" y="58" width="32" height="24" rx="2" fill="url(#metalDarkGrad)" stroke="#111827" strokeWidth="1" />
            {/* Clapet anti-pluie sur tuyau d'échappement */}
            <path d="M 132 58 L 170 54 L 170 57 L 132 60 Z" fill="#9CA3AF" />
            <circle cx="151" cy="58" r="3" fill="#4B5563" />
          </g>

          {/* Portes d'accès insonorisées avec serrures et charnières inox */}
          <g id="canopy-doors">
            {/* Porte gauche (Maintenance moteur) */}
            <rect x="125" y="102" width={isHeavy ? 105 : 115} height="148" rx="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            {/* Charnières porte gauche */}
            <rect x="122" y="115" width="5" height="12" rx="1" fill="#4B5563" />
            <rect x="122" y="225" width="5" height="12" rx="1" fill="#4B5563" />
            {/* Serrure inox à clé encastrée */}
            <rect x="220" y="170" width="12" height="18" rx="2" fill="#D1D5DB" stroke="#374151" strokeWidth="1" />
            <circle cx="226" cy="179" r="2.5" fill="#1F2937" />

            {/* Ouïes d'aération acoustiques porte gauche */}
            <rect x="135" y="112" width="75" height="42" rx="2" fill="#1F2937" />
            <rect x="136" y="113" width="73" height="40" rx="1" fill="url(#louverGrid)" opacity="0.9" />

            {/* Porte droite (Accès alternateur & tableau de contrôle) */}
            <rect x={isHeavy ? 240 : 250} y="102" width={isHeavy ? 230 : 225} height="148" rx="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            {/* Charnières porte droite */}
            <rect x={isHeavy ? 467 : 472} y="115" width="5" height="12" rx="1" fill="#4B5563" />
            <rect x={isHeavy ? 467 : 472} y="225" width="5" height="12" rx="1" fill="#4B5563" />
            {/* Poignée encastrée */}
            <rect x={isHeavy ? 248 : 258} y="170" width="12" height="18" rx="2" fill="#D1D5DB" stroke="#374151" strokeWidth="1" />
            <circle cx={isHeavy ? 254 : 264} cy="179" r="2.5" fill="#1F2937" />
          </g>

          {/* ================= PANNEAU DE CONTRÔLE NUMÉRIQUE (ComAp / DeepSea) ================= */}
          <g id="control-panel">
            {/* Enceinte étanche IP65 vitrée pour l'écran */}
            <rect x="280" y="112" width="105" height="78" rx="4" fill="#111827" stroke="#374151" strokeWidth="2" />
            {/* Écran LCD rétro-éclairé vert industriel */}
            <rect x="290" y="118" width="85" height="38" rx="2" fill="url(#lcdScreenGrad)" stroke="#059669" strokeWidth="1" />
            {/* Affichage digital dynamique */}
            <text x="296" y="130" fill="#34D399" fontSize="8" fontFamily="monospace" fontWeight="bold">
              400V · 50.0Hz
            </text>
            <text x="296" y="142" fill="#6EE7B7" fontSize="8" fontFamily="monospace">
              {kva} kVA · OK
            </text>
            <text x="296" y="152" fill="#A7F3D0" fontSize="6.5" fontFamily="monospace">
              STEG: VEILLE AUTO
            </text>

            {/* Témoins LED (Vert=Prêt, Ambre=Préchauffage, Rouge=Défaut) */}
            <circle cx="295" cy="166" r="3" fill="#10B981" />
            <circle cx="307" cy="166" r="3" fill="#F59E0B" />
            <circle cx="319" cy="166" r="3" fill="#374151" />

            {/* Boutons poussoirs de commande étanches */}
            <rect x="338" y="161" width="10" height="9" rx="1" fill="#10B981" />
            <rect x="353" y="161" width="10" height="9" rx="1" fill="#EF4444" />
            <rect x="368" y="161" width="10" height="9" rx="1" fill="#4B5563" />

            {/* Bouton d'arrêt d'urgence coup-de-poing normalisé */}
            <circle cx="410" cy="132" r="13" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="410" cy="132" r="9" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="410" cy="132" r="4" fill="#B91C1C" />
            <text x="410" y="152" textAnchor="middle" fill="#1F2937" fontSize="6" fontWeight="bold">
              ARRÊT URGENCE
            </text>
          </g>

          {/* Grilles de refoulement d'air d'alternateur à droite */}
          <g id="exhaust-louvers">
            <rect x="280" y="198" width="145" height="42" rx="2" fill="#111827" />
            <rect x="281" y="199" width="143" height="40" rx="1" fill="url(#louverGrid)" opacity="0.9" />
          </g>

          {/* ================= MARQUAGES TECHNIQUES & LOGO VOLT ================= */}
          <g id="brand-decals">
            {/* Wordmark VOLT sur capot */}
            <rect x="135" y="165" width="75" height="28" rx="2" fill="#111827" />
            <path d="M 143 173 L 148 185 L 153 173 Z" fill="#F59E0B" />
            <text x="156" y="184" fill="#FFFFFF" fontSize="13" fontWeight="900" letterSpacing="1.5" fontFamily="sans-serif">
              VOLT
            </text>

            {/* Calibre kVA imprimé */}
            <text x="135" y="206" fill="#78350F" fontSize="11" fontWeight="bold">
              {kva} kVA DIESEL
            </text>

            {/* Plaque d'avertissement danger électrique */}
            <polygon points="445,170 465,170 455,188" fill="#FEF08A" stroke="#854D0E" strokeWidth="1" />
            <path d="M 455 174 L 452 181 L 455 181 L 454 186 L 458 180 L 455 180 Z" fill="#1E293B" />
          </g>

          {/* Bandes diagonales de sécurité sur le coin droit */}
          <rect x="475" y="90" width="15" height="170" fill="url(#hazardStripes)" opacity="0.8" />
        </g>
      </svg>

      {/* Badge technique superposé subtil */}
      <div className="absolute top-2 right-2 bg-neutral-900/90 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded border border-neutral-700/60 shadow-xs flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-semibold text-amber-400">{kva} kVA</span>
        <span className="text-neutral-400">·</span>
        <span className="text-neutral-300">ISO 8528</span>
      </div>
    </div>
  );
};

/**
 * Schéma unifilaire interactif : Réseau STEG vs Générateur VOLT avec Inverseur ATS
 */
export const StegAtsDiagram: React.FC<{ activeSource?: 'steg' | 'generator' | 'auto'; className?: string }> = ({
  activeSource = 'auto',
  className = '',
}) => {
  return (
    <div className={`p-4 bg-neutral-900 text-neutral-100 rounded-lg border border-neutral-800 ${className}`}>
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-xs font-semibold tracking-wider uppercase text-neutral-300">
            Schéma d’Inversion Automatique ATS (Grand Tunis)
          </span>
        </div>
        <span className="text-[11px] font-mono text-amber-400">Temps de basculement : &lt; 8 sec</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center text-xs">
        {/* Source 1 : STEG */}
        <div className="p-3 rounded bg-neutral-800/80 border border-neutral-700 relative">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-neutral-200">1. Réseau STEG 400V</span>
            <span className="inline-block px-1.5 py-0.5 text-[10px] rounded bg-rose-950 text-rose-300 border border-rose-800">
              Sujet aux coupures
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            Alimentation normale moyenne/basse tension. Déclenchement de l’ATS en cas de chute de tension ou délestage.
          </p>
        </div>

        {/* Cœur : Inverseur de source motorisé ATS */}
        <div className="p-3 rounded bg-amber-950/40 border border-amber-500/50 text-center relative">
          <div className="text-[11px] font-mono text-amber-400 font-bold mb-1">
            ARMOIRE ATS SCHNEIDER / COMAP
          </div>
          <div className="text-[11px] text-neutral-300 font-medium">Basculement Mécanique &amp; Électrique</div>
          <p className="text-[10px] text-neutral-400 mt-1">
            Verrouillage strict anti-retour réseau STEG. Protège les équipes techniques extérieures.
          </p>
        </div>

        {/* Source 2 : Groupe Électrogène VOLT */}
        <div className="p-3 rounded bg-neutral-800/80 border border-amber-500/60 relative">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-amber-400">2. Groupe VOLT Diesel</span>
            <span className="inline-block px-1.5 py-0.5 text-[10px] rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              100% Autonome
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            Démarrage automatique instantané, régulation AVR &plusmn;1%, reprise intégrale des charges vitales.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Composant de présentation visuelle de générateur avec photo réelle haute définition
 * et repli gracieux sur le schéma SVG vectoriel technique si nécessaire.
 */
export const GeneratorVisual: React.FC<{
  imageUrl?: string;
  kva: number;
  modelName?: string;
  isMobileTrailer?: boolean;
  className?: string;
  detailLevel?: 'card' | 'hero' | 'modal';
  alt?: string;
}> = ({
  imageUrl,
  kva,
  modelName = 'VOLT Power',
  isMobileTrailer = false,
  className = 'w-full h-full',
  detailLevel = 'card',
  alt,
}) => {
  const [hasError, setHasError] = React.useState(false);

  if (imageUrl && !hasError) {
    return (
      <div className={`relative overflow-hidden w-full h-full bg-neutral-950 group select-none ${className}`}>
        <img
          src={imageUrl}
          alt={alt || `${modelName} - Groupe électrogène diesel insonorisé ${kva} kVA`}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Dégradé d'ambiance technique pour lisibilité des badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/30 pointer-events-none" />

        {/* Badge technique superposé subtil */}
        <div className="absolute top-2.5 right-2.5 bg-neutral-900/90 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded border border-neutral-700/60 shadow-xs flex items-center gap-1.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-amber-400">{kva} kVA</span>
          <span className="text-neutral-400">·</span>
          <span className="text-neutral-300">Diesel</span>
        </div>

        {/* Indicateur photo réelle certifiée */}
        <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-neutral-300 text-[10px] font-mono px-2 py-0.5 rounded border border-neutral-800 flex items-center gap-1 pointer-events-none">
          <span className="text-amber-400 font-bold">Équipement réel</span>
          <span>·</span>
          <span>Insonorisé</span>
        </div>
      </div>
    );
  }

  return (
    <GeneratorIllustration
      kva={kva}
      modelName={modelName}
      isMobileTrailer={isMobileTrailer}
      className={className}
      detailLevel={detailLevel}
    />
  );
};

