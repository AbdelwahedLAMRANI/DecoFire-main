'use client';
import { useState, useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/data";
import { updateSiteConfig } from './actions';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ImagePreviewState = {
    logoUrl: string | null;
    heroImageUrl: string | null;
    aboutImageUrl: string | null;
    contactImageUrl: string | null;
}
const initialState = { success: false, message: '' };


export default function GeneralAdminPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [state, formAction, isPending] = useActionState(updateSiteConfig, initialState);
    const [previews, setPreviews] = useState<ImagePreviewState>({
        logoUrl: siteConfig.logoUrl,
        heroImageUrl: siteConfig.heroImageUrl,
        aboutImageUrl: siteConfig.aboutImageUrl,
        contactImageUrl: siteConfig.contactImageUrl
    });
    
    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast({
                    title: "Succès",
                    description: state.message,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: "Erreur",
                    description: state.message,
                });
            }
        }
    }, [state.message, state.success, toast]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof ImagePreviewState) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({...prev, [key]: reader.result as string}));
            };
            reader.readAsDataURL(file);
        }
    };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold font-headline">Administration Générale</h1>
        </div>

        <form action={formAction}>
            <div className="grid gap-8">
                {/* Site Images */}
                <Card>
                    <CardHeader>
                        <CardTitle>Images du Site</CardTitle>
                        <CardDescription>Gérez le logo et les images principales des pages.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label>Logo</Label>
                            {previews.logoUrl && <Image src={previews.logoUrl} alt="Logo preview" width={64} height={64} className="rounded-full object-contain" />}
                            <Input name="logoUrl" type="file" accept="image/*" onChange={e => handleImageChange(e, 'logoUrl')} />
                        </div>
                        <div className="space-y-4">
                            <Label>Image Page d'Accueil (Hero)</Label>
                            {previews.heroImageUrl && <Image src={previews.heroImageUrl} alt="Hero preview" width={200} height={112} className="rounded-md object-contain" />}
                            <Input name="heroImageUrl" type="file" accept="image/*" onChange={e => handleImageChange(e, 'heroImageUrl')} />
                        </div>
                        <div className="space-y-4">
                            <Label>Image Page "À propos"</Label>
                            {previews.aboutImageUrl && <Image src={previews.aboutImageUrl} alt="About preview" width={200} height={112} className="rounded-md object-contain" />}
                            <Input name="aboutImageUrl" type="file" accept="image/*" onChange={e => handleImageChange(e, 'aboutImageUrl')} />
                        </div>
                        <div className="space-y-4">
                            <Label>Image Page Contact</Label>
                            {previews.contactImageUrl && <Image src={previews.contactImageUrl} alt="Contact preview" width={200} height={112} className="rounded-md object-contain" />}
                            <Input name="contactImageUrl" type="file" accept="image/*" onChange={e => handleImageChange(e, 'contactImageUrl')} />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Coordonnées</CardTitle>
                        <CardDescription>Mettez à jour les informations de contact de votre entreprise.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" defaultValue={siteConfig.contact.email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input id="phone" name="phone" defaultValue={siteConfig.contact.phone} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
                            <Input id="whatsapp" name="whatsapp" defaultValue={siteConfig.contact.whatsapp} placeholder="ex: 212600000000" />
                            <p className="text-xs text-muted-foreground">Inclure l'indicatif du pays sans le signe '+'.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse</Label>
                            <Input id="address" name="address" defaultValue={siteConfig.contact.address} />
                        </div>
                    </CardContent>
                </Card>
                
                 {/* Social Media */}
                <Card>
                    <CardHeader>
                        <CardTitle>Réseaux Sociaux</CardTitle>
                        <CardDescription>Liens vers vos profils sur les réseaux sociaux.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="instagram">URL Instagram</Label>
                            <Input id="instagram" name="instagram" defaultValue={siteConfig.social.instagram} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="facebook">URL Facebook</Label>
                            <Input id="facebook" name="facebook" defaultValue={siteConfig.social.facebook} />
                        </div>
                    </CardContent>
                </Card>

                {/* About Page Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contenu de la Page "À propos"</CardTitle>
                        <CardDescription>Modifiez les textes de votre page "À propos".</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="aboutTitle">Titre</Label>
                            <Input id="aboutTitle" name="aboutTitle" defaultValue={siteConfig.about.title} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="aboutParagraph1">Paragraphe 1</Label>
                            <Textarea id="aboutParagraph1" name="aboutParagraph1" defaultValue={siteConfig.about.paragraph1} rows={4} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="aboutParagraph2">Paragraphe 2</Label>
                            <Textarea id="aboutParagraph2" name="aboutParagraph2" defaultValue={siteConfig.about.paragraph2} rows={4} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="aboutQuote">Citation</Label>
                            <Textarea id="aboutQuote" name="aboutQuote" defaultValue={siteConfig.about.quote} rows={2} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="aboutParagraph3">Paragraphe 3</Label>
                            <Textarea id="aboutParagraph3" name="aboutParagraph3" defaultValue={siteConfig.about.paragraph3} rows={4} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="aboutParagraph4">Paragraphe 4</Label>
                            <Textarea id="aboutParagraph4" name="aboutParagraph4" defaultValue={siteConfig.about.paragraph4} rows={3} />
                        </div>
                    </CardContent>
                </Card>
            </div>
             <div className="mt-8 flex justify-end items-center gap-4">
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sauvegarder les modifications
                </Button>
            </div>
        </form>
    </div>
  );
}
