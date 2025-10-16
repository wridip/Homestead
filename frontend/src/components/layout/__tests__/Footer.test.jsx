import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the footer text', () => {
    render(<Footer />);
    expect(screen.getByText(/Homestead Management System/i)).toBeInTheDocument();
  });
});