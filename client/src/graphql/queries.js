import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
// import { request } from 'graphql-request';
import { getAccessToken } from '../auth';

const GRAPHQL_URL = 'http://localhost:9000/graphql';

const JOB_DETAIL_FRAGMENT = gql`
  fragment JobDetail on Job {
    id
    title
    description
    company {
      id
      name
    }
  }
`;

export const JOBS_QUERY = gql`
  query JobsQuery {
    jobs {
      id
      title
      company {
        id
        name
      }
      description
    }
  }
`;

// NOTE: we can use the gql tag to parse the query string into a query document
export const JOB_QUERY = gql`
  query Job($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  # inset the fragment into the query
  ${JOB_DETAIL_FRAGMENT}
`;

export const COMPANY_QUERY = gql`
  query Company($companyId: ID!) {
    company(id: $companyId) {
      id
      name
      description
      jobs {
        id
        title
        description
      }
    }
  }
`;

export const CREATE_JOB_MUTATION = gql`
  mutation CreateJob($input: CreateJobInput!) {
    # NOTE: the mutation name is the same as the query name
    # we can rename a filed in the mutation by using an alias (e.g. job: createJob)
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`;

// ================================================================================================= /
// NOTE: Apollo Client is a GraphQL client that allows us to easily query data from a GraphQL server
// It also provides a cache that can be used to store data locally
export const client = new ApolloClient({
  uri: GRAPHQL_URL,
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
  cache: new InMemoryCache(),
  // NOTE: we can set the default fetch policy for all queries, mutations, and subscriptions here (e.g. 'network-only')
  // or we can set the fetch policy for each query, mutation, or subscription individually above
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: 'network-only',
  //   },
  //   mutate: {
  //     fetchPolicy: 'network-only',
  //   },
  //   watchQuery: {
  //     fetchPolicy: 'network-only',
  //   },
  // },
});

// ================================================================================================= /
// This was replaced by the useJobs hook in src/components/JobBoard.js
// export const getJobs = async () => {
// try {
// Approach 1: Using Apollo Client
// const {
//   data: { jobs },
// } = await client.query({
//   query: JOBS_QUERY,
//   fetchPolicy: 'network-only',
// });
// return jobs;

// Approach 2: Using graphql-request
// const data = await request(GRAPHQL_URL, query);
// return data.jobs;
//   } catch (error) {
//     throw error;
//   }
// };

// ================================================================================================= /
// This was replaced by the useJob hook in src/components/JobDetail.js
// export const getJob = async (id) => {
//   const variables = { id };
//   try {
// Approach 1: Using Apollo Client
// const {
//   data: { job },
// } = await client.query({ query: JOB_QUERY, variables });
// return job;

// Approach 2: Using graphql-request
// const data = await request(GRAPHQL_URL, query, variables);
// return data.job;
//   } catch (error) {
//     throw error;
//   }
// };

// ================================================================================================= /
// This was replaced by the useCompany hook in src/components/CompanyDetail.js
// export const getCompany = async (companyId) => {
//   const variables = { companyId };

//   try {
// Approach 1: Using Apollo Client
// const {
//   data: { company },
// } = await client.query({ query: COMPANY_QUERY, variables });
// return company;

// Approach 2: Using graphql-request
// const data = await request(GRAPHQL_URL, query, variables);
// return data.company;
//   } catch (error) {
//     throw error;
//   }
// };

// ================================================================================================= /
// This was replaced by the useCreateJob hook in src/components/CreateJob.js
// export const createJob = async (input) => {
//   try {
//     const variables = { input };
// const headers = { Authorization: `Bearer ${getAccessToken()}` };

// Approach 1: Using Apollo Client
// const {
//   data: { job },
// } = await client.mutate({
//   mutation: CREATE_JOB_MUTATION,
//   variables,

// NOTE: we can use the update function to update the cache after the mutation is completed
// we avoid having to refetch the data from the server after the mutation is completed
// update: (cache, { data: { job } }) => {
//   cache.writeQuery({
//     query: JOB_QUERY,
// NOTE: we can pass in the variables for the query here
//       variables: { id: job.id },
//       data: { job },
//     });
//   },
// });
// return job;

// Approach 2: Using graphql-request
// const data = await request(GRAPHQL_URL, mutation, variables, headers);
// return data.job;
//   } catch (error) {
//     throw error;
//   }
// };
