import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { getPropertyById } from '../../../services/propertyService';
import { getReviewsForProperty } from '../../../services/reviewService';
import AuthContext from '../../../context/AuthContext';
import { useGoogleMapsLoader } from '../../../context/GoogleMapsLoaderContext';
import PropertyDetails from '../PropertyDetails';

// Mock services
vi.mock('../../../services/propertyService');
vi.mock('../../../services/reviewService');

// Mock context
vi.mock('../../../context/GoogleMapsLoaderContext', () => ({
  useGoogleMapsLoader: () => ({ isLoaded: true }),
}));

// Mock components
vi.mock('../../../components/property/PropertyHeader', () => ({ __esModule: true, default: ({ name }) => <div>{name}</div> }));
vi.mock('../../../components/property/PhotoGallery', () => ({ __esModule: true, default: () => <div>Photo Gallery</div> }));
vi.mock('../../../components/property/PropertyInfo', () => ({ __esModule: true, default: () => <div>Property Info</div> }));

vi.mock('../../../components/property/Reviews', () => ({ __esModule: true, default: () => <div>Reviews</div> }));

vi.mock('../../../components/property/LocationMap', () => ({ __esModule: true, default: () => <div>Location Map</div> }));


const renderWithProviders = (ui, authContextValue = {}) => {
  return render(
    <AuthContext.Provider value={authContextValue}>
      <MemoryRouter initialEntries={['/property/123']}>
        <Routes>
          <Route path="/property/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('PropertyDetails Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProperty = {
    data: {
      _id: '123',
      name: 'Test Property',
      description: 'A test description',
      type: 'Mountain',
      address: '123 Test St',
      contact: '123-456-7890',
      baseRate: 100,
      amenities: ['Comfortable beds'],
      roomTypes: [{ name: 'Room 1', beds: 2, occupancy: 2 }],
      images: ['image1.jpg'],
      status: 'Active',
      location: {
        coordinates: [-73.935242, 40.730610]
      }
    }
  };

  const mockReviews = {
    data: [{ _id: 'r1', rating: 5, comment: 'Great place!' }]
  };

  it('should render property details and reviews successfully', async () => {
    getPropertyById.mockResolvedValue(mockProperty);
    getReviewsForProperty.mockResolvedValue(mockReviews);

    renderWithProviders(<PropertyDetails />, { isAuthenticated: true, user: { role: 'Traveler' } });

    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument();
      expect(screen.getByText('Photo Gallery')).toBeInTheDocument();
      expect(screen.getByText('Property Info')).toBeInTheDocument();
      expect(screen.getByText('Book your stay')).toBeInTheDocument();
      expect(screen.getByText('Reviews')).toBeInTheDocument();
      expect(screen.getByText('Leave a Review')).toBeInTheDocument();
      expect(screen.getByText('Location Map')).toBeInTheDocument();
    });
  });

  it('should display an error message if fetching reviews fails', async () => {
    getPropertyById.mockResolvedValue(mockProperty);
    getReviewsForProperty.mockRejectedValue(new Error('Failed to fetch reviews'));

    renderWithProviders(<PropertyDetails />, { isAuthenticated: true, user: { role: 'Traveler' } });

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch reviews')).toBeInTheDocument();
    });
  });

  it('should display an error message when a non-authenticated user tries to book', async () => {
    getPropertyById.mockResolvedValue(mockProperty);
    getReviewsForProperty.mockResolvedValue(mockReviews);

    renderWithProviders(<PropertyDetails />, { isAuthenticated: false, user: null });

    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Book Now' }));

    await waitFor(() => {
      expect(screen.getByText('You must be logged in to book a property.')).toBeInTheDocument();
    });
  });

  it('should display an error message when a non-Traveler user tries to book', async () => {
    getPropertyById.mockResolvedValue(mockProperty);
    getReviewsForProperty.mockResolvedValue(mockReviews);

    renderWithProviders(<PropertyDetails />, { isAuthenticated: true, user: { role: 'Host' } });

    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Book Now' }));

    await waitFor(() => {
      expect(screen.getByText('Only travelers can book properties.')).toBeInTheDocument();
    });
  });

  it('should display an error message when booking without selecting dates', async () => {
    getPropertyById.mockResolvedValue(mockProperty);
    getReviewsForProperty.mockResolvedValue(mockReviews);

    renderWithProviders(<PropertyDetails />, { isAuthenticated: true, user: { role: 'Traveler' } });

    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Book Now' }));

    await waitFor(() => {
      expect(screen.getByText('Please select a start and end date.')).toBeInTheDocument();
    });
  });

  it('should not render the review form for non-authenticated users', async () => {
    getPropertyById.mockResolvedValue(mockProperty);
    getReviewsForProperty.mockResolvedValue(mockReviews);

    renderWithProviders(<PropertyDetails />, { isAuthenticated: false, user: null });

    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument();
    });

    expect(screen.queryByText('Leave a Review')).not.toBeInTheDocument();
  });

  it('should not render the review form for non-Traveler users', async () => {
    getPropertyById.mockResolvedValue(mockProperty);
    getReviewsForProperty.mockResolvedValue(mockReviews);

    renderWithProviders(<PropertyDetails />, { isAuthenticated: true, user: { role: 'Host' } });

    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument();
    });

    expect(screen.queryByText('Leave a Review')).not.toBeInTheDocument();
  });
});
