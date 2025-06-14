
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border/40 bg-muted/20 backdrop-blur-sm">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl">Ezequiel de Souza Rodrigues</h3>
            <p className="text-muted-foreground max-w-md">
            {t('smallAbout')}
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">{t('quickLinks')}</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/#projects" className="text-foreground/80 hover:text-foreground transition-colors link-underline">{t('projects')}</Link>
              <Link to="/#about" className="text-foreground/80 hover:text-foreground transition-colors link-underline">{t('about')}</Link>
              <Link to="/#skills" className="text-foreground/80 hover:text-foreground transition-colors link-underline">{t('skills')}</Link>
              <Link to="/#contact" className="text-foreground/80 hover:text-foreground transition-colors link-underline">{t('contact')}</Link>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">{t('contact')}</h4>
            <div className="flex space-x-4">
              <a href="https://github.com/ezequieldesr" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-foreground/10 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/ezequieldesr/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-foreground/10 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="mailto:ezequieldesr@gmail.com" className="p-2 rounded-full hover:bg-foreground/10 transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Ezequiel de Souza Rodrigues. {t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
