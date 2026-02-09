import { useState } from 'react';
import { motion } from 'framer-motion';
import { galleryImages } from '@/data/mockData';

const albums = ['All', ...Array.from(new Set(galleryImages.map((g) => g.album)))];

const Gallery = () => {
  const [activeAlbum, setActiveAlbum] = useState('All');
  const filtered = activeAlbum === 'All' ? galleryImages : galleryImages.filter((g) => g.album === activeAlbum);

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="editorial-container py-12">
          <div className="editorial-divider-accent mb-4" />
          <h1 className="font-serif text-4xl font-bold mb-4">Gallery</h1>
          <p className="opacity-80 max-w-xl">A visual journey through events, campus life, and moments that define our community.</p>
        </div>
      </section>

      <section className="editorial-container py-8">
        <div className="flex gap-2 mb-8">
          {albums.map((a) => (
            <button
              key={a}
              onClick={() => setActiveAlbum(a)}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                activeAlbum === a ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="columns-2 md:columns-3 gap-4 pb-16">
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="mb-4 break-inside-avoid"
            >
              <div className="overflow-hidden rounded-sm group">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{img.alt}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Gallery;
