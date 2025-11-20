import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import CardComponent from './(auth)/dashboard/card';
import { PenTool, Share2, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-10 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            AI-Powered Content Generation
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Create blog posts, social media content, and more with AI. No
            writer's block, just endless creativity.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          <CardComponent
            data={{
              id: 1,
              title: 'Generate Blog Posts',
              icon: <PenTool />,
              description: '',
              content:
                'Create high-quality blog posts from any topic. AI writes, you refine. Perfect for content creators and marketers.',
              footer: '',
              action: undefined,
            }}
          />
          <CardComponent
            data={{
              id: 2,
              title: 'Create Social Media Content',
              icon: <Share2 />,
              description: '',
              content:
                'Generate engaging posts for Twitter, LinkedIn, and Instagram. Multiple formats, one platform. Save hours every week.',
              footer: '',
              action: undefined,
            }}
          />
          <CardComponent
            data={{
              id: 3,
              title: 'AI Image Generation',
              icon: <Sparkles />,
              description: '',
              content:
                'Bring your content to life with AI-generated images. Describe what you need, get stunning visuals in seconds.',
              footer: '',
              action: undefined,
            }}
          />
        </div>
        <div className="my-10 text-center sm:text-left">
          <h2 className="text-xl mt-2 mb-2">Ready to create?</h2>
          <Button asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
