import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

export default function ResumeFooter() {
  return (
    <footer className="text-center py-5 text-xs text-gray-400 print:hidden">
      {/* This template is free as long as you keep the footer attribution link. */}
      <small>
        Designed with <FontAwesomeIcon icon={faHeart} className="text-red-400 w-3 h-3 inline" /> by{' '}
        <a
          href="https://themes.3rdwavemedia.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600 transition-colors no-print-url"
        >
          Xiaoying Riley
        </a>{' '}
        for developers
      </small>
    </footer>
  )
}
