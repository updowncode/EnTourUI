import { Trip } from "./trip";

export class OrderDetail {
    status: string;
    message: string;
    orderNumber: string;
    invoiceNumber: string;
    trip: Trip;
}
