import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faMobileAlt, faCalendarAlt, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons'
import PdfDownloadButton from '@/components/PdfDownloadButton'

const linkClass = 'flex items-center gap-2 text-interactive-light underline decoration-interactive-light/50 hover:text-mint hover:decoration-mint/50 transition-colors duration-150'
const iconBox = 'w-5 h-5 bg-black/30 flex items-center justify-center shrink-0'
const iconClass = 'w-2.5 h-2.5'

export default function ResumeHeader() {
  return (
    <header className="bg-navy-dark text-white overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row print:flex-row">

        {/* Foto — flush, sem borda, ocupa a altura total do flex row */}
        <div className="relative h-56 w-full md:h-auto md:w-44 print:h-auto print:w-44 shrink-0">
          <Image
            src="/images/profile.jpg"
            alt="Alexandre Monteiro de Mello"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 176px"
            priority
          />
        </div>

        {/* Conteúdo: nome + contatos + links */}
        <div className="flex-1 flex flex-col md:flex-row print:flex-row py-6 px-6 gap-6 md:gap-8 print:gap-8">

          {/* Nome + contatos */}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold uppercase leading-none">Alexandre</h1>
            <h1 className="text-xl font-bold uppercase leading-tight mb-2">Monteiro de Mello</h1>
            <p className="text-sm font-semibold text-white/70 mb-4">Product Manager</p>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a className={linkClass} href="mailto:almmello@gmail.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faEnvelope} className={iconClass + ' shrink-0'} />
                  almmello@gmail.com
                </a>
              </li>
              <li>
                <a className={linkClass} href="tel:+16508348841" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faMobileAlt} className={iconClass + ' shrink-0'} />
                  +1 650 834-8841
                </a>
              </li>
              <li>
                <a className={linkClass} href="tel:+5521995121700" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faMobileAlt} className={iconClass + ' shrink-0'} />
                  +55 21 99512-1700
                </a>
              </li>
            </ul>
          </div>

          {/* Links sociais */}
          <div className="shrink-0 text-sm w-full md:w-auto print:w-auto">
            <ul className="space-y-2">
              <li>
                <a className={linkClass} href="https://linkedin.com/in/almmello" target="_blank" rel="noopener noreferrer">
                  <span className={iconBox}><FontAwesomeIcon icon={faLinkedinIn} className={iconClass} /></span>
                  linkedin.com/in/almmello
                </a>
              </li>
              <li>
                <a className={linkClass} href="https://github.com/almmello" target="_blank" rel="noopener noreferrer">
                  <span className={iconBox}><FontAwesomeIcon icon={faGithub} className={iconClass} /></span>
                  github.com/almmello
                </a>
              </li>
              <li>
                <a className={linkClass} href="https://goalmoon.com" target="_blank" rel="noopener noreferrer">
                  <span className={iconBox}><Image src="/images/fav2.png" alt="Goalmoon" width={10} height={10} /></span>
                  goalmoon.com
                </a>
              </li>
              <li>
                <a className={linkClass} href="https://www.codeable.io/developers/alexandre-mello/" target="_blank" rel="noopener noreferrer">
                  <span className={iconBox}><Image src="/images/codeable.png" alt="Codeable" width={10} height={10} /></span>
                  Codeable
                </a>
              </li>
              <li>
                <a className={linkClass} href="https://calendly.com/almmello/30-min" target="_blank" rel="noopener noreferrer">
                  <span className={iconBox}><FontAwesomeIcon icon={faCalendarAlt} className={iconClass} /></span>
                  calendly.com/almmello
                </a>
              </li>
              <li className="print:hidden">
                <PdfDownloadButton />
              </li>
              <li className="hidden print:flex items-center gap-2 text-interactive-light">
                <span className={iconBox}><FontAwesomeIcon icon={faGlobe} className={iconClass} /></span>
                almmello.com
              </li>
            </ul>
          </div>

        </div>
      </div>
    </header>
  )
}
