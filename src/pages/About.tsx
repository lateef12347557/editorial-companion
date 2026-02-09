import { motion } from 'framer-motion';

const About = () => {
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="editorial-container py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="editorial-divider-accent mb-4" />
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">About UPEBSA</h1>
            <p className="text-lg opacity-80 max-w-2xl">
              A platform dedicated to amplifying scholarly voices, fostering critical discourse, and shaping the narrative of our time through rigorous, independent journalism.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="editorial-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-serif text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              UPEBSA Editorial & Press was founded on the belief that quality journalism and academic discourse are essential pillars of a thriving society. We provide a platform for writers, researchers, and thought leaders to share insights that matter.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our editorial team maintains the highest standards of integrity, accuracy, and fairness in every piece we publish. We believe in the power of words to inspire change and build bridges across communities.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-serif text-2xl font-bold mb-4">Our Values</h2>
            <ul className="space-y-4">
              {[
                { title: 'Independence', desc: 'Free from political or commercial influence in our editorial decisions.' },
                { title: 'Excellence', desc: 'Committed to rigorous standards in research, writing, and publishing.' },
                { title: 'Inclusivity', desc: 'Amplifying diverse voices and perspectives from all backgrounds.' },
                { title: 'Integrity', desc: 'Transparent in our processes and accountable to our readers.' },
              ].map((v) => (
                <li key={v.title} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="editorial-container py-16 text-center">
          <h2 className="font-serif text-3xl font-bold mb-3">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
            {[
              { n: '150+', l: 'Articles Published' },
              { n: '24', l: 'Contributing Writers' },
              { n: '45K+', l: 'Monthly Readers' },
              { n: '7', l: 'Content Categories' },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-serif text-3xl font-bold text-accent">{s.n}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
