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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createSimulation } from 'apiSdk/simulations';
import { Error } from 'components/error';
import { simulationValidationSchema } from 'validationSchema/simulations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ProviderInterface } from 'interfaces/provider';
import { getProviders } from 'apiSdk/providers';
import { SimulationInterface } from 'interfaces/simulation';

function SimulationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SimulationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSimulation(values);
      resetForm();
      router.push('/simulations');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SimulationInterface>({
    initialValues: {
      pulse_sequence: '',
      parameters: '',
      provider_id: (router.query.provider_id as string) ?? null,
    },
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
            Create Simulation
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'simulation',
  operation: AccessOperationEnum.CREATE,
})(SimulationCreatePage);
