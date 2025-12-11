import { Metadata } from 'next';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'Login | Content AI Web Creator app',
  description: 'Created by Krzysztof &copy; 2025',
};

export default function Login() {
  return <LoginForm />;
}
