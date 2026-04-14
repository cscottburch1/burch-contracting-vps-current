/**
 * Calculator Engine for Competitive Local Pricing
 * Reference: burch_pricing_calculator_system.xlsx
 * 
 * MANDATORY FORMULA:
 * (Direct Cost × Location × Material × Complexity × Site + Adders) × (1 + O&P)
 */

import { PRICING_CONFIG } from './pricingConfig';

export interface CalculationInputs {
  // Base inputs
  squareFootage: number;
  baseDirectCost: number; // $/SF from pricing config
  
  // Multiplier factors
  locationFactor: number;
  materialFactor: number;
  complexityFactor: number;
  siteConditionFactor: number;
  
  // Additional costs
  adders: number; // Sum of all selected adders
  
  // Overhead & Profit
  overheadAndProfit: number; // Default: 0.225 (22.5%)
}

export interface CalculationResults {
  // Step 1: Direct Cost
  directCost: number;
  
  // Step 2: Adjusted Direct Cost (after all factors)
  adjustedDirectCost: number;
  
  // Intermediate: Direct + Adders (before O&P)
  subtotalBeforeOP: number;
  
  // Step 3: Final Price (after O&P)
  finalPrice: number;
  
  // Output ranges
  budgetLow: number;      // Final × 0.93
  mostCommon: number;     // Final × 1.0
  customHigh: number;     // Final × 1.12
  
  // Breakdown for transparency
  breakdown: {
    baseDirectCost: number;
    squareFootage: number;
    directCost: number;
    locationFactor: number;
    materialFactor: number;
    complexityFactor: number;
    siteConditionFactor: number;
    adjustedDirectCost: number;
    adders: number;
    subtotalBeforeOP: number;
    overheadAndProfitAmount: number;
    overheadAndProfitRate: number;
    finalPrice: number;
  };
}

/**
 * Calculate Direct Cost
 * Formula: Size (SF) × Base Rate ($/SF)
 */
export function calculateDirectCost(squareFootage: number, baseRate: number): number {
  return squareFootage * baseRate;
}

/**
 * Calculate Adjusted Direct Cost
 * Formula: Direct Cost × Location × Material × Complexity × Site
 */
export function calculateAdjustedDirectCost(
  directCost: number,
  locationFactor: number,
  materialFactor: number,
  complexityFactor: number,
  siteConditionFactor: number
): number {
  return directCost * locationFactor * materialFactor * complexityFactor * siteConditionFactor;
}

/**
 * Calculate Final Price
 * Formula: (Adjusted Direct Cost + Adders) × (1 + O&P)
 */
export function calculateFinalPrice(
  adjustedDirectCost: number,
  adders: number,
  overheadAndProfit: number
): number {
  const subtotal = adjustedDirectCost + adders;
  return subtotal * (1 + overheadAndProfit);
}

/**
 * Calculate Output Ranges
 * Returns: Budget-Conscious, Most Common, Custom/High-End
 */
export function calculateOutputRanges(finalPrice: number) {
  return {
    budgetLow: finalPrice * PRICING_CONFIG.outputRanges.budgetLow,
    mostCommon: finalPrice * PRICING_CONFIG.outputRanges.mostCommon,
    customHigh: finalPrice * PRICING_CONFIG.outputRanges.customHigh,
  };
}

/**
 * Main calculation engine
 * Implements complete formula with full breakdown
 */
export function calculateProjectCost(inputs: CalculationInputs): CalculationResults {
  const {
    squareFootage,
    baseDirectCost,
    locationFactor,
    materialFactor,
    complexityFactor,
    siteConditionFactor,
    adders,
    overheadAndProfit,
  } = inputs;

  // Step 1: Calculate Direct Cost
  const directCost = calculateDirectCost(squareFootage, baseDirectCost);

  // Step 2: Calculate Adjusted Direct Cost (all factors applied)
  const adjustedDirectCost = calculateAdjustedDirectCost(
    directCost,
    locationFactor,
    materialFactor,
    complexityFactor,
    siteConditionFactor
  );

  // Intermediate: Subtotal before O&P
  const subtotalBeforeOP = adjustedDirectCost + adders;

  // Step 3: Calculate Final Price (with O&P)
  const finalPrice = calculateFinalPrice(adjustedDirectCost, adders, overheadAndProfit);

  // Calculate output ranges
  const ranges = calculateOutputRanges(finalPrice);

  // Calculate O&P amount for transparency
  const overheadAndProfitAmount = finalPrice - subtotalBeforeOP;

  return {
    directCost,
    adjustedDirectCost,
    subtotalBeforeOP,
    finalPrice,
    budgetLow: ranges.budgetLow,
    mostCommon: ranges.mostCommon,
    customHigh: ranges.customHigh,
    breakdown: {
      baseDirectCost,
      squareFootage,
      directCost,
      locationFactor,
      materialFactor,
      complexityFactor,
      siteConditionFactor,
      adjustedDirectCost,
      adders,
      subtotalBeforeOP,
      overheadAndProfitAmount,
      overheadAndProfitRate: overheadAndProfit,
      finalPrice,
    },
  };
}

/**
 * Helper: Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Helper: Format percentage
 */
export function formatPercentage(decimal: number): string {
  return `${(decimal * 100).toFixed(1)}%`;
}

/**
 * Helper: Round to nearest $50 or $100
 */
export function roundToNearestHundred(amount: number): number {
  return Math.round(amount / 100) * 100;
}

export function roundToNearestFifty(amount: number): number {
  return Math.round(amount / 50) * 50;
}
