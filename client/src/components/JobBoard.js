import { useEffect, useState } from 'react';
import JobList from './JobList';
import { getJobs } from '../graphql/queries';

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const fetchJobs = async () => {
    try {
      const jobs = await getJobs();
      setJobs(jobs);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <h1 className='title'>Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard;
