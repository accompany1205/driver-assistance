import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import { customerApi } from '../../../__fake-api__/customer-api';
import { useMounted } from '../../../hooks/use-mounted';
import type { CustomerLog } from '../../../types/customer';
import { MoreMenu } from '../../more-menu';
import { Scrollbar } from '../../scrollbar';
import { SeverityPill } from '../../severity-pill';

export const CustomerLogs: FC = (props) => {
  const isMounted = useMounted();
  const [logs, setLogs] = useState<CustomerLog[]>([]);

  const getLogs = useCallback(async () => {
    try {
      const data = await customerApi.getCustomerLogs();

      if (isMounted()) {
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getLogs();
  }, [getLogs]);

  return (
    <Card {...props}>
      <CardHeader
        action={<MoreMenu />}
        title="Recent Logs"
      />
      <Divider />
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell width="100">
                  <Typography
                    color="textSecondary"
                    variant="caption"
                  >
                    {log.method}
                  </Typography>
                </TableCell>
                <TableCell width="64">
                  <SeverityPill
                    color={
                      (log.status >= 200 && log.status < 300)
                        ? 'success'
                        : 'error'
                    }
                  >
                    {log.status}
                  </SeverityPill>
                </TableCell>
                <TableCell>
                  {log.route}
                </TableCell>
                <TableCell>
                  {log.description}
                </TableCell>
                <TableCell>
                  {log.ip}
                </TableCell>
                <TableCell>
                  {format(log.createdAt, 'yyyy/MM/dd HH:mm:ss')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
};
