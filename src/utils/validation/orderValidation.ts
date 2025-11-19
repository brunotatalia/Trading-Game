import type { Order, Position, ValidationResult } from '../../types';

export const validateQuantity = (quantity: number): boolean => {
  return quantity > 0 && Number.isInteger(quantity);
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && !isNaN(price);
};

export const validateBuyOrder = (
  order: Order,
  cash: number,
  currentPrice: number
): ValidationResult => {
  const errors: string[] = [];

  // בדיקת symbol
  if (!order.symbol) {
    errors.push('יש לבחור מניה');
  }

  // בדיקת quantity
  if (!order.quantity || order.quantity <= 0) {
    errors.push('יש להזין כמות חוקית');
  } else if (!Number.isInteger(order.quantity)) {
    errors.push('הכמות חייבת להיות מספר שלם');
  }

  // בדיקת מחיר (עבור limit order)
  if (order.type === 'LIMIT') {
    if (!order.price || order.price <= 0) {
      errors.push('יש להזין מחיר חוקי');
    }
  }

  // חישוב עלות כוללת
  const price = order.type === 'MARKET' ? currentPrice : order.price || 0;
  const total = order.quantity * price;
  const fee = total * 0.001; // 0.1% fee
  const totalCost = total + fee;

  // בדיקת תקציב
  if (totalCost > cash) {
    errors.push(
      `אין מספיק כסף. נדרש: $${totalCost.toFixed(2)}, זמין: $${cash.toFixed(2)}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSellOrder = (
  order: Order,
  position: Position | undefined
): ValidationResult => {
  const errors: string[] = [];

  // בדיקת symbol
  if (!order.symbol) {
    errors.push('יש לבחור מניה');
  }

  // בדיקת quantity
  if (!order.quantity || order.quantity <= 0) {
    errors.push('יש להזין כמות חוקית');
  } else if (!Number.isInteger(order.quantity)) {
    errors.push('הכמות חייבת להיות מספר שלם');
  }

  // בדיקת מחיר (עבור limit order)
  if (order.type === 'LIMIT') {
    if (!order.price || order.price <= 0) {
      errors.push('יש להזין מחיר חוקי');
    }
  }

  // בדיקת פוזיציה
  if (!position) {
    errors.push(`אין לך מניות של ${order.symbol}`);
  } else if (order.quantity > position.quantity) {
    errors.push(
      `אין מספיק מניות. יש לך: ${position.quantity}, מנסה למכור: ${order.quantity}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateOrder = (
  order: Order,
  cash: number,
  position: Position | undefined,
  currentPrice: number
): ValidationResult => {
  if (order.side === 'BUY') {
    return validateBuyOrder(order, cash, currentPrice);
  } else {
    return validateSellOrder(order, position);
  }
};
