import axios from 'axios';
import queryString from 'query-string';
import { ProviderInterface, ProviderGetQueryInterface } from 'interfaces/provider';
import { GetQueryInterface } from '../../interfaces';

export const getProviders = async (query?: ProviderGetQueryInterface) => {
  const response = await axios.get(`/api/providers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createProvider = async (provider: ProviderInterface) => {
  const response = await axios.post('/api/providers', provider);
  return response.data;
};

export const updateProviderById = async (id: string, provider: ProviderInterface) => {
  const response = await axios.put(`/api/providers/${id}`, provider);
  return response.data;
};

export const getProviderById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/providers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteProviderById = async (id: string) => {
  const response = await axios.delete(`/api/providers/${id}`);
  return response.data;
};
