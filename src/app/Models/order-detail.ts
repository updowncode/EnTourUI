import { Trip } from "./trip";
import { EnPaymentType } from "./en-payment-type";

export class OrderDetail {
    status: string;
    message: string;
    orderNumber: string;
    invoiceNumber: string;
    selectedPaymentType: number;
    enPaymentTypeList: EnPaymentType[];
    trip: Trip;
}
