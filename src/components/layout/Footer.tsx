import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="editorial-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl font-bold mb-2">UPEBSA</h3>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 opacity-60">Editorial & Press</p>
            <p className="text-sm opacity-80 max-w-md leading-relaxed">
              Committed to independent journalism, rigorous scholarship, and amplifying voices that shape the future of our communities.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold mb-4 uppercase tracking-wider">Navigate</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/articles" className="hover:opacity-100 transition-opacity">Articles</Link></li>
              <li><Link to="/gallery" className="hover:opacity-100 transition-opacity">Gallery</Link></li>
              <li><Link to="/about" className="hover:opacity-100 transition-opacity">About Us</Link></li>
              <li><Link to="/contact" className="hover:opacity-100 transition-opacity">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold mb-4 uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Twitter / X</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">LinkedIn</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Facebook</a></li>
              <li><Link to="/auth" className="hover:opacity-100 transition-opacity">Writer Portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-primary-foreground/20 text-xs opacity-50 text-center">
          © {new Date().getFullYear()} UPEBSA Editorial & Press. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
