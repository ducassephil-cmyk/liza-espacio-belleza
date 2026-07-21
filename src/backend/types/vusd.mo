module {
  /// Identificador de wallet demo (mock, generado al "conectar wallet" en el
  /// modal del front-end). No corresponde a una wallet Web3 real.
  public type WalletId = Text;

  /// Saldo vUSD demo de un visitante. El balance se almacena en centavos de
  /// vUSD (1 vUSD = 100 centavos) como Nat, igual que los montos de los
  /// service tokens minteados.
  public type VusdWallet = {
    walletId : WalletId;
    balance : Nat; // vUSD cents
    createdAt : Nat; // Timestamp (ns)
  };

  /// Tipo de item que se puede "mintear" como service token demo.
  public type MintableItemType = {
    #service;
    #combo;
  };

  /// Service token demo: registro de un servicio o combo "minted" por un
  /// visitante usando su saldo vUSD demo. No es un NFT on-chain real.
  public type MintedServiceToken = {
    tokenId : Nat;
    walletId : WalletId;
    itemType : MintableItemType;
    itemId : Nat;
    itemName : Text;
    priceVusd : Nat; // vUSD cents
    mintedAt : Nat; // Timestamp (ns)
  };

  /// Resultado de un mint demo: tokenId asignado, nuevo saldo y wallet.
  public type VusdMintResult = {
    tokenId : Nat;
    newBalance : Nat; // vUSD cents
    walletId : WalletId;
  };

  /// Configuración del demo vUSD. Tasa CLP/USD para conversión de precios
  /// de servicios/combos a vUSD, y monto de recarga demo (en centavos de
  /// vUSD) que se acredita al pulsar "recargar saldo demo".
  public type VusdDemoConfig = {
    clpUsdRate : Nat; // CLP por 1 USD (ej. 950)
    demoTopupAmount : Nat; // vUSD cents acreditados en cada recarga (ej. 100000 = 1000 vUSD)
  };
};
