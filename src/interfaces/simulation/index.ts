import { SimulationResultInterface } from 'interfaces/simulation-result';
import { ProviderInterface } from 'interfaces/provider';
import { GetQueryInterface } from 'interfaces';

export interface SimulationInterface {
  id?: string;
  pulse_sequence: string;
  parameters: string;
  provider_id?: string;
  created_at?: any;
  updated_at?: any;
  simulation_result?: SimulationResultInterface[];
  provider?: ProviderInterface;
  _count?: {
    simulation_result?: number;
  };
}

export interface SimulationGetQueryInterface extends GetQueryInterface {
  id?: string;
  pulse_sequence?: string;
  parameters?: string;
  provider_id?: string;
}
