import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { getPropertyById, updateProperty, updatePropertyImages } from '../../../services/propertyService';
import EditProperty from '../EditProperty';

// Mock services
vi.mock('../../../services/propertyService');

// Mock react-router-dom's useNavigate
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
    useParams: () => ({ id: '123' }), // Mock useParams
  };
});

const renderWithProviders = (ui) => {
  return render(
    <MemoryRouter initialEntries={['/edit-property/123']}>
      <Routes>
        <Route path="/edit-property/:id" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe('EditProperty Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUsedNavigate.mockReset();
    getPropertyById.mockReset();
    updateProperty.mockReset();
    updatePropertyImages.mockReset();
  });

  it('should fetch and display existing property data', async () => {
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
    getPropertyById.mockResolvedValue(mockProperty);

    renderWithProviders(<EditProperty />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Property Name')).toHaveValue(mockProperty.data.name);
      expect(screen.getByPlaceholderText('Description')).toHaveValue(mockProperty.data.description);
      expect(screen.getByDisplayValue('Mountain')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Address')).toHaveValue(mockProperty.data.address);
      expect(screen.getByPlaceholderText('Contact')).toHaveValue(mockProperty.data.contact);
      expect(screen.getByPlaceholderText('Base Rate')).toHaveValue(mockProperty.data.baseRate);
      expect(screen.getByPlaceholderText('Latitude')).toHaveValue(String(mockProperty.data.location.coordinates[1]));
      expect(screen.getByPlaceholderText('Longitude')).toHaveValue(String(mockProperty.data.location.coordinates[0]));
    });
  });

  it('should display validation errors when required fields are cleared and form is submitted', async () => {
    const mockProperty = {
      data: {
        _id: '123',
        name: 'Test Property',
        description: 'A test description',
        type: 'Mountain',
        address: '123 Test St',
        contact: '123-456-7890',
        baseRate: 100,
        amenities: [],
        roomTypes: [],
        images: [],
        status: 'Active',
        location: { coordinates: [0, 0] }
      }
    };
    getPropertyById.mockResolvedValue(mockProperty);

    const { container } = render(
      <MemoryRouter initialEntries={['/edit-property/123']}>
        <Routes>
          <Route path="/edit-property/:id" element={<EditProperty />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Property Name')).toHaveValue(mockProperty.data.name);
    });

    // Clear required fields
    fireEvent.change(screen.getByPlaceholderText('Property Name'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Base Rate'), { target: { value: '' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateProperty).not.toHaveBeenCalled();
      expect(screen.getByText('Property name is required')).toBeInTheDocument();
      expect(screen.getByText('Base rate is required')).toBeInTheDocument();
    });
  });

  it('should display validation errors for invalid number formats', async () => {
    const mockProperty = {
      data: {
        _id: '123',
        name: 'Test Property',
        description: 'A test description',
        type: 'Mountain',
        address: '123 Test St',
        contact: '123-456-7890',
        baseRate: 100,
        amenities: [],
        roomTypes: [],
        images: [],
        status: 'Active',
        location: { coordinates: [0, 0] }
      }
    };
    getPropertyById.mockResolvedValue(mockProperty);

    const { container } = render(
      <MemoryRouter initialEntries={['/edit-property/123']}>
        <Routes>
          <Route path="/edit-property/:id" element={<EditProperty />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Property Name')).toHaveValue(mockProperty.data.name);
    });

    // Enter invalid number formats
    fireEvent.change(screen.getByPlaceholderText('Latitude'), { target: { value: 'abc' } });
    fireEvent.change(screen.getByPlaceholderText('Longitude'), { target: { value: 'xyz' } });
    fireEvent.change(screen.getByPlaceholderText('Base Rate'), { target: { value: 'abc' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateProperty).not.toHaveBeenCalled();
      expect(screen.getByText('Latitude must be a number')).toBeInTheDocument();
      expect(screen.getByText('Longitude must be a number')).toBeInTheDocument();
      expect(screen.getByText('Base rate is required')).toBeInTheDocument();
    });
  });

  it('should display validation errors for invalid room type number ranges', async () => {
    const mockProperty = {
      data: {
        _id: '123',
        name: 'Test Property',
        description: 'A test description',
        type: 'Mountain',
        address: '123 Test St',
        contact: '123-456-7890',
        baseRate: 100,
        amenities: [],
        roomTypes: [],
        images: [],
        status: 'Active',
        location: { coordinates: [0, 0] }
      }
    };
    getPropertyById.mockResolvedValue(mockProperty);

    const { container } = render(
      <MemoryRouter initialEntries={['/edit-property/123']}>
        <Routes>
          <Route path="/edit-property/:id" element={<EditProperty />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Property Name')).toHaveValue(mockProperty.data.name);
    });

    // Add a room type
    fireEvent.click(screen.getByText('Add Room Type'));

    // Enter invalid room type data
    fireEvent.change(screen.getByPlaceholderText('Room Name'), { target: { value: 'New Room' } });
    fireEvent.change(screen.getByPlaceholderText('Beds'), { target: { value: '0' } }); // Non-positive beds
    fireEvent.change(screen.getByPlaceholderText('Occupancy'), { target: { value: '-1' } }); // Non-positive occupancy

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateProperty).not.toHaveBeenCalled();
      expect(screen.getByText('Number of beds for Room 1 must be a positive integer')).toBeInTheDocument();
      expect(screen.getByText('Max occupancy for Room 1 must be a positive integer')).toBeInTheDocument();
    });
  });

  it('should display validation errors for partial room type data', async () => {
    const mockProperty = {
      data: {
        _id: '123',
        name: 'Test Property',
        description: 'A test description',
        type: 'Mountain',
        address: '123 Test St',
        contact: '123-456-7890',
        baseRate: 100,
        amenities: [],
        roomTypes: [],
        images: [],
        status: 'Active',
        location: { coordinates: [0, 0] }
      }
    };
    getPropertyById.mockResolvedValue(mockProperty);

    const { container } = render(
      <MemoryRouter initialEntries={['/edit-property/123']}>
        <Routes>
          <Route path="/edit-property/:id" element={<EditProperty />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Property Name')).toHaveValue(mockProperty.data.name);
    });

    // Add a room type
    fireEvent.click(screen.getByText('Add Room Type'));

    // Enter partial room type data
    fireEvent.change(screen.getByPlaceholderText('Beds'), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Occupancy'), { target: { value: '2' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateProperty).not.toHaveBeenCalled();
      expect(screen.getByText('Room name for Room 1 is required')).toBeInTheDocument();
    });
  });

  it('should display a general error message on API call failure', async () => {
    const mockProperty = {
      data: {
        _id: '123',
        name: 'Test Property',
        description: 'A test description',
        type: 'Mountain',
        address: '123 Test St',
        contact: '123-456-7890',
        baseRate: 100,
        amenities: [],
        roomTypes: [],
        images: [],
        status: 'Active',
        location: { coordinates: [0, 0] }
      }
    };
    getPropertyById.mockResolvedValue(mockProperty);
    updateProperty.mockRejectedValue({ response: { data: { message: 'Server error' } } });

    const { container } = render(
      <MemoryRouter initialEntries={['/edit-property/123']}>
        <Routes>
          <Route path="/edit-property/:id" element={<EditProperty />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Property Name')).toHaveValue(mockProperty.data.name);
    });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    const errorMessage = await screen.findByText('Server error');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should call updateProperty with imagesToDelete when an image is removed', async () => {
    const mockProperty = {
      data: {
        _id: '123',
        name: 'Test Property',
        description: 'A test description',
        type: 'Mountain',
        address: '123 Test St',
        contact: '123-456-7890',
        baseRate: 100,
        amenities: [],
        roomTypes: [],
        images: ['image1.jpg', 'image2.jpg'],
        status: 'Active',
        location: { coordinates: [0, 0] }
      }
    };
    getPropertyById.mockResolvedValue(mockProperty);

    const { container } = render(
      <MemoryRouter initialEntries={['/edit-property/123']}>
        <Routes>
          <Route path="/edit-property/:id" element={<EditProperty />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByAltText('preview')).toHaveLength(2);
    });

    // Click the "X" button on the first image
    const removeButtons = screen.getAllByRole('button', { name: 'X' });
    fireEvent.click(removeButtons[0]);

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateProperty).toHaveBeenCalledWith('123', expect.objectContaining({
        imagesToDelete: ['image1.jpg']
      }));
    });
  });
});
