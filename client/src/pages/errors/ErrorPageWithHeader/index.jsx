import React from 'react';
import { useLocation } from 'react-router-dom';

import { Header } from '/src/components/articles_platform/Header';
import ErrorPage from '/src/pages/errors/ErrorPage';

const Page403 = () => {
  const location = useLocation();
  const { code, type, message } = location.state || {};

  return (
    <div style={{minHeight: '100vh'}}>
      <Header position='sticky' />
      <ErrorPage
        code={code}
        type={type}
        message={message}
      />
    </div>
  )
}

export default Page403
