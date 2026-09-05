const { sendSuccess } = require('../../common/utils/apiResponse');

describe('API Response Utility', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should format success response correctly with default status 200', () => {
    const data = { foo: 'bar' };
    sendSuccess(res, data);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data
    });
  });

  it('should format success response with custom status code', () => {
    const data = { created: true };
    sendSuccess(res, data, 201);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data
    });
  });
});
