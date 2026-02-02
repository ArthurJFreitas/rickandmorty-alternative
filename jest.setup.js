import '@testing-library/jest-dom'

global.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback
    this.options = options
  }

  observe(target) {
    this.callback(
      [
        {
          isIntersecting: false,
          target,
          intersectionRatio: 0,
          boundingClientRect: {},
          intersectionRect: {},
          rootBounds: {},
          time: Date.now(),
        },
      ],
      this
    )
  }

  unobserve() {}

  disconnect() {}
}

global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback
  }

  observe() {}

  unobserve() {}

  disconnect() {}
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
