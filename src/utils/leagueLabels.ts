import { normalizeGenderForFilter } from './rankingsPageFilters'

const COUNTRY_LOCATIVE: Record<string, string> = {
  Türkiye: "Türkiye'de",
  Almanya: "Almanya'da",
  'Amerika Birleşik Devletleri': "Amerika Birleşik Devletleri'nde",
  İngiltere: "İngiltere'de",
  Fransa: "Fransa'da",
  İtalya: "İtalya'da",
  Hollanda: "Hollanda'da",
  Azerbaycan: "Azerbaycan'da",
  İspanya: "İspanya'da",
  Rusya: "Rusya'da",
  Japonya: "Japonya'da",
}

const CITY_LOCATIVE: Record<string, string> = {
  İstanbul: "İstanbul'da",
  Ankara: "Ankara'da",
  İzmir: "İzmir'de",
  Bursa: "Bursa'da",
  Antalya: "Antalya'da",
  Berlin: "Berlin'de",
  Münih: "Münih'te",
  Hamburg: "Hamburg'da",
  Frankfurt: "Frankfurt'ta",
  Köln: "Köln'de",
  'New York': "New York'ta",
  'Los Angeles': "Los Angeles'ta",
}

/** Meslek → “…lar arasında” (dinamik + bilinen kalıplar) */
const PROFESSION_AMONG: Record<string, string> = {
  avukat: 'Avukatlar arasında',
  aşçı: 'Aşçılar arasında',
  bankacı: 'Bankacılar arasında',
  berber: 'Berberler arasında',
  biyolog: 'Biyologlar arasında',
  doktor: 'Doktorlar arasında',
  eczacı: 'Eczacılar arasında',
  emlakçı: 'Emlakçılar arasında',
  emekli: 'Emekliler arasında',
  'ev hanımı': 'Ev hanımları arasında',
  esnaf: 'Esnaf arasında',
  'finans uzmanı': 'Finans uzmanları arasında',
  gazeteci: 'Gazeteciler arasında',
  girişimci: 'Girişimciler arasında',
  'grafik tasarımcı': 'Grafik tasarımcılar arasında',
  hemşire: 'Hemşireler arasında',
  'insan kaynakları uzmanı': 'İnsan kaynakları uzmanları arasında',
  işletmeci: 'İşletmeciler arasında',
  kasiyer: 'Kasiyerler arasında',
  kuaför: 'Kuaförler arasında',
  kurye: 'Kuryeler arasında',
  memur: 'Memurlar arasında',
  mimar: 'Mimarlar arasında',
  mühendis: 'Mühendisler arasında',
  müzisyen: 'Müzisyenler arasında',
  muhasebeci: 'Muhasebeciler arasında',
  öğrenci: 'Öğrenciler arasında',
  öğretmen: 'Öğretmenler arasında',
  pazarlamacı: 'Pazarlamacılar arasında',
  pilot: 'Pilotlar arasında',
  polis: 'Polisler arasında',
  psikolog: 'Psikologlar arasında',
  'satış temsilcisi': 'Satış temsilcileri arasında',
  'serbest meslek': 'Serbest meslek sahipleri arasında',
  'sosyal medya uzmanı': 'Sosyal medya uzmanları arasında',
  şoför: 'Şoförler arasında',
  tasarımcı: 'Tasarımcılar arasında',
  teknisyen: 'Teknisyenler arasında',
  turizm: 'Turizm sektöründe çalışanlar arasında',
  veteriner: 'Veterinerler arasında',
  yazar: 'Yazarlar arasında',
  yazılımcı: 'Yazılımcılar arasında',
  'ziraat mühendisi': 'Ziraat mühendisleri arasında',
  kullanıcı: 'Kullanıcılar arasında',
  platform: 'Platform kullanıcıları arasında',
}

function lastBackVowel(text: string): 'a' | 'e' | 'ı' | 'i' | 'o' | 'ö' | 'u' | 'ü' {
  const vowels = 'aıoueöüi'
  for (let i = text.length - 1; i >= 0; i--) {
    const c = text[i].toLocaleLowerCase('tr')
    if (vowels.includes(c)) {
      return c as 'a' | 'e' | 'ı' | 'i' | 'o' | 'ö' | 'u' | 'ü'
    }
  }
  return 'a'
}

function usesLerSuffix(v: string): boolean {
  return v === 'e' || v === 'i' || v === 'ö' || v === 'ü'
}

/** Ülke / şehir için -de/-da/-te/-ta */
export function toLocativeLabel(place: string): string {
  const trimmed = place.trim()
  if (!trimmed) return ''

  const v = lastBackVowel(trimmed)
  const last = trimmed.slice(-1).toLocaleLowerCase('tr')
  const suffix = usesLerSuffix(v) ? 'de' : 'da'

  if (last === 'k' || last === 'p' || last === 'ç' || last === 't') {
    const ta = usesLerSuffix(v) ? 'te' : 'ta'
    return `${trimmed}'${ta}`
  }

  return `${trimmed}'${suffix}`
}

export function countryContextLine(country: string): string {
  return COUNTRY_LOCATIVE[country] ?? toLocativeLabel(country)
}

export function cityContextLine(city: string): string {
  return CITY_LOCATIVE[city] ?? toLocativeLabel(city)
}

function pluralizeAmong(base: string): string {
  const trimmed = base.trim()
  const lower = trimmed.toLocaleLowerCase('tr')
  const v = lastBackVowel(trimmed)
  const pluralSuffix = usesLerSuffix(v) ? 'ler' : 'lar'

  if (/(lar|ler)$/.test(lower)) {
    return `${trimmed} arasında`
  }

  if (lower.endsWith('cı') || lower.endsWith('ci') || lower.endsWith('çu')) {
    return `${trimmed}${pluralSuffix} arasında`
  }

  if (lower.endsWith('i') || lower.endsWith('ı')) {
    const stem = trimmed.slice(0, -1)
    const iSuffix = usesLerSuffix(v) ? 'iler' : 'ılar'
    return `${stem}${iSuffix} arasında`
  }

  if (lower.endsWith('e')) {
    return `${trimmed}${usesLerSuffix(v) ? 'ler' : 'lar'} arasında`
  }

  return `${trimmed}${pluralSuffix} arasında`
}

export function professionContextLine(profession: string): string {
  const key = profession.trim().toLocaleLowerCase('tr')
  return PROFESSION_AMONG[key] ?? pluralizeAmong(profession)
}

export function ageGroupContextLine(ageGroup: string): string {
  return `${ageGroup} yaş grubunda`
}

export function genderContextLine(gender: string): string {
  const normalized = normalizeGenderForFilter(gender)
  if (normalized === 'Erkek') return 'Erkekler arasında'
  if (normalized === 'Kadın') return 'Kadınlar arasında'
  return 'Diğerler arasında'
}

export function maritalContextLine(maritalStatus: string): string {
  const s = maritalStatus.trim()
  if (s === 'Evli') return 'Evliler arasında'
  if (s === 'Bekar') return 'Bekarlar arasında'
  return pluralizeAmong(s)
}

export function formatRankLine(rank: number): string {
  return `${rank}. sıradasın`
}
