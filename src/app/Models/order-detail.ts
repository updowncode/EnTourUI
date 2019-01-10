import { Trip } from "./trip";
import { EnPaymentType } from "./en-payment-type";

export class OrderDetail {
    status: string;
    message: string;
    orderNumber: string;
    invoiceNumber: string;
    totalRoomPriceIncludeChild: number;
    totalOptionPrice: number;
    totalVisaPrice: number;
    extraHotelAmount: number;
    selectedPaymentType: number;
    enPaymentTypeList: EnPaymentType[];
    trip: Trip;
}
