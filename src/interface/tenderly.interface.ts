export interface ITenderlySampleRequest {
  network_id: string;
  from: string;
  to: string;
  input: string;
  save: boolean;
  save_if_fails: boolean;
  simulation_type: string;
}
