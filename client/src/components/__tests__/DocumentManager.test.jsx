import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import DocumentManager from '../DocumentManager';

// Mock api service
vi.mock('../../services/api', () => ({
  api: {
    getDocuments: vi.fn().mockResolvedValue({ documents: [] }),
    uploadDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
}));

// Mock AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Alex Johnson', email: 'alex@student.edu', role: 'student' }
  })
}));

describe('DocumentManager Component', () => {
  it('renders Study Library title and upload zone correctly', async () => {
    render(<DocumentManager />);
    expect(screen.getByText(/Good morning, Alex 👋|Good afternoon, Alex 👋|Good evening, Alex 👋|Welcome back, Alex 👋/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Upload your study material/i)).toBeInTheDocument();
    });
  });
});
