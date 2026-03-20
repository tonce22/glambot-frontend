import { createContext, useContext, useState } from 'react'

const LangContext = createContext()

// ── TRANSLATIONS ──────────────────────────────────────────
// Georgian text is marked with [KA: ...] — replace with correct text
export const T = {
  en: {
    // Nav
    nav: { about: 'About', services: 'Services', gallery: 'Gallery', contact: 'Contact', login: 'Login' },
    // Hero
    hero: {
      tag: 'Wedding & Event Cinema',
      h1a: 'Capture Your',
      h1em: 'Glamour',
      h1b: 'in Motion',
      sub: 'Professional Glambot slow-motion video services for weddings and events across Georgia. Unforgettable moments, beautifully preserved forever.',
      btn1: 'View Services',
      btn2: 'Book Now',
    },
    // About
    about: {
      tag: 'About Us',
      h: 'The Art of',
      hem: 'Slow Motion',
      frame: 'Slow Motion Magic',
      p1: 'Glambot Georgia brings the Hollywood-style slow motion experience to your most precious celebrations. We specialise in capturing those fleeting, magical moments — a twirl of a dress, a burst of confetti, the first dance.',
      p2: 'As an Individual Entrepreneur, we offer a personal, dedicated service tailored to every client. Your celebration is unique, and your Glambot video should be too.',
      events: 'Events',
      slowmo: 'Slow Motion',
      res: 'Resolution',
    },
    // Services
    services: {
      tag: 'What We Offer',
      h: 'Our',
      hem: 'Services',
      price: 'Contact for pricing →',
      s1: { name: 'Wedding Glambot', desc: 'Full day coverage with our signature Glambot setup. Ceremony, reception, and all the beautiful moments in between.' },
      s2: { name: 'Event Coverage', desc: 'Corporate events, birthdays, and private parties. Bring the slow-motion magic to any celebration.' },
      s3: { name: 'Highlight Reel', desc: 'Professionally edited slow motion highlight video delivered within 48 hours. A keepsake for life.' },
    },
    // Gallery
    gallery: {
      tag: 'Our Work',
      h: 'Moments',
      hem: 'Frozen in Time',
      items: ['Wedding Reel 2024', 'First Dance', 'Bouquet Toss', 'Reception Magic', 'Celebrations'],
    },
    // Contact
    contact: {
      tag: 'Get in Touch',
      h: 'Book Your',
      hem: 'Glambot',
      p: 'Ready to add cinematic slow motion to your special day? Get in touch to check availability and discuss your event.',
      phone: 'Phone',
      owner: 'Owner',
      location: 'Location',
      loc: 'Georgia',
    },
    // Footer
    footer: {
      copy: '© 2025 Tezo Tabidze · Individual Entrepreneur',
      admin: 'Admin →',
    },
  },

  // ── GEORGIAN ─────────────────────────────────────────────
  // [KA: placeholder] = replace with correct Georgian text
  ka: {
    nav: {
      about: '[KA: ჩვენს შესახებ]',
      services: '[KA: სერვისები]',
      gallery: '[KA: გალერეა]',
      contact: '[KA: კონტაქტი]',
      login: '[KA: შესვლა]',
    },
    hero: {
      tag: '[KA: ქორწილი და ღონისძიებები]',
      h1a: '[KA: შეინახე შენი]',
      h1em: '[KA: სილამაზე]',
      h1b: '[KA: მოძრაობაში]',
      sub: '[KA: პროფესიული Glambot სლოუ-მოუშენ ვიდეო სერვისი ქორწილებისა და ღონისძიებებისთვის საქართველოში.]',
      btn1: '[KA: სერვისები]',
      btn2: '[KA: დაჯავშნე]',
    },
    about: {
      tag: '[KA: ჩვენს შესახებ]',
      h: '[KA: სლოუ მოუშენის]',
      hem: '[KA: ხელოვნება]',
      frame: '[KA: სლოუ მოუშენ მაგია]',
      p1: '[KA: Glambot Georgia გთავაზობთ ჰოლივუდური სლოუ მოუშენის გამოცდილებას თქვენს ყველაზე განსაკუთრებულ დღესასწაულებზე.]',
      p2: '[KA: როგორც ინდივიდუალური მეწარმე, ჩვენ გთავაზობთ პერსონალურ სერვისს.]',
      events: '[KA: ღონისძიება]',
      slowmo: '[KA: სლოუ მოუშენი]',
      res: '[KA: გარჩევადობა]',
    },
    services: {
      tag: '[KA: ჩვენი შეთავაზება]',
      h: '[KA: ჩვენი]',
      hem: '[KA: სერვისები]',
      price: '[KA: ფასი გასარკვევია →]',
      s1: { name: '[KA: საქორწილო Glambot]', desc: '[KA: სრული დღის გადაღება ჩვენი Glambot-ით.]' },
      s2: { name: '[KA: ღონისძიების გადაღება]', desc: '[KA: კორპორატიული ღონისძიებები, დაბადების დღეები და კერძო წვეულებები.]' },
      s3: { name: '[KA: ჰაილაით ვიდეო]', desc: '[KA: პროფესიონალურად დამონტაჟებული სლოუ მოუშენ ვიდეო 48 საათში.]' },
    },
    gallery: {
      tag: '[KA: ჩვენი ნამუშევარი]',
      h: '[KA: მომენტები]',
      hem: '[KA: გაყინული დროში]',
      items: ['[KA: საქორწილო ვიდეო 2024]', '[KA: პირველი ცეკვა]', '[KA: თაიგულის სროლა]', '[KA: ბანქეტის მომენტები]', '[KA: დღესასწაულები]'],
    },
    contact: {
      tag: '[KA: დაგვიკავშირდით]',
      h: '[KA: დაჯავშნე]',
      hem: '[KA: Glambot]',
      p: '[KA: მზად ხართ კინემატოგრაფიული სლოუ მოუშენი დაამატოთ თქვენს განსაკუთრებულ დღეს?]',
      phone: '[KA: ტელეფონი]',
      owner: '[KA: მფლობელი]',
      location: '[KA: მდებარეობა]',
      loc: '[KA: საქართველო]',
    },
    footer: {
      copy: '© 2025 [KA: თეზო ტაბიძე] · [KA: ინდივიდუალური მეწარმე]',
      admin: '[KA: ადმინი →]',
    },
  },

  // ── RUSSIAN ───────────────────────────────────────────────
  ru: {
    nav: { about: 'О нас', services: 'Услуги', gallery: 'Галерея', contact: 'Контакты', login: 'Войти' },
    hero: {
      tag: 'Свадьбы и мероприятия',
      h1a: 'Запечатлей свой',
      h1em: 'Гламур',
      h1b: 'в движении',
      sub: 'Профессиональная съёмка Glambot в замедленной съёмке для свадеб и мероприятий по всей Грузии. Незабываемые моменты, сохранённые навсегда.',
      btn1: 'Наши услуги',
      btn2: 'Забронировать',
    },
    about: {
      tag: 'О нас',
      h: 'Искусство',
      hem: 'слоу-моушен',
      frame: 'Магия замедленной съёмки',
      p1: 'Glambot Georgia привносит опыт голливудской замедленной съёмки на ваши самые значимые торжества. Мы специализируемся на съёмке волшебных моментов — кружение платья, взрыв конфетти, первый танец.',
      p2: 'Как индивидуальный предприниматель, мы предлагаем персональный сервис, адаптированный под каждого клиента. Ваш праздник уникален, и ваше видео должно быть таким же.',
      events: 'Мероприятий',
      slowmo: 'Слоу-моушен',
      res: 'Разрешение',
    },
    services: {
      tag: 'Что мы предлагаем',
      h: 'Наши',
      hem: 'Услуги',
      price: 'Цена по запросу →',
      s1: { name: 'Свадебный Glambot', desc: 'Съёмка на весь день с нашим фирменным Glambot. Церемония, банкет и все красивые моменты.' },
      s2: { name: 'Съёмка мероприятий', desc: 'Корпоративы, дни рождения и частные вечеринки. Магия слоу-моушен на любом торжестве.' },
      s3: { name: 'Highlight-видео', desc: 'Профессионально смонтированное слоу-моушен видео, готовое в течение 48 часов.' },
    },
    gallery: {
      tag: 'Наши работы',
      h: 'Моменты',
      hem: 'застывшие во времени',
      items: ['Свадебное видео 2024', 'Первый танец', 'Бросок букета', 'Магия банкета', 'Торжества'],
    },
    contact: {
      tag: 'Связаться с нами',
      h: 'Забронируйте',
      hem: 'Glambot',
      p: 'Хотите добавить кинематографичный слоу-моушен в ваш особенный день? Свяжитесь с нами для проверки доступности.',
      phone: 'Телефон',
      owner: 'Владелец',
      location: 'Местоположение',
      loc: 'Грузия',
    },
    footer: {
      copy: '© 2025 Тезо Табидзе · Индивидуальный предприниматель',
      admin: 'Админ →',
    },
  },
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')
  return (
    <LangContext.Provider value={{ lang, setLang, t: T[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
