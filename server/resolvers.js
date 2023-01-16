import { Job, Company } from '../server/db.js';

export const resolvers = {
  Query: {
    // receive the parent object and the arguments in the resolver
    job: (_root, { id }) => Job.findById(id),
    company: (_root, { id }) => Company.findById(id),
    jobs: () => Job.findAll(),
  },

  // add a resolver for the company field on the Job type - this is a field resolver
  // job is the parent object, which is the Job object
  Job: {
    company: (job) => Company.findById(job.companyId),
  },

  // add a resolver for the jobs field on the Company type - this is a field resolver
  // company is the parent object, which is the Company object
  Company: {
    jobs: (company) => Job.findAll((job) => job.companyId === company.id),
  },

  Mutation: {
    createJob: (_root, { input }) => Job.create(input),
    deleteJob: (_root, { id }) => Job.delete(id),
    updateJob: (_root, { input }) => Job.update(input),
  },
};
