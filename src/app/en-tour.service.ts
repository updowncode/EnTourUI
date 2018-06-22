import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";
import { MessageService } from "./message.service";
import { Tour, MockTours } from "./tour";
@Injectable({
  providedIn: "root"
})
export class EnTourService {
  private toursUrl = "https://b2b.toureast.com/api/heroes"; // URL to web api
  private createtour = "https://b2b.toureast.com/api/createhero";
  private headers = new Headers({ "Content-Type": "application/json" });
  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error); // for demo purposes only
    this.messageService.add("An error occurred" + error);
    return Promise.reject(error.message || error);
  }
  constructor(private http: Http, private messageService: MessageService) {}
  getTours(): Promise<Tour[]> {
    return this.http
      .get(this.toursUrl)
      .toPromise()
      .then(response => response.json() as Tour[])
      .catch(this.handleError);
  }
  getTour(id: number): Promise<Tour> {
    const url = `${this.toursUrl}/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as Tour)
      .catch(this.handleError);
  }
  getToursMockData(): Tour[] {
    return MockTours;
  }
  getTourMockData(id: number): Tour {
    return MockTours.find(c => c.id === id);
  }

  update(tour: Tour): Promise<Tour> {
    const url = `${this.toursUrl}/${tour.id}`;
    return this.http
      .put(url, JSON.stringify(tour), { headers: this.headers })
      .toPromise()
      .then(() => tour)
      .catch(this.handleError);
  }
  create(name: string): Promise<Tour> {
    return this.http
      .post(this.createtour, JSON.stringify({ name: name }), {
        headers: this.headers
      })
      .toPromise()
      .then(res => res.json() as Tour)
      .catch(this.handleError);
  }
  delete(id: number): Promise<void> {
    const url = `${this.toursUrl}/${id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }
}
