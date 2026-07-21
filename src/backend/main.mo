import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";

import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";

import Types "types/liza-core";
import LizaApi "mixins/liza-core-api";

import VusdTypes "types/vusd";
import VusdApi "mixins/vusd-api";

actor {
  // --- Authorization (pre-existing scaffold; preserved) ---
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  // --- Liza domain stable state (initialized by the migration chain) ---
  let services : List.List<Types.Service>;
  let combos : List.List<Types.Combo>;
  let workers : List.List<Types.Worker>;
  let products : List.List<Types.Product>;
  let testimonials : List.List<Types.Testimonial>;
  let partners : List.List<Types.Partner>;
  let applications : Map.Map<Nat, Types.Application>;
  let nextApplicationId : { var next : Nat };

  // --- Liza domain public API ---
  include LizaApi(
    services,
    combos,
    workers,
    products,
    testimonials,
    partners,
    applications,
    nextApplicationId,
  );

  // --- vUSD demo stable state (initialized by the migration chain) ---
  let vusdWallets : Map.Map<VusdTypes.WalletId, VusdTypes.VusdWallet>;
  let mintedTokens : List.List<VusdTypes.MintedServiceToken>;
  let nextTokenId : { var next : Nat };
  let nextWalletId : { var next : Nat };
  let vusdConfig : VusdTypes.VusdDemoConfig;

  // --- vUSD demo public API ---
  include VusdApi(
    vusdWallets,
    mintedTokens,
    nextTokenId,
    nextWalletId,
    vusdConfig,
  );

  // --- OQL: expose primary stored collections for natural-language queries ---
  // Variant/array fields are projected to #text (variant arm name, or
  // array joined) so the manual `.payload` extractors return primitives
  // with registered implicit `_toRow` instances (Nat/Text/Bool).
  include Expose({
    entities = [
      services.toEntityManual("service", "Service", "id")
        .payload("id", func(s : Types.Service) : Nat { s.id })
        .payload("name", func(s : Types.Service) : Text { s.name })
        .payload("description", func(s : Types.Service) : Text { s.description })
        .payload("longDescription", func(s : Types.Service) : Text { s.longDescription })
        .payload("durationMins", func(s : Types.Service) : Nat { s.durationMins })
        .payload("priceCLP", func(s : Types.Service) : Nat { s.priceCLP })
        .payload("category", func(s : Types.Service) : Text {
          switch (s.category) {
            case (#facial) "facial";
            case (#corporal) "corporal";
            case (#especial) "especial";
          }
        })
        .payload("techniques", func(s : Types.Service) : Text {
          s.techniques.values().join(", ")
        })
        .payload("toolsIncluded", func(s : Types.Service) : Text {
          s.toolsIncluded.values().join(", ")
        })
        .payload("allIncluded", func(s : Types.Service) : Bool { s.allIncluded })
        .payload("cuposTotal", func(s : Types.Service) : Nat { s.cuposTotal })
        .payload("agendaproUrl", func(s : Types.Service) : Text { s.agendaproUrl })
        .public_()
        .build(),
      combos.toEntityManual("combo", "Combo", "id")
        .payload("id", func(c : Types.Combo) : Nat { c.id })
        .payload("name", func(c : Types.Combo) : Text { c.name })
        .payload("description", func(c : Types.Combo) : Text { c.description })
        .payload("servicesIncluded", func(c : Types.Combo) : Text {
          c.servicesIncluded.values().map(func(n : Nat) : Text { n.toText() }).join(", ")
        })
        .payload("priceCLP", func(c : Types.Combo) : Nat { c.priceCLP })
        .payload("regularPriceCLP", func(c : Types.Combo) : Nat { c.regularPriceCLP })
        .payload("validity", func(c : Types.Combo) : Text { c.validity })
        .payload("comboType", func(c : Types.Combo) : Text {
          switch (c.comboType) {
            case (#newClient) "newClient";
            case (#monthly) "monthly";
            case (#untilDecember) "untilDecember";
          }
        })
        .payload("cuposTotal", func(c : Types.Combo) : Nat { c.cuposTotal })
        .payload("agendaproUrl", func(c : Types.Combo) : Text { c.agendaproUrl })
        .public_()
        .build(),
      workers.toEntityManual("worker", "Worker", "id")
        .payload("id", func(w : Types.Worker) : Nat { w.id })
        .payload("name", func(w : Types.Worker) : Text { w.name })
        .payload("role", func(w : Types.Worker) : Text { w.role })
        .payload("bio", func(w : Types.Worker) : Text { w.bio })
        .payload("servicesIds", func(w : Types.Worker) : Text {
          w.servicesIds.values().map(func(n : Nat) : Text { n.toText() }).join(", ")
        })
        .payload("silhouetteVariant", func(w : Types.Worker) : Nat { w.silhouetteVariant })
        .public_()
        .build(),
      products.toEntityManual("product", "Product", "id")
        .payload("id", func(p : Types.Product) : Nat { p.id })
        .payload("name", func(p : Types.Product) : Text { p.name })
        .payload("description", func(p : Types.Product) : Text { p.description })
        .payload("usage", func(p : Types.Product) : Text { p.usage })
        .payload("badge", func(p : Types.Product) : Text {
          switch (p.badge) {
            case null "";
            case (?#new) "new";
            case (?#recommended) "recommended";
          }
        })
        .public_()
        .build(),
      testimonials.toEntity("testimonial", "Testimonial", "id")
        .sample({
          id = 0;
          clientName = "";
          comment = "";
        })
        .public_()
        .build(),
      partners.toEntity("partner", "Partner", "id")
        .sample({
          id = 0;
          name = "";
          description = "";
          logoText = "";
        })
        .public_()
        .build(),
      applications.toEntity("application", "Application", "id")
        .sample({
          id = 0;
          name = "";
          email = "";
          specialty = "";
          message = "";
          submittedAt = 0;
        })
        .controllerOnly()
        .build(),
      vusdWallets.toEntity("vusd_wallet", "VusdWallet", "walletId")
        .sample({
          walletId = "";
          balance = 0;
          createdAt = 0;
        })
        .public_()
        .build(),
      mintedTokens.toEntityManual("minted_service_token", "MintedServiceToken", "tokenId")
        .payload("tokenId", func(t : VusdTypes.MintedServiceToken) : Nat { t.tokenId })
        .payload("walletId", func(t : VusdTypes.MintedServiceToken) : Text { t.walletId })
        .payload("itemType", func(t : VusdTypes.MintedServiceToken) : Text {
          switch (t.itemType) {
            case (#service) "service";
            case (#combo) "combo";
          }
        })
        .payload("itemId", func(t : VusdTypes.MintedServiceToken) : Nat { t.itemId })
        .payload("itemName", func(t : VusdTypes.MintedServiceToken) : Text { t.itemName })
        .payload("priceVusd", func(t : VusdTypes.MintedServiceToken) : Nat { t.priceVusd })
        .payload("mintedAt", func(t : VusdTypes.MintedServiceToken) : Nat { t.mintedAt })
        .public_()
        .build(),
    ];
  });
};
