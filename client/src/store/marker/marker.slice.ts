/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { apiSlice } from '../api';
import { IMarker } from '@/types';

const transformMarkerResponse = ({
  data: {
    longitude,
    latitude,
    timestamp,
    type,
  },
}: any): IMarker => ({
    longitude,
    latitude,
    timestamp,
    type,
});

export const marker = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMarkers: builder.query<{ data: IMarker[] }, void>({
      query: () => '/all-markers',
    }),
    saveMarker: builder.mutation<void, IMarker>({
      query: (body) => ({
        url: '/marker',
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const {
  useGetMarkersQuery,
  useSaveMarkerMutation,
} = marker;
