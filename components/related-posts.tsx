'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/sanity';
import { getImageUrl } from '@/lib/sanity';

interface RelatedPostsProps {
  relatedPosts: BlogPost[];
}

export default function RelatedPosts({ relatedPosts }: RelatedPostsProps) {
  console.log('RelatedPosts component - relatedPosts:', relatedPosts);
  console.log('RelatedPosts component - relatedPosts.length:', relatedPosts.length);
  
  if (relatedPosts.length === 0) {
    console.log('RelatedPosts: No related posts found, returning null');
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Atmospheric Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-escape-red rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-escape-red-600 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-escape-red-700 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-escape-red via-escape-red-600 to-escape-red-700 bg-clip-text text-transparent mb-6">
            Related Articles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover more insights and tips from our escape room community
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-escape-red rounded-full"></div>
            <div className="w-2 h-2 bg-escape-red-600 rounded-full"></div>
            <div className="w-2 h-2 bg-escape-red-700 rounded-full"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPosts.map((post) => (
            <Link key={post._id} href={`/blog/${post.slug.current}`} className="block group">
              <Card className="h-full bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 rounded-2xl overflow-hidden">
                {/* Atmospheric background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-4 right-4 w-16 h-16 bg-escape-red/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-escape-red-600/10 rounded-full blur-xl"></div>
                </div>
                
                {post.mainImage && (
                  <div className="relative overflow-hidden">
                    <Image
                      src={getImageUrl(post.mainImage, 400, 240)}
                      alt={post.mainImage.alt || `${post.title} - Related Escape Room Article`}
                      width={400}
                      height={240}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category badge overlay */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-escape-red text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        🗝️ Article
                      </div>
                    </div>
                  </div>
                )}
                
                <CardContent className="p-6 relative z-10">
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-escape-red line-clamp-2 mb-4 transition-colors duration-300 leading-tight">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 text-escape-red-600" />
                      <span className="font-medium">{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-escape-red">
                      <span className="text-sm font-bold">Read More</span>
                      <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
