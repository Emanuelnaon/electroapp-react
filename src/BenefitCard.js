function BenefitCard({ emoji , titulo, descripcion }) {
   return (
       <div style={{
         backgroundColor: '#f0f4f8',
         borderRadius: '8px',
         padding: '20px',
         marginBottom: '15px',
         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
       }}>
         <div style={{ fontSize: '40px', marginBottom: '10px' }}>
            {emoji}
         </div>
         <h3 style={{ color: '#007acc', marginBottom: '10px' }}>
            {titulo}
         </h3>
         <p style={{ color:'#4a5568', lineHeight: '1.6'}}>
            {descripcion}
         </p>
       </div>
   );
}

export default BenefitCard;

// <BenefitCard emoji="⚡" titulo="ElectroApp" descripcion="La app para electricistas que simplifica tu trabajo" />
