import { Trip } from "./trip";

export class OrderDetail {
    status: string;
    message: string;
    orderNumber?: number;
    invoiceNumber?: number;
    trip: Trip;
}
