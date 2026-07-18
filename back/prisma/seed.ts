// prisma/seed.ts
import { PrismaClient, UserRole, MovieAvailability } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...');

  // ==========================================
  // 1. CRIAR CONTA DE ADMIN
  // ==========================================
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cinerent.com' },
    update: {}, 
    create: {
      name: 'Administrador Cinerent',
      email: 'admin@cinerent.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log(`✅ Admin criado com sucesso: ${admin.email} | Senha: admin123`);

  // ==========================================
  // 2. CRIAR FILMES INICIAIS
  // ==========================================
  const moviesData = [
    {
      title: 'A Origem',
      synopsis: 'Um ladrão que rouba segredos corporativos por meio do uso da tecnologia de compartilhamento de sonhos recebe a tarefa inversa de plantar uma ideia na mente de um CEO.',
      genre: 'Ficção Científica',
      director: 'Christopher Nolan',
      releaseYear: 2010,
      durationMinutes: 148,
      ageRating: '14',
      posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkYSBZAByZnPNMqW.jpg',
      rentalPrice: 12.90,
      stock: 5,
      availability: MovieAvailability.AVAILABLE,
    },
    {
      title: 'O Poderoso Chefão',
      synopsis: 'O patriarca de uma dinastia do crime organizado transfere o controle de seu império clandestino para seu filho relutante.',
      genre: 'Drama',
      director: 'Francis Ford Coppola',
      releaseYear: 1972,
      durationMinutes: 175,
      ageRating: '16',
      posterUrl: 'https://image.tmdb.org/t/p/w500/o7n7WbJk1tA8I3lX05T2gW9T8L4.jpg',
      rentalPrice: 9.90,
      stock: 3,
      availability: MovieAvailability.AVAILABLE,
    },
    {
      title: 'Matrix',
      synopsis: 'Um hacker de computador aprende com rebeldes misteriosos sobre a verdadeira natureza de sua realidade e seu papel na guerra contra seus controladores.',
      genre: 'Ação',
      director: 'Lana Wachowski, Lilly Wachowski',
      releaseYear: 1999,
      durationMinutes: 136,
      ageRating: '12',
      posterUrl: 'https://image.tmdb.org/t/p/w500/q22R4O3z0R43I8I256l1D8b0fNq.jpg',
      rentalPrice: 8.50,
      stock: 10,
      availability: MovieAvailability.AVAILABLE,
    },
    {
      title: 'Interestelar',
      synopsis: 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.',
      genre: 'Ficção Científica',
      director: 'Christopher Nolan',
      releaseYear: 2014,
      durationMinutes: 169,
      ageRating: '10',
      posterUrl: 'https://image.tmdb.org/t/p/w500/nCbkKJriBiTKQpCB5h6LcgU3r2r.jpg',
      rentalPrice: 14.90,
      stock: 8,
      availability: MovieAvailability.AVAILABLE,
    },
    {
      title: 'Parasita',
      synopsis: 'A ganância e a discriminação de classe ameaçam a relação simbiótica recém-formada entre a rica família Park e a destituída família Kim.',
      genre: 'Suspense',
      director: 'Bong Joon Ho',
      releaseYear: 2019,
      durationMinutes: 132,
      ageRating: '16',
      posterUrl: 'https://image.tmdb.org/t/p/w500/1pzj1Vav8rX8zVjLp4809VjNidC.jpg',
      rentalPrice: 15.00,
      stock: 6,
      availability: MovieAvailability.AVAILABLE,
    },
    {
      title: 'Vingadores: Ultimato',
      synopsis: 'Após os eventos devastadores de Guerra Infinita, os Vingadores se reúnem mais uma vez para reverter as ações de Thanos e restaurar a ordem no universo.',
      genre: 'Ação',
      director: 'Anthony Russo, Joe Russo',
      releaseYear: 2019,
      durationMinutes: 181,
      ageRating: '12',
      posterUrl: 'https://image.tmdb.org/t/p/w500/q6725aR8Zs4IwGXCzV8sVv7qOls.jpg',
      rentalPrice: 16.90,
      stock: 15,
      availability: MovieAvailability.AVAILABLE,
    },
    {
      title: 'Coringa',
      synopsis: 'Em Gotham City, o comediante mentalmente perturbado Arthur Fleck é desconsiderado e maltratado pela sociedade. Ele então embarca em uma espiral descendente de revolução e crimes sangrentos.',
      genre: 'Drama',
      director: 'Todd Phillips',
      releaseYear: 2019,
      durationMinutes: 122,
      ageRating: '16',
      posterUrl: 'https://image.tmdb.org/t/p/w500/xcegLLaHZN0J8W2j8m2kQ0UqgH3.jpg',
      rentalPrice: 14.50,
      stock: 4,
      availability: MovieAvailability.AVAILABLE,
    },
    {
      title: 'Toy Story',
      synopsis: 'Um boneco de caubói fica profundamente ameaçado e enciumado quando um novo e moderno brinquedo de astronauta ganha o posto de favorito no quarto de um menino.',
      genre: 'Animação',
      director: 'John Lasseter',
      releaseYear: 1995,
      durationMinutes: 81,
      ageRating: 'Livre',
      posterUrl: 'https://image.tmdb.org/t/p/w500/z61qR3oJqX6Lh23bFmN20xXb6R3.jpg',
      rentalPrice: 7.90,
      stock: 12,
      availability: MovieAvailability.AVAILABLE,
    },
    {
      title: 'Jurassic Park',
      synopsis: 'Um paleontólogo é encarregado de proteger algumas crianças após uma queda de energia causar a fuga de dinossauros clonados em um parque temático.',
      genre: 'Aventura',
      director: 'Steven Spielberg',
      releaseYear: 1993,
      durationMinutes: 127,
      ageRating: '10',
      posterUrl: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg',
      rentalPrice: 8.90,
      stock: 7,
      availability: MovieAvailability.AVAILABLE,
    },
    {
      title: 'O Senhor dos Anéis: A Sociedade do Anel',
      synopsis: 'Um manso hobbit e seus oito companheiros partem em uma jornada para destruir o poderoso Um Anel e salvar a Terra-Média do Senhor das Trevas Sauron.',
      genre: 'Fantasia',
      director: 'Peter Jackson',
      releaseYear: 2001,
      durationMinutes: 178,
      ageRating: '12',
      posterUrl: 'https://image.tmdb.org/t/p/w500/pA2kEB30b7h6XFmI7tA7I0w2i3N.jpg',
      rentalPrice: 11.90,
      stock: 9,
      availability: MovieAvailability.AVAILABLE,
    }
  ];

  // Verifica se já existem filmes para evitar duplicação no catálogo
  const count = await prisma.movie.count();
  
  if (count === 0) {
    await prisma.movie.createMany({
      data: moviesData,
    });
    console.log(`✅ ${moviesData.length} filmes foram adicionados ao catálogo!`);
  } else {
    console.log('⚠️ Os filmes já existem no banco. Pulando inserção de filmes.');
  }

  console.log('🎉 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });