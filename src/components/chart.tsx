import React from 'react';
import dynamic from 'next/dynamic';
import { Props } from 'react-apexcharts';

export const Chart = dynamic<Props>(
  () => import('react-apexcharts'),
  {
    ssr: false,
    loading: () => null
  }
);
