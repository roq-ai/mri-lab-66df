import * as yup from 'yup';

export const simulationValidationSchema = yup.object().shape({
  pulse_sequence: yup.string().required(),
  parameters: yup.string().required(),
  provider_id: yup.string().nullable(),
});
