// import { i18nInstance as i18n  } from "@loopring-web/component-lib/static-resource"
import i18n from 'i18next';

const covertLocale = (rawLocale: string = i18n.language) => {
    return rawLocale.replace('_', '-')
}

export function getLocaleDtFromTs(ts: number | string, locale: string = i18n.language) {
    if (typeof(ts) === 'string') {
        ts = parseInt(ts)
    }
    const dt = new Date(ts).toLocaleString(covertLocale(locale))
    return dt
}

export function getLocaleDt(dt?: Date, locale: string = i18n.language) {
    if (dt) {
        return dt.toLocaleString(covertLocale(locale))
    }
    return ''
}

export function getContactInfo(subject: string = 'report to loopring website', body: string ='Body Content') {
    const email = process.env.CONTACT_US_EMAIL ?? 'contact@loopring.io'
    return `mailto:${email}?subject=${subject}&body=${body}`
}