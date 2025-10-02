
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import type { Product, Customization, SelectedCustomization } from '@/lib/types';
import { customizations as allCustomizations } from '@/lib/data';
import { ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ProductCustomizerProps {
  product: Product;
}

export default function ProductCustomizer({ product }: ProductCustomizerProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initialOptions: Record<string, string> = {};
    if (product.customizationIds) {
      product.customizationIds.forEach(id => {
        const customization = allCustomizations.find(c => c.id === id);
        if (customization) {
          initialOptions[id] = customization.options[0].value;
        }
      });
    }
    return initialOptions;
  });

  const productCustomizations = useMemo(() => {
    return (product.customizationIds || [])
      .map(id => allCustomizations.find(c => c.id === id))
      .filter((c): c is Customization => !!c);
  }, [product.customizationIds]);

  const handleOptionChange = (customizationId: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [customizationId]: value,
    }));
  };

  const finalPrice = useMemo(() => {
    let price = product.price;
    productCustomizations.forEach(customization => {
      const selectedValue = selectedOptions[customization.id];
      const selectedOption = customization.options.find(opt => opt.value === selectedValue);
      if (selectedOption) {
        price += selectedOption.priceModifier;
      }
    });
    return price;
  }, [product.price, productCustomizations, selectedOptions]);

  const handleAddToCart = () => {
    const selectedCustomizations: SelectedCustomization[] = productCustomizations.map(customization => ({
      customizationId: customization.id,
      customizationName: customization.name,
      optionValue: selectedOptions[customization.id],
    }));

    addToCart({
      product,
      quantity,
      price: finalPrice,
      customizations: selectedCustomizations,
    });

    toast({
      title: "Ajouté au panier",
      description: `${product.name} (x${quantity}) a été ajouté à votre panier.`,
    });
  };
  
  const isEngravingSelected = selectedOptions['engraving']?.includes('Texte personnalisé');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">{product.name}</h1>
        <p className="text-muted-foreground mt-2">{product.description}</p>
      </div>

      <p className="text-4xl font-bold font-headline text-primary">{formatPrice(finalPrice)}</p>

      <Separator />

      <div className="space-y-6">
        {productCustomizations.map(customization => (
          <div key={customization.id}>
            <Label className="text-lg font-semibold font-headline">{customization.name}</Label>
            <RadioGroup
              value={selectedOptions[customization.id]}
              onValueChange={(value) => handleOptionChange(customization.id, value)}
              className="mt-3 space-y-2"
            >
              {customization.options.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${customization.id}-${option.value}`} />
                  <Label htmlFor={`${customization.id}-${option.value}`} className="flex justify-between w-full cursor-pointer">
                    <span>{option.value}</span>
                    {option.priceModifier > 0 && (
                      <span className="text-muted-foreground text-sm">+{formatPrice(option.priceModifier)}</span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {customization.id === 'engraving' && isEngravingSelected && (
              <Input
                placeholder="Entrez votre texte personnalisé"
                className="mt-3"
                maxLength={20}
              />
            )}
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
          <span className="w-10 text-center text-lg font-bold">{quantity}</span>
          <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setQuantity(q => q + 1)}>+</Button>
        </div>
        <Button size="lg" className="flex-grow bg-primary text-primary-foreground" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}
