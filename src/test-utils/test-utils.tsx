import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing/react'
import type { MockLink } from '@apollo/client/testing'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'

interface AllTheProvidersProps {
  children: React.ReactNode
  mocks?: MockLink.MockedResponse[]
}

function AllTheProviders({ children, mocks = [] }: AllTheProvidersProps) {
  return (
    <NuqsTestingAdapter>
      <MockedProvider mocks={mocks}>
        {children}
      </MockedProvider>
    </NuqsTestingAdapter>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  mocks?: MockLink.MockedResponse[]
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { mocks = [], ...renderOptions } = options || {}

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders mocks={mocks}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { customRender as render }
