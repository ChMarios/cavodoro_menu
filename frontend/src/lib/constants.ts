// src/lib/constants.ts

export const MENU_STRUCTURE: { 
  [key: string]: { 
    label: string; 
    subcategories: { el: string; en: string }[] 
  } 
} = {
  BREAD: { 
    label: "ΑΡΤΟΣ | BREAD", subcategories: [] 
  },
  APPETIZERS: {
    label: "ΟΡΕΚΤΙΚΑ | STARTERS",
    subcategories: [
      { el: "ΚΡΥΑ", en: "COLD" },
      { el: "ΖΕΣΤΑ", en: "HOT" }
    ]
  },
  SALADS: { label: "ΣΑΛΑΤΕΣ | SALADS", subcategories: [] },
  SOUPS: { label: "ΣΟΥΠΕΣ | SOUPS", subcategories: [] },
  VEGETERIANS: { label: "ΓΙΑ ΧΟΡΤΟΦΑΓΟΥΣ | FOR VEGETERIANS", subcategories: [] },
  FRIED: { label: "ΤΗΓΑΝΗΤΑ | FRIED", subcategories: [] },
  PASTA: { label: "ΖΥΜΑΡΙΚΑ | PASTA", subcategories: [] },
  MAIN_COURSES: {
    label: "ΚΥΡΙΩΣ ΠΙΑΤΑ | MAIN COURSES",
    subcategories: [
      { el: "ΚΡΕΑΤΙΚΑ ΚΟΚΚΙΝΙΣΤΑ", en: "MEAT IN TOMATO SAUCE" },
      { el: "ΚΡΕΑΤΙΚΑ ΛΕΜΟΝΑΤΑ", en: "MEAT IN LEMON SAUCE" },
      { el: "ΚΙΜΑΔΕΣ", en: "MINCED MEAT" },
      { el: "ΘΑΛΛΑΣΙΝΑ ΜΕ ΣΑΛΤΣΑ ΝΤΟΜΑΤΑΣ", en: "SEA FOOD IN TOMATO SAUCE" },
      { el: "ΘΑΛΛΑΣΙΝΑ ΞΥΔΑΤΑ", en: "SEA FOOD IN VINEGAR" }
    ]
  },
  TRADITIONAL_DISHES: { label: "ΠΑΡΑΔΟΣΙΑΚΑ ΠΙΑΤΑ | TRADITIONAL DISHES", subcategories: [] },
  SPECIAL_DISHES: { label: "ΙΔΙΑΙΤΕΡΑ ΠΙΑΤΑ | SPECIAL DISHES", subcategories: [] },
  GRILLED: {
    label: "ΨΗΤΑ ΤΗΣ ΩΡΑΣ | GRILLED",
    subcategories: [
      { el: "ΚΡΕΑΤΙΚΑ", en: "MEAT" },
      { el: "ΣΟΥΒΛΑΣ", en: "ROASTED ON A SPIT" },
      { el: "ΘΑΛΑΣΣΙΝΑ ΜΕ ΤΟ ΚΙΛΟ", en: "FRESH FISH PER KILO" },
      { el: "ΘΑΛΑΣΣΙΝΑ ΜΕΡΙΔΑ", en: "FRESH FISH PER PORTION" }
    ]
  },
  SOFT_DRINKS: { label: "ΑΝΑΨΥΚΤΙΚΑ-ΝΕΡΑ | SOFT DRINKS", subcategories: [] },
  BEERS: { label: "ΜΠΥΡΕΣ | BEERS", subcategories: [] },
  ALCHOHOLIC: { label: "ΑΛΚΟΟΛΟΥΧΑ ΠΟΤΑ | ALCHOHOLIC BEVERAGE", subcategories: [] },
  WINES: {
    label: "ΚΡΑΣΙΑ | WINES",
    subcategories: [
      { el: "ΛΕΥΚΑ", en: "WHITE" },
      { el: "ΕΡΥΘΡΑ", en: "RED" },
      { el: "ΡΟΖΕ", en: "ROSE" },
      { el: "ΗΜΙΓΛΥΚΟΣ", en: "SEMI-SWEET WINE" }
    ]
  },
  COFFEE: { label: "ΚΑΦΕΔΕΣ | COFFEES", subcategories: [] },
  EXTRA: { label: "ΕΞΤΡΑ ΧΡΕΩΣΕΙΣ | EXTRA CHARGES", subcategories: [] }
};

export const CATEGORY_ORDER = Object.keys(MENU_STRUCTURE);