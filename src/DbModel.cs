using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Aspose.Modules.EnTourModule.Models
{

    public class Country
    {
        [Key]
        public int id { get; set; }
        public string name { get; set; }
        public string code { get; set; }
    }
    public class Title
    {
        [Key]
        public int id { get; set; }
        public string name { get; set; }
    }
    public class EnTourBook_TravellerInclude
    {
        [Key]
        public int id { get; set; }
        [Column(TypeName = "nvarchar")]
        public string text { get; set; }
        [Required, ForeignKey("trip")]
        public int tripId { get; set; }
        public virtual EnTourBook_Trip trip { get; set; }
    }
    public class EnTourBook_TravellerNotInclude
    {
        [Key]
        public int id { get; set; }
        [Column(TypeName = "nvarchar")]
        public string text { get; set; }
        [Required, ForeignKey("trip")]
        public int tripId { get; set; }
        public virtual EnTourBook_Trip trip { get; set; }
    }
    public class EnTourBook_BillingInfo
    {
        [ForeignKey("trip")]
        public int id { get; set; }
        [Required]
        [Column(TypeName = "nvarchar")]
        public string firstName { get; set; }
        [Required]
        [Column(TypeName = "nvarchar")]
        public string lastName { get; set; }
        [Column(TypeName = "nvarchar")]
        public string email { get; set; }
        [Column(TypeName = "nvarchar")]
        public string primaryPhone { get; set; }
        [Column(TypeName = "nvarchar")]
        public string secondaryPhone { get; set; }
        [Column(TypeName = "nvarchar")]
        public string mailingAddress { get; set; }
        [Column(TypeName = "nvarchar")]
        public string city { get; set; }
        [Column(TypeName = "nvarchar")]
        public string provinceStates { get; set; }
        [Column(TypeName = "nvarchar")]
        public string postalCode { get; set; }
        [Required]
        public string countryCode { get; set; }

        public virtual EnTourBook_Trip trip { get; set; }
    }
    public class EnTourBook_Trip
    {
        public EnTourBook_Trip()
        {
            this.travellerRooms = new HashSet<EnTourBook_TravellerRoom>();
            this.includedIn = new HashSet<EnTourBook_TravellerInclude>();
            this.notIncludeIn = new HashSet<EnTourBook_TravellerNotInclude>();
        }
        [Key]
        public int id { get; set; }
        [Required]
        [Column(TypeName = "nvarchar")]
        public string tripCode { get; set; } //"30004810"
        [Required]
        [Column(TypeName = "nvarchar")]
        public string tripName { get; set; } // "2-for-1, with Air Canada, 9 Days / 7 Nights"
        [Required]
        [Column(TypeName = "nvarchar")]
        public string startPlace { get; set; } //"Toronto"
        [Required]
        [Column(TypeName = "nvarchar")]
        public string endPlace { get; set; } //"Beijing"
        [Required]
        public string startCountryCode { get; set; }  //{ id: 37, name: "Canada", code: "CA" }
        [Required]
        public string endCountryCode { get; set; } //{ id: 47, name: "China", code: "CN" }
        [Required]
        [DataType(DataType.Date)]
        public DateTime startDate { get; set; } //"Sep 27, 2018"
        [Required]
        [DataType(DataType.Date)]
        public DateTime endDate { get; set; } //"Oct 5, 2018"
        [Required]
        public decimal tripCostForDefaultPerTraveller { get; set; } //1449.5
        [Required]
        public decimal tripCostForDefaultTravellerQuantity { get; set; } //2
        [Required]
        public decimal tripSingleSupplement { get; set; } //295.0
       
        [Required]
        public string tourCode { get; set; }//"CHG11"
        [Required]
        public string tourName { get; set; }//"China Encounter"
        public string selectedInfoSource { get; set; } // "Toronto Star"
        [Column(TypeName = "varchar")]
        [MaxLength(100)]
        public string RequestIpAddress { get; set; }
        [DataType(DataType.Date)]
        public Nullable<DateTime> createUTC { get; set; }
        [Timestamp]
        public byte[] timestamp { get; set; }
        public virtual EnTourBook_BillingInfo billingInfo { get; set; }
        public virtual ICollection<EnTourBook_TravellerRoom> travellerRooms { get; set; }
        public virtual ICollection<EnTourBook_TravellerInclude> includedIn { get; set; } //{id:0, text: "balabala...", tourId: "CHG11"}, {id:1, text: "balabala...", tourId: "CHG11"} ....
        public virtual ICollection<EnTourBook_TravellerNotInclude> notIncludeIn { get; set; }//{id:0, text: "balabala...", tourId: "CHG11"}, {id:1, text: "balabala...", tourId: "CHG11"} ....

    }
    public class EnTourBook_TravellerRoom
    {
        public EnTourBook_TravellerRoom()
        {
            this.travellers = new HashSet<EnTourBook_Traveller>();
        }
        [Key]
        public int id { get; set; } // 0, 1, 2, 3...
        [Required]
        [Column(TypeName = "nvarchar")]
        public string beddingConfig { get; set; } //"Single Room(One Single Bed)", "Double Room(One King/Queen Bed)", "Twin Room(Two Single Beds)", "Triple Room(One King/Queen Bed plus One Single Bed)"...
        [Required]
        public int capacity { get; set; } // 1, 2, 2, 3....
        [Required]
        public int extraHotels { get; set; } //1, 2, ....days
        [Required]
        public decimal roomPriceForPerTraveller { get; set; } //1449.5
        [Required]
        public decimal singleSupplement { get; set; } //295.0
        [Required]
        public int smokingRoom { get; set; } //0:unknown

        [Required, ForeignKey("trip")]
        public int travellerSelectedTripId { get; set; }
        public virtual EnTourBook_Trip trip { get; set; }
        public virtual ICollection<EnTourBook_Traveller> travellers { get; set; }

    }
    public class EnTourBook_Traveller
    {
        public EnTourBook_Traveller()
        {
            this.options = new HashSet<EnTourBook_TravellerOption>();
        }
        [Key]
        public int id { get; set; }
        [Required]
        [Column(TypeName = "nvarchar")]
        public string selectedTitle { get; set; }
        [Required]
        [Column(TypeName = "nvarchar")]
        public string firstName { get; set; }
        [Column(TypeName = "nvarchar")]
        public string middleName { get; set; }
        [Required]
        [Column(TypeName = "nvarchar")]
        public string lastName { get; set; }
        [Required]
        [Column(TypeName = "nvarchar")]
        public string placeofbirth { get; set; }
        [Required]
        public string countryCode { get; set; }

        public bool needVisa { get; set; }
        public bool needInsuance { get; set; }
        [Column(TypeName = "nvarchar")]
        public string specialRequest { get; set; }

        [Required, ForeignKey("room")]
        public int roomId { get; set; }
        public virtual EnTourBook_TravellerRoom room { get; set; }
        public virtual EnTourBook_TravellerPassport passport { get; set; }
        public virtual ICollection<EnTourBook_TravellerOption> options { get; set; }
    }
    public class EnTourBook_TravellerPassport
    {
        [ForeignKey("traveller")]
        public int id { get; set; }
        [Required]
        [Column(TypeName = "nvarchar")]
        public string number { get; set; }
        [Required]
        [DataType(DataType.Date)]
        public DateTime issueDate { get; set; }
        [Required]
        [DataType(DataType.Date)]
        public DateTime expiryDate { get; set; }
        [Required]
        public string CountryCode { get; set; }
        public virtual EnTourBook_Traveller traveller { get; set; }
    }
    public class EnTourBook_TravellerOption
    {
        [Key]
        public int id { get; set; } //0
        [Required]
        [Column(TypeName = "nvarchar")]
        public string location { get; set; } //"Beijing"
        [Required]
        [Column(TypeName = "nvarchar")]
        public string name { get; set; }//"Acrobatic Show"
        [Required]
        public decimal price { get; set; } //50.0

        [Required, ForeignKey("traveller")]
        public int travellerId { get; set; }
        public virtual EnTourBook_Traveller traveller { get; set; }
    }
    public class EnTourSearch_TourInclude
    {
        [Key]
        public int id { get; set; }
        [Required]
        [Column(TypeName = "nvarchar")]
        public string text { get; set; }
        [Required, ForeignKey("tour")]
        public int tourId { get; set; }
        public virtual EnTourSearch_Tour tour { get; set; }
    }
    public class EnTourSearch_TourNotInclude
    {
        [Key]
        public int id { get; set; }
        [Required]
        [Column(TypeName = "nvarchar")]
        public string text { get; set; }
        [Required, ForeignKey("tour")]
        public int tourId { get; set; }

        public virtual EnTourSearch_Tour tour { get; set; }
    }
    public class EnTour_InfoSource
    {
        [Key]
        public int id { get; set; }
        [Required]
        [Column(TypeName = "nvarchar")]
        public string name { get; set; } //"Toronto Star"
        [Required, ForeignKey("tour")]
        public int tourId { get; set; }

        public virtual EnTourSearch_Tour tour { get; set; }
    }
    public class EnTourSearch_Tour
    {
        public EnTourSearch_Tour()
        {
            this.trips = new HashSet<EnTourSearch_Trip>();
            this.includes = new HashSet<EnTourSearch_TourInclude>();
            this.notIncludes = new HashSet<EnTourSearch_TourNotInclude>();
            this.infoSources = new HashSet<EnTour_InfoSource>();
        }
        [Key]
        public int id { get; set; }
        [Required]
        public string tourCode { get; set; } //"CHG11"
        [Required]
        public string tourName { get; set; } //"China Encounter"
        public virtual ICollection<EnTourSearch_Trip> trips { get; set; }
        public virtual ICollection<EnTourSearch_TourInclude> includes { get; set; } 
        public virtual ICollection<EnTourSearch_TourNotInclude> notIncludes { get; set; }
        public virtual ICollection<EnTour_InfoSource> infoSources { get; set; } //"Toronto Star", "TourEast Website", ...

    }
    public class EnTourSearch_Trip
    {
        public EnTourSearch_Trip()
        {
            this.options = new HashSet<EnTourSearch_TripOption>();
            this.rooms = new HashSet<EnTourSearch_Room>();
        }
        [Key]
        public int id { get; set; }
        [Required]
        public string tripCode { get; set; } //"30004810"
        [Required]
        public string tripName { get; set; } // "2-for-1, with Air Canada, 9 Days / 7 Nights"
        [Required]
        [Column(TypeName = "nvarchar")]
        public string startPlace { get; set; } //"Toronto"
        [Required]
        [Column(TypeName = "nvarchar")]
        public string endPlace { get; set; } //"Beijing"
        [Required]
        [DataType(DataType.Date)]
        public DateTime startDate { get; set; } //"Sep 27, 2018"
        [Required]
        [DataType(DataType.Date)]
        public DateTime endDate { get; set; } //"Oct 5, 2018"
        [Required]
        public decimal tripCostForDefaultPerTraveller { get; set; } //1449.5
        [Required]
        public decimal tripCostForDefaultTravellerQuantity { get; set; } //2
        [Required]
        public decimal tripSingleSupplement { get; set; } //295.0

        [Required]
        public string startCountryCode { get; set; } //{ id: 37, name: "Canada", code: "CA" }
        [Required]
        public string endCountryCode { get; set; } //{ id: 47, name: "China", code: "CN" }
        [Required, ForeignKey("tour")]
        public int tourId { get; set; }
        public virtual EnTourSearch_Tour tour { get; set; }
        public virtual ICollection<EnTourSearch_TripOption> options { get; set; }
        public virtual ICollection<EnTourSearch_Room> rooms { get; set; }

    }
    public class EnTourSearch_TripOption
    {
        [Key]
        public int id { get; set; }
        [Required]
        [Column(TypeName = "nvarchar")]
        public string location { get; set; } //"Beijing"
        [Required]
        [Column(TypeName = "nvarchar")]
        public string name { get; set; }//"Acrobatic Show"
        [Required]
        public decimal price { get; set; } //50.0

        [Required, ForeignKey("trip")]
        public int tripId { get; set; }

        public virtual EnTourSearch_Trip trip { get; set; }
    }
    public class EnTourSearch_Room
    {
        public EnTourSearch_Room()
        {
            this.roomConfigs = new HashSet<EnTourSearch_RoomBedConfig>();
        }
        [Key]
        public int id { get; set; }
        [Required]
        public int capacity { get; set; } // 1, 2, 2, 3....
        [Required]
        public int extraHotels { get; set; } //1, 2, ....days
        [Required]
        public decimal roomPriceForPerTraveller { get; set; } //1449.5
        [Required]
        public decimal singleSupplement { get; set; } //295.0
        [Required]
        public int smokingRoom { get; set; } //0:unknown, 1:yes , -1:no
        [Required, ForeignKey("trip")]
        public int tripId { get; set; }
        public virtual EnTourSearch_Trip trip { get; set; }

        public virtual ICollection<EnTourSearch_RoomBedConfig> roomConfigs { get; set; }
    }
    public class EnTourSearch_RoomBedConfig
    {
        [Key, ForeignKey("Room"), Column(Order = 0)]
        public int RoomID { get; set; }
        [Key, ForeignKey("BedConfig"), Column(Order = 1)]
        public int BedConfigID { get; set; }

        public virtual EnTourSearch_Room Room { get; set; }
        public virtual EnTour_BeddingConfig BedConfig { get; set; }
    }
    public class EnTour_BeddingConfig
    {
        public EnTour_BeddingConfig()
        {
            this.roomsConfig = new HashSet<EnTourSearch_RoomBedConfig>();
        }
        [Key]
        public int id { get; set; }
        [Required]
        [Column(TypeName = "nvarchar")]
        public string configName { get; set; }
        public virtual ICollection<EnTourSearch_RoomBedConfig> roomsConfig { get; set; }
    }

}