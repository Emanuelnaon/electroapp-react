import { useState, useEffect } from "react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Mostrar botón cuando bajas 200px
 const toggleVisibility = () => {
     // Buscamos en todas las fuentes posibles de scroll
     const scrolled =
         window.pageYOffset ||
         document.documentElement.scrollTop ||
         document.body.scrollTop ||
         0;

     if (scrolled > 200) {
         setIsVisible(true);
     } else {
         setIsVisible(false);
     }
 };

    // La función mágica para subir
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Animación suave
        });
    };

useEffect(() => {
    // El 'true' es la clave: escucha el scroll en cualquier parte de la app
    window.addEventListener("scroll", toggleVisibility, true);
    return () => window.removeEventListener("scroll", toggleVisibility, true);
}, []);

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    style={{
                        position: "fixed",
                        bottom: "30px",
                        right: "30px",
                        backgroundColor: "#FFD700", // Amarillo ElectroApp
                        color: "#131517",
                        border: "none",
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        fontSize: "24px",
                        cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                        zIndex: 9999999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                        (e.target.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                        (e.target.style.transform = "scale(1)")
                    }
                    title="Volver arriba"
                >
                    ⬆️
                </button>
            )}
        </>
    );
};

export default ScrollToTop;
