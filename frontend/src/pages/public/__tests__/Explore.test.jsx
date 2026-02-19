import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getProperties } from '../../../services/propertyService';
import Explore from '../Explore';

// Mock services
vi.mock('../../../services/propertyService');

// Mock the PropertyCard component
vi.mock('../../../components/properties/PropertyCard', () => ({
  __esModule: true,
  default: ({ property }) => <div data-testid="property-card">{property.name}</div>,
}));

const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('Explore Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display "No properties found" message when no properties are returned', async () => {
    getProperties.mockResolvedValue([]);

    renderWithRouter(<Explore />);

    await waitFor(() => {
      expect(screen.getByText('No properties found matching your criteria.')).toBeInTheDocument();
    });
  });

  it('should display an error message when the API call fails', async () => {
    getProperties.mockRejectedValue(new Error('Failed to fetch'));

    renderWithRouter(<Explore />);

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
    });
  });

  it('should filter properties based on text search', async () => {
    const mockProperties = [
      { _id: '1', name: 'Mountain Cabin', address: '123 Pine St', type: 'Mountain', baseRate: 100, averageRating: 4.5 },
      { _id: '2', name: 'Riverside Retreat', address: '456 Oak Ave', type: 'Riverside', baseRate: 150, averageRating: 4.8 },
      { _id: '3', name: 'Farmhouse', address: '789 Maple Dr', type: 'Farm', baseRate: 120, averageRating: 4.2 },
    ];
    getProperties.mockResolvedValue(mockProperties);

    renderWithRouter(<Explore />);

    await waitFor(() => {
      expect(screen.getAllByTestId('property-card')).toHaveLength(3);
    });

    // Enter search query
    fireEvent.change(screen.getByPlaceholderText(/e.g., 'Mountain cabin' or 'Lachung'/i), { target: { value: 'Cabin' } });

    await waitFor(() => {
      expect(screen.getAllByTestId('property-card')).toHaveLength(1);
      expect(screen.getByText('Mountain Cabin')).toBeInTheDocument();
    });
  });

  it('should filter properties based on type', async () => {
    const mockProperties = [
      { _id: '1', name: 'Mountain Cabin', address: '123 Pine St', type: 'Mountain', baseRate: 100, averageRating: 4.5 },
      { _id: '2', name: 'Riverside Retreat', address: '456 Oak Ave', type: 'Riverside', baseRate: 150, averageRating: 4.8 },
      { _id: '3', name: 'Another Mountain Property', address: '789 Maple Dr', type: 'Mountain', baseRate: 120, averageRating: 4.2 },
    ];
    getProperties.mockResolvedValue(mockProperties);

    renderWithRouter(<Explore />);

    await waitFor(() => {
      expect(screen.getAllByTestId('property-card')).toHaveLength(3);
    });

    // Click the "Mountain" checkbox
    fireEvent.click(screen.getByLabelText('Mountain'));

    await waitFor(() => {
      expect(screen.getAllByTestId('property-card')).toHaveLength(2);
      expect(screen.getByText('Mountain Cabin')).toBeInTheDocument();
      expect(screen.getByText('Another Mountain Property')).toBeInTheDocument();
    });
  });

  it('should filter properties based on price', async () => {
    const mockProperties = [
      { _id: '1', name: 'Cheap Shack', address: '123 Pine St', type: 'Mountain', baseRate: 500, averageRating: 4.5 },
      { _id: '2', name: 'Mid-range Abode', address: '456 Oak Ave', type: 'Riverside', baseRate: 1500, averageRating: 4.8 },
      { _id: '3', name: 'Luxury Villa', address: '789 Maple Dr', type: 'Farm', baseRate: 3000, averageRating: 4.2 },
    ];
    getProperties.mockResolvedValue(mockProperties);

    renderWithRouter(<Explore />);

    await waitFor(() => {
      expect(screen.getAllByTestId('property-card')).toHaveLength(3);
    });

    // Change the price slider
    fireEvent.change(screen.getByLabelText('Price per night'), { target: { value: '1600' } });

    await waitFor(() => {
      expect(screen.getAllByTestId('property-card')).toHaveLength(2);
      expect(screen.getByText('Cheap Shack')).toBeInTheDocument();
      expect(screen.getByText('Mid-range Abode')).toBeInTheDocument();
    });
  });

  it('should sort properties by price: low to high', async () => {
    const mockProperties = [
      { _id: '1', name: 'Expensive Property', baseRate: 200 },
      { _id: '2', name: 'Cheap Property', baseRate: 100 },
      { _id: '3', name: 'Mid-range Property', baseRate: 150 },
    ];
    getProperties.mockResolvedValue(mockProperties);

    renderWithRouter(<Explore />);

    await waitFor(() => {
      expect(screen.getAllByTestId('property-card')).toHaveLength(3);
    });

    // Select sorting option
    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'Price: Low to High' } });

    await waitFor(() => {
      const propertyCards = screen.getAllByTestId('property-card');
      expect(propertyCards[0]).toHaveTextContent('Cheap Property');
      expect(propertyCards[1]).toHaveTextContent('Mid-range Property');
      expect(propertyCards[2]).toHaveTextContent('Expensive Property');
    });
  });
});

