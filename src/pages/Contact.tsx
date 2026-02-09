import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Message sent!', description: 'We\'ll get back to you soon.' });
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="editorial-container py-12">
          <div className="editorial-divider-accent mb-4" />
          <h1 className="font-serif text-4xl font-bold mb-4">Contact Us</h1>
          <p className="opacity-80 max-w-xl">Have a story tip, feedback, or inquiry? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="editorial-container py-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                  <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Subject</label>
                <Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Message</label>
                <Textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Send Message
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>editorial@upebsa.org</span>
                </div>
                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>+234 800 000 0000</span>
                </div>
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>University Press Building, Lagos, Nigeria</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;
