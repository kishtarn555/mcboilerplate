const LANGUAGE = {
    id_ID: "id_ID",
    da_DK: "da_DK",
    de_DE: "de_DE",
    en_GB: "en_GB",
    en_US: "en_US",
    es_ES: "es_ES",
    es_MX: "es_MX",
    fr_CA: "fr_CA",
    fr_FR: "fr_FR",
    it_IT: "it_IT",
    hu_HU: "hu_HU",
    nl_NL: "nl_NL",
    nb_NO: "nb_NO",
    pl_PL: "pl_PL",
    pt_BR: "pt_BR",
    pt_PT: "pt_PT",
    sk_SK: "sk_SK",
    fi_FI: "fi_FI",
    sv_SE: "sv_SE",
    tr_TR: "tr_TR",
    cs_CZ: "cs_CZ",
    el_GR: "el_GR",
    bg_BG: "bg_BG",
    ru_RU: "ru_RU",
    uk_UA: "uk_UA",
    ja_JP: "ja_JP",
    zh_CN: "zh_CN",
    zh_TW: "zh_TW",
    ko_KR: "ko_KR"
} as const;

type LANGUAGE =  typeof LANGUAGE[keyof typeof LANGUAGE];


export type TranslatableEntity = {
    translationKey: string
    translations: {
        en_US: string;
    } & Partial<Record<Exclude<LANGUAGE, "en_US">, string>> & {
        [custom: string]: string; // allow custom languages
    };
}