import React, { useState } from 'react';
import FadeIn from '../animations/FadeIn';
import CustomButton from '../ui/CustomButton';
import { AtSign, MapPin, Phone, SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import emailjs from '@emailjs/browser';     

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
  delay?: number;
}

const ContactInfo = ({ icon, title, value, href, delay = 0 }: ContactInfoProps) => (
  <FadeIn direction="up" delay={delay}>
    <a 
      href={href}
      className={cn(
        "flex p-4 bg-card/40 backdrop-blur-sm border border-border/50 rounded-lg",
        "transition-all hover:shadow-md hover:border-primary/50",
        href ? "cursor-pointer" : "cursor-default"
      )}
      target={href?.startsWith('http') ? "_blank" : undefined}
      rel={href?.startsWith('http') ? "noopener noreferrer" : undefined}
    >
      <div className="mr-4 flex-shrink-0">
        <div className="p-3 bg-primary/10 text-primary rounded-md">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-muted-foreground break-words">{value}</p>
      </div>
    </a>
  </FadeIn>
);

export default function Contact() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConfigured = [import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID, import.meta.env.VITE_EMAILJS_USER_ID]
    .every(value => typeof value === 'string' && value.trim().length > 0);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!isConfigured) {
      toast({ title: language === 'pt-BR' ? 'Contato por e-mail' : 'Contact by email',
        description: language === 'pt-BR' ? 'O formulário está indisponível. Use o e-mail ao lado.' : 'This form is unavailable. Please use the email address beside it.' });
      return;
    }
    
    if (Object.values(formData).some(value => !value.trim())) {
      toast({
        title: t('error') || 'Erro',
        description: 'Por favor, preencha todos os campos.',
        variant: "destructive",
      });
      return;
    }
    
    if (!validateEmail(formData.email)) {
      toast({
        title: t('error') || 'Erro',
        description: "Por favor, informe um e-mail válido.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, value.trim()])),
        { publicKey: import.meta.env.VITE_EMAILJS_USER_ID, limitRate: { throttle: 10000 } }
      );

      toast({
        title: language === 'pt-BR' ? 'Mensagem enviada!' : 'Message sent!',
        description: language === 'pt-BR' ? 'Obrigado pelo contato. Responderei o mais breve possível.' : 'Thank you for reaching out. I will reply as soon as possible.',
      });
      
      // Reseta o formulário após o envio bem-sucedido
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch {
      const errorMessage = language === 'pt-BR'
        ? 'Não foi possível enviar. Tente novamente mais tarde ou use o e-mail ao lado.'
        : 'Unable to send. Please try again later or use the email address beside the form.';
      toast({
        title: language === 'pt-BR' ? 'Erro no envio' : 'Unable to send',
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="relative py-24 sm:py-32 bg-muted/30" id="contact">
      <div className="section-container">
        <FadeIn direction="up">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            {t('contactTitle')}
          </span>
        </FadeIn>
        
        <FadeIn direction="up" delay={100}>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-6 tracking-tight">
            {t('letsChat')}
          </h2>
        </FadeIn>
        
        <FadeIn direction="up" delay={200}>
          <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl">
            {t('contactDescription')}
          </p>
        </FadeIn>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FadeIn direction="up" delay={300}>
              <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card/20 backdrop-blur-sm border border-border/50 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium mb-2">
                      {t('name')}
                    </Label>
                    <Input
                      id="name"
                      maxLength={100}
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full"
                      placeholder={t('yourName')}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium mb-2">
                      {t('email')}
                    </Label>
                    <Input
                      id="email"
                      maxLength={254}
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full"
                      placeholder={t('yourEmail')}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject" className="block text-sm font-medium mb-2">
                    {t('subject')}
                  </Label>
                  <Input
                    id="subject"
                      maxLength={160}
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full"
                    placeholder={t('howCanIHelp')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t('message')}
                  </Label>
                  <Textarea
                    id="message"
                      maxLength={5000}
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="resize-none"
                    placeholder={t('projectDescription')}
                  />
                </div>
                
                <div>
                  {!isConfigured && <p role="status" className="text-sm text-muted-foreground mb-4">
                    {language === 'pt-BR' ? 'Formulário indisponível. Entre em contato pelo e-mail ao lado.' : 'Form unavailable. Please use the email address beside it.'}
                  </p>}
                  <CustomButton 
                    type="submit" 
                    disabled={isSubmitting || !isConfigured}
                    icon={<SendHorizontal className="w-4 h-4" />}
                    iconPosition="right"
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? t('sending') : t('sendMessage')}
                  </CustomButton>
                </div>
              </form>
            </FadeIn>
          </div>
          
          <div className="space-y-4">
            <ContactInfo
              icon={<AtSign className="w-5 h-5" />}
              title={t('email')}
              value="ezequieldesr@gmail.com"
              href="mailto:ezequieldesr@gmail.com"
              delay={400}
            />
            
            <ContactInfo
              icon={<Phone className="w-5 h-5" />}
              title={t('phone')}
              value="+55 (48) 98413-0138"
              href="tel:+5548984130138"
              delay={500}
            />
            
            <ContactInfo
              icon={<MapPin className="w-5 h-5" />}
              title={t('location')}
              value="Santa Catarina, Brasil"
              delay={600}
            />
          </div>
        </div>
      </div>
    </section>
  );
}