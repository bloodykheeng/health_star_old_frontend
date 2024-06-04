import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const BreadcrumbNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paths = location.pathname.split('/').filter((path) => path !== '');

  const handleClick = (event, index) => {
    event.preventDefault();
    const stepsBack = index - paths.length + 1;
    // console.log('🚀 ~ handleClick ~ stepsBack:', stepsBack);
    navigate(stepsBack);
  };

  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ marginBottom: '1rem' }}>
      <Link
        color="inherit"
        href="/"
        onClick={(event) => {
          event.preventDefault();
          navigate('/');
        }}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      {paths.map((path, index) => {
        const pathName = path.charAt(0).toUpperCase() + path.slice(1);
        const isLast = index === paths.length - 1;

        return isLast ? (
          <Typography key={index} color="text.primary">
            {pathName}
          </Typography>
        ) : (
          <Link
            key={index}
            color="inherit"
            // href={`/${paths.slice(0, index + 1).join('/')}`}
            onClick={(event) => handleClick(event, index)}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            {pathName}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;
