import AboutContactSection from '@/components/sections/AboutContactSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About & Contact | NextGenAI',
    description: 'Learn more about NextGenAI, the futuristic AI platform by Parul, and how to get in touch with us.',
};

export default function AboutPage() {
  return <AboutContactSection />;
}
