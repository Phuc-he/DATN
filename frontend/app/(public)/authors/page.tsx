import { AppProviders } from '@/src/provider/provider';
import AuthorSection from '@/src/presentation/components/public/authors/AuthorSection';
import { Author } from '@/src/domain/entity/author.entity';

export const metadata = {
  title: 'Tác giả | Nhà sách trực tuyến',
  description: 'Khám phá các tác giả nổi bật của chúng tôi',
};

export default async function AuthorsPage() {
  const { GetAllAuthorsUseCase } = AppProviders;
  let authors: Author[] = [];

  try {
    authors = await GetAllAuthorsUseCase.execute();
  } catch (error) {
    console.error('Failed to fetch authors:', error);
  }

  return (
    <main className="min-h-screen">
      <AuthorSection authors={authors} />
    </main>
  );
}
