import { request, gql } from 'graphql-request';

const GRAPHQL_URL = 'http://localhost:9000/graphql';

export const getJobs = async () => {
  const query = gql`
    query Query {
      jobs {
        id
        title
        company {
          id
          name
          description
        }
        description
      }
    }
  `;

  try {
    const data = await request(GRAPHQL_URL, query);
    return data.jobs;
  } catch (error) {
    throw error;
  }
};

export const getJob = async (id) => {
  const query = gql`
    query Job($id: ID!) {
      job(id: $id) {
        id
        title
        description
        company {
          id
          name
          description
        }
      }
    }
  `;

  const variables = { id };

  try {
    const data = await request(GRAPHQL_URL, query, variables);
    return data.job;
  } catch (error) {
    throw error;
  }
};

export const getCompany = async (companyId) => {
  const query = gql`
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

  const variables = { companyId };

  try {
    const data = await request(GRAPHQL_URL, query, variables);
    return data.company;
  } catch (error) {
    throw error;
  }
};

export const createJob = async (input) => {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      # NOTE: the mutation name is the same as the query name
      # we can rename a filed in the mutation by using an alias (e.g. job: createJob)
      job: createJob(input: $input) {
        id
      }
    }
  `;

  const variables = { input };

  try {
    const data = await request(GRAPHQL_URL, mutation, variables);
    return data.job;
  } catch (error) {
    throw error;
  }
};
