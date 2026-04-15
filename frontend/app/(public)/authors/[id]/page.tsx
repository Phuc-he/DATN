import ProductSection from '@/src/presentation/components/public/products/ProductSection';
import { AppProviders } from '@/src/provider/provider';
import { ArrowLeft, Award, BookOpen, Share2, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// 1. params.id luôn là một chuỗi từ URL
interface AuthorPageProps {
  params: Promise<{ id: string }>;
}

export default async function AuthorDetailPage({ params }: AuthorPageProps) {
  // 2. Await đối tượng params
  const resolvedParams = await params;
  const idString = resolvedParams.id;

  // 3. Chuyển đổi sang số cho Backend/UseCase
  const authorId = parseInt(idString, 10);

  console.log('Đang tải thông tin tác giả và sách cho authorId:', authorId);

  if (isNaN(authorId)) {
    return <div>ID Tác giả không hợp lệ</div>;
  }

  // 1. Lấy dữ liệu Tác giả và Sách của họ
  const [author, paginatedBooks] = await Promise.all([
    AppProviders.GetAuthorUseCase.execute(authorId),
    AppProviders.GetBooksByAuthorUseCase.execute(authorId, 0, 10),
  ]);

  const authorBooks = paginatedBooks.content;

  if (!author) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h1 className="text-2xl font-bold text-slate-800">Không tìm thấy tác giả</h1>
        <Link href="/" className="mt-4 text-emerald-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={18} /> Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 2. Điều hướng Breadcrumb */}
      <nav className="container mx-auto px-8 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại Trang chủ
        </Link>
      </nav>

      {/* 3. Phần Hero Tác giả */}
      <section className="container mx-auto px-8 mb-16">
        <div className="relative bg-slate-950 rounded-[2rem] overflow-hidden p-8 md:p-16 text-white flex flex-col md:flex-row gap-12 items-center">
          {/* Trang trí nền */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />

          {/* Ảnh hồ sơ */}
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

          {/* Nội dung tiểu sử */}
          <div className="relative z-10 flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <span className="bg-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Tác giả đã xác minh
              </span>
              <Award size={18} className="text-emerald-400" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              {author.name}
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mb-8 font-medium italic">
              &quot;{author.bio || 'Tác giả này chưa cung cấp tiểu sử.'}&quot;
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <BookOpen size={20} className="text-emerald-400" />
                <span className="font-bold">{authorBooks.length} Cuốn sách đã xuất bản</span>
              </div>
              <button className="flex items-center gap-2 bg-white text-slate-950 px-6 py-2 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                <Share2 size={18} />
                Chia sẻ hồ sơ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tác phẩm của tác giả */}
      <div className="container mx-auto px-8">
        <div className="h-px bg-slate-100 w-full mb-16" />

        {authorBooks.length > 0 ? (
          <ProductSection
            title={`Tác phẩm của ${author.name}`}
            subtitle={`Khám phá bộ sưu tập đầy đủ các tựa sách được viết bởi ${author.name}.`}
            products={authorBooks}
            viewAllHref={`/shop/search?author=${author.id}`}
          />
        ) : (
          <div className="py-20 text-center bg-emerald-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">Chưa có danh sách sách</h3>
            <p className="text-emerald-900">Chúng tôi đang cập nhật thư viện của tác giả này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
