import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: Id;
    name: string;
    description: string;
    usage: string;
    badge?: ProductBadge;
}
export type Error_ = {
    __kind__: "invalidInput";
    invalidInput: string;
} | {
    __kind__: "notFound";
    notFound: string;
} | {
    __kind__: "unauthorized";
    unauthorized: string;
};
export type Timestamp = bigint;
export type Result_2 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Combo {
    id: Id;
    validity: string;
    regularPriceCLP: bigint;
    agendaproUrl: string;
    name: string;
    description: string;
    comboType: ComboType;
    cuposTotal: bigint;
    servicesIncluded: Array<Id>;
    priceCLP: bigint;
}
export interface Application {
    id: Id;
    name: string;
    submittedAt: Timestamp;
    email: string;
    specialty: string;
    message: string;
}
export interface Result__1 {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface Service {
    id: Id;
    durationMins: bigint;
    agendaproUrl: string;
    techniques: Array<string>;
    toolsIncluded: Array<string>;
    allIncluded: boolean;
    name: string;
    description: string;
    cuposTotal: bigint;
    category: ServiceCategory;
    priceCLP: bigint;
    longDescription: string;
}
export interface VusdMintResult {
    tokenId: bigint;
    newBalance: bigint;
    walletId: WalletId;
}
export interface Partner {
    id: Id;
    name: string;
    description: string;
    logoText: string;
}
export type Result_1 = {
    __kind__: "ok";
    ok: VusdMintResult;
} | {
    __kind__: "err";
    err: Error_;
};
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface VusdDemoConfig {
    demoTopupAmount: bigint;
    clpUsdRate: bigint;
}
export type Result = {
    __kind__: "ok";
    ok: Application;
} | {
    __kind__: "err";
    err: Error_;
};
export interface MintedServiceToken {
    itemId: bigint;
    tokenId: bigint;
    mintedAt: bigint;
    itemName: string;
    itemType: MintableItemType;
    priceVusd: bigint;
    walletId: WalletId;
}
export interface Cell {
    value: Value;
    name: string;
}
export type Id = bigint;
export interface VusdWallet {
    balance: bigint;
    createdAt: bigint;
    walletId: WalletId;
}
export type WalletId = string;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export interface Worker {
    id: Id;
    bio: string;
    servicesIds: Array<Id>;
    name: string;
    role: string;
    silhouetteVariant: bigint;
}
export interface Testimonial {
    id: Id;
    clientName: string;
    comment: string;
}
export enum ComboType {
    untilDecember = "untilDecember",
    monthly = "monthly",
    newClient = "newClient"
}
export enum MintableItemType {
    service = "service",
    combo = "combo"
}
export enum ProductBadge {
    new_ = "new",
    recommended = "recommended"
}
export enum ServiceCategory {
    especial = "especial",
    corporal = "corporal",
    facial = "facial"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    connectDemoWallet(): Promise<VusdWallet>;
    execute(qJson: string): Promise<Result__1>;
    getCallerUserRole(): Promise<UserRole>;
    getCombos(): Promise<Array<Combo>>;
    getMintedTokens(walletId: WalletId): Promise<Array<MintedServiceToken>>;
    getPartners(): Promise<Array<Partner>>;
    getProducts(): Promise<Array<Product>>;
    getServices(): Promise<Array<Service>>;
    getServicesByCategory(category: ServiceCategory): Promise<Array<Service>>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getVusdConfig(): Promise<VusdDemoConfig>;
    getVusdWallet(walletId: WalletId): Promise<VusdWallet | null>;
    getWorkers(): Promise<Array<Worker>>;
    isCallerAdmin(): Promise<boolean>;
    mintServiceToken(walletId: WalletId, itemType: MintableItemType, itemId: bigint, itemName: string, priceVusd: bigint): Promise<Result_1>;
    schema(): Promise<string>;
    submitApplication(name: string, email: string, specialty: string, message: string): Promise<Result>;
    topupVusd(walletId: WalletId): Promise<VusdWallet>;
}
