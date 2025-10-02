
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { siteConfig } from "@/lib/data";

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();

  const handleOrder = () => {
    let message = "Bonjour DecoFire, j'aimerais passer une commande pour les articles suivants :\n\n";
    
    cart.forEach(item => {
      message += `*${item.product.name}* (x${item.quantity})\n`;
      if (item.customizations.length > 0) {
        item.customizations.forEach(cust => {
          if (cust.optionValue !== "None" && cust.optionValue !== "Natural") {
             message += ` - ${cust.customizationName}: ${cust.optionValue}\n`;
          }
        });
      }
      message += `Sous-total: ${formatPrice(item.price * item.quantity)}\n\n`;
    });

    message += `*Total: ${formatPrice(total)}*`;

    const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Panier d'achat ({cart.length})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cart.length > 0 ? (
          <>
            <div className="flex-grow overflow-y-auto -mx-6 px-6">
              <div className="space-y-4">
                {cart.map(item => {
                  const primaryImageUrl = item.product.imageUrls[0];
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0 bg-secondary">
                        {primaryImageUrl && (
                          <Image
                            src={primaryImageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        {item.customizations.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.customizations.map(cust => {
                              if (cust.optionValue === "None" || cust.optionValue === "Natural") return null;
                              return (
                                <div key={cust.customizationId}>
                                  {cust.customizationName}: {cust.optionValue}
                                </div>
                              )
                            })}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
                            <span>{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                          </div>
                          <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
            <Separator />
            <SheetFooter className="mt-auto">
                <div className="w-full space-y-4">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90" onClick={handleOrder}>Commander via WhatsApp</Button>
                    <Button variant="outline" size="lg" className="w-full" onClick={clearCart}>Vider le panier</Button>
                </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-semibold">Votre panier est vide</h3>
            <p className="text-muted-foreground mt-2">Ajoutez des produits pour commencer.</p>
            <SheetTrigger asChild>
                <Button variant="link" className="mt-4">Continuer vos achats</Button>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
