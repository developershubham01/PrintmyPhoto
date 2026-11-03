import type { CountryInfo, PhotoSizeOption } from "@/types/editor";

/**
 * Reference catalogue of passport / visa / ID photo sizes.
 *
 * IMPORTANT INTEGRITY NOTES
 * - Sizes below are widely published reference values for common document types.
 * - Requirements differ per document, application channel and authority, and they
 *   change over time. Every entry must be verified against the issuing authority
 *   before use. This catalogue is a printing aid, not official guidance.
 * - `sources` link to official government pages where a stable, well-known URL
 *   exists. We never fabricate requirements or invent sources.
 */

function size(
  id: string,
  label: string,
  widthMm: number,
  heightMm: number,
  extra?: Partial<PhotoSizeOption>,
): PhotoSizeOption {
  return { id, label, widthMm, heightMm, countryId: null, ...extra };
}

export const COUNTRIES: CountryInfo[] = [
  {
    id: "united-states",
    name: "United States",
    flag: "🇺🇸",
    region: "Americas",
    sizes: [
      size("us-passport", "U.S. Passport & Visa", 50.8, 50.8, {
        note: "2 × 2 inches square. Head height and eye-line rules apply — verify at travel.state.gov.",
        popular: true,
      }),
      size("us-2x2-visa", "U.S. Visa / DV Lottery", 50.8, 50.8, {
        note: "Same 2 × 2 in format; digital submission has its own rules.",
      }),
    ],
    sources: [
      {
        label: "U.S. Department of State — passport photo requirements",
        url: "https://travel.state.gov/content/travel/en/passports/requirements/photos.html",
      },
    ],
  },
  {
    id: "united-kingdom",
    name: "United Kingdom",
    flag: "🇬🇧",
    region: "Europe",
    sizes: [
      size("uk-passport", "UK Passport", 35, 45, {
        note: "45 mm tall × 35 mm wide, plain light-grey background, biometric rules apply.",
        popular: true,
      }),
      size("uk-visa", "UK Visa & Immigration", 35, 45, {
        note: "Digital upload accepted for most applications — check UKVI guidance.",
      }),
    ],
    sources: [
      { label: "GOV.UK — passport photo rules", url: "https://www.gov.uk/photos-passports" },
    ],
  },
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    region: "Asia",
    sizes: [
      size("in-passport", "Indian Passport", 35, 45, {
        note: "Widely used 35 × 45 mm print size for Indian passport applications.",
        popular: true,
      }),
      size("in-oci-visa", "OCI / Visa applications", 51, 51, {
        note: "2 × 2 inch square commonly requested for OCI and certain visa/consular services.",
        popular: true,
      }),
      size("in-stamp", "Stamp size (general ID use)", 20, 25, {
        note: "Common stamp size for local forms and IDs — not a passport size.",
      }),
    ],
    sources: [
      { label: "Passport Seva (Ministry of External Affairs)", url: "https://www.passportindia.gov.in" },
    ],
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    region: "Americas",
    sizes: [
      size("ca-passport", "Canadian Passport", 50, 70, {
        note: "50 × 70 mm; photographer and date details are required on the back — see official rules.",
        popular: true,
      }),
    ],
    sources: [
      {
        label: "Government of Canada — passport photo requirements",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html",
      },
    ],
  },
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    region: "Oceania",
    sizes: [
      size("au-passport", "Australian Passport", 35, 45, {
        note: "35 × 45 mm with plain light background and biometric guidance.",
        popular: true,
      }),
    ],
    sources: [
      { label: "Australian Passports Office", url: "https://www.passports.gov.au" },
    ],
  },
  {
    id: "schengen-eu",
    name: "Schengen / EU (visa)",
    flag: "🇪🇺",
    region: "Europe",
    sizes: [
      size("eu-visa", "Schengen visa photo", 35, 45, {
        note: "Common ICAO-style 35 × 45 mm format used for Schengen visa applications.",
        popular: true,
      }),
    ],
    sources: [
      {
        label: "European Commission — visa requirements",
        url: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en",
      },
    ],
  },
  {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
    region: "Europe",
    sizes: [
      size("de-biometric", "Biometric passport / ID", 35, 45, {
        note: "35 × 45 mm biometric format with face-height rules (Bundesdruckerei guidance).",
      }),
    ],
    sources: [{ label: "Bundesdruckerei photo rules", url: "https://www.bundesdruckerei.de" }],
  },
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    region: "Europe",
    sizes: [
      size("fr-passport", "Passport / national ID", 35, 45, {
        note: "35 × 45 mm; e-photo (photo signature numérique) rules may apply for French applications.",
      }),
    ],
    sources: [{ label: "Service-Public.fr — passport", url: "https://www.service-public.fr" }],
  },
  {
    id: "china",
    name: "China",
    flag: "🇨🇳",
    region: "Asia",
    sizes: [
      size("cn-passport", "Chinese Passport", 33, 48, {
        note: "33 × 48 mm is the commonly published passport photo size.",
      }),
      size("cn-visa", "Chinese Visa (2 inch)", 33, 48, {
        note: "33 × 48 mm; some visa channels request 2-inch photos — verify with the embassy.",
      }),
    ],
    sources: [
      { label: "National Immigration Administration", url: "https://www.nia.gov.cn" },
    ],
  },
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    region: "Asia",
    sizes: [
      size("jp-passport", "Japanese Passport", 35, 45, {
        note: "35 × 45 mm; head height 32–36 mm per MOFA guidance.",
      }),
    ],
    sources: [{ label: "MOFA Japan — passport photos", url: "https://www.mofa.go.jp" }],
  },
  {
    id: "south-korea",
    name: "South Korea",
    flag: "🇰🇷",
    region: "Asia",
    sizes: [
      size("kr-passport", "Korean Passport", 35, 45, {
        note: "35 × 45 mm standard for passport applications.",
      }),
    ],
    sources: [{ label: "Korea Passport (Ministry of Foreign Affairs)", url: "https://www.passport.go.kr" }],
  },
  {
    id: "singapore",
    name: "Singapore",
    flag: "🇸🇬",
    region: "Asia",
    sizes: [
      size("sg-passport", "Singapore Passport", 35, 45, {
        note: "35 × 45 mm digital-photo rules via ICA FILEX — check ICA guidance.",
      }),
    ],
    sources: [{ label: "Singapore ICA — photo guidelines", url: "https://www.ica.gov.sg" }],
  },
  {
    id: "malaysia",
    name: "Malaysia",
    flag: "🇲🇾",
    region: "Asia",
    sizes: [
      size("my-passport", "Malaysian Passport", 35, 50, {
        note: "35 × 50 mm is the commonly published passport photo size.",
      }),
    ],
    sources: [{ label: "Jabatan Imigresen Malaysia", url: "https://www.imi.gov.my" }],
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    region: "Middle East",
    sizes: [
      size("ae-passport", "UAE Passport / Emirates ID", 43, 55, {
        note: "43 × 55 mm commonly published for UAE documents — verify with ICP.",
      }),
    ],
    sources: [{ label: "UAE ICP", url: "https://icp.gov.ae" }],
  },
  {
    id: "russia",
    name: "Russia",
    flag: "🇷🇺",
    region: "Europe",
    sizes: [
      size("ru-passport", "Russian Passport", 35, 45, {
        note: "35 × 45 mm standard for internal and international passports.",
      }),
    ],
    sources: [{ label: "MVD of Russia — passport services", url: "https://гувм.мвд.рф" }],
  },
  {
    id: "philippines",
    name: "Philippines",
    flag: "🇵🇭",
    region: "Asia",
    sizes: [
      size("ph-passport", "Philippine Passport", 35, 45, {
        note: "35 × 45 mm per DFA passport guidelines.",
      }),
    ],
    sources: [{ label: "DFA Philippines — passport requirements", url: "https://www.philippine-passport.com" }],
  },
  {
    id: "thailand",
    name: "Thailand",
    flag: "🇹🇭",
    region: "Asia",
    sizes: [
      size("th-passport", "Thai Passport", 35, 45, {
        note: "3.5 × 4.5 cm standard passport photo size.",
      }),
    ],
    sources: [{ label: "Thai Consular Department", url: "https://consular.mfa.go.th" }],
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    flag: "🇳🇿",
    region: "Oceania",
    sizes: [
      size("nz-passport", "New Zealand Passport", 35, 45, {
        note: "35 × 45 mm; check Te Aka Taiwhiwhio / passports.govt.nz for current rules.",
      }),
    ],
    sources: [{ label: "New Zealand Passports", url: "https://www.passports.govt.nz" }],
  },
];

/** Generic sizes not tied to one country. */
export const GENERIC_SIZES: PhotoSizeOption[] = [
  size("gen-35x45", "International 35 × 45 mm", 35, 45, {
    note: "The most common international passport format (ICAO-style).",
    popular: true,
  }),
  size("gen-51x51", "Square 2 × 2 inch (51 × 51 mm)", 50.8, 50.8, {
    note: "Square format used by several consular services.",
    popular: true,
  }),
  size("gen-30x40", "30 × 40 mm (3 × 4 cm)", 30, 40, {
    note: "Common general-purpose ID photo size in several countries.",
  }),
  size("gen-25x35", "25 × 35 mm", 25, 35, {
    note: "Smaller ID / application photo size.",
  }),
];

export const ALL_COUNTRIES: CountryInfo[] = [
  ...COUNTRIES,
  {
    id: "generic",
    name: "International / Generic",
    flag: "🌍",
    region: "Universal",
    sizes: GENERIC_SIZES,
    sources: [],
    note: "Generic reference sizes for general-purpose printing.",
  },
];

export function findCountry(id: string | null | undefined): CountryInfo | undefined {
  if (!id) return undefined;
  return ALL_COUNTRIES.find((c) => c.id === id);
}

export function countrySizes(id: string): PhotoSizeOption[] {
  return findCountry(id)?.sizes ?? [];
}

export const POPULAR_SIZES: PhotoSizeOption[] = ALL_COUNTRIES.flatMap((c) => c.sizes).filter(
  (s) => s.popular,
);

export const DEFAULT_SIZE: PhotoSizeOption = GENERIC_SIZES[0]; // 35 × 45 mm
