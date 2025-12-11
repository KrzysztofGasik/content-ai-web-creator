import { Metadata } from 'next';
import GenerateCard from './generate-card';

export const metadata: Metadata = {
  title: 'Generate content | Content AI Web Creator app',
  description: 'Created by Krzysztof &copy; 2025',
};

export default function Generate() {
  return <GenerateCard />;
}
