import type { ChangeEvent, MouseEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { endOfDay, startOfDay } from 'date-fns';
import type { Theme } from '@mui/material';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { invoiceApi } from '../../../__fake-api__/invoice-api';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import type { Filters } from '../../../components/dashboard/invoice/invoice-list-filters';
import { InvoiceListFilters } from '../../../components/dashboard/invoice/invoice-list-filters';
import { InvoiceListTable } from '../../../components/dashboard/invoice/invoice-list-table';
import { useMounted } from '../../../hooks/use-mounted';
import { Filter as FilterIcon } from '../../../icons/filter';
import { Plus as PlusIcon } from '../../../icons/plus';
import { gtm } from '../../../lib/gtm';
import type { Invoice } from '../../../types/invoice';

const applyFilters = (
  invoices: Invoice[],
  filters: Filters
): Invoice[] => invoices.filter((invoice) => {
  if (filters.query) {
    const queryMatched = invoice.number.toLowerCase().includes(filters.query.toLowerCase());

    if (!queryMatched) {
      return false;
    }
  }

  if (filters.startDate && invoice.issueDate) {
    // Convert the filter start date to timestamp to be able to compare with the
    // timestamp from the invoice
    const startDateMatched = endOfDay(invoice.issueDate) >= startOfDay(filters.startDate.getTime());

    if (!startDateMatched) {
      return false;
    }
  }

  if (filters.endDate && invoice.issueDate) {
    // Convert the filter end date to timestamp to be able to compare with the
    // timestamp from the invoice
    const endDateMatched = startOfDay(invoice.issueDate) <= endOfDay(filters.endDate.getTime());

    if (!endDateMatched) {
      return false;
    }
  }

  if (filters.customer && filters.customer.length > 0) {
    const customerMatched = filters.customer.includes(invoice.customer.name);

    if (!customerMatched) {
      return false;
    }
  }

  if (filters.status === 'paid' && invoice.status !== 'paid') {
    return false;
  }

  return true;
});

const applyPagination = (
  invoices: Invoice[],
  page: number,
  rowsPerPage: number
): Invoice[] => invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const InvoiceListInner = styled(
  'div',
  { shouldForwardProp: (prop) => prop !== 'open' }
)<{ open?: boolean; }>(
  ({ theme, open }) => ({
    flexGrow: 1,
    overflow: 'hidden',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    zIndex: 1,
    [theme.breakpoints.up('lg')]: {
      marginLeft: -380
    },
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
      [theme.breakpoints.up('lg')]: {
        marginLeft: 0
      },
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    })
  })
);

const InvoiceList: NextPage = () => {
  const isMounted = useMounted();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mdUp = useMediaQuery(
    (theme: Theme) => theme.breakpoints.up('md'),
    { noSsr: true }
  );
  const [group, setGroup] = useState<boolean>(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [openFilters, setOpenFilters] = useState<boolean>(mdUp);
  const [filters, setFilters] = useState<Filters>({
    query: '',
    startDate: null,
    endDate: null,
    customer: []
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getInvoices = useCallback(async () => {
    try {
      const data = await invoiceApi.getInvoices();

      if (isMounted()) {
        setInvoices(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getInvoices();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleChangeGroup = (event: ChangeEvent<HTMLInputElement>): void => {
    setGroup(event.target.checked);
  };

  const handleToggleFilters = (): void => {
    setOpenFilters((prevState) => !prevState);
  };

  const handleChangeFilters = (newFilters: Filters): void => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleCloseFilters = (): void => {
    setOpenFilters(false);
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredInvoices = applyFilters(invoices, filters);
  const paginatedInvoices = applyPagination(filteredInvoices, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>
          Dashboard: Invoice List | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        ref={rootRef}
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        <InvoiceListFilters
          containerRef={rootRef}
          filters={filters}
          onChange={handleChangeFilters}
          onClose={handleCloseFilters}
          open={openFilters}
        />
        <InvoiceListInner open={openFilters}>
          <Box sx={{ mb: 3 }}>
            <Grid
              container
              spacing={3}
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="h4">
                  Invoices
                </Typography>
              </Grid>
              <Grid
                item
                sx={{ m: -1 }}
              >
                <Button
                  endIcon={<FilterIcon fontSize="small" />}
                  onClick={handleToggleFilters}
                  sx={{ m: 1 }}
                  variant="outlined"
                >
                  Filters
                </Button>
                <Button
                  startIcon={<PlusIcon fontSize="small" />}
                  sx={{ m: 1 }}
                  variant="contained"
                >
                  New
                </Button>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 3
              }}
            >
              <FormControlLabel
                control={(
                  <Switch
                    checked={group}
                    onChange={handleChangeGroup}
                  />
                )}
                label="Show groups"
              />
            </Box>
          </Box>
          <InvoiceListTable
            group={group}
            invoices={paginatedInvoices}
            invoicesCount={filteredInvoices.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </InvoiceListInner>
      </Box>
    </>
  );
};

InvoiceList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default InvoiceList;
