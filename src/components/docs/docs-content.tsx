import type { FC } from 'react';
import Markdown from 'react-markdown';
import type { CodeComponent, Components } from 'react-markdown/lib/ast-to-react';
import PropTypes from 'prop-types';
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import dracula from 'react-syntax-highlighter/dist/cjs/styles/prism/dracula';
import { styled } from '@mui/material/styles';

// NOTE: To reduce the bundle size, we did not include react-syntax-highlighter types package.

interface DocsContentProps {
  content?: string;
}

const Link: Components['link'] = (props) => {
  const { href, children } = props;

  if (!href?.startsWith('http')) {
    return (
      <a href={href}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      rel="nofollow noreferrer noopener"
      target="_blank"
    >
      {children}
    </a>
  );
};

const Code: CodeComponent = (props) => {
  const { node, inline, className, children, ...other } = props;

  const match = /language-(\w+)/.exec(className || '');

  return !inline && match ? (
    <SyntaxHighlighter
      children={String(children).replace(/\n$/, '')}
      style={dracula}
      language={match[1]}
      PreTag="div"
      {...other}
    />
  ) : (
    <code
      className={className}
      {...other}
    >
      {children}
    </code>
  );
};

const components: Components = {
  link: Link,
  code: Code
};

const DocsContentRoot = styled('div')(
  ({ theme }) => ({
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    '& blockquote': {
      borderLeft: `4px solid ${theme.palette.text.secondary}`,
      marginBottom: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingTop: theme.spacing(1),
      '& > p': {
        color: theme.palette.text.secondary,
        marginBottom: 0
      }
    },
    '& code': {
      color: '#01ab56',
      fontFamily: 'Inconsolata, Monaco, Consolas, \'Courier New\', Courier, monospace',
      fontSize: 14,
      paddingLeft: 2,
      paddingRight: 2
    },
    '& h1': {
      fontSize: 35,
      fontWeight: 500,
      letterSpacing: '-0.24px',
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(6)
    },
    '& h2': {
      fontSize: 29,
      fontWeight: 500,
      letterSpacing: '-0.24px',
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(6)
    },
    '& h3': {
      fontSize: 24,
      fontWeight: 500,
      letterSpacing: '-0.06px',
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(6)
    },
    '& h4': {
      fontSize: 20,
      fontWeight: 500,
      letterSpacing: '-0.06px',
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(4)
    },
    '& h5': {
      fontSize: 16,
      fontWeight: 500,
      letterSpacing: '-0.05px',
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    },
    '& h6': {
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: '-0.05px',
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    },
    '& li': {
      fontSize: 14,
      lineHeight: 1.5,
      marginBottom: theme.spacing(2),
      marginLeft: theme.spacing(4)
    },
    '& p': {
      fontSize: 14,
      lineHeight: 1.5,
      marginBottom: theme.spacing(2),
      '& > a': {
        color: theme.palette.secondary.main
      }
    }
  })
);

export const DocsContent: FC<DocsContentProps> = (props) => {
  const { content } = props;

  return (
    <DocsContentRoot>
      {content && (
        <Markdown
          components={components}
          children={content}
        />
      )}
    </DocsContentRoot>
  );
};

DocsContent.propTypes = {
  content: PropTypes.string
};
