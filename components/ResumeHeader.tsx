import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faMobileAlt, faCalendarAlt, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons'
import PdfDownloadButton from '@/components/PdfDownloadButton'

export default function ResumeHeader() {
  return (
    <header className="bg-navy-dark text-white py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row print:flex-row items-center md:items-start print:items-start gap-6 md:gap-8 print:gap-8">

          {/* Foto */}
          <div className="shrink-0 text-center">
            <Image
              className="rounded-2xl border-4 border-white/20"
              src="/images/profile.jpg"
              alt="Alexandre Monteiro de Mello"
              width={180}
              height={180}
            />
          </div>

          {/* Informações primárias */}
          <div className="flex-grow text-center md:text-left print:text-left">
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide leading-tight mb-0">
              Alexandre
            </h1>
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide leading-tight mb-2">
              Monteiro de Mello
            </h1>
            <div className="text-base text-white/60 mb-5 uppercase tracking-widest">Product Manager</div>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-white/80 hover:text-mint transition-colors duration-150 inline-flex items-center gap-2 justify-center md:justify-start print:justify-start"
                  href="mailto:almmello@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 shrink-0" />
                  almmello@gmail.com
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-mint transition-colors duration-150 inline-flex items-center gap-2 justify-center md:justify-start print:justify-start"
                  href="tel:+16508348841"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faMobileAlt} className="w-4 h-4 shrink-0" />
                  +1 650 834-8841
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-mint transition-colors duration-150 inline-flex items-center gap-2 justify-center md:justify-start print:justify-start"
                  href="tel:+5521995121700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faMobileAlt} className="w-4 h-4 shrink-0" />
                  +55 21 99512-1700
                </a>
              </li>
            </ul>
          </div>

          {/* Redes sociais */}
          <div className="shrink-0 text-sm w-full md:w-auto print:w-auto">
            <ul className="space-y-3">
              <li>
                <a
                  className="text-white/80 hover:text-mint transition-colors duration-150 flex items-center gap-3"
                  href="https://linkedin.com/in/almmello"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="w-8 h-8 bg-white/10 rounded flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faLinkedinIn} className="w-3.5 h-3.5" />
                  </span>
                  linkedin.com/in/almmello
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-mint transition-colors duration-150 flex items-center gap-3"
                  href="https://github.com/almmello"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="w-8 h-8 bg-white/10 rounded flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faGithub} className="w-3.5 h-3.5" />
                  </span>
                  github.com/almmello
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-mint transition-colors duration-150 flex items-center gap-3"
                  href="https://goalmoon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="w-8 h-8 bg-white/10 rounded flex items-center justify-center shrink-0">
                    <Image src="/images/fav2.png" alt="Goalmoon" width={14} height={14} />
                  </span>
                  goalmoon.com
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-mint transition-colors duration-150 flex items-center gap-3"
                  href="https://www.codeable.io/developers/alexandre-mello/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="w-8 h-8 bg-white/10 rounded flex items-center justify-center shrink-0">
                    <Image src="/images/codeable.png" alt="Codeable" width={14} height={14} />
                  </span>
                  Codeable
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-mint transition-colors duration-150 flex items-center gap-3"
                  href="https://calendly.com/almmello/30-min"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="w-8 h-8 bg-white/10 rounded flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faCalendarAlt} className="w-3.5 h-3.5" />
                  </span>
                  calendly.com/almmello
                </a>
              </li>
              <li className="print:hidden">
                <PdfDownloadButton />
              </li>
              <li className="hidden print:flex items-center gap-3 text-white/80">
                <span className="w-8 h-8 bg-white/10 rounded flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faGlobe} className="w-3.5 h-3.5" />
                </span>
                almmello.com
              </li>
            </ul>
          </div>

        </div>
      </div>
    </header>
  )
}
