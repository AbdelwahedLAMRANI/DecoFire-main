

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categories, siteConfig } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// This is now a Server Component
export default async function Home() {
  const featured = products.filter(p => p.isFeatured);
  const nonFeatured = products.filter(p => !p.isFeatured);
  
  const featuredProducts = [...featured];
  
  if (featuredProducts.length < 4) {
    const needed = 4 - featuredProducts.length;
    featuredProducts.push(...nonFeatured.slice(0, needed));
  }


  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-primary-foreground overflow-hidden">
        <Image
            src={siteConfig.heroImageUrl}
            alt="Warm and modern living room with a bioethanol fireplace"
            fill
            className="object-cover -z-10"
            priority
          />
        <div className="absolute inset-0 bg-black/50 -z-10" />
        <div className="p-4 max-w-3xl mx-auto z-10">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight">
            Élégance Moderne, Chaleur Naturelle
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Découvrez un décor unique et personnalisable qui apporte une touche de sophistication personnelle à votre espace.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/shop">
              Acheter maintenant <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 font-headline">Produits en vedette</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {featuredProducts.slice(0, 4).map((product) => {
            const primaryImageUrl = product.imageUrls[0];
            
            return (
              <Link href={`/products/${product.slug}`} key={product.id} className="group">
                <Card className="overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    {primaryImageUrl ? (
                      <Image
                        src={primaryImageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        data-ai-hint="product"
                      />
                    ) : (
                       <div className="w-full h-full bg-secondary"></div>
                    )}
                  </div>
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <h3 className="text-lg font-medium font-headline flex-grow">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1 mb-4">{categories.find(c => c.id === product.categoryId)?.name}</p>
                    <p className="text-lg font-semibold text-primary">{product.price.toFixed(2)} MAD</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 font-headline">Découvrez nos collections</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {categories.map((category) => {
                const categoryImage = category.imageUrl;
                return (
                  <CarouselItem key={category.id} className="basis-1/2 md:basis-1/3">
                    <div className="p-1">
                      <Link href={`/shop?category=${category.id}`} className="group relative block">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                          {categoryImage ? (
                            <Image
                              src={categoryImage}
                              alt={category.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              data-ai-hint={category.name}
                            />
                          ) : (
                            <div className="w-full h-full bg-secondary flex items-center justify-center">
                              <span className="text-muted-foreground text-sm">Aucune image</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h3 className="text-2xl font-bold text-white font-headline text-center px-2">{category.name}</h3>
                        </div>
                      </Link>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
