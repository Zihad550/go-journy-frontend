export const PaymentStatus = {
  UNPAID: "unpaid",
  PAID: "paid",
  CANCELLED: "cancelled",
  FAILED: "failed",
  REFUNDED: "refunded"
} as const;

export type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus];

export interface IPayment {
  _id: string;
  ride: string;
  transactionId: string;
  amount: number;
  status: PaymentStatusType;
  paymentGatewayData?: object;
  invoiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentInitiationResponse {
  paymentUrl: string;
}

export interface IPaymentCallbackQuery {
  transactionId: string;
  amount: string;
  status: string;
}

export interface IPaymentValidationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
}

export interface IInvoiceDownloadResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: string; // Cloudinary URL
}