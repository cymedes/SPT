export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}> Subaru Pricing Tool</h1>
      <a href="/admin/pricing" style={{ color: '#2563eb', textDecoration: 'underline' }}>
        Przejdź do wyceny serwisowej
      </a>
    </main>
  );
}

