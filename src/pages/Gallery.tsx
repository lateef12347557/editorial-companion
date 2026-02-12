import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePublishedGallery } from '@/hooks/usePublicData';

const Gallery = () => {
  const [activeAlbum, setActiveAlbum] = useState('All');
  const { data: images = [], isLoading } = usePublishedGallery();

  const albums = ['All', ...Array.from(new Set(images.map((g) => g.album).filter(Boolean) as string[]))];
  const filtered = activeAlbum === 'All' ? images : images.filter((g) => g.album === activeAlbum);

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
        <div className="flex gap-2 mb-8 flex-wrap">
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

        {isLoading ? (
          <p className="text-center py-20 text-muted-foreground">Loading gallery...</p>
        ) : filtered.length > 0 ? (
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
                  <img src={img.image_url} alt={img.title} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{img.title}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="font-serif text-xl">No images yet</p>
          </div>
        )}
      </section>
    </>
  );
};

export default Gallery;
