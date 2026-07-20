module {
  public type Id = Nat;
  public type Timestamp = Nat;

  /// High-level classification of a Liza service, used to group the home
  /// catalogue by use.
  public type ServiceCategory = {
    #facial;
    #corporal;
    #especial;
  };

  /// Scarcity tiers for buy-in cupos. Derived from price via `cuposTierFor`.
  ///   premium = 4 cupos
  ///   mid     = 6 cupos
  ///   entry   = 12 cupos
  public type CuposTier = {
    #premium;
    #mid;
    #entry;
  };

  /// A single service offered by Liza.
  public type Service = {
    id : Id;
    name : Text;
    description : Text;
    longDescription : Text;
    durationMins : Nat;
    priceCLP : Nat;
    category : ServiceCategory;
    techniques : [Text];
    toolsIncluded : [Text];
    allIncluded : Bool;
    cuposTotal : Nat;
    agendaproUrl : Text;
  };

  /// Kind of promotion a Combo represents.
  public type ComboType = {
    #newClient;
    #monthly;
    #untilDecember;
  };

  /// A promotional combo bundling multiple services.
  public type Combo = {
    id : Id;
    name : Text;
    description : Text;
    servicesIncluded : [Id];
    priceCLP : Nat;
    regularPriceCLP : Nat;
    validity : Text;
    comboType : ComboType;
    cuposTotal : Nat;
    agendaproUrl : Text;
  };

  /// A Liza team member who performs services. Photos are rendered as prism
  /// silhouettes on the frontend, so only a `silhouetteVariant` is stored.
  public type Worker = {
    id : Id;
    name : Text;
    role : Text;
    bio : Text;
    servicesIds : [Id];
    silhouetteVariant : Nat;
  };

  /// Badge tagging a product as new or recommended.
  public type ProductBadge = {
    #new;
    #recommended;
  };

  /// A product the business uses and promotes.
  public type Product = {
    id : Id;
    name : Text;
    description : Text;
    usage : Text;
    badge : ?ProductBadge;
  };

  /// A short client testimonial.
  public type Testimonial = {
    id : Id;
    clientName : Text;
    comment : Text;
  };

  /// A protocol partner (e.g. Flow) shown in the partners banner.
  public type Partner = {
    id : Id;
    name : Text;
    description : Text;
    logoText : Text;
  };

  /// An application submitted through the Únete page.
  public type Application = {
    id : Id;
    name : Text;
    email : Text;
    specialty : Text;
    message : Text;
    submittedAt : Timestamp;
  };
};
