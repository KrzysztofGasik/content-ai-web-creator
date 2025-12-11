import { Metadata } from 'next';
import GenerateImageCard from './generate-image-card';

export const metadata: Metadata = {
  title: 'Generate image | Content AI Web Creator app',
  description: 'Created by Krzysztof &copy; 2025',
};

export default function GenerateImage() {
  return <GenerateImageCard />;
}
