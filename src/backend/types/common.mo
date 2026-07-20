module {
  /// Timestamp in nanoseconds since epoch (IC Time.now()).
  public type Timestamp = Nat;

  /// Stable identifier reused across services, combos, workers, products,
  /// testimonials, partners and applications.
  public type Id = Nat;

  /// Error variant returned by update methods that may fail validation.
  public type Error_ = {
    #invalidInput : Text;
    #notFound : Text;
    #unauthorized : Text;
  };
};
