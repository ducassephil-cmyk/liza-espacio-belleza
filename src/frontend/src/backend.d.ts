import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Testimonial {
    id: Id;
    clientName: string;
    comment: string;
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
export interface Result__1 {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface Partner {
    id: Id;
    name: string;
    description: string;
    logoText: string;
}
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
export type Result_1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type Result = {
    __kind__: "ok";
    ok: Application;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Cell {
    value: Value;
    name: string;
}
export type Id = bigint;
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
export interface Product {
    id: Id;
    name: string;
    description: string;
    usage: string;
    badge?: ProductBadge;
}
export enum ComboType {
    untilDecember = "untilDecember",
    monthly = "monthly",
    newClient = "newClient"
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
    execute(qJson: string): Promise<Result__1>;
    getCallerUserRole(): Promise<UserRole>;
    getCombos(): Promise<Array<Combo>>;
    getPartners(): Promise<Array<Partner>>;
    getProducts(): Promise<Array<Product>>;
    getServices(): Promise<Array<Service>>;
    getServicesByCategory(category: ServiceCategory): Promise<Array<Service>>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getWorkers(): Promise<Array<Worker>>;
    isCallerAdmin(): Promise<boolean>;
    schema(): Promise<string>;
    submitApplication(name: string, email: string, specialty: string, message: string): Promise<Result>;
}
