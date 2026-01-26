import { useState } from 'react';

function Counter() {
  // useState retorna un array con 2 elementos:
  // [1] valor actual, [2] función para cambiar ese valor
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Contador de prueba</h2>
      <p style={{ fontSize: '48px', color: '#007acc' }}>{count}</p>
      
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007acc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Incrementar
      </button>
      
      <button 
        onClick={() => setCount(count - 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Decrementar
      </button>
      
      <button 
        onClick={() => setCount(0)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default Counter;