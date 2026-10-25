import type { CategoryKey } from './categories';
export type Locale = 'en' | 'fr';
export const messages = {
  en: {
    languages: 'Reading language',
    unavailable: 'No current French translation.',
    selection: 'French selection',
    search: 'Search',
    searchLabel: 'Search Pulse',
    homeLabel: 'The Daily AI Pulse home',
    tagline: 'Ideas Tools People Impact',
    themeToggleLabel: 'Toggle theme',
    settings: 'Settings',
    appearance: 'Appearance',
    themeMode: 'Theme mode',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
  },
  fr: {
    languages: 'Langue de lecture',
    unavailable: 'Aucune traduction française à jour.',
    selection: 'Sélection en français',
    search: 'Rechercher (en anglais)',
    searchLabel: 'Rechercher dans les articles en anglais',
    homeLabel: 'The Daily AI Pulse — sélection en français',
    tagline: 'Idées Outils Équipes Impact',
    themeToggleLabel: 'Changer de thème',
    settings: 'Paramètres',
    appearance: 'Apparence',
    themeMode: 'Mode de thème',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    themeSystem: 'Système',
  },
} satisfies Record<Locale, Record<string, string>>;
export const frenchCategories: Record<CategoryKey, string> = {
  models: 'Modèles et nouveautés',
  research: 'Recherche',
  engineering: 'Ingénierie de l’IA',
  tools: 'Outils de développement',
  practice: 'L’IA en pratique',
  workflows: 'Méthodes de travail',
  business: 'Entreprises et secteur',
  curious: 'Curiosités de l’IA',
};
export const frenchLabels = {
  pulse: 'Brève',
  briefing: 'Synthèse',
  'deep-dive': 'Analyse approfondie',
  strong: 'Solides',
  primary: 'Source primaire',
  preliminary: 'Préliminaires',
  anecdotal: 'Anecdotiques',
  unverified: 'Non vérifiées',
  low: 'Faible',
  medium: 'Moyen',
  high: 'Élevé',
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
};
export const frenchDate = (date: Date) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
