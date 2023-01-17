import { useQuery, useMutation } from '@apollo/client';
import {
  JOBS_QUERY,
  JOB_QUERY,
  COMPANY_QUERY,
  CREATE_JOB_MUTATION,
} from '../graphql/queries';

// Custom hooks to fetch jobs, job and company data
export const useJobs = () => {
  const { loading, error, data } = useQuery(JOBS_QUERY, {
    fetchPolicy: 'network-only',
  });
  return { loading, error: Boolean(error), jobs: data?.jobs };
};

export const useJob = (id) => {
  const { loading, error, data } = useQuery(JOB_QUERY, {
    variables: { id },
    fetchPolicy: 'network-only',
  });
  return { loading, error: Boolean(error), job: data?.job };
};

export const useCompany = (companyId) => {
  const { loading, error, data } = useQuery(COMPANY_QUERY, {
    variables: { companyId },
    fetchPolicy: 'network-only',
  });
  return { loading, error: Boolean(error), company: data?.company };
};

export const useCreateJob = () => {
  const [mutate, { loading, error }] = useMutation(CREATE_JOB_MUTATION);
  return {
    createJob: async (title, description) => {
      const {
        data: { job },
      } = await mutate({
        variables: { input: { title, description } },
        update: (cache, { data: { job } }) => {
          cache.writeQuery({
            query: JOB_QUERY,
            // NOTE: we can pass in the variables for the query here
            variables: { id: job.id },
            data: { job },
          });
        },
      });
      return job;
    },
    loading,
    error: Boolean(error),
  };
};
