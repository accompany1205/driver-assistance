import type { ChangeEvent, FC, FormEvent, MutableRefObject } from 'react';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import type { Theme } from '@mui/material';
import {
  Box,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Search as SearchIcon } from '../../../icons/search';
import { X } from '../../../icons/x';
import { Scrollbar } from '../../scrollbar';
import { InvoiceStatus } from '../../../types/invoice';

export interface Filters {
  query?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  customer?: string[];
  status?: InvoiceStatus;
}

interface InvoiceListFiltersProps {
  containerRef?: MutableRefObject<HTMLDivElement | null>;
  filters?: Filters;
  onChange?: (filters: Filters) => void;
  onClose?: () => void;
  open?: boolean;
}

const customers = [
  'Blind Spots Inc.',
  'Dispatcher Inc.',
  'ACME SRL',
  'Novelty I.S',
  'Beauty Clinic SRL',
  'Division Inc.'
];

const FiltersDrawerDesktop = styled(Drawer)({
  flexShrink: 0,
  width: 380,
  '& .MuiDrawer-paper': {
    position: 'relative',
    width: 380
  }
});

const FiltersDrawerMobile = styled(Drawer)({
  maxWidth: '100%',
  width: 380,
  '& .MuiDrawer-paper': {
    height: 'calc(100% - 64px)',
    maxWidth: '100%',
    top: 64,
    width: 380
  }
});

export const InvoiceListFilters: FC<InvoiceListFiltersProps> = (props) => {
  const { containerRef, filters = {}, onChange, onClose, open, ...other } = props;
  const queryRef = useRef<HTMLInputElement | null>(null);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const handleQueryChange = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onChange?.({
      ...filters,
      query: queryRef.current?.value
    });
  };

  const handleStartDateChange = (date: Date | null): void => {
    const newFilters: Filters = {
      ...filters,
      startDate: date
    };

    // Prevent end date to be before start date
    if (newFilters.endDate && date && date > newFilters.endDate) {
      newFilters.endDate = date;
    }

    onChange?.(newFilters);
  };

  const handleEndDateChange = (date: Date | null): void => {
    const newFilters: Filters = {
      ...filters,
      endDate: date
    };

    // Prevent start date to be after end date
    if (newFilters.startDate && date && date < newFilters.startDate) {
      newFilters.startDate = date;
    }

    onChange?.(newFilters);
  };

  const handleCustomerChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      onChange?.({
        ...filters,
        customer: [...(filters.customer || []), event.target.value]
      });
    } else {
      onChange?.({
        ...filters,
        customer: (filters.customer || []).filter((customer) => customer !== event.target.value)
      });
    }
  };

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.({
      ...filters,
      status: event.target.checked ? 'paid' : undefined
    });
  };

  const content = (
    <Box
      sx={{
        pb: 3,
        pt: {
          xs: 3,
          lg: 8
        },
        px: 3
      }}
    >
      <Box
        sx={{
          display: {
            lg: 'none'
          },
          mb: 2
        }}
      >
        <IconButton onClick={onClose}>
          <X fontSize="small" />
        </IconButton>
      </Box>
      <Box
        component="form"
        onSubmit={handleQueryChange}
      >
        <TextField
          defaultValue=""
          fullWidth
          inputProps={{ ref: queryRef }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          label="Search"
          placeholder="Search by invoice number"
        />
      </Box>
      <Typography
        color="textSecondary"
        sx={{ mt: 3 }}
        variant="subtitle2"
      >
        Issue date
      </Typography>
      <Stack
        spacing={2}
        sx={{ mt: 2 }}
      >
        <DatePicker
          inputFormat="dd/MM/yyyy"
          label="From"
          onChange={handleStartDateChange}
          renderInput={(inputProps) => <TextField {...inputProps} />}
          value={filters.startDate}
        />
        <DatePicker
          inputFormat="dd/MM/yyyy"
          label="To"
          onChange={handleEndDateChange}
          renderInput={(inputProps) => <TextField {...inputProps} />}
          value={filters.endDate}
        />
      </Stack>
      <Typography
        color="textSecondary"
        sx={{ mt: 3 }}
        variant="subtitle2"
      >
        From customer
      </Typography>
      <Box
        sx={{
          backgroundColor: 'background.default',
          borderColor: 'divider',
          borderRadius: 1,
          borderStyle: 'solid',
          borderWidth: 1,
          mt: 2
        }}
      >
        <Scrollbar sx={{ maxHeight: 200 }}>
          <FormGroup
            sx={{
              py: 1,
              px: 1.5
            }}
          >
            {customers.map((customer) => (
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={filters.customer?.includes(customer)}
                    onChange={handleCustomerChange}
                  />
                )}
                key={customer}
                label={customer}
                value={customer}
              />
            ))}
          </FormGroup>
        </Scrollbar>
      </Box>
      <FormControlLabel
        control={(
          <Switch
            checked={filters.status === 'paid'}
            onChange={handleStatusChange}
          />
        )}
        label="Show paid only"
        sx={{ mt: 2 }}
      />
    </Box>
  );

  if (lgUp) {
    return (
      <FiltersDrawerDesktop
        anchor="left"
        open={open}
        SlideProps={{ container: containerRef?.current }}
        variant="persistent"
        {...other}
      >
        {content}
      </FiltersDrawerDesktop>
    );
  }

  return (
    <FiltersDrawerMobile
      anchor="left"
      ModalProps={{ container: containerRef?.current }}
      onClose={onClose}
      open={open}
      SlideProps={{ container: containerRef?.current }}
      variant="temporary"
      {...other}
    >
      {content}
    </FiltersDrawerMobile>
  );
};

InvoiceListFilters.propTypes = {
  containerRef: PropTypes.any,
  // @ts-ignore
  filters: PropTypes.object,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
