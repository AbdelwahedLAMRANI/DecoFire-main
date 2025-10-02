
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { createOrUpdateCustomization } from '../actions';
import type { Customization, CustomizationOption } from '@/lib/types';

interface CustomizationFormProps {
    customization?: Customization;
}

export function CustomizationForm({ customization }: CustomizationFormProps) {
  const [options, setOptions] = useState<CustomizationOption[]>(customization?.options || [{ value: '', priceModifier: 0 }]);

  const addOption = () => {
    setOptions([...options, { value: '', priceModifier: 0 }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: keyof CustomizationOption, value: string | number) => {
    const newOptions = [...options];
    (newOptions[index] as any)[field] = value;
    setOptions(newOptions);
  };
  
  const generateIdFromName = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  return (
    <form action={createOrUpdateCustomization}>
      {customization?.id && <input type="hidden" name="id" value={customization.id} />}
      <Card>
        <CardHeader>
          <CardTitle>Customization Details</CardTitle>
          <CardDescription>
            {customization ? 'Edit the details for this customization.' : 'Fill in the details for a new customization.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Customization Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="e.g., Finish" 
              defaultValue={customization?.name}
              required 
              onChange={(e) => {
                if (!customization) {
                  const idInput = document.getElementById('id') as HTMLInputElement;
                  if (idInput) idInput.value = generateIdFromName(e.target.value);
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="id">Customization ID</Label>
            <Input 
              id="id" 
              name="id" 
              placeholder="e.g., finish" 
              defaultValue={customization?.id}
              readOnly={!!customization}
              required 
            />
            <p className="text-xs text-muted-foreground">
              Unique identifier. Use lowercase letters and dashes. Cannot be changed after creation.
            </p>
          </div>
          
          <div className="space-y-4">
              <Label>Options</Label>
              {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                      <Input 
                          name="optionValue"
                          placeholder="Option Name (e.g., Gold)"
                          value={option.value}
                          onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                          required
                      />
                      <Input 
                          name="priceModifier"
                          type="number"
                          placeholder="Price Modifier"
                          value={option.priceModifier}
                          onChange={(e) => handleOptionChange(index, 'priceModifier', Number(e.target.value))}
                          className="w-40"
                      />
                      <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeOption(index)}
                          disabled={options.length <= 1}
                      >
                          <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                  </div>
              ))}
               <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Option
              </Button>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit">Save Customization</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
