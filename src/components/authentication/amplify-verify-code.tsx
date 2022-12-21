import type { ClipboardEvent, FC, KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, FormHelperText, TextField, Typography } from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';

export const AmplifyVerifyCode: FC = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const { verifyCode } = useAuth();
  const itemsRef = useRef<HTMLInputElement[]>([]);
  const [username, setUsername] = useState('');
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: username,
      code: ['', '', '', '', '', ''],
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      code: Yup
        .array()
        .of(Yup.string().required('Code is required'))
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await verifyCode(values.email, values.code.join(''));

        if (isMounted()) {
          router.push('/authentication/login').catch(console.error);
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    }
  });

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, 6);

    const storedUsername = sessionStorage.getItem('username');

    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number): void => {
    if (event.code === 'Enter') {
      if (formik.values.code[index]) {
        formik.setFieldValue(`code[${index}]`, '');
        return;
      }

      if (index > 0) {
        formik.setFieldValue(`code[${index}]`, '');
        itemsRef.current[index - 1].focus();
        return;
      }
    }

    if (Number.isInteger(parseInt(event.key, 10))) {
      formik.setFieldValue(`code[${index}]`, event.key);

      if (index < 5) {
        itemsRef.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (event: ClipboardEvent): void => {
    const paste = event.clipboardData.getData('text');
    const pasteArray = paste.split('');

    if (pasteArray.length !== 6) {
      return;
    }

    let valid = true;

    pasteArray.forEach((x) => {
      if (!Number.isInteger(parseInt(x, 10))) {
        valid = false;
      }
    });

    if (valid) {
      formik.setFieldValue('code', pasteArray);
      itemsRef.current[5].focus();
    }
  };

  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
      {...props}
    >
      {
        !username
          ? (
            <TextField
              autoFocus
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
            />
          )
          : (
            <TextField
              disabled
              fullWidth
              margin="normal"
              value={username}
            />
          )
      }
      <Typography
        color="textSecondary"
        sx={{
          mb: 2,
          mt: 3
        }}
        variant="subtitle2"
      >
        Verification code
      </Typography>
      <Box
        sx={{
          columnGap: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          pt: 1
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((ref, index) => (
          <TextField
            error={Boolean(
              Array.isArray(formik.touched.code)
              && formik.touched.code.length === 6
              && formik.errors.code
            )}
            fullWidth
            inputRef={(el) => itemsRef.current[index] = el}
            // eslint-disable-next-line react/no-array-index-key
            key={`code-${index}`}
            name={`code[${index}]`}
            onBlur={formik.handleBlur}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onPaste={handlePaste}
            value={formik.values.code[index]}
            sx={{
              display: 'inline-block',
              textAlign: 'center',
              '& .MuiInputBase-input': {
                textAlign: 'center'
              }
            }}
          />
        ))}
      </Box>
      {
        Boolean(
          Array.isArray(formik.touched.code)
          && formik.touched.code.length === 6
          && formik.errors.code
        ) && (
          <FormHelperText
            error
            sx={{ mx: '14px' }}
          >
            {Array.isArray(formik.errors.code) && formik.errors.code.find((x) => x !== undefined)}
          </FormHelperText>
        )
      }
      {formik.errors.submit && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>
            {formik.errors.submit as string}
          </FormHelperText>
        </Box>
      )}
      <Box sx={{ mt: 3 }}>
        <Button
          disabled={formik.isSubmitting}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Verify
        </Button>
      </Box>
    </form>
  );
};
