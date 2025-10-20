import { style, styleVariants } from '@vanilla-extract/css';

export const container = style({
  maxWidth: '1536px',
  margin: '0 auto',
  padding: '1.25rem',
});

export const header = style({
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  borderRadius: '0.75rem',
  padding: '1.25rem',
  marginBottom: '2rem',
  color: 'white',
  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
});

export const headerContent = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
});

export const title = style({
  fontSize: '1.5rem',
  fontWeight: '600',
  margin: 0,
});

export const controls = style({
  display: 'flex',
  gap: '0.75rem',
});

export const button = style({
  padding: '0.5rem 1.5rem',
  borderRadius: '0.5rem',
  fontWeight: '500',
  transition: 'all 200ms',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
});

export const buttonVariants = styleVariants({
  primary: {
    backgroundColor: '#3b82f6',
    color: 'white',
    ':hover': {
      backgroundColor: '#2563eb',
    },
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
});

export const itemsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1.25rem',
  marginBottom: '2rem',
  
  '@media': {
    'screen and (min-width: 640px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    },
    'screen and (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    },
    'screen and (min-width: 1280px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    },
  },
});

export const itemCard = style({
  backgroundColor: 'white',
  borderRadius: '0.75rem',
  padding: '1.25rem',
  cursor: 'pointer',
  transition: 'all 300ms',
  border: '2px solid',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  
  ':hover': {
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    transform: 'translateY(-4px)',
  },
  
  '::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
    transform: 'scaleX(0)',
    transition: 'transform 300ms',
  },
  
});

export const itemCardVariants = styleVariants({
  active: {
    borderColor: '#10b981',
    backgroundColor: '#f9fafb',
  },
  inactive: {
    borderColor: '#e5e7eb',
    ':hover': {
      borderColor: '#3b82f6',
    },
  },
});

export const itemHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.75rem',
});

export const itemTitle = style({
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1f2937',
  margin: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const itemValue = style({
  padding: '0.25rem 0.75rem',
  borderRadius: '9999px',
  fontSize: '0.875rem',
  fontWeight: '600',
});

export const itemValueVariants = styleVariants({
  active: {
    backgroundColor: '#10b981',
    color: 'white',
  },
  inactive: {
    backgroundColor: '#3b82f6',
    color: 'white',
  },
});

export const itemDescription = style({
  color: '#4b5563',
  fontSize: '0.875rem',
  marginBottom: '1rem',
  margin: 0,
});

export const itemActions = style({
  paddingTop: '1rem',
  borderTop: '1px solid #f3f4f6',
});

export const itemButton = style({
  width: '100%',
  padding: '0.5rem 1rem',
  backgroundColor: '#f3f4f6',
  color: '#374151',
  borderRadius: '0.5rem',
  fontWeight: '500',
  transition: 'all 200ms',
  border: 'none',
  cursor: 'pointer',
  
  ':hover': {
    backgroundColor: '#e5e7eb',
  },
});

export const metricsContainer = style({
  backgroundColor: '#f9fafb',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  border: '1px solid #e5e7eb',
});

export const metricsTitle = style({
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#1f2937',
  marginBottom: '1rem',
  margin: 0,
});

export const metricsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
});

export const metricItem = style({
  backgroundColor: 'white',
  borderRadius: '0.5rem',
  padding: '1rem',
  border: '1px solid #e5e7eb',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const metricLabel = style({
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#4b5563',
});

export const metricValue = style({
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1f2937',
  fontFamily: 'monospace',
});
