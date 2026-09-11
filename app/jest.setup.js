// jest.setup.js
import '@testing-library/jest-dom';

// Global mocks for Next.js App Router hooks (useRouter, usePathname, useParams)
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useParams() {
    return {};
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));