import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as propertyService from '../modules/property/services/propertyService';
import { Property } from '../modules/property/types';

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: propertyService.fetchProperties,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.fetchProperty(id),
  });
}

export function useSavePropertyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Property>) => propertyService.saveProperty(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdatePropertyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Property> }) =>
      propertyService.updateProperty(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}
