import type { backendInterface } from "@/backend";
import {
  ComboType,
  MintableItemType,
  ProductBadge,
  ServiceCategory,
  UserRole,
} from "@/backend";
import type {
  Error_,
  MintedServiceToken,
  Result_1,
  VusdDemoConfig,
  VusdWallet,
} from "@/backend";

// ---- vUSD demo in-memory state ----
// Mock state lives for the lifetime of the page. The demo walletId is stored
// in localStorage by useVusdSession; here we keep a single in-memory wallet per
// session so balances and minted tokens persist across modal reopens.

const VUSD_CONFIG: VusdDemoConfig = {
  clpUsdRate: 950n, // 950 CLP = 1 USD = 1 vUSD
  demoTopupAmount: 100000n, // 1000.00 vUSD per topup
};

const VUSD_INITIAL_BALANCE = 100000n; // 1000.00 vUSD

interface MockWalletState {
  wallet: VusdWallet;
  tokens: MintedServiceToken[];
}

// Map of walletId -> wallet state. A single demo wallet is created on connect.
const vusdState = new Map<string, MockWalletState>();
let vusdTokenCounter = 0n;

function nowNs(): bigint {
  return BigInt(Date.now()) * 1_000_000n;
}

function genWalletId(): string {
  // Faux wallet address: 0xvUSD... + random hex.
  const hex = Math.random().toString(16).slice(2, 10).padEnd(8, "0");
  return `0xvUSD${hex}`;
}

export const mockBackend: backendInterface = {
  async _initialize_access_control(): Promise<void> {
    return undefined;
  },
  async _internet_identity_sign_in_finish() {
    return { __kind__: "ok" as const, ok: null };
  },
  async _internet_identity_sign_in_start(): Promise<Uint8Array> {
    return new Uint8Array([1, 2, 3, 4]);
  },
  async assignCallerUserRole(): Promise<void> {
    return undefined;
  },
  async execute(): Promise<{ hasMore: boolean; rows: never[][] }> {
    return { hasMore: false, rows: [] };
  },
  async getCallerUserRole(): Promise<UserRole> {
    return UserRole.guest;
  },
  async getCombos() {
    return [
      {
        id: 0n,
        name: "Bienvenida Liza",
        description:
          "Combo para nuevas clientas: limpieza facial + hidratación corporal.",
        servicesIncluded: [0n, 5n],
        priceCLP: 70000n,
        regularPriceCLP: 85000n,
        validity: "Primera visita",
        comboType: ComboType.newClient,
        cuposTotal: 6n,
        agendaproUrl: "https://agendapro.com/cl/liza/combo-bienvenida",
      },
      {
        id: 1n,
        name: "Rutina Mensual Facial",
        description: "Limpieza facial + radiofrecuencia, una vez al mes.",
        servicesIncluded: [0n, 1n],
        priceCLP: 75000n,
        regularPriceCLP: 90000n,
        validity: "Mensual, renovable",
        comboType: ComboType.monthly,
        cuposTotal: 6n,
        agendaproUrl: "https://agendapro.com/cl/liza/combo-mensual",
      },
      {
        id: 2n,
        name: "Verano hasta Diciembre",
        description:
          "Drenaje linfático + masaje reafirmante + hidratación corporal.",
        servicesIncluded: [2n, 3n, 5n],
        priceCLP: 130000n,
        regularPriceCLP: 160000n,
        validity: "Válido hasta el 31 de diciembre",
        comboType: ComboType.untilDecember,
        cuposTotal: 4n,
        agendaproUrl: "https://agendapro.com/cl/liza/combo-verano",
      },
    ];
  },
  async getPartners() {
    return [
      {
        id: 0n,
        name: "Flow",
        description:
          "Pagos en cuotas simples y rápidas, con descuentos exclusivos para clientas del protocolo Liza.",
        logoText: "Flow",
      },
      {
        id: 1n,
        name: "Protocolo DeFi vUSD",
        description:
          "Protocolo DeFi que emite vUSD, un USD sintético estable, para pagos y reservas sin fricción.",
        logoText: "vU",
      },
    ];
  },
  async getProducts() {
    return [
      {
        id: 0n,
        name: "Sérum Facial Hidratante Liza",
        description: "Sérum facial con ácido hialurónico para uso diario.",
        usage:
          "Aplicar sobre piel limpia mañana y noche, antes del hidratante.",
        badge: ProductBadge.new_,
      },
      {
        id: 1n,
        name: "Crema Corporal Tensora",
        description: "Crema corporal reafirmante con activos tensoros.",
        usage:
          "Aplicar diariamente sobre la piel seca con masaje ascendente.",
        badge: ProductBadge.recommended,
      },
      {
        id: 2n,
        name: "Mascarilla Purificante",
        description: "Mascarilla facial purificante con arcilla blanca.",
        usage:
          "Usar 1-2 veces por semana sobre piel limpia, dejar 10 minutos y enjuagar.",
      },
    ];
  },
  async getServices() {
    return [
      {
        id: 0n,
        name: "Limpieza Facial Profunda",
        description: "Limpieza profunda con extracción y mascarilla.",
        longDescription:
          "Limpieza facial completa que incluye doble limpieza, vaporización, extracción de impurezas, mascarilla purificante e hidratación final. Ideal para todo tipo de piel.",
        durationMins: 60n,
        priceCLP: 35000n,
        category: ServiceCategory.facial,
        techniques: ["Doble limpieza", "Extracción manual", "Vaporización"],
        toolsIncluded: ["Mascarilla purificante", "Tónico", "Hidratante"],
        allIncluded: true,
        cuposTotal: 12n,
        agendaproUrl: "https://agendapro.com/cl/liza/limpieza-facial",
      },
      {
        id: 1n,
        name: "Radiofrecuencia Facial",
        description: "Tratamiento de firmeza con radiofrecuencia.",
        longDescription:
          "Sesión de radiofrecuencia facial que estimula la producción de colágeno, reafirma la piel y atenúa líneas de expresión. Incluye limpieza previa y crioterapia final.",
        durationMins: 75n,
        priceCLP: 55000n,
        category: ServiceCategory.facial,
        techniques: [
          "Radiofrecuencia monopolar",
          "Crioterapia",
          "Aplicación de suero",
        ],
        toolsIncluded: ["Gel conductor", "Suero de colágeno"],
        allIncluded: true,
        cuposTotal: 6n,
        agendaproUrl: "https://agendapro.com/cl/liza/radiofrecuencia-facial",
      },
      {
        id: 2n,
        name: "Drenaje Linfático Manual",
        description: "Masaje corporal de drenaje linfático.",
        longDescription:
          "Técnica de masaje manual suave que estimula el sistema linfático, reduce retención de líquidos y favorece la desintoxicación corporal.",
        durationMins: 60n,
        priceCLP: 40000n,
        category: ServiceCategory.corporal,
        techniques: ["Drenaje linfático manual", "Movimientos lentos y rítmicos"],
        toolsIncluded: ["Aceite corporal ligero"],
        allIncluded: false,
        cuposTotal: 12n,
        agendaproUrl: "https://agendapro.com/cl/liza/drenaje-linfatico",
      },
      {
        id: 3n,
        name: "Masaje Reafirmante Corporal",
        description: "Masaje reafirmante con tecnología.",
        longDescription:
          "Tratamiento corporal que combina masaje reafirmante con aparatología para mejorar la firmeza y textura de la piel. Sesión de 90 minutos con productos profesionales.",
        durationMins: 90n,
        priceCLP: 70000n,
        category: ServiceCategory.corporal,
        techniques: [
          "Masaje reafirmante",
          "Aparatología",
          "Aplicación de crema tensora",
        ],
        toolsIncluded: ["Crema tensora", "Gel conductor", "Mascarilla corporal"],
        allIncluded: true,
        cuposTotal: 4n,
        agendaproUrl: "https://agendapro.com/cl/liza/masaje-reafirmante",
      },
      {
        id: 4n,
        name: "Tratamiento Anti-Celulítico",
        description: "Protocolo intensivo anti-celulítico.",
        longDescription:
          "Protocolo intensivo que combina masaje modelador, aparatología y productos activos para reducir la apariencia de la celulitis. Recomendado en sesiones consecutivas.",
        durationMins: 90n,
        priceCLP: 80000n,
        category: ServiceCategory.especial,
        techniques: [
          "Masaje modelador",
          "Radiofrecuencia corporal",
          "Aplicación de activos",
        ],
        toolsIncluded: [
          "Crema activa anti-celulítica",
          "Gel conductor",
          "Film oclusivo",
        ],
        allIncluded: true,
        cuposTotal: 4n,
        agendaproUrl: "https://agendapro.com/cl/liza/anti-celulitico",
      },
      {
        id: 5n,
        name: "Hidratación Corporal Premium",
        description: "Hidratación corporal profunda con envoltura.",
        longDescription:
          "Tratamiento de hidratación corporal que incluye exfoliación, mascarilla hidratante y envoltura oclusiva para pieles resecas. Finaliza con masaje de absorción.",
        durationMins: 75n,
        priceCLP: 50000n,
        category: ServiceCategory.corporal,
        techniques: [
          "Exfoliación corporal",
          "Envoltura hidratante",
          "Masaje de absorción",
        ],
        toolsIncluded: ["Exfoliante", "Mascarilla hidratante", "Crema de cierre"],
        allIncluded: true,
        cuposTotal: 6n,
        agendaproUrl: "https://agendapro.com/cl/liza/hidratacion-corporal",
      },
    ];
  },
  async getServicesByCategory(category: ServiceCategory) {
    const all = await this.getServices();
    return all.filter((s) => s.category === category);
  },
  async getTestimonials() {
    return [
      {
        id: 0n,
        clientName: "María José",
        comment:
          "La limpieza facial con Gregoria dejó mi piel renovada. Súper recomendable.",
      },
      {
        id: 1n,
        clientName: "Constanza",
        comment:
          "El combo mensual facial es lo mejor que he hecho por mi piel este año.",
      },
      {
        id: 2n,
        clientName: "Paulina",
        comment:
          "El drenaje linfático con Camila me ayudó muchísimo con la retención de líquidos.",
      },
    ];
  },
  async getWorkers() {
    return [
      {
        id: 0n,
        name: "Gregoria Mendoza",
        role: "Especialista en cuidados faciales",
        bio: "Con más de 10 años de experiencia, Gregoria lidera los tratamientos faciales de Liza, especializándose en limpieza profunda, radiofrecuencia y protocolos anti-edad.",
        servicesIds: [0n, 1n],
        silhouetteVariant: 0n,
      },
      {
        id: 1n,
        name: "Camila Rojas",
        role: "Terapeuta corporal",
        bio: "Camila es terapeuta corporal certificada en drenaje linfático y masajes reafirmantes. Su enfoque combina técnica y relajación.",
        servicesIds: [2n, 3n, 5n],
        silhouetteVariant: 1n,
      },
      {
        id: 2n,
        name: "Daniela Soto",
        role: "Especialista en tratamientos especiales",
        bio: "Daniela se especializa en protocolos anti-celulíticos y tratamientos intensivos con aparatología. Acompaña a cada clienta en su proceso.",
        servicesIds: [4n],
        silhouetteVariant: 2n,
      },
      {
        id: 3n,
        name: "Francisca Vera",
        role: "Esteticista integral",
        bio: "Francisca cubre tratamientos faciales y corporales, con foco en hidratación y bienestar general. Atiende también a clientas nuevas.",
        servicesIds: [0n, 2n, 5n],
        silhouetteVariant: 3n,
      },
    ];
  },
  async isCallerAdmin(): Promise<boolean> {
    return false;
  },
  async schema(): Promise<string> {
    return "{}";
  },
  async submitApplication(name, email, specialty, message) {
    return {
      __kind__: "ok" as const,
      ok: {
        id: 0n,
        name,
        email,
        specialty,
        message,
        submittedAt: 0n,
      },
    };
  },

  // ---- vUSD demo methods (mock implementations) ----
  // These mirror the generated backendInterface vUSD methods. The useVusd
  // hooks probe the actor at runtime and fall back to this in-memory mock
  // when the real actor is unavailable (e.g. local dev without a canister).

  async getVusdConfig(): Promise<VusdDemoConfig> {
    return { ...VUSD_CONFIG };
  },

  async getVusdWallet(walletId: string): Promise<VusdWallet | null> {
    const state = vusdState.get(walletId);
    return state ? { ...state.wallet, balance: state.wallet.balance } : null;
  },

  async connectDemoWallet(): Promise<VusdWallet> {
    const walletId = genWalletId();
    const wallet: VusdWallet = {
      walletId,
      balance: VUSD_INITIAL_BALANCE,
      createdAt: nowNs(),
    };
    vusdState.set(walletId, { wallet, tokens: [] });
    return { ...wallet };
  },

  async topupVusd(walletId: string): Promise<VusdWallet> {
    const state = vusdState.get(walletId);
    if (!state) {
      throw new Error("Wallet no encontrada. Conéctala nuevamente.");
    }
    state.wallet = {
      ...state.wallet,
      balance: state.wallet.balance + VUSD_CONFIG.demoTopupAmount,
    };
    return { ...state.wallet };
  },

  async getMintedTokens(walletId: string): Promise<MintedServiceToken[]> {
    const state = vusdState.get(walletId);
    return state ? state.tokens.map((t) => ({ ...t })) : [];
  },

  async mintServiceToken(
    walletId: string,
    itemType: MintableItemType,
    itemId: bigint,
    itemName: string,
    priceVusd: bigint,
  ): Promise<Result_1> {
    const state = vusdState.get(walletId);
    if (!state) {
      const err: Error_ = {
        __kind__: "notFound",
        notFound: "Wallet no encontrada. Conéctala nuevamente.",
      };
      return { __kind__: "err", err };
    }
    if (state.wallet.balance < priceVusd) {
      const err: Error_ = {
        __kind__: "invalidInput",
        invalidInput: "Saldo vUSD insuficiente para mintear este service token.",
      };
      return { __kind__: "err", err };
    }
    vusdTokenCounter += 1n;
    const tokenId = vusdTokenCounter;
    state.wallet = {
      ...state.wallet,
      balance: state.wallet.balance - priceVusd,
    };
    const token: MintedServiceToken = {
      tokenId,
      walletId,
      itemType,
      itemId,
      itemName,
      priceVusd,
      mintedAt: nowNs(),
    };
    state.tokens.push(token);
    return {
      __kind__: "ok",
      ok: {
        tokenId,
        newBalance: state.wallet.balance,
        walletId,
      },
    };
  },
};
