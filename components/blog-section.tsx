"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BlogPost, formatDate, getImageUrl, calculateReadTime, createSeoSlug } from "@/lib/sanity";

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/blog-posts');
        const result = await response.json();
        
        if (result.success) {
          setBlogPosts(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch blog posts');
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-escape-red via-escape-red-600 to-escape-red-700 bg-clip-text text-transparent mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest escape room trends, tips, and insights from our community of enthusiasts.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="group border-0 shadow-md bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm animate-pulse">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="w-full h-48 bg-slate-700/50" />
                </div>
                <CardHeader className="pb-3">
                  <div className="h-6 bg-slate-700/50 rounded mb-2" />
                  <div className="h-4 bg-slate-700/50 rounded mb-1" />
                  <div className="h-4 bg-slate-700/50 rounded w-3/4" />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 bg-slate-700/50 rounded w-24" />
                    <div className="h-4 bg-slate-700/50 rounded w-20" />
                  </div>
                  <div className="h-10 bg-slate-700/50 rounded" />
                </CardContent>
              </Card>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
              >
                Try Again
              </Button>
            </div>
          ) : blogPosts.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 mb-4">No blog posts available at the moment.</p>
              <p className="text-gray-500 text-sm">Check back later for new content!</p>
            </div>
          ) : (
            // Blog posts
            blogPosts.map((post) => (
              <Card key={post._id} className="group hover:shadow-2xl hover:shadow-escape-red/20 transition-all duration-500 border border-gray-200/50 hover:border-escape-red/30 shadow-lg bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden">
                {/* Card atmospheric background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-4 right-4 w-16 h-16 bg-escape-red/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-escape-red-600/10 rounded-full blur-xl"></div>
                </div>
                
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                      src={getImageUrl(post.image, 400, 240)}
                      alt={post.image?.alt || `${post.title} - Escape Room Blog Article`}
                      width={400}
                      height={240}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  
                  {/* Enhanced overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-gradient-to-r from-escape-red to-escape-red-700 text-white font-bold hover:from-escape-red-600 hover:to-escape-red-800 transition-all duration-300 shadow-lg px-3 py-1">
                      {post.category || 'General'}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="text-xl font-bold line-clamp-2 text-gray-900 group-hover:text-escape-red transition-colors duration-300 leading-tight">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {post.excerpt || 'Read this exciting blog post to learn more!'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0 relative z-10">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-escape-red" />
                      <span className="font-medium">{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-escape-red-600" />
                      <span className="font-medium">{post.readTime || calculateReadTime(post.content)}</span>
                    </div>
                  </div>
                  
                  <Link href={`/blog/${createSeoSlug(post.slug.current)}`} className="block">
                    <Button variant="ghost" className="w-full justify-between text-gray-700 hover:bg-escape-red/5 hover:text-escape-red border border-transparent hover:border-escape-red/20 transition-all duration-300 font-semibold group/btn">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              View All Articles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}