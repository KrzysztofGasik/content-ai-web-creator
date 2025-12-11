import { Metadata } from 'next';
import ProjectsClient from './projects-client';

export const metadata: Metadata = {
  title: 'Projects | Content AI Web Creator app',
  description: 'Created by Krzysztof &copy; 2025',
};

export default function Projects() {
  return <ProjectsClient />;
}
