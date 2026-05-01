import { useLang } from '../context/LangContext'
import styles from './LangSwitcher.module.css'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ka', label: 'KA' },
  { code: 'ru', label: 'RU' },
]

export default function LangSwitcher() {
  const { lang, setLang } = useLang()
  return (
    <div className={styles.wrap}>
      {LANGS.map(l => (
        <button
          key={l.code}
          className={`${styles.btn} ${lang === l.code ? styles.active : ''}`}
          onClick={() => setLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
