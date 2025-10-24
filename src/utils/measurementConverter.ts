export interface MeasurementSystem {
  volume: {
    ml: number;
    l: number;
    cup: number;
    tbsp: number;
    tsp: number;
  };
  weight: {
    g: number;
    kg: number;
    oz: number;
    lb: number;
  };
  temperature: {
    celsius: number;
    fahrenheit: number;
  };
}

export const measurementSystems = {
  metric: {
    volume: { ml: 1, l: 1000, cup: 250, tbsp: 15, tsp: 5 },
    weight: { g: 1, kg: 1000, oz: 28.35, lb: 453.59 },
    temperature: { celsius: 1, fahrenheit: (c: number) => (c * 9/5) + 32 }
  },
  imperial: {
    volume: { ml: 1, l: 1000, cup: 236.59, tbsp: 14.79, tsp: 4.93 },
    weight: { g: 1, kg: 1000, oz: 28.35, lb: 453.59 },
    temperature: { celsius: (f: number) => (f - 32) * 5/9, fahrenheit: 1 }
  }
};

export function convertMeasurement(
  value: number,
  fromUnit: string,
  toUnit: string,
  system: 'metric' | 'imperial' = 'metric'
): number {
  const systemData = measurementSystems[system];
  
  // Volume conversions
  if (['ml', 'l', 'cup', 'tbsp', 'tsp'].includes(fromUnit) && 
      ['ml', 'l', 'cup', 'tbsp', 'tsp'].includes(toUnit)) {
    const fromMl = value * systemData.volume[fromUnit as keyof typeof systemData.volume];
    return fromMl / systemData.volume[toUnit as keyof typeof systemData.volume];
  }
  
  // Weight conversions
  if (['g', 'kg', 'oz', 'lb'].includes(fromUnit) && 
      ['g', 'kg', 'oz', 'lb'].includes(toUnit)) {
    const fromGrams = value * systemData.weight[fromUnit as keyof typeof systemData.weight];
    return fromGrams / systemData.weight[toUnit as keyof typeof systemData.weight];
  }
  
  // Temperature conversions
  if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
    return (value * 9/5) + 32;
  }
  if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
    return (value - 32) * 5/9;
  }
  
  return value; // No conversion needed
}

export function formatMeasurement(
  value: number,
  unit: string,
  locale: string = 'en'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  return `${formatter.format(value)} ${unit}`;
}

export function getPreferredUnits(locale: string): {
  volume: string[];
  weight: string[];
  temperature: string;
} {
  // US uses imperial, most others use metric
  const isImperial = locale.startsWith('en-US');
  
  return {
    volume: isImperial ? ['cup', 'tbsp', 'tsp', 'fl oz'] : ['ml', 'l', 'tbsp', 'tsp'],
    weight: isImperial ? ['oz', 'lb'] : ['g', 'kg'],
    temperature: isImperial ? 'fahrenheit' : 'celsius'
  };
}