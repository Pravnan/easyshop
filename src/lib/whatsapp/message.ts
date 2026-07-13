import { IOrder } from "@/models/Order";

function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-LK")}`;
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s+\-()]/g, "");
}

export function buildWhatsAppMessage(order: IOrder): string {
  const lines: string[] = [];

  lines.push("Hello, I would like to place an order.");
  lines.push("");
  lines.push(`Order ID: ${order.orderId}`);
  lines.push("");

  lines.push("Customer");
  lines.push(`Name: ${order.customer.name}`);
  lines.push(`Phone: ${order.customer.phone}`);
  lines.push(`Address: ${order.customer.address}`);
  if (order.customer.city) {
    lines.push(`City: ${order.customer.city}`);
  }
  lines.push("");

  lines.push("Items");
  order.items.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.productName}`);
    if (item.selectedColor) lines.push(`   Colour: ${item.selectedColor}`);
    if (item.selectedSize) lines.push(`   Size: ${item.selectedSize}`);
    if (item.selectedVariants) {
      Object.entries(item.selectedVariants).forEach(([key, value]) => {
        lines.push(`   ${key}: ${value}`);
      });
    }
    lines.push(`   Quantity: ${item.quantity}`);
    lines.push(`   Unit price: ${formatCurrency(item.unitPrice)}`);
    lines.push(`   Subtotal: ${formatCurrency(item.subtotal)}`);
  });

  lines.push("");
  lines.push(`Total: ${formatCurrency(order.total)}`);

  if (order.customer.note) {
    lines.push("");
    lines.push(`Note: ${order.customer.note}`);
  }

  return lines.join("\n");
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  const normalized = normalizePhone(whatsappNumber);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encoded}`;
}
