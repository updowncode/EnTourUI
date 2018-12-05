import { Tour } from "./tour";
export const MockTours: Tour[] = [
  {
    id: "CHG11",
    name: "China Encounter",
    availabledTitles: [
      "Mr",
      "Mrs",
      "Ms",
      "Miss",
      "Mstr",
      "Dr",
      "Prof",
      "Sir",
      "Sen"
    ],
    availabledCountryOrAreas: [
      { id: 0, name: "Andorra", code: "AD" },
      { id: 1, name: "United Arab Emirates", code: "AE" },
      { id: 2, name: "Afghanistan", code: "AF" },
      { id: 3, name: "Antigua and Barbuda", code: "AG" },
      { id: 4, name: "Anguilla", code: "AI" }
    ],
    trips: [
      {
        id: "30004810",
        name: "China Encounter 2-for-1, with Air Canada, 9 Days / 7 Nights",
        summary:
          "Experts in travel to China for the past 40 years! Travel to China on this group journey of her key sites staying in good value accommodation with English speaking guides. From the Great Wall and Forbidden City in Beijing to the city of Suzhou, once called the Venice of the East, where you can explore classical gardens and gain insight into the silk trade, to the picturesque town of Wuxi, this trip covers the highlights. You'll then head onward to Hangzhou to discover this cultural gem and city of lore before traveling to Shanghai for a city tour. Complete with English speaking guides, many meals, and more!",

        applicationID: 400,
        currencyCode: "CAD",
        saleChannel: 9,
        dk: "9",
        userId: 5017302,
        remark: "remark",
        guideline: "<strong>guidelineguidelineguidelineguideline</strong>",
        selectedTravellerQuantity: { id: 2, name: "Traveller Quantity: 2" },
        selectedRoomQuantity: { id: 1, name: "Capacity: 1" },
        availabledRoomQuantities: [
          { id: 1, name: "Capacity: 1" },
          { id: 2, name: "Capacity: 2" },
          { id: 3, name: "Capacity: 3" }
        ],
        availabledTravellerQuantities: [
          { id: 1, name: "Traveller Quantity: 1" },
          { id: 2, name: "Traveller Quantity: 2" },
          { id: 3, name: "Traveller Quantity: 3" },
          { id: 4, name: "Traveller Quantity: 4" },
          { id: 5, name: "Traveller Quantity: 5" }
        ],
        startPlace: "Toronto,Edmonton,Ottawa,Montréal,Vancouver,Calgary",
        endPlace: "Asia,China,Beijing",
        startCountryOrArea: { id: 37, name: "Canada", code: "CA" },
        endCountryOrArea: { id: 47, name: "China", code: "CN" },
        startDate: "September 27, 2018",
        endDate: "October 5, 2018",
        tripCostForDefaultPerTraveller: 1449.5,
        tripCostForDefaultTravellerQuantity: 2.0,
        tripSingleSupplement: 295.0,
        minRoomQuantityForTravellers: 1,
        // tourInfoSource: "",
        billingInfo: {
          firstName: null,
          lastName: null,
          email: null,
          primaryPhone: null,
          secondaryPhone: null,
          mailingAddress: null,
          city: null,
          country: null,
          provinceStates: null,
          postalCode: null,
          agreeTermAndCondition: false,
          haveReadTripNotes: false,
          canReceiveMoreInfo: false
        },
        includedIn: [
          {
            id: 0,
            text: "include info...",
            tourId: "CHG11",
            tripId: "30004810"
          }
        ],
        notIncludeIn: [
          {
            id: 0,
            text: "not IncludeIn info...",
            tourId: "CHG11",
            tripId: "30004810"
          }
        ],
        options: [
          {
            id: 0,
            location: "Beijing",
            name: "Acrobatic Show",
            price: 50.0,
            enabled: true,
            type: 2,
            tourId: "CHG11",
            tripId: "30004810"
          }
        ],
        rooms: [],
        infoSource: [],
        selectedInfoSource: null,
        availabledRooms: [
          {
            id: 0,
            index: 0,
            beddingConfig: "Single Room(One Single Bed)",
            capacity: 1,
            adultMaxQuantity: 1,
            childMaxQuantity: 0,
            roomPriceForPerTraveller: 1449.5,
            singleSupplement: 295.0,
            childPromoAmount: 50,
            smokingRoom: 0,
            extraHotelQuantity: 0,
            roomCfgList: [],
            selectedRoomCfg: null,
            travellers: [],
            tourId: "CHG11",
            tripId: "30004810"
          }
        ],
        totalPriceForPayment: 0,
        paymentTypeSurcharges: 0,
        minimumDeposit: 100,
        paidAmounts:[],
        tourId: "CHG11",
        tourName: ""
      }
    ]
  }
];
