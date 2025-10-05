// src/components/AdvantagesSection.js

// Placeholder Ikon (SVG sederhana)
const IconBook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.45-6.892L12 17.747l5.45-6.892M12 6.253L5.45 13.145" />
  </svg>
);
const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H9a4 4 0 01-4-4V9a4 4 0 014-4h6a4 4 0 014 4v8a4 4 0 01-4 4z" />
  </svg>
);
const IconFacility = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);
const IconCertificate = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IconNetwork = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IconAlumni = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);


// Data untuk keunggulan LPK
const advantagesData = [
  {
    icon: <IconBook />,
    title: 'Kurikulum Berbasis Kompetensi',
    description: 'Kurikulum kami dirancang sesuai dengan standar industri terkini untuk memastikan lulusan siap kerja.',
  },
  {
    icon: <IconUsers />,
    title: 'Instruktur Profesional',
    description: 'Belajar langsung dari praktisi industri yang berpengalaman di bidangnya masing-masing.',
  },
  {
    icon: <IconFacility />,
    title: 'Fasilitas Lengkap',
    description: 'Peralatan modern dan laboratorium praktik yang memadai untuk mendukung proses belajar.',
  },
  {
    icon: <IconCertificate />,
    title: 'Sertifikat Diakui',
    description: 'Sertifikat pelatihan kami diakui secara luas oleh dunia usaha dan industri.',
  },
  {
    icon: <IconNetwork />,
    title: 'Jaringan Kerjasama Luas',
    description: 'Kami memiliki kemitraan dengan berbagai perusahaan untuk mendukung penempatan kerja lulusan.',
  },
  {
    icon: <IconAlumni />,
    title: 'Pendampingan Alumni',
    description: 'Dukungan karir dan bimbingan tetap kami berikan bahkan setelah Anda menyelesaikan pelatihan.',
  },
];

export default function AdvantagesSection() {
  return (
    <section id="advantages" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Mengapa Memilih LPK Tunas Karya Putra?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami berkomitmen untuk memberikan pendidikan keterampilan terbaik untuk masa depan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantagesData.map((advantage, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
              {advantage.icon}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{advantage.title}</h3>
              <p className="text-gray-600 text-sm">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}