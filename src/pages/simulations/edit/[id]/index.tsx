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
import { getSimulationById, updateSimulationById } from 'apiSdk/simulations';
import { Error } from 'components/error';
import { simulationValidationSchema } from 'validationSchema/simulations';
import { SimulationInterface } from 'interfaces/simulation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ProviderInterface } from 'interfaces/provider';
import { getProviders } from 'apiSdk/providers';

function SimulationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SimulationInterface>(
    () => (id ? `/simulations/${id}` : null),
    () => getSimulationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SimulationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSimulationById(id, values);
      mutate(updated);
      resetForm();
      router.push('/simulations');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SimulationInterface>({
    initialValues: data,
    validationSchema: simulationValidationSchema,
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
            Edit Simulation
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
            <FormControl id="pulse_sequence" mb="4" isInvalid={!!formik.errors?.pulse_sequence}>
              <FormLabel>Pulse Sequence</FormLabel>
              <Input
                type="text"
                name="pulse_sequence"
                value={formik.values?.pulse_sequence}
                onChange={formik.handleChange}
              />
              {formik.errors.pulse_sequence && <FormErrorMessage>{formik.errors?.pulse_sequence}</FormErrorMessage>}
            </FormControl>
            <FormControl id="parameters" mb="4" isInvalid={!!formik.errors?.parameters}>
              <FormLabel>Parameters</FormLabel>
              <Input type="text" name="parameters" value={formik.values?.parameters} onChange={formik.handleChange} />
              {formik.errors.parameters && <FormErrorMessage>{formik.errors?.parameters}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<ProviderInterface>
              formik={formik}
              name={'provider_id'}
              label={'Select Provider'}
              placeholder={'Select Provider'}
              fetcher={getProviders}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
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
  entity: 'simulation',
  operation: AccessOperationEnum.UPDATE,
})(SimulationEditPage);
