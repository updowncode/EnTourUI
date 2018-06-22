export class Tour {
  id: number;
  name: string;
  trips: Trip[];
}
export class Trip {
  tourId: number;
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  tripCost: string;
  tripSingleSupplement: string;
  includedIn: string[];
  notIncludeIn: string[];
  travellerQuantity: number;
  travellerRoomsQuantity: number;
}
export const MockTours: Tour[] = [
  {
    id: 11,
    name: "South America 6 Days",
    trips: [
      {
        tourId: 11,
        id: 111,
        name: "trip 1",
        startDate: "Sep 27, 2018",
        endDate: "Oct 8, 2018",
        tripCost: "$2,899",
        tripSingleSupplement: "$299",
        travellerQuantity: 1,
        travellerRoomsQuantity: 1,
        includedIn: [
          "include content 1",
          "include content 2",
          "include content 3"
        ],
        notIncludeIn: [
          "not include content 1",
          "not include content 2",
          "not include content 3"
        ]
      },
      {
        tourId: 11,
        id: 112,
        name: "trip 2",
        startDate: "Sep 28, 2018",
        endDate: "Oct 18, 2018",
        tripCost: "$3,000",
        tripSingleSupplement: "$299",
        travellerQuantity: 1,
        travellerRoomsQuantity: 1,
        includedIn: [
          "include content 11",
          "include content 21",
          "include content 31"
        ],
        notIncludeIn: [
          "not include content 13",
          "not include content 23",
          "not include content 33"
        ]
      }
    ]
  },
  {
    id: 12,
    name: "South America 7 Days",
    trips: [
      {
        tourId: 12,
        id: 121,
        name: "trip 1",
        startDate: "Sep 27, 2018",
        endDate: "Oct 8, 2018",
        tripCost: "$2,899",
        tripSingleSupplement: "$299",
        travellerQuantity: 1,
        travellerRoomsQuantity: 1,
        includedIn: [
          "include content 1",
          "include content 2",
          "include content 3"
        ],
        notIncludeIn: [
          "not include content 1",
          "not include content 2",
          "not include content 3"
        ]
      }
    ]
  },
  {
    id: 13,
    name: "South America 8 Days",
    trips: [
      {
        tourId: 11,
        id: 131,
        name: "trip 1",
        startDate: "Sep 27, 2018",
        endDate: "Oct 8, 2018",
        tripCost: "$2,899",
        tripSingleSupplement: "$299",
        travellerQuantity: 1,
        travellerRoomsQuantity: 1,
        includedIn: [
          "include content 1",
          "include content 2",
          "include content 3"
        ],
        notIncludeIn: [
          "not include content 1",
          "not include content 2",
          "not include content 3"
        ]
      }
    ]
  }
];
