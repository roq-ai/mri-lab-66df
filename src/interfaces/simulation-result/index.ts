import { SimulationInterface } from 'interfaces/simulation';
import { GetQueryInterface } from 'interfaces';

export interface SimulationResultInterface {
  id?: string;
  simulation_id?: string;
  result_data: string;
  created_at?: any;
  updated_at?: any;

  simulation?: SimulationInterface;
  _count?: {};
}

export interface SimulationResultGetQueryInterface extends GetQueryInterface {
  id?: string;
  simulation_id?: string;
  result_data?: string;
}
