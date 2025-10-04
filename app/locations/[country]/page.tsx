import { notFound } from 'next/navigation';
import { getStatesWithRoomCounts, getFullStateName, formatStateForURL, getDatabaseStats } from '@/lib/supabase';
import { createCountryMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { MapPin, Building2, Globe, Star, ArrowRight, Key, Lock, Clock, Search, Puzzle } from 'lucide-react';
import { Metadata } from 'next';

interface CountryPageProps {
  params: Promise<{
    country: string;
  }>;
}

const SUPPORTED_COUNTRIES = {
  'usa': 'United States',
  'canada': 'Canada',
  'uk': 'United Kingdom'
};



export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country } = await params;
  
  if (!SUPPORTED_COUNTRIES[country as keyof typeof SUPPORTED_COUNTRIES]) {
    return {
      title: 'Country Not Found',
      description: 'The requested country page could not be found.'
    };
  }

  const countryName = SUPPORTED_COUNTRIES[country as keyof typeof SUPPORTED_COUNTRIES];
  const { data: statesWithCounts } = await getStatesWithRoomCounts(countryName);
  const dbStats = await getDatabaseStats();
  const totalRooms = country === 'usa' ? dbStats.totalRooms : (statesWithCounts?.reduce((sum, state) => sum + state.room_count, 0) || 0);
  const totalStates = statesWithCounts?.length || 0;

  return createCountryMetadata(
    countryName,
    totalStates
  );
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country } = await params;
  
  // Debug logging
  console.log('Country parameter:', country);
  console.log('Is USA?', country === 'usa');
  console.log('Background image should be:', country === 'usa' ? '/images/united states.jpg' : '/images/hero.jpeg');
  
  // Validate country parameter
  if (!SUPPORTED_COUNTRIES[country as keyof typeof SUPPORTED_COUNTRIES]) {
    notFound();
  }
  
  const countryName = SUPPORTED_COUNTRIES[country as keyof typeof SUPPORTED_COUNTRIES];
  
  try {
    // Get states/provinces for this country
    const { data: statesWithCounts } = await getStatesWithRoomCounts(countryName);
    
    if (!statesWithCounts || statesWithCounts.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Escape Rooms in {countryName}</h1>
          <p className="text-muted-foreground">
            No escape rooms found in {countryName} yet. Check back soon!
          </p>
        </div>
      );
    }
    
    // Get accurate database statistics
    const dbStats = await getDatabaseStats();
    const totalRooms = country === 'usa' ? dbStats.totalRooms : (statesWithCounts?.reduce((sum, state) => sum + state.room_count, 0) || 0);
    const totalStates = country === 'usa' ? dbStats.uniqueStates : (statesWithCounts?.length || 0);
    
    return (
      <div className="min-h-screen bg-background">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': `https://escaperoomsfinder.com/locations/${country}#organization`,
              'name': `Escape Rooms Finder ${countryName}`,
              'url': `https://escaperoomsfinder.com/locations/${country}`,
              'description': `Directory of escape rooms in ${countryName}. Find local escape room experiences.`,
              'areaServed': {
                '@type': 'Country',
                'name': countryName
              },
              'numberOfItems': totalRooms,
              'potentialAction': {
                '@type': 'SearchAction',
                'target': `https://escaperoomsfinder.com/browse?country=${countryName}&{search_term_string}`,
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              'itemListElement': [
                {
                  '@type': 'ListItem',
                  'position': 1,
                  'name': 'Home',
                  'item': 'https://escaperoomsfinder.com'
                },
                {
                  '@type': 'ListItem',
                  'position': 2,
                  'name': 'Locations',
                  'item': 'https://escaperoomsfinder.com/locations'
                },
                {
                  '@type': 'ListItem',
                  'position': 3,
                  'name': countryName,
                  'item': `https://escaperoomsfinder.com/locations/${country}`
                }
              ]
            })
          }}
        />
        {/* Breadcrumb Navigation */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/locations">Locations</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{countryName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <section 
          className="relative text-white py-20 overflow-hidden" 
          style={{
            backgroundImage: 'url("/images/united states.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
          
          {/* Enhanced atmospheric elements matching homepage */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500" />
          </div>
          
          {/* Mystery elements matching homepage */}
          <div className="absolute inset-0 opacity-10 -z-10">
            <div className="absolute top-1/4 left-1/6 text-4xl animate-mystery-float pointer-events-none">🔍</div>
            <div className="absolute top-3/4 right-1/5 text-3xl animate-mystery-float delay-1000 pointer-events-none">🗝️</div>
            <div className="absolute top-1/2 right-1/4 text-2xl animate-mystery-float delay-500 pointer-events-none">🔐</div>
            <div className="absolute bottom-1/4 left-1/4 text-3xl animate-mystery-float delay-1500 pointer-events-none">⏱️</div>
            <div className="absolute top-1/3 right-1/6 text-2xl animate-mystery-float delay-2000 pointer-events-none">🧩</div>
          </div>
          
          {/* Glowing particles effect */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-escape-red rounded-full animate-ping" />
            <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-escape-red-400 rounded-full animate-ping delay-1000" />
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-escape-red-600 rounded-full animate-ping delay-500" />
          </div>
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Globe className="h-8 w-8 text-escape-red" />
                <Badge variant="secondary" className="px-3 py-1 bg-escape-red/20 text-escape-red border-escape-red/30">
                  <MapPin className="h-3 w-3 mr-1" />
                  {countryName}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent">
                  Escape Rooms in {countryName}
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover thrilling escape room adventures across {countryName}. From mind-bending puzzles to immersive storylines, find your next challenge.
                <br className="hidden sm:block" />
                <span className="text-escape-red-300">Explore escape rooms in this country!</span>
              </p>
              
              {/* Statistics */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-4 py-3 border border-white/20">
                  <Building2 className="h-5 w-5 text-escape-red" />
                  <span className="font-semibold text-white">{totalRooms}</span>
                  <span className="text-gray-200">Escape Rooms</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-4 py-3 border border-white/20">
                  <MapPin className="h-5 w-5 text-escape-red" />
                  <span className="font-semibold text-white">{totalStates}</span>
                  <span className="text-gray-200">{country === 'usa' ? 'States' : country === 'canada' ? 'Provinces' : 'Regions'}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-4 py-3 border border-white/20">
                  <Star className="h-5 w-5 text-escape-red" />
                  <span className="font-semibold text-white">Premium</span>
                  <span className="text-gray-200">Experiences</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* States Grid - Rebuilt from scratch */}
        <div className="container mx-auto px-4 py-16">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-3 gap-6">
            {statesWithCounts.map((stateData, index) => {
              const stateName = stateData.state;
              const fullStateName = stateData.fullName;
              const stateUrl = formatStateForURL(stateName);
              const colorIndex = index % 4;
              
              // Array of different descriptions without numbers
              const descriptions = [
                `Experience thrilling escape room adventures and immersive puzzle challenges in ${fullStateName}`,
                `Discover amazing escape room experiences with unique themes and storylines across ${fullStateName}`,
                `Explore captivating escape rooms featuring mind-bending puzzles and exciting adventures in ${fullStateName}`,
                `Uncover incredible escape room destinations with challenging scenarios and unforgettable experiences in ${fullStateName}`
              ];
              
              const description = descriptions[index % descriptions.length];
              
              const colors = {
                0: { bg: 'bg-gradient-to-br from-escape-red to-escape-red-600', text: 'text-escape-red', accent: 'border-escape-red-200', icon: Key },
                1: { bg: 'bg-gradient-to-br from-escape-red-600 to-escape-red-700', text: 'text-escape-red-600', accent: 'border-escape-red-300', icon: Lock },
                2: { bg: 'bg-gradient-to-br from-escape-red-700 to-escape-red-800', text: 'text-escape-red-700', accent: 'border-escape-red-400', icon: Puzzle },
                3: { bg: 'bg-gradient-to-br from-escape-red-500 to-escape-red-600', text: 'text-escape-red-500', accent: 'border-escape-red-200', icon: Search }
              };
              
              const color = colors[colorIndex as keyof typeof colors];
              const IconComponent = color.icon;
              
              return (
                <Link 
                  key={`${stateName}-${index}`}
                  href={`/locations/${country}/${stateUrl}`}
                  className="group block"
                >
                  <Card className="h-full transition-all duration-500 hover:shadow-2xl hover:shadow-escape-red/20 border-2 rounded-xl overflow-hidden group-hover:-translate-y-3 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 hover:border-escape-red/50 relative group">
                    {/* Atmospheric Background Elements */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                      <div className="absolute top-4 right-4 w-16 h-16 bg-escape-red rounded-full blur-2xl animate-pulse" />
                      <div className="absolute bottom-6 left-6 w-12 h-12 bg-escape-red-600 rounded-full blur-xl animate-pulse delay-1000" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-escape-red-700/30 rounded-full blur-3xl" />
                    </div>
                    
                    {/* Mystery Elements */}
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 -z-10">
                      <div className="absolute top-6 left-6 text-2xl animate-mystery-float pointer-events-none">🔍</div>
                      <div className="absolute top-1/3 right-8 text-xl animate-mystery-float delay-500 pointer-events-none">🗝️</div>
                      <div className="absolute bottom-8 right-6 text-lg animate-mystery-float delay-1000 pointer-events-none">🔐</div>
                      <div className="absolute bottom-1/3 left-8 text-xl animate-mystery-float delay-1500 pointer-events-none">⏱️</div>
                    </div>
                    
                    {/* Glowing Particles */}
                    <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                      <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-escape-red rounded-full animate-ping" />
                      <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-escape-red-400 rounded-full animate-ping delay-700" />
                      <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-escape-red-600 rounded-full animate-ping delay-1400" />
                    </div>
                    
                    <CardContent className="p-8 relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`p-4 rounded-full ${color.text} bg-gradient-to-br from-escape-red/20 to-escape-red/10 shadow-2xl border border-escape-red/30 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-7 w-7" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-escape-red-300 uppercase tracking-wide font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {country === 'usa' ? 'State' : 'Region'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-escape-red-200 transition-colors duration-300 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent group-hover:from-escape-red-200 group-hover:to-white">
                          {fullStateName}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
                          {description}
                        </p>
                      </div>
                      
                      <div className={`w-full py-4 px-6 rounded-lg text-center font-semibold text-sm text-white transition-all duration-500 ${color.bg} hover:shadow-2xl group-hover:shadow-escape-red/30 flex items-center justify-center gap-2 group-hover:scale-105 relative overflow-hidden`}>
                        {/* Button atmospheric effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Key className="h-4 w-4 transition-transform group-hover:rotate-12" />
                        Unlock {fullStateName}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching states:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Escape Rooms in {countryName}</h1>
        <p className="text-red-500">
          Sorry, we encountered an error loading the states. Please try again later.
        </p>
      </div>
    );
  }
}

export async function generateStaticParams() {
  return Object.keys(SUPPORTED_COUNTRIES).map((country) => ({
    country,
  }));
}