import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { addProperty } from '../../../services/hostService';
import api from '../../../services/api';
import AddProperty from '../AddProperty';

// Mock services
vi.mock('../../../services/hostService', () => ({ addProperty: vi.fn() }));
vi.mock('../../../services/api', () => ({ post: vi.fn() }));

// Mock react-router-dom's useNavigate
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

const renderWithProviders = (ui) => {
  const { container, ...rest } = render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
  return { container, ...rest };
};

describe('AddProperty Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUsedNavigate.mockReset(); // Reset navigate mock for each test
    addProperty.mockReset(); // Reset addProperty mock for each test
  });

  it('should prevent form submission and not call addProperty if required fields are missing', async () => {
    const { container } = renderWithProviders(<AddProperty />);

    // Attempt to submit the form without filling any required fields
    const form = container.querySelector('form'); // Assuming the form has an implicit role of 'form' or an explicit one
    fireEvent.submit(form);

    await waitFor(() => {
      // Expect addProperty service not to have been called
      expect(addProperty).not.toHaveBeenCalled();
      // Since there are no explicit client-side error messages in current AddProperty.jsx,
      // we primarily assert that the service call was prevented.
      // In a real application, you'd assert for visible error messages for each field.
    });
  });

  it('should display validation errors for empty required fields on submission', async () => {
    const { container } = renderWithProviders(<AddProperty />);

    // Submit the form without filling any fields
    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Property name is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Property type is required')).toBeInTheDocument();
      expect(screen.getByText('Address is required')).toBeInTheDocument();
      expect(screen.getByText('Contact is required')).toBeInTheDocument();
      expect(screen.getByText('Base rate is required')).toBeInTheDocument();
    });
  });

  it('should display validation error if base rate is 0', async () => {
    const { container } = renderWithProviders(<AddProperty />);

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText('Property Name'), { target: { value: 'Test Property' } });
    fireEvent.change(screen.getByLabelText('Property Type'), { target: { value: 'Mountain' } });
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'A test description' } });
    fireEvent.change(screen.getByPlaceholderText('Contact'), { target: { value: '123-456-7890' } });

    // Enter invalid base rate (0)
    fireEvent.change(screen.getByPlaceholderText('Base Rate per Night'), { target: { value: '0' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    const errorMessage = await screen.findByText('Base rate must be a positive number');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display validation error if base rate is text', async () => {
    const { container } = renderWithProviders(<AddProperty />);

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText('Property Name'), { target: { value: 'Test Property' } });
    fireEvent.change(screen.getByLabelText('Property Type'), { target: { value: 'Mountain' } });
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'A test description' } });
    fireEvent.change(screen.getByPlaceholderText('Contact'), { target: { value: '123-456-7890' } });

    // Test with text
    fireEvent.change(screen.getByPlaceholderText('Base Rate per Night'), { target: { value: 'abc' } });
    const form = container.querySelector('form');
    fireEvent.submit(form);

    const errorMessage = await screen.findByText('Base rate is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display validation error if latitude or longitude are not numbers', async () => {
    const { container } = renderWithProviders(<AddProperty />);

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText('Property Name'), { target: { value: 'Test Property' } });
    fireEvent.change(screen.getByLabelText('Property Type'), { target: { value: 'Mountain' } });
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'A test description' } });
    fireEvent.change(screen.getByPlaceholderText('Contact'), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByPlaceholderText('Base Rate per Night'), { target: { value: '100' } });

    // Enter invalid latitude
    fireEvent.change(screen.getByPlaceholderText('Latitude'), { target: { value: 'abc' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    let errorMessage = await screen.findByText('Latitude must be a number');
    expect(errorMessage).toBeInTheDocument();

    // Correct latitude, enter invalid longitude
    fireEvent.change(screen.getByPlaceholderText('Latitude'), { target: { value: '12.34' } });
    fireEvent.change(screen.getByPlaceholderText('Longitude'), { target: { value: 'xyz' } });
    fireEvent.submit(form);

    errorMessage = await screen.findByText('Longitude must be a number');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display validation error for invalid room type data', async () => {
    const { container } = renderWithProviders(<AddProperty />);

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText('Property Name'), { target: { value: 'Test Property' } });
    fireEvent.change(screen.getByLabelText('Property Type'), { target: { value: 'Mountain' } });
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'A test description' } });
    fireEvent.change(screen.getByPlaceholderText('Contact'), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByPlaceholderText('Base Rate per Night'), { target: { value: '100' } });

    // Add a room type
    fireEvent.click(screen.getByText('Add Room Type'));

    // Enter invalid room type data
    fireEvent.change(screen.getByPlaceholderText('Room Name'), { target: { value: '' } }); // Empty name
    fireEvent.change(screen.getByPlaceholderText('Number of Beds'), { target: { value: '0' } }); // Non-positive beds
    fireEvent.change(screen.getByPlaceholderText('Max Occupancy'), { target: { value: '-1' } }); // Non-positive occupancy

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Room name for Room 1 is required')).toBeInTheDocument();
      expect(screen.getByText('Number of beds for Room 1 must be a positive integer')).toBeInTheDocument();
      expect(screen.getByText('Max occupancy for Room 1 must be a positive integer')).toBeInTheDocument();
    });
  });

  it('should display a general error message on API call failure', async () => {
    addProperty.mockRejectedValue({ response: { data: { message: 'Server error' } } });

    const { container } = renderWithProviders(<AddProperty />);

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText('Property Name'), { target: { value: 'Test Property' } });
    fireEvent.change(screen.getByLabelText('Property Type'), { target: { value: 'Mountain' } });
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'A test description' } });
    fireEvent.change(screen.getByPlaceholderText('Contact'), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByPlaceholderText('Base Rate per Night'), { target: { value: '100' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    const errorMessage = await screen.findByText('Server error');
    expect(errorMessage).toBeInTheDocument();
  });
});