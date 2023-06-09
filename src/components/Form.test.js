import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'


import Form from './Form'
import App from '../App'

import { formValidation } from './formValidation'

jest.mock('./formValidation')

test('form renders correctly', () => {
    const { getByPlaceholderText, getByRole } = render(<Form />)

    expect(getByPlaceholderText(/^İsim/i)).toBeInTheDocument()
    expect(getByPlaceholderText(/soyisim/i)).toBeInTheDocument()
    expect(getByPlaceholderText(/parola/i)).toBeInTheDocument()
    expect(getByPlaceholderText(/e-posta/i)).toBeInTheDocument()

    expect(getByRole('button', { name: /göster/i })).toBeInTheDocument()
    expect(getByRole('button', { name: /kayıt/i })).toBeInTheDocument()
})

test('password input show-hide toggle works properly', () => {
    const { getByPlaceholderText, getByRole } = render(<Form />)

    const passwordInput = getByPlaceholderText(/parola/i);
    const passwordShowOrHideToggle = getByRole('button', { name: /göster/i })

    expect(passwordInput.type).toEqual('password');
    fireEvent.click(passwordShowOrHideToggle);
    expect(passwordInput.type).toEqual('text');
    expect(passwordShowOrHideToggle).toHaveTextContent(/gizle/i);

})

test('form validation works properly', async () => {

    const { getByRole, getByTestId, getByPlaceholderText } = render(<Form />);
    const errorText = getByTestId('error-text');

    formValidation.mockReturnValueOnce('error');
    expect(errorText).toHaveTextContent('');
    fireEvent.click(getByRole('button', { name: /kayıt/i }));
    expect(errorText).toHaveTextContent('error');
    userEvent.type(getByPlaceholderText(/e-posta/i), "test")
    await waitFor(() => {
        expect(errorText).toHaveTextContent('');
    })
})


test('submit works properly', async () => {
    const mockFormData = {
        firstName: 'test name',
        lastName: 'test last name',
        password: 'test password',
        email: 'test@mail.com'
    }

    const { getByRole, getByText, getByPlaceholderText } = render(<App />);

    userEvent.paste(getByPlaceholderText(/^İsim/i), mockFormData.firstName)
    userEvent.paste(getByPlaceholderText(/soyisim/i), mockFormData.lastName)
    userEvent.paste(getByPlaceholderText(/parola/i), mockFormData.password)
    userEvent.paste(getByPlaceholderText(/e-posta/i), mockFormData.email)

    userEvent.click(getByRole('button', { name: /kayıt/i }))

    await waitFor(() => {
        getByText(/hoşgeldiniz/i);
    });

})

