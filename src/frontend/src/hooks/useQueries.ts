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
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";

// ---- Queries ----

export function useServices() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useServicesByCategory(category: ServiceCategory) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Service[]>({
    queryKey: ["services", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServicesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCombos() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Combo[]>({
    queryKey: ["combos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCombos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWorkers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Worker[]>({
    queryKey: ["workers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProducts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTestimonials() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePartners() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Partner[]>({
    queryKey: ["partners"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPartners();
    },
    enabled: !!actor && !isFetching,
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
