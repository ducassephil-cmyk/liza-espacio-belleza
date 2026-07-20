import Types "../types/liza-core";
import Common "../types/common";

module {
  public type Service = Types.Service;
  public type Combo = Types.Combo;
  public type Worker = Types.Worker;
  public type Product = Types.Product;
  public type Testimonial = Types.Testimonial;
  public type Partner = Types.Partner;
  public type Application = Types.Application;
  public type ServiceCategory = Types.ServiceCategory;
  public type CuposTier = Types.CuposTier;
  public type Error_ = Common.Error_;

  /// Derive the scarcity tier from a service price in CLP.
  /// Thresholds are defined by the business rule:
  ///   premium (4 cupos)  — highest priced  (> 70000 CLP)
  ///   mid     (6 cupos)  — middle priced   (> 45000 CLP)
  ///   entry   (12 cupos) — cheapest, shortest (<= 45000 CLP)
  public func cuposTierFor(priceCLP : Nat) : CuposTier {
    if (priceCLP > 70000) #premium
    else if (priceCLP > 45000) #mid
    else #entry;
  };

  /// Number of cupos associated with a tier.
  public func cuposForTier(tier : CuposTier) : Nat {
    switch (tier) {
      case (#premium) 4;
      case (#mid) 6;
      case (#entry) 12;
    };
  };

  /// Filter services by category.
  public func filterByCategory(services : [Service], category : ServiceCategory) : [Service] {
    services.filter(func(s : Service) : Bool { s.category == category });
  };

  /// Build a new Application record from the Únete form fields.
  public func newApplication(id : Nat, name : Text, email : Text, specialty : Text, message : Text, submittedAt : Nat) : Application {
    { id; name; email; specialty; message; submittedAt };
  };
};
