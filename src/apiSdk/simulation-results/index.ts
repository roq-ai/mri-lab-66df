import axios from 'axios';
import queryString from 'query-string';
import { SimulationResultInterface, SimulationResultGetQueryInterface } from 'interfaces/simulation-result';
import { GetQueryInterface } from '../../interfaces';

export const getSimulationResults = async (query?: SimulationResultGetQueryInterface) => {
  const response = await axios.get(`/api/simulation-results${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSimulationResult = async (simulationResult: SimulationResultInterface) => {
  const response = await axios.post('/api/simulation-results', simulationResult);
  return response.data;
};

export const updateSimulationResultById = async (id: string, simulationResult: SimulationResultInterface) => {
  const response = await axios.put(`/api/simulation-results/${id}`, simulationResult);
  return response.data;
};

export const getSimulationResultById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/simulation-results/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSimulationResultById = async (id: string) => {
  const response = await axios.delete(`/api/simulation-results/${id}`);
  return response.data;
};
