import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PropertyCard from '../PropertyCard';

const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('PropertyCard', () => {
  const mockProperty = {
    _id: '1',
    name: 'Test Property',
    type: 'Mountain',
    address: '123 Test St',
    description: 'A test description',
    baseRate: 100,
    averageRating: 4.5,
    images: ['image1.jpg'],
  };

  it('should render with complete data', () => {
    renderWithRouter(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('A test description')).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', `http://localhost:5000/image1.jpg`);
  });

  it('should render gracefully with missing optional data', () => {
    const propertyWithMissingData = {
      ...mockProperty,
      description: null,
      averageRating: undefined,
    };
    renderWithRouter(<PropertyCard property={propertyWithMissingData} />);

    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.queryByText('A test description')).not.toBeInTheDocument();
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
  });

  it('should handle unusually long data gracefully', () => {
    const propertyWithLongData = {
      ...mockProperty,
      name: 'This is a very long property name that should be truncated by the UI to prevent it from breaking the layout of the card.',
    };
    renderWithRouter(<PropertyCard property={propertyWithLongData} />);

    const nameElement = screen.getByText(propertyWithLongData.name);
    expect(nameElement).toBeInTheDocument();
  });
});
