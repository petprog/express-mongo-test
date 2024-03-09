export const mockRequest = {
  foundUserIndex: 1,
};

export const mockResponse = {
  sendStatus: jest.fn(),
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
};
