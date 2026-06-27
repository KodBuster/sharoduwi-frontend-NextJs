export type CheckoutFormData = {
  name: string;
  phone: string;
  city?: string;
  address?: string;
  comment?: string;
};

export function validateCheckoutForm(data: CheckoutFormData): string | null {
  if (!data.name.trim()) return "Укажите имя";
  if (!data.phone.trim()) return "Укажите телефон";
  return null;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) {
    return `+7${digits.slice(1)}`;
  }
  if (digits.length === 11 && digits.startsWith("7")) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+7${digits}`;
  }
  return phone.trim();
}

export function generateOrderId(): string {
  return `SH-${Date.now()}`;
}

export function getDeliveryFee(): number {
  return 0;
}
