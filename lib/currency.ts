/**
 * Currency utility for BlueStone Trust Bank
 *
 * Maps each country to its currency code, symbol, locale, and approximate
 * USD exchange rate. Rates are approximate fixed values — in a production app
 * you would replace these with live rates from an API like exchangerate.host.
 *
 * All balances are stored in USD in the database. When displaying to the user,
 * we convert using their country's rate and show the local symbol.
 */

export interface CurrencyInfo {
  code:   string  // ISO 4217 code e.g. "GBP"
  symbol: string  // e.g. "£"
  locale: string  // BCP 47 locale for Intl.NumberFormat e.g. "en-GB"
  rate:   number  // 1 USD = X local currency
  name:   string  // e.g. "British Pound"
}

/** Country name → currency info */
export const COUNTRY_CURRENCY: Record<string, CurrencyInfo> = {
  // North America
  "United States":             { code: "USD", symbol: "$",   locale: "en-US",  rate: 1,       name: "US Dollar" },
  "Canada":                    { code: "CAD", symbol: "C$",  locale: "en-CA",  rate: 1.36,    name: "Canadian Dollar" },
  "Mexico":                    { code: "MXN", symbol: "MX$", locale: "es-MX",  rate: 17.15,   name: "Mexican Peso" },

  // Europe
  "United Kingdom":            { code: "GBP", symbol: "£",   locale: "en-GB",  rate: 0.79,    name: "British Pound" },
  "Germany":                   { code: "EUR", symbol: "€",   locale: "de-DE",  rate: 0.92,    name: "Euro" },
  "France":                    { code: "EUR", symbol: "€",   locale: "fr-FR",  rate: 0.92,    name: "Euro" },
  "Italy":                     { code: "EUR", symbol: "€",   locale: "it-IT",  rate: 0.92,    name: "Euro" },
  "Spain":                     { code: "EUR", symbol: "€",   locale: "es-ES",  rate: 0.92,    name: "Euro" },
  "Portugal":                  { code: "EUR", symbol: "€",   locale: "pt-PT",  rate: 0.92,    name: "Euro" },
  "Netherlands":               { code: "EUR", symbol: "€",   locale: "nl-NL",  rate: 0.92,    name: "Euro" },
  "Belgium":                   { code: "EUR", symbol: "€",   locale: "fr-BE",  rate: 0.92,    name: "Euro" },
  "Austria":                   { code: "EUR", symbol: "€",   locale: "de-AT",  rate: 0.92,    name: "Euro" },
  "Greece":                    { code: "EUR", symbol: "€",   locale: "el-GR",  rate: 0.92,    name: "Euro" },
  "Finland":                   { code: "EUR", symbol: "€",   locale: "fi-FI",  rate: 0.92,    name: "Euro" },
  "Ireland":                   { code: "EUR", symbol: "€",   locale: "en-IE",  rate: 0.92,    name: "Euro" },
  "Luxembourg":                { code: "EUR", symbol: "€",   locale: "fr-LU",  rate: 0.92,    name: "Euro" },
  "Malta":                     { code: "EUR", symbol: "€",   locale: "en-MT",  rate: 0.92,    name: "Euro" },
  "Cyprus":                    { code: "EUR", symbol: "€",   locale: "el-CY",  rate: 0.92,    name: "Euro" },
  "Slovakia":                  { code: "EUR", symbol: "€",   locale: "sk-SK",  rate: 0.92,    name: "Euro" },
  "Slovenia":                  { code: "EUR", symbol: "€",   locale: "sl-SI",  rate: 0.92,    name: "Euro" },
  "Switzerland":               { code: "CHF", symbol: "Fr",  locale: "de-CH",  rate: 0.90,    name: "Swiss Franc" },
  "Sweden":                    { code: "SEK", symbol: "kr",  locale: "sv-SE",  rate: 10.42,   name: "Swedish Krona" },
  "Norway":                    { code: "NOK", symbol: "kr",  locale: "nb-NO",  rate: 10.55,   name: "Norwegian Krone" },
  "Denmark":                   { code: "DKK", symbol: "kr",  locale: "da-DK",  rate: 6.88,    name: "Danish Krone" },
  "Poland":                    { code: "PLN", symbol: "zł",  locale: "pl-PL",  rate: 3.95,    name: "Polish Zloty" },
  "Czech Republic":            { code: "CZK", symbol: "Kč",  locale: "cs-CZ",  rate: 22.8,    name: "Czech Koruna" },
  "Hungary":                   { code: "HUF", symbol: "Ft",  locale: "hu-HU",  rate: 356,     name: "Hungarian Forint" },
  "Romania":                   { code: "RON", symbol: "lei", locale: "ro-RO",  rate: 4.57,    name: "Romanian Leu" },
  "Bulgaria":                  { code: "BGN", symbol: "лв",  locale: "bg-BG",  rate: 1.80,    name: "Bulgarian Lev" },
  "Croatia":                   { code: "EUR", symbol: "€",   locale: "hr-HR",  rate: 0.92,    name: "Euro" },
  "Russia":                    { code: "RUB", symbol: "₽",   locale: "ru-RU",  rate: 90.5,    name: "Russian Ruble" },
  "Ukraine":                   { code: "UAH", symbol: "₴",   locale: "uk-UA",  rate: 38.9,    name: "Ukrainian Hryvnia" },
  "Turkey":                    { code: "TRY", symbol: "₺",   locale: "tr-TR",  rate: 32.5,    name: "Turkish Lira" },

  // Africa
  "Nigeria":                   { code: "NGN", symbol: "₦",   locale: "en-NG",  rate: 1550,    name: "Nigerian Naira" },
  "South Africa":              { code: "ZAR", symbol: "R",   locale: "en-ZA",  rate: 18.6,    name: "South African Rand" },
  "Kenya":                     { code: "KES", symbol: "KSh", locale: "sw-KE",  rate: 129,     name: "Kenyan Shilling" },
  "Ghana":                     { code: "GHS", symbol: "₵",   locale: "en-GH",  rate: 15.4,    name: "Ghanaian Cedi" },
  "Ethiopia":                  { code: "ETB", symbol: "Br",  locale: "am-ET",  rate: 56.5,    name: "Ethiopian Birr" },
  "Tanzania":                  { code: "TZS", symbol: "TSh", locale: "sw-TZ",  rate: 2540,    name: "Tanzanian Shilling" },
  "Uganda":                    { code: "UGX", symbol: "USh", locale: "sw-UG",  rate: 3750,    name: "Ugandan Shilling" },
  "Cameroon":                  { code: "XAF", symbol: "CFA", locale: "fr-CM",  rate: 602,     name: "Central African CFA Franc" },
  "Senegal":                   { code: "XOF", symbol: "CFA", locale: "fr-SN",  rate: 602,     name: "West African CFA Franc" },
  "Ivory Coast":               { code: "XOF", symbol: "CFA", locale: "fr-CI",  rate: 602,     name: "West African CFA Franc" },
  "Rwanda":                    { code: "RWF", symbol: "Fr",  locale: "rw-RW",  rate: 1295,    name: "Rwandan Franc" },
  "Egypt":                     { code: "EGP", symbol: "£",   locale: "ar-EG",  rate: 48.5,    name: "Egyptian Pound" },
  "Morocco":                   { code: "MAD", symbol: "د.م", locale: "ar-MA",  rate: 9.97,    name: "Moroccan Dirham" },
  "Algeria":                   { code: "DZD", symbol: "دج",  locale: "ar-DZ",  rate: 134,     name: "Algerian Dinar" },
  "Tunisia":                   { code: "TND", symbol: "د.ت", locale: "ar-TN",  rate: 3.11,    name: "Tunisian Dinar" },
  "Zimbabwe":                  { code: "ZWL", symbol: "Z$",  locale: "en-ZW",  rate: 361,     name: "Zimbabwean Dollar" },
  "Angola":                    { code: "AOA", symbol: "Kz",  locale: "pt-AO",  rate: 840,     name: "Angolan Kwanza" },
  "Zambia":                    { code: "ZMW", symbol: "ZK",  locale: "en-ZM",  rate: 26.7,    name: "Zambian Kwacha" },
  "Mozambique":                { code: "MZN", symbol: "MT",  locale: "pt-MZ",  rate: 63.9,    name: "Mozambican Metical" },
  "Botswana":                  { code: "BWP", symbol: "P",   locale: "en-BW",  rate: 13.6,    name: "Botswana Pula" },
  "Namibia":                   { code: "NAD", symbol: "N$",  locale: "en-NA",  rate: 18.6,    name: "Namibian Dollar" },
  "Mauritius":                 { code: "MUR", symbol: "₨",   locale: "en-MU",  rate: 44.8,    name: "Mauritian Rupee" },

  // Asia
  "India":                     { code: "INR", symbol: "₹",   locale: "en-IN",  rate: 83.5,    name: "Indian Rupee" },
  "China":                     { code: "CNY", symbol: "¥",   locale: "zh-CN",  rate: 7.24,    name: "Chinese Yuan" },
  "Japan":                     { code: "JPY", symbol: "¥",   locale: "ja-JP",  rate: 149,     name: "Japanese Yen" },
  "South Korea":               { code: "KRW", symbol: "₩",   locale: "ko-KR",  rate: 1330,    name: "South Korean Won" },
  "Indonesia":                 { code: "IDR", symbol: "Rp",  locale: "id-ID",  rate: 15600,   name: "Indonesian Rupiah" },
  "Pakistan":                  { code: "PKR", symbol: "₨",   locale: "ur-PK",  rate: 278,     name: "Pakistani Rupee" },
  "Bangladesh":                { code: "BDT", symbol: "৳",   locale: "bn-BD",  rate: 109.5,   name: "Bangladeshi Taka" },
  "Vietnam":                   { code: "VND", symbol: "₫",   locale: "vi-VN",  rate: 24500,   name: "Vietnamese Dong" },
  "Thailand":                  { code: "THB", symbol: "฿",   locale: "th-TH",  rate: 35.1,    name: "Thai Baht" },
  "Malaysia":                  { code: "MYR", symbol: "RM",  locale: "ms-MY",  rate: 4.72,    name: "Malaysian Ringgit" },
  "Singapore":                 { code: "SGD", symbol: "S$",  locale: "en-SG",  rate: 1.34,    name: "Singapore Dollar" },
  "Philippines":               { code: "PHP", symbol: "₱",   locale: "en-PH",  rate: 56.4,    name: "Philippine Peso" },
  "Taiwan":                    { code: "TWD", symbol: "NT$", locale: "zh-TW",  rate: 31.9,    name: "New Taiwan Dollar" },
  "Hong Kong":                 { code: "HKD", symbol: "HK$", locale: "zh-HK",  rate: 7.82,    name: "Hong Kong Dollar" },
  "Sri Lanka":                 { code: "LKR", symbol: "Rs",  locale: "si-LK",  rate: 305,     name: "Sri Lankan Rupee" },
  "Nepal":                     { code: "NPR", symbol: "Rs",  locale: "ne-NP",  rate: 133.5,   name: "Nepalese Rupee" },
  "Saudi Arabia":              { code: "SAR", symbol: "﷼",   locale: "ar-SA",  rate: 3.75,    name: "Saudi Riyal" },
  "UAE":                       { code: "AED", symbol: "د.إ", locale: "ar-AE",  rate: 3.67,    name: "UAE Dirham" },
  "Kuwait":                    { code: "KWD", symbol: "د.ك", locale: "ar-KW",  rate: 0.307,   name: "Kuwaiti Dinar" },
  "Qatar":                     { code: "QAR", symbol: "﷼",   locale: "ar-QA",  rate: 3.64,    name: "Qatari Riyal" },
  "Bahrain":                   { code: "BHD", symbol: ".د.ب",locale: "ar-BH",  rate: 0.376,   name: "Bahraini Dinar" },
  "Oman":                      { code: "OMR", symbol: "﷼",   locale: "ar-OM",  rate: 0.385,   name: "Omani Rial" },
  "Jordan":                    { code: "JOD", symbol: "د.ا", locale: "ar-JO",  rate: 0.709,   name: "Jordanian Dinar" },
  "Israel":                    { code: "ILS", symbol: "₪",   locale: "he-IL",  rate: 3.72,    name: "Israeli Shekel" },
  "Iran":                      { code: "IRR", symbol: "﷼",   locale: "fa-IR",  rate: 42000,   name: "Iranian Rial" },
  "Iraq":                      { code: "IQD", symbol: "ع.د", locale: "ar-IQ",  rate: 1310,    name: "Iraqi Dinar" },

  // Oceania
  "Australia":                 { code: "AUD", symbol: "A$",  locale: "en-AU",  rate: 1.53,    name: "Australian Dollar" },
  "New Zealand":               { code: "NZD", symbol: "NZ$", locale: "en-NZ",  rate: 1.63,    name: "New Zealand Dollar" },
  "Fiji":                      { code: "FJD", symbol: "FJ$", locale: "en-FJ",  rate: 2.25,    name: "Fijian Dollar" },

  // South America
  "Brazil":                    { code: "BRL", symbol: "R$",  locale: "pt-BR",  rate: 4.97,    name: "Brazilian Real" },
  "Argentina":                 { code: "ARS", symbol: "$",   locale: "es-AR",  rate: 870,     name: "Argentine Peso" },
  "Chile":                     { code: "CLP", symbol: "$",   locale: "es-CL",  rate: 940,     name: "Chilean Peso" },
  "Colombia":                  { code: "COP", symbol: "$",   locale: "es-CO",  rate: 3900,    name: "Colombian Peso" },
  "Peru":                      { code: "PEN", symbol: "S/",  locale: "es-PE",  rate: 3.72,    name: "Peruvian Sol" },
  "Venezuela":                 { code: "VES", symbol: "Bs",  locale: "es-VE",  rate: 36.5,    name: "Venezuelan Bolivar" },
  "Ecuador":                   { code: "USD", symbol: "$",   locale: "es-EC",  rate: 1,       name: "US Dollar" },
  "Bolivia":                   { code: "BOB", symbol: "Bs",  locale: "es-BO",  rate: 6.91,    name: "Bolivian Boliviano" },
  "Paraguay":                  { code: "PYG", symbol: "₲",   locale: "es-PY",  rate: 7290,    name: "Paraguayan Guarani" },
  "Uruguay":                   { code: "UYU", symbol: "$U",  locale: "es-UY",  rate: 38.6,    name: "Uruguayan Peso" },
}

/** Default fallback — USD */
const USD: CurrencyInfo = { code: "USD", symbol: "$", locale: "en-US", rate: 1, name: "US Dollar" }

/** Get currency info for a country, falls back to USD */
export function getCurrency(country: string): CurrencyInfo {
  return COUNTRY_CURRENCY[country] ?? USD
}

/**
 * Format a USD amount in the user's local currency.
 * The balance is stored in USD — we multiply by the exchange rate to display locally.
 *
 * @param usdAmount  The amount stored in the database (in USD)
 * @param country    The user's country string
 * @param options    Optional: { showCode: true } appends the currency code e.g. "£7.90 GBP"
 */
export function formatCurrency(
  usdAmount: number,
  country: string,
  options?: { showCode?: boolean; hidePlus?: boolean; prefix?: "+" | "-" | "" }
): string {
  const c = getCurrency(country)
  const localAmount = usdAmount * c.rate

  // Use Intl.NumberFormat for proper locale formatting
  const formatted = new Intl.NumberFormat(c.locale, {
    style:                 "currency",
    currency:              c.code,
    minimumFractionDigits: localAmount >= 1000 ? 0 : 2,
    maximumFractionDigits: localAmount >= 1000 ? 0 : 2,
  }).format(localAmount)

  const prefix = options?.prefix ?? ""
  const suffix = options?.showCode ? ` ${c.code}` : ""
  return `${prefix}${formatted}${suffix}`
}

/**
 * Get the signup bonus amount in local currency.
 * Base bonus is $10 USD converted at the country's rate.
 */
export function getSignupBonus(country: string): number {
  const c = getCurrency(country)
  return parseFloat((10 * c.rate).toFixed(2))
}

/**
 * Format just the bonus display string e.g. "£7.90" or "₦15,500"
 */
export function formatBonus(country: string): string {
  return formatCurrency(10, country)
}
