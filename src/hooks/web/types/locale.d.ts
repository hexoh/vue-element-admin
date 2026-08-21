export interface Language {
  el: Recordable
  name: string
}

export interface LocaleEntry {
  lang: LocaleType
  name?: string
  elLocale?: Language
}
