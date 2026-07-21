import Int "mo:core/Int";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Result "mo:core/Result";
import Time "mo:core/Time";

import Types "../types/vusd";
import Common "../types/common";

/// Public API surface for the vUSD demo domain. State is injected by the
/// composition root in main.mo. All endpoints are demo-only: no transacciones
/// reales on-chain, no minteo real de NFT, no integración real con el
/// protocolo DeFi. El saldo vUSD y los service tokens son representaciones
/// visuales demo almacenadas en estado del backend.
mixin (
  vusdWallets : Map.Map<Types.WalletId, Types.VusdWallet>,
  mintedTokens : List.List<Types.MintedServiceToken>,
  nextTokenId : { var next : Nat },
  nextWalletId : { var next : Nat },
  vusdConfig : Types.VusdDemoConfig,
) {
  /// Retorna la configuración del demo vUSD (tasa CLP/USD y monto de recarga).
  public query func getVusdConfig() : async Types.VusdDemoConfig {
    vusdConfig;
  };

  /// Retorna el wallet vUSD demo del visitante actual, si existe.
  public query func getVusdWallet(walletId : Types.WalletId) : async ?Types.VusdWallet {
    vusdWallets.get(walletId);
  };

  /// Crea un wallet vUSD demo con saldo inicial demo. Simula el flujo de
  /// "conectar wallet" del modal del front-end. Genera un walletId mock a
  /// partir de un contador y acredita el monto de recarga demo configurado.
  public func connectDemoWallet() : async Types.VusdWallet {
    let n = nextWalletId.next;
    nextWalletId.next := n + 1;
    let walletId : Types.WalletId = "vusd-" # n.toText();
    let wallet : Types.VusdWallet = {
      walletId;
      balance = vusdConfig.demoTopupAmount;
      createdAt = Int.abs(Time.now());
    };
    vusdWallets.add(walletId, wallet);
    wallet;
  };

  /// Recarga el saldo vUSD demo del visitante con el monto configurado en
  /// `vusdConfig.demoTopupAmount`. Simula recibir vUSD del protocolo DeFi.
  public func topupVusd(walletId : Types.WalletId) : async Types.VusdWallet {
    switch (vusdWallets.get(walletId)) {
      case (?wallet) {
        let updated : Types.VusdWallet = {
          wallet with
          balance = wallet.balance + vusdConfig.demoTopupAmount;
        };
        vusdWallets.add(walletId, updated);
        updated;
      };
      case null {
        // Wallet no encontrado: no debería ocurrir en el flujo demo, pero
        // creamos uno nuevo con el saldo de recarga para mantener el flujo
        // demostrable.
        let wallet : Types.VusdWallet = {
          walletId;
          balance = vusdConfig.demoTopupAmount;
          createdAt = Int.abs(Time.now());
        };
        vusdWallets.add(walletId, wallet);
        wallet;
      };
    };
  };

  /// Retorna todos los service tokens minteados por el visitante actual.
  public query func getMintedTokens(walletId : Types.WalletId) : async [Types.MintedServiceToken] {
    mintedTokens.filter(func(t : Types.MintedServiceToken) : Bool { t.walletId == walletId }).toArray();
  };

  /// Procesa el "mint" demo de un service token: valida saldo suficiente,
  /// descuenta vUSD del wallet, registra el service token y retorna la
  /// confirmación con el nuevo saldo.
  public func mintServiceToken(
    walletId : Types.WalletId,
    itemType : Types.MintableItemType,
    itemId : Nat,
    itemName : Text,
    priceVusd : Nat,
  ) : async Result.Result<Types.VusdMintResult, Common.Error_> {
    switch (vusdWallets.get(walletId)) {
      case null {
        return #err(#notFound "Wallet vUSD no encontrado");
      };
      case (?wallet) {
        if (wallet.balance < priceVusd) {
          return #err(#invalidInput "Saldo vUSD insuficiente");
        };
        let tokenId = nextTokenId.next;
        nextTokenId.next := tokenId + 1;
        let newBalance = wallet.balance - priceVusd;
        let updatedWallet : Types.VusdWallet = {
          wallet with
          balance = newBalance;
        };
        vusdWallets.add(walletId, updatedWallet);
        let token : Types.MintedServiceToken = {
          tokenId;
          walletId;
          itemType;
          itemId;
          itemName;
          priceVusd;
          mintedAt = Int.abs(Time.now());
        };
        mintedTokens.add(token);
        #ok({
          tokenId;
          newBalance;
          walletId;
        });
      };
    };
  };
};
