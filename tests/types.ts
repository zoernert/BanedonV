declare global {
  namespace NodeJS {
    interface Global {
      testUtils: {
        generateMockUser: () => {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'manager' | 'user';
          active: boolean;
          createdAt: string;
        };
        generateMockToken: () => string;
        createTestServer: () => any;
        cleanupTestData: () => void;
      };
    }
  }
}

export {};
