import { createActor } from "@/backend";
import type {
  Application,
  Combo,
  Partner,
  Product,
  Result,
  Service,
  ServiceCategory,
  Testimonial,
  Worker,
} from "@/backend";
import { mockBackend } from "@/mocks/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";

function resolveActor(actor: Awaited<ReturnType<typeof createActor>> | null) {
  return actor ?? mockBackend;
}

// ---- Queries ----

export function useServices() {
  const { actor } = useActor(createActor);
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => resolveActor(actor).getServices(),
    enabled: true,
  });
}

export function useServicesByCategory(category: ServiceCategory) {
  const { actor } = useActor(createActor);
  return useQuery<Service[]>({
    queryKey: ["services", category],
    queryFn: async () => resolveActor(actor).getServicesByCategory(category),
    enabled: true,
  });
}

export function useCombos() {
  const { actor } = useActor(createActor);
  return useQuery<Combo[]>({
    queryKey: ["combos"],
    queryFn: async () => resolveActor(actor).getCombos(),
    enabled: true,
  });
}

export function useWorkers() {
  const { actor } = useActor(createActor);
  return useQuery<Worker[]>({
    queryKey: ["workers"],
    queryFn: async () => resolveActor(actor).getWorkers(),
    enabled: true,
  });
}

export function useProducts() {
  const { actor } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => resolveActor(actor).getProducts(),
    enabled: true,
  });
}

export function useTestimonials() {
  const { actor } = useActor(createActor);
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => resolveActor(actor).getTestimonials(),
    enabled: true,
  });
}

export function usePartners() {
  const { actor } = useActor(createActor);
  return useQuery<Partner[]>({
    queryKey: ["partners"],
    queryFn: async () => resolveActor(actor).getPartners(),
    enabled: true,
  });
}

// ---- Mutations ----

export interface SubmitApplicationInput {
  name: string;
  email: string;
  specialty: string;
  message: string;
}

export function useSubmitApplication() {
  const { actor } = useActor(createActor);
  return useMutation<Result, Error, SubmitApplicationInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Backend no disponible");
      return actor.submitApplication(
        input.name,
        input.email,
        input.specialty,
        input.message,
      );
    },
  });
}

// Re-export Application type for convenience in pages.
export type { Application };
