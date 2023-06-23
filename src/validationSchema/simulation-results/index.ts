import * as yup from 'yup';

export const simulationResultValidationSchema = yup.object().shape({
  result_data: yup.string().required(),
  simulation_id: yup.string().nullable(),
});
