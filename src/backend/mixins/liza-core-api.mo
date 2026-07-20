import List "mo:core/List";
import Map "mo:core/Map";
import Result "mo:core/Result";
import Text "mo:core/Text";
import Time "mo:core/Time";

import EmailClient "mo:caffeineai-email/emailClient";

import Types "../types/liza-core";
import Common "../types/common";
import LizaLib "../lib/liza-core";

/// Public API surface for the Liza domain. State is injected by the composition
/// root in main.mo. All read endpoints are `query` methods; the only update
/// method is `submitApplication`, which also sends a transactional email to the
/// Liza team.
mixin (
  services : List.List<Types.Service>,
  combos : List.List<Types.Combo>,
  workers : List.List<Types.Worker>,
  products : List.List<Types.Product>,
  testimonials : List.List<Types.Testimonial>,
  partners : List.List<Types.Partner>,
  applications : Map.Map<Nat, Types.Application>,
  nextApplicationId : { var next : Nat },
) {
  /// Return all services, in catalogue order.
  public query func getServices() : async [Types.Service] {
    services.toArray();
  };

  /// Return services filtered by category.
  public query func getServicesByCategory(category : Types.ServiceCategory) : async [Types.Service] {
    LizaLib.filterByCategory(services.toArray(), category);
  };

  /// Return all promotional combos.
  public query func getCombos() : async [Types.Combo] {
    combos.toArray();
  };

  /// Return all workers (team members).
  public query func getWorkers() : async [Types.Worker] {
    workers.toArray();
  };

  /// Return all promoted products.
  public query func getProducts() : async [Types.Product] {
    products.toArray();
  };

  /// Return all client testimonials.
  public query func getTestimonials() : async [Types.Testimonial] {
    testimonials.toArray();
  };

  /// Return all protocol partners.
  public query func getPartners() : async [Types.Partner] {
    partners.toArray();
  };

  /// Submit an application through the Únete page. Stores the application,
  /// sends a transactional email to the Liza team, and returns the stored
  /// application on success.
  public shared ({ caller }) func submitApplication(
    name : Text,
    email : Text,
    specialty : Text,
    message : Text,
  ) : async Result.Result<Types.Application, Common.Error_> {
    ignore caller;
    if (name.size() == 0) {
      return #err(#invalidInput "El nombre es obligatorio");
    };
    if (email.size() == 0) {
      return #err(#invalidInput "El email es obligatorio");
    };
    if (specialty.size() == 0) {
      return #err(#invalidInput "La especialidad es obligatoria");
    };

    let id = nextApplicationId.next;
    nextApplicationId.next := id + 1;
    let application = LizaLib.newApplication(
      id,
      name,
      email,
      specialty,
      message,
      Int.abs(Time.now()),
    );
    applications.add(id, application);

    // Notify the Liza team about the new application.
    let subject = "Nueva postulación al protocolo Liza";
    let body =
      "<h2>Nueva postulación al protocolo Liza</h2>" #
      "<p>Se ha recibido una nueva postulación a través de la página Únete.</p>" #
      "<ul>" #
      "<li><strong>Nombre:</strong> " # name # "</li>" #
      "<li><strong>Email:</strong> " # email # "</li>" #
      "<li><strong>Especialidad:</strong> " # specialty # "</li>" #
      "<li><strong>Mensaje:</strong> " # message # "</li>" #
      "</ul>";
    let _emailResult = await EmailClient.sendServiceEmail(
      "no-reply",
      ["contacto@lizaespaciobelleza.cl"],
      subject,
      body,
    );

    #ok application;
  };
};
