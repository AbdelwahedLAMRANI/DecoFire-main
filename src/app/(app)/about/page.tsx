
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/data";
import { Target, Gem, Handshake } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-6">
          {siteConfig.about.title}
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          Chez DecoFire, nous croyons que votre maison doit être le reflet de votre histoire unique. Nous marions l'élégance moderne à la chaleur naturelle pour créer un décor qui n'est pas seulement beau, mais profondément personnel.
        </p>
        
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {siteConfig.aboutImageUrl && (
            <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-lg md:order-last">
                <Image
                    src={siteConfig.aboutImageUrl}
                    alt="Notre histoire chez DecoFire"
                    fill
                    className="object-cover"
                    data-ai-hint="craftsman hands"
                />
            </div>
          )}
          <div className="prose prose-lg max-w-none font-body text-foreground space-y-6">
              <p>{siteConfig.about.paragraph1}</p>
              <p>{siteConfig.about.paragraph2}</p>
               <blockquote className="border-l-4 border-accent pl-6 italic text-muted-foreground my-8">
                  "{siteConfig.about.quote}"
              </blockquote>
              <p>{siteConfig.about.paragraph3}</p>
              <p>{siteConfig.about.paragraph4}</p>
          </div>
        </div>


        <Separator className="my-16" />

        <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 border rounded-lg">
                <Target className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold font-headline mb-2">Notre Mission</h3>
                <p className="text-muted-foreground text-sm">Fournir une décoration de haute qualité et personnalisable qui favorise l'expression de soi et apporte de la chaleur à la vie moderne.</p>
            </div>
            <div className="p-8 border rounded-lg">
                <Gem className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold font-headline mb-2">Nos Valeurs</h3>
                <p className="text-muted-foreground text-sm">L'artisanat, la qualité, la durabilité et une approche centrée sur le client guident tout ce que nous faisons.</p>
            </div>
            <div className="p-8 border rounded-lg">
                <Handshake className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold font-headline mb-2">Notre Artisanat</h3>
                <p className="text-muted-foreground text-sm">Nous collaborons avec des artisans qualifiés qui partagent notre passion pour le détail et les pratiques durables.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
