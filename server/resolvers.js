import { Job, Company } from '../server/db.js';

function rejectIfNotAuthenticated(condition) {
  if (!condition) {
    throw new Error('Unauthorized');
  }
}

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
    createJob: (_root, args, context) => {
      const { user } = context;
      const { input } = args;
      rejectIfNotAuthenticated(user);
      return Job.create({ ...input, companyId: user.companyId });
    },
    deleteJob: async (_root, { id }, { user }) => {
      // check if user is logged in before deleting a job and the job belongs to the user company id
      rejectIfNotAuthenticated(user);
      const job = await Job.findById(id);
      rejectIfNotAuthenticated(job.companyId === user.companyId);

      return Job.delete(id);
    },
    updateJob: async (_root, { input }, { user }) => {
      rejectIfNotAuthenticated(user);
      const job = await Job.findById(input.id);
      rejectIfNotAuthenticated(job.companyId === user.companyId);
      return Job.update({ ...input, companyId: user.companyId });
    },
  },
}; // end of resolvers
