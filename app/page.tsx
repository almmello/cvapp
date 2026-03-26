import ResumeHeader from '@/components/ResumeHeader'
import ResumeFooter from '@/components/ResumeFooter'
import About from '@/components/content/About'
import ExperienceSection from '@/components/content/experience/ExperienceSection'
import Education from '@/components/content/Education'
import Languages from '@/components/content/Languages'
import Awards from '@/components/content/Awards'

export default function Home() {
  return (
    <article className="min-h-screen bg-cool-2 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white shadow-xl print:shadow-none">

        <ResumeHeader />

        <div className="p-6 md:p-10">

          {/* About */}
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-navy pb-3 mb-4 border-b border-navy/20">About</h2>
            <About />
          </section>

          {/* Experience */}
          <ExperienceSection />

          {/* Education + Languages + Awards (two-column) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">

            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-navy pb-3 mb-4 border-b border-navy/20">Education</h2>
              <Education />
            </section>

            <div>
              <section className="mb-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-navy pb-3 mb-4 border-b border-navy/20">Language</h2>
                <Languages />
              </section>

              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-navy pb-3 mb-4 border-b border-navy/20">Awards</h2>
                <Awards />
              </section>
            </div>

          </div>

        </div>
      </div>

      <ResumeFooter />
    </article>
  )
}