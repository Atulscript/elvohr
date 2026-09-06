import React from 'react';
import { useParams } from 'react-router-dom';
import Careers from '../components/Careers';

const CareersPage = () => {
  const { jobId } = useParams();
  return (
    <div style={{ paddingTop: '80px' }}>
      <Careers initialJobId={jobId} />
    </div>
  );
};

export default CareersPage;
