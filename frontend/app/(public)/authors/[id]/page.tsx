import ProductSection from '@/src/presentation/components/public/products/ProductSection';
import { AppProviders } from '@/src/provider/provider';
import { ArrowLeft, Award, BookOpen, Share2, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// 1. params.id is always a string from the URL
interface AuthorPageProps {
  params: Promise<{ id: string }>;
}

export default async function AuthorDetailPage({ params }: AuthorPageProps) {
  // 2. Await the params object
  const resolvedParams = await params;
  const idString = resolvedParams.id;

  // 3. Convert to number for your Backend/UseCase
  const authorId = parseInt(idString, 10);

  console.log('Fetching author and books for authorId:', authorId);

  if (isNaN(authorId)) {
    return <div>Invalid Author ID</div>;
  }

  // 1. Fetch Author data and their Books
  const [author, paginatedBooks] = await Promise.all([
    AppProviders.GetAuthorUseCase.execute(authorId),
    AppProviders.GetBooksByAuthorUseCase.execute(authorId, 0, 10),
  ]);

  const authorBooks = paginatedBooks.content;

  if (!author) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h1 className="text-2xl font-bold text-slate-800">Author not found</h1>
        <Link href="/authors" className="mt-4 text-emerald-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={18} /> Back to all authors
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 2. Top Navigation Breadcrumb */}
      <nav className="container mx-auto px-8 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </nav>

      {/* 3. Author Hero Section */}
      <section className="container mx-auto px-8 mb-16">
        <div className="relative bg-slate-950 rounded-[2rem] overflow-hidden p-8 md:p-16 text-white flex flex-col md:flex-row gap-12 items-center">
          {/* Abstract Background Decoration */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />

          {/* Profile Image */}
          <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse" />
            <div className="relative h-full w-full rounded-full border-4 border-white/10 p-2 overflow-hidden bg-slate-800">
              {author.profileImage ? (
                <Image
                  src={author.profileImage}
                  alt={author.name}
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-600">
                  <User size={80} />
                </div>
              )}
            </div>
          </div>

          {/* Bio Content */}
          <div className="relative z-10 flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <span className="bg-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Verified Author
              </span>
              <Award size={18} className="text-emerald-400" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              {author.name}
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mb-8 font-medium italic">
              &quot;{author.bio || 'This author has not provided a biography yet.'}&quot;
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <BookOpen size={20} className="text-emerald-400" />
                <span className="font-bold">{authorBooks.length} Published Books</span>
              </div>
              <button className="flex items-center gap-2 bg-white text-slate-950 px-6 py-2 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                <Share2 size={18} />
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Author's Works (Books) */}
      <div className="container mx-auto px-8">
        <div className="h-px bg-slate-100 w-full mb-16" />

        {authorBooks.length > 0 ? (
          <ProductSection
            title={`Works by ${author.name}`}
            subtitle={`Browse the full collection of titles authored by ${author.name}.`}
            products={authorBooks}
            viewAllHref={`/shop/search?author=${author.id}`}
          />
        ) : (
          <div className="py-20 text-center bg-emerald-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No books listed yet</h3>
            <p className="text-emerald-900">We are currently cataloging this author&apos;s library.</p>
          </div>
        )}
      </div>
    </div>
  );
}
