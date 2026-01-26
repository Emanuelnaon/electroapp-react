function Header({titulo, subtitulo}) {
  return (
    <header style={{ 
      backgroundColor: '#007acc', 
      color: 'white', 
      padding: '20px', 
      textAlign: 'center' 
    }}>
      <h1>⚡ {titulo}</h1>
      <p>{subtitulo}</p>
    </header>
  );
}

export default Header;