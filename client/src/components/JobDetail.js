import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { getJob } from '../graphql/queries';

function JobDetail() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  const fetchJob = async (id) => {
    const job = await getJob(id);
    setJob(job);
  };

  useEffect(() => {
    fetchJob(jobId);
  }, [jobId]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className='title'>{job.title}</h1>
      <h2 className='subtitle'>
        <Link to={`/companies/${job.company?.id}`}>{job.company?.name}</Link>
      </h2>
      <div className='box'>{job.description}</div>
    </div>
  );
}

export default JobDetail;
