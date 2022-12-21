import type { FC } from 'react';
import { useState } from 'react';
import numeral from 'numeral';
import type { CardProps } from '@mui/material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography
} from '@mui/material';
import { InformationCircleOutlined as InformationCircleOutlinedIcon } from '../../../icons/information-circle-outlined';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';

interface Country {
  flag: string;
  name: string;
  seo: number;
  visits: number;
}

type SortDir = 'asc' | 'desc';

const applySort = (countries: Country[], sortDir: SortDir): Country[] => countries.sort((a, b) => {
  let newOrder = 0;

  if (a.visits < b.visits) {
    newOrder = -1;
  }

  if (a.visits > b.visits) {
    newOrder = 1;
  }

  return sortDir === 'asc' ? newOrder : -newOrder;
});

const countries: Country[] = [
  {
    flag: '/static/icons/us_flag.svg',
    name: 'United States',
    seo: 40,
    visits: 31200
  },
  {
    flag: '/static/icons/uk_flag.svg',
    name: 'United Kingdom',
    seo: 47,
    visits: 12700
  },
  {
    flag: '/static/icons/ru_flag.svg',
    name: 'Russia',
    seo: 65,
    visits: 10360
  },
  {
    flag: '/static/icons/ca_flag.svg',
    name: 'Canada',
    seo: 23,
    visits: 5749
  },
  {
    flag: '/static/icons/de_flag.svg',
    name: 'Germany',
    seo: 45,
    visits: 2932
  },
  {
    flag: '/static/icons/es_flag.svg',
    name: 'Spain',
    seo: 56,
    visits: 200
  }
];

export const AnalyticsVisitsByCountry: FC<CardProps> = (props) => {
  const [sort, setSort] = useState<SortDir>('desc');

  const handleSort = (): void => {
    setSort((prevOrder) => {
      if (prevOrder === 'asc') {
        return 'desc';
      }

      return 'asc';
    });
  };

  const sortedCountries = applySort(countries, sort);

  return (
    <Card {...props}>
      <CardHeader
        title="Keywords by country"
        action={(
          <Tooltip title="Refresh rate is 24h">
            <InformationCircleOutlinedIcon sx={{ color: 'action.active' }} />
          </Tooltip>
        )}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Country
            </TableCell>
            <TableCell sortDirection={sort}>
              <TableSortLabel
                active
                direction={sort}
                onClick={handleSort}
              >
                Value
              </TableSortLabel>
            </TableCell>
            <TableCell>
              SEO
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCountries.map((country) => (
            <TableRow
              key={country.name}
              sx={{
                '&:last-child td': {
                  border: 0
                }
              }}
            >
              <TableCell>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <Box
                    sx={{
                      height: 16,
                      width: 16,
                      '& img': {
                        height: 16,
                        width: 16
                      }
                    }}
                  >
                    <img
                      alt={country.name}
                      src={country.flag}
                    />
                  </Box>
                  <Typography
                    sx={{ ml: 1 }}
                    variant="subtitle2"
                  >
                    {country.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                {numeral(country.visits).format('0,0')}
              </TableCell>
              <TableCell>
                {country.seo}
                %
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Divider />
      <CardActions>
        <Button endIcon={(<ArrowRightIcon fontSize="small" />)}>
          See more
        </Button>
      </CardActions>
    </Card>
  );
};
