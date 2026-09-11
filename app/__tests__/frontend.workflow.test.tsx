import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkspaceDocumentList from '@/app/workspace/[workspaceId]/page';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useParams: () => ({ workspaceId: 'ws_123' }),
}));

describe('9. Frontend Upload Workflow State Transitions', () => {
  test('Transitions from empty state -> upload modal -> progress -> success state', async () => {
    render(<WorkspaceDocumentList params={Promise.resolve({ workspaceId: 'ws_123' })} />);

    // 1. Verify Initial Empty State
    expect(screen.getByText(/No documents yet/i)).toBeInTheDocument();

    // 2. Open Upload Modal
    const uploadBtn = screen.getByRole('button', { name: /Upload Document/i });
    fireEvent.click(uploadBtn);
    expect(screen.getByText(/Upload Document/i)).toBeInTheDocument();

    // 3. Validation Trigger on Empty Form Submit
    const submitBtn = screen.getByRole('button', { name: /Upload File/i });
    fireEvent.click(submitBtn);
    expect(await screen.findByText(/Please select a file to upload/i)).toBeInTheDocument();

    // 4. Attach File & Submit
    const file = new File(['dummy content'], 'test_contract.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByTestId('file-input') || screen.getByType('file');
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(submitBtn);

    // 5. Verify Upload Progress State
    expect(await screen.findByText(/Uploading test_contract.pdf/i)).toBeInTheDocument();

    // 6. Verify Final Success State & Modal Reset
    await waitFor(() => {
      expect(screen.getByText(/Upload Successful/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    fireEvent.click(screen.getByRole('button', { name: /Close/i }));
    
    // Verify document now appears in table list
    expect(screen.getByText('test_contract.pdf')).toBeInTheDocument();
  });
});