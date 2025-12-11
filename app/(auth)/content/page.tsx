import { Metadata } from 'next';
import ContentClient from './content-client';

export const metadata: Metadata = {
  title: 'Content | Content AI Web Creator app',
  description: 'Created by Krzysztof &copy; 2025',
};

export default function Content() {
  return <ContentClient />;
}
