import type { ChangeEvent, FC, MouseEvent } from 'react';
import { Fragment } from 'react';
import NextLink from 'next/link';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import type { Invoice, InvoiceStatus } from '../../../types/invoice';
import { getInitials } from '../../../utils/get-initials';
import { Scrollbar } from '../../scrollbar';

interface InvoiceListTableProps {
  group?: boolean;
  invoices: Invoice[];
  invoicesCount: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
}

type GroupedInvoices = {
  [key in InvoiceStatus]: Invoice[];
};

const groupInvoices = (invoices: Invoice[]): GroupedInvoices => invoices.reduce(
  (acc, invoice) => {
    const { status } = invoice;

    return {
      ...acc,
      [status]: [...acc[status], invoice]
    };
  },
  {
    canceled: [],
    paid: [],
    pending: []
  }
);

interface InvoiceRowProps {
  invoice: Invoice;
}

const InvoiceRow: FC<InvoiceRowProps> = (props) => {
  const { invoice } = props;

  return (
    <TableRow
      key={invoice.id}
      sx={{
        boxShadow: 1,
        transition: (theme) => theme.transitions.create('box-shadow', {
          easing: theme.transitions.easing.easeOut
        }),
        '&:hover': {
          boxShadow: 8
        },
        '& > td': {
          backgroundColor: 'background.paper',
          borderBottom: 0
        }
      }}
    >
      <TableCell width="25%">
        <NextLink
          href="/dashboard/invoices/1"
          passHref
        >
          <Box
            component="a"
            sx={{
              alignItems: 'center',
              display: 'inline-flex',
              textDecoration: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <Avatar
              sx={{
                height: 42,
                width: 42
              }}
            >
              {getInitials(invoice.customer.name)}
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {invoice.number}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {invoice.customer.name}
              </Typography>
            </Box>
          </Box>
        </NextLink>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {invoice.currency}
          {numeral(invoice.totalAmount).format('0,0.00')}
        </Typography>
      </TableCell>
      <TableCell>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="subtitle2">
            Issued
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {invoice.issueDate && format(invoice.issueDate, 'dd/MM/yyyy')}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="subtitle2">
            Due
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {invoice.dueDate && format(invoice.dueDate, 'dd/MM/yyyy')}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="right">
        <NextLink
          href="/dashboard/invoices/1"
          passHref
        >
          <IconButton component="a">
            <ArrowRightIcon fontSize="small" />
          </IconButton>
        </NextLink>
      </TableCell>
    </TableRow>
  );
};

export const InvoiceListTable: FC<InvoiceListTableProps> = (props) => {
  const {
    group,
    invoices,
    invoicesCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;

  const groupedInvoices = group && groupInvoices(invoices);
  const renderGrouped = group && groupedInvoices;

  return (
    <div {...other}>
      <Scrollbar>
        <Table
          sx={{
            borderCollapse: 'separate',
            borderSpacing: (theme) => `0 ${theme.spacing(3)}`,
            minWidth: 600,
            marginTop: (theme) => `-${theme.spacing(3)}`,
            p: '1px'
          }}
        >
          {renderGrouped && (
            <TableBody>
              {(Object.keys(groupedInvoices) as InvoiceStatus[]).map((status) => (
                <Fragment key={status}>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      sx={{ px: 0 }}
                    >
                      <Typography
                        color="textSecondary"
                        variant="h6"
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        {' '}
                        ({groupedInvoices[status].length})
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {groupedInvoices[status].map((invoice) => (
                    <InvoiceRow
                      invoice={invoice}
                      key={invoice.id}
                    />
                  ))}
                </Fragment>
              ))}
            </TableBody>
          )}
          {!group && (
            <TableBody>
              {invoices.map((invoice) => (
                <InvoiceRow
                  invoice={invoice}
                  key={invoice.id}
                />
              ))}
            </TableBody>
          )}
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={invoicesCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

InvoiceListTable.propTypes = {
  group: PropTypes.bool,
  invoices: PropTypes.array.isRequired,
  invoicesCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
