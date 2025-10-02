
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/data";
import { Phone, Mail, MapPin, Instagram, Facebook, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Contactez-nous</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Nous serions ravis d'avoir de vos nouvelles ! Que vous ayez une question sur nos produits, une commande, ou que vous vouliez simplement dire bonjour, n'hésitez pas à nous contacter.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-10 md:gap-16">
        {/* Contact Info Section */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold font-headline mb-4">Coordonnées</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent" />
                <a href={`mailto:${siteConfig.contact.email}`} className="text-muted-foreground hover:text-primary">{siteConfig.contact.email}</a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent" />
                <span className="text-muted-foreground">{siteConfig.contact.phone}</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent mt-1" />
                <p className="text-muted-foreground">{siteConfig.contact.address}</p>
              </div>
            </div>
             <Button asChild className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white">
                <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Discuter sur WhatsApp
                </a>
            </Button>
          </div>
          <div>
            <h3 className="text-xl font-bold font-headline mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <Link href={siteConfig.social.instagram} aria-label="Instagram">
                <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href={siteConfig.social.facebook} aria-label="Facebook">
                <Facebook className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-square w-full rounded-lg overflow-hidden hidden md:block">
            <Image
              src={siteConfig.contactImageUrl}
              alt="DecoFire Contact"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="md:col-span-3 bg-card p-8 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-bold font-headline mb-6">Envoyez-nous un message</h2>
          <form className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" placeholder="Votre nom" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Votre email" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input id="subject" placeholder="Question sur une commande" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Votre message..." rows={6} />
            </div>
            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Envoyer le message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
