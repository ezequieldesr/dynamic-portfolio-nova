
import React from 'react';
import FadeIn from '../animations/FadeIn';
import ProjectCard from '../ui/ProjectCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Github } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Interface para os projetos específicos
interface Project {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  topics: string[];
  imageUrl: string;
}

export default function Projects() {
  const { t, language } = useLanguage();
  
  // Lista de projetos específicos
  const specificProjects: Project[] = [
    {
      id: 1,
      name: "O_Desafio_Simon",
      description: language === 'pt-BR' 
        ? "Jogo de memória inspirado no clássico Simon, desenvolvido com JavaScript" 
        : "Memory game inspired by the classic Simon, developed with JavaScript",
      html_url: "https://github.com/ezequieldesr/O_Desafio_Simon",
      homepage: "https://o-desafio-simon.vercel.app/",
      topics: ["JavaScript", "HTML", "CSS", "Game"],
      imageUrl: "https://opengraph.githubassets.com/1/ezequieldesr/O_Desafio_Simon"
    },
    {
      id: 2,
      name: "ecommerce-product-page-main",
      description: language === 'pt-BR' 
        ? "Página de produto de e-commerce responsiva, desenvolvida com HTML, CSS e JavaScript" 
        : "Responsive e-commerce product page, developed with HTML, CSS and JavaScript",
      html_url: "https://github.com/ezequieldesr/ecommerce-product-page-main",
      homepage: "https://ecommerce-product-page-main-zeta.vercel.app/",
      topics: ["HTML", "CSS", "JavaScript", "E-commerce"],
      imageUrl: "https://opengraph.githubassets.com/1/ezequieldesr/ecommerce-product-page-main"
    },
    
    {
      id: 3,
      name: "Ip-Address-Tracker",
      description: language === 'pt-BR' 
        ? "Desenvolvi o IP Address Tracker, um aplicativo que permite visualizar a localização de endereços IP em um mapa interativo. Utilizei a API IP Geolocation da IPify para obter os dados e o LeafletJS para a renderização do mapa, garantindo uma experiência responsiva e fiel ao design proposto." 
        : "I developed IP Address Tracker, an application that allows you to view the location of IP addresses on an interactive map. I used IPify's IP Geolocation API to obtain the data and LeafletJS for the map rendering, ensuring a responsive experience that is faithful to the proposed design.",
      html_url: "https://github.com/ezequieldesr/Ip-Address-Tracker",
      homepage: "https://ip-address-tracker-theta-seven.vercel.app/",
      topics: ["React", "TypeScript", "NodeJS", "API"],
      imageUrl: "https://opengraph.githubassets.com/1/ezequieldesr/Ip-Address-Tracker"
    },
    {
      id: 4,
      name: "ClonePayloads",
      description: language === 'pt-BR'
          ? "Ferramenta para gerar dados JSON de teste com regras configuráveis, interface React e API Java com Spring Boot."
          : "Tool for generating JSON test data with configurable rules, a React interface and a Java Spring Boot API.",
      html_url: "https://github.com/ezequieldesr/ClonePayloads_Frontend",
      homepage: "",
      topics: ["React", "TypeScript", "Java", "Spring Boot"],
      imageUrl: "https://opengraph.githubassets.com/1/ezequieldesr/ClonePayloads_Frontend"
    }
    
  ];

  return (
    <section className="relative py-24 sm:py-32" id="projects">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 75%, rgba(38, 57, 77, 0.2) 0%, rgba(255, 255, 255, 0) 25%)',
        }}
      />

      <div className="section-container">
        <FadeIn direction="up">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            {t('portfolio')}
          </span>
        </FadeIn>

        <FadeIn direction="up" delay={100}>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-6 tracking-tight flex items-center gap-3">
            {t('featuredProjects')}
            <a href="https://github.com/ezequieldesr" target="_blank" rel="noopener noreferrer" className="inline-flex">
              <Github className="h-8 w-8 text-primary hover:text-accent transition-colors" />
            </a>
          </h2>
        </FadeIn>

        <FadeIn direction="up" delay={200}>
          <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl">
            {t('projectsDescription')}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {specificProjects.map((project, index) => (
            <FadeIn key={project.id} direction="up" delay={300 + index * 100}>
              <ProjectCard
                title={project.name}
                description={project.description}
                image={project.imageUrl}
                tags={project.topics}
                liveUrl={project.homepage || ""}
                githubUrl={project.html_url}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
