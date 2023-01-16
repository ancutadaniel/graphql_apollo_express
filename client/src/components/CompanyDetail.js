import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getCompany } from '../graphql/queries';
import JobList from './JobList';

function CompanyDetail() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);

  const fetchCompany = async (id) => {
    try {
      const company = await getCompany(id);
      setCompany(company);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchCompany(companyId);
  }, [companyId]);

  if (!company)
    return (
      <>
        <div>Something went wrong!</div>
        {error && <div>{error.message}</div>}
      </>
    );

  return (
    <div>
      <h1 className='title'>{company.name}</h1>
      <div className='box'>{company.description}</div>
      <h5 className='title is-5'>Jobs at {company.name}</h5>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyDetail;
