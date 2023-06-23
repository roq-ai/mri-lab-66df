import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getSimulationResultById, updateSimulationResultById } from 'apiSdk/simulation-results';
import { Error } from 'components/error';
import { simulationResultValidationSchema } from 'validationSchema/simulation-results';
import { SimulationResultInterface } from 'interfaces/simulation-result';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { SimulationInterface } from 'interfaces/simulation';
import { getSimulations } from 'apiSdk/simulations';

function SimulationResultEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SimulationResultInterface>(
    () => (id ? `/simulation-results/${id}` : null),
    () => getSimulationResultById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SimulationResultInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSimulationResultById(id, values);
      mutate(updated);
      resetForm();
      router.push('/simulation-results');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SimulationResultInterface>({
    initialValues: data,
    validationSchema: simulationResultValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Simulation Result
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="result_data" mb="4" isInvalid={!!formik.errors?.result_data}>
              <FormLabel>Result Data</FormLabel>
              <Input type="text" name="result_data" value={formik.values?.result_data} onChange={formik.handleChange} />
              {formik.errors.result_data && <FormErrorMessage>{formik.errors?.result_data}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<SimulationInterface>
              formik={formik}
              name={'simulation_id'}
              label={'Select Simulation'}
              placeholder={'Select Simulation'}
              fetcher={getSimulations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.pulse_sequence}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'simulation_result',
  operation: AccessOperationEnum.UPDATE,
})(SimulationResultEditPage);
