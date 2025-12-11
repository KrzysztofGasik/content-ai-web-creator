import { Metadata } from 'next';
import RegisterForm from './register-form';

export const metadata: Metadata = {
  title: 'Register | Content AI Web Creator app',
  description: 'Created by Krzysztof &copy; 2025',
};

export default function Login() {
  return <RegisterForm />;
}
