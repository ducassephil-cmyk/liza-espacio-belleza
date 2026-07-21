import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

/// Second migration in the chain — introduces stable state for the vUSD demo
/// domain (wallets demo, service tokens minted demo, config) and seeds the
/// new partner 'Protocolo DeFi vUSD' alongside the existing Flow partner.
///
/// OldActor matches the NewActor of 20260720_000000.mo (the previous file in
/// lex order). NewActor adds the vUSD demo stable fields declared in main.mo.
module {
  // Inlined old types — must match the NewActor of 20260720_000000.mo.
  type UserRole = { #admin; #user; #guest };
  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  type ServiceCategory = { #facial; #corporal; #especial };
  type ComboType = { #newClient; #monthly; #untilDecember };
  type ProductBadge = { #new; #recommended };

  type Service = {
    id : Nat;
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
  type Combo = {
    id : Nat;
    name : Text;
    description : Text;
    servicesIncluded : [Nat];
    priceCLP : Nat;
    regularPriceCLP : Nat;
    validity : Text;
    comboType : ComboType;
    cuposTotal : Nat;
    agendaproUrl : Text;
  };
  type Worker = {
    id : Nat;
    name : Text;
    role : Text;
    bio : Text;
    servicesIds : [Nat];
    silhouetteVariant : Nat;
  };
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    usage : Text;
    badge : ?ProductBadge;
  };
  type Testimonial = {
    id : Nat;
    clientName : Text;
    comment : Text;
  };
  type Partner = {
    id : Nat;
    name : Text;
    description : Text;
    logoText : Text;
  };
  type Application = {
    id : Nat;
    name : Text;
    email : Text;
    specialty : Text;
    message : Text;
    submittedAt : Nat;
  };

  type OldActor = {
    accessControlState : AccessControlState;
    services : List.List<Service>;
    combos : List.List<Combo>;
    workers : List.List<Worker>;
    products : List.List<Product>;
    testimonials : List.List<Testimonial>;
    partners : List.List<Partner>;
    applications : Map.Map<Nat, Application>;
    nextApplicationId : { var next : Nat };
  };

  // Inlined new vUSD demo types — matches types/vusd.mo shape.
  type WalletId = Text;
  type MintableItemType = { #service; #combo };
  type VusdWallet = {
    walletId : WalletId;
    balance : Nat;
    createdAt : Nat;
  };
  type MintedServiceToken = {
    tokenId : Nat;
    walletId : WalletId;
    itemType : MintableItemType;
    itemId : Nat;
    itemName : Text;
    priceVusd : Nat;
    mintedAt : Nat;
  };
  type VusdDemoConfig = {
    clpUsdRate : Nat;
    demoTopupAmount : Nat;
  };

  type NewActor = {
    accessControlState : AccessControlState;
    services : List.List<Service>;
    combos : List.List<Combo>;
    workers : List.List<Worker>;
    products : List.List<Product>;
    testimonials : List.List<Testimonial>;
    partners : List.List<Partner>;
    applications : Map.Map<Nat, Application>;
    nextApplicationId : { var next : Nat };
    vusdWallets : Map.Map<WalletId, VusdWallet>;
    mintedTokens : List.List<MintedServiceToken>;
    nextTokenId : { var next : Nat };
    nextWalletId : { var next : Nat };
    vusdConfig : VusdDemoConfig;
  };

  public func migration(old : OldActor) : NewActor {
    {
      // Preserve all existing Liza domain state unchanged.
      accessControlState = old.accessControlState;
      services = old.services;
      combos = old.combos;
      workers = old.workers;
      products = old.products;
      testimonials = old.testimonials;
      partners = addDefiPartner(old.partners);
      applications = old.applications;
      nextApplicationId = old.nextApplicationId;
      // Initialize vUSD demo state: empty wallets/tokens, fresh counters
      // starting at 1, demo config with CLP/USD rate and topup amount in
      // vUSD cents.
      vusdWallets = Map.empty();
      mintedTokens = List.empty();
      nextTokenId = { var next = 1 };
      nextWalletId = { var next = 1 };
      vusdConfig = {
        clpUsdRate = 950;
        demoTopupAmount = 100000; // 1000 vUSD en centavos
      };
    };
  };

  /// Append the new 'Protocolo DeFi vUSD' partner to the existing partners
  /// list, assigning the next available id. Idempotent: if a partner with
  /// the same name already exists, the list is returned unchanged.
  func addDefiPartner(existing : List.List<Partner>) : List.List<Partner> {
    let already = existing.find(func(p : Partner) : Bool { p.name == "Protocolo DeFi vUSD" });
    switch (already) {
      case (?_) { existing };
      case null {
        let nextId = existing.size();
        existing.add({
          id = nextId;
          name = "Protocolo DeFi vUSD";
          description = "Protocolo DeFi que emite vUSD, un USD sintético estable, para pagos y reservas sin fricción.";
          logoText = "vU";
        });
        existing;
      };
    };
  };
};
