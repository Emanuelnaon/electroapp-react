import React, { useState, useEffect, useRef } from "react";
import styles from "./Cotizador.module.css";
import toast from "react-hot-toast";
import { supabase } from "./supabaseClient"; // ✅ AGREGADO

const Cotizador = ({ onBack }) => {
    // 1. ESTADOS Y REFERENCIAS
    const [cliente, setCliente] = useState({
        nombre: "",
        telefono: "",
        email: "",
        fecha: new Date().toISOString().split("T")[0],
    });
    const [items, setItems] = useState([
        { id: 1, descripcion: "", cantidad: 1, precio: "" },
    ]);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // ✅ AGREGADO
    const itemsRef = useRef([]);

    // 2. DEFINICIÓN DE TODAS LAS FUNCIONES (Lógica)

    // ✅ NUEVA FUNCIÓN: GUARDAR EN SUPABASE
    const handleSaveQuote = async () => {
        if (!cliente.nombre.trim())
            return toast.error("El nombre del cliente es obligatorio");

        setIsSaving(true);
        const toastId = toast.loading("Guardando...");

        try {
            // A. Obtener usuario
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error("Debes iniciar sesión");

            let finalClienteId = null;

            // B. Buscar o Crear Cliente
            const { data: clientesExistentes } = await supabase
                .from("clientes")
                .select("id")
                .eq("user_id", user.id)
                .ilike("nombre", cliente.nombre.trim())
                .limit(1);

            if (clientesExistentes?.length > 0) {
                finalClienteId = clientesExistentes[0].id;
            } else {
                const { data: nuevoCliente, error: errC } = await supabase
                    .from("clientes")
                    .insert([
                        {
                            nombre: cliente.nombre.trim(),
                            telefono: cliente.telefono,
                            email: cliente.email,
                            user_id: user.id,
                        },
                    ])
                    .select()
                    .single();
                if (errC) throw errC;
                finalClienteId = nuevoCliente.id;
            }

            // C. Guardar Presupuesto
            const { error: errP } = await supabase.from("presupuestos").insert([
                {
                    user_id: user.id,
                    cliente_id: finalClienteId,
                    items: items,
                    total: total,
                    fecha: cliente.fecha,
                },
            ]);

            if (errP) throw errP;

            toast.success("¡Guardado en la nube! ☁️", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    // Limpiar campos
    const handleClear = () => {
        if (
            window.confirm(
                "¿Estás seguro de borrar todo para empezar un presupuesto nuevo?",
            )
        ) {
            setCliente({
                nombre: "",
                telefono: "",
                email: "",
                fecha: new Date().toISOString().split("T")[0],
            });
            setItems([
                { id: Date.now(), descripcion: "", cantidad: 1, precio: "" },
            ]);
            toast.success("Campos limpios ✨");

            // Re-enfocar
            setTimeout(() => {
                const inputNombre = document.querySelector(
                    'input[placeholder="Nombre completo"]',
                );
                if (inputNombre) inputNombre.focus();
            }, 100);
        }
    };

    // Agregar Item
    const addItem = () => {
        const newItem = {
            id: Date.now(),
            descripcion: "",
            cantidad: 1,
            precio: "",
        };
        setItems((prev) => [...prev, newItem]);
        setTimeout(() => {
            const lastIndex = items.length;
            if (itemsRef.current[lastIndex])
                itemsRef.current[lastIndex].focus();
        }, 50);
    };

    // Eliminar Item
    const removeItem = (id) => {
        if (items.length === 1) {
            setItems([
                { id: Date.now(), descripcion: "", cantidad: 1, precio: "" },
            ]);
            return;
        }
        setItems(items.filter((item) => item.id !== id));
    };

    // Actualizar Item
    const updateItem = (id, field, value) => {
        const newItems = items.map((item) => {
            if (item.id === id) return { ...item, [field]: value };
            return item;
        });
        setItems(newItems);
    };

    // Calcular Total
    const total = items.reduce((acc, item) => {
        return (
            acc +
            (parseFloat(item.cantidad) || 0) * (parseFloat(item.precio) || 0)
        );
    }, 0);

    // Imprimir
    const handlePrint = () => {
        if (!cliente.nombre.trim())
            return toast.error("Falta el nombre del cliente");
        window.print();
    };

    // Abrir Modal
    const handleOpenShare = () => {
        if (!cliente.nombre.trim())
            return toast.error("Ingresa nombre del cliente antes de enviar");
        setShowShareModal(true);
    };

    // Generar Mensaje
    const generateMessage = () => {
        let msg = `⚡ *PRESUPUESTO ELECTROAPP*\n`;
        msg += `📅 Fecha: ${cliente.fecha}\n`;
        msg += `👤 Cliente: ${cliente.nombre}\n\n`;
        msg += `*DETALLE DEL TRABAJO:*\n`;

        items.forEach((item) => {
            if (item.descripcion) {
                const subtotal =
                    (parseFloat(item.cantidad) || 0) *
                    (parseFloat(item.precio) || 0);
                msg += `• ${item.descripcion} (x${item.cantidad}): $${subtotal.toLocaleString()}\n`;
            }
        });

        msg += `\n💰 *TOTAL ESTIMADO: $${total.toLocaleString()}*\n`;
        msg += `\n_Presupuesto válido por 15 días._`;
        return encodeURIComponent(msg);
    };

    const sendWhatsApp = () => {
        const text = generateMessage();
        const phone = cliente.telefono
            ? `&phone=${cliente.telefono.replace(/[^0-9]/g, "")}`
            : "";
        window.open(`https://wa.me/?text=${text}${phone}`, "_blank");
        setShowShareModal(false);
    };

    const sendEmail = () => {
        const text = generateMessage().replace(/%0A/g, "%0D%0A");
        const subject = `Presupuesto para ${cliente.nombre}`;
        window.open(
            `mailto:${cliente.email || ""}?subject=${subject}&body=${text}`,
            "_blank",
        );
        setShowShareModal(false);
    };

    const handleKeyDownTable = (e, index, field, id) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (field === "precio") addItem();
        }
        if (
            e.key === "Backspace" &&
            field === "descripcion" &&
            items[index].descripcion === "" &&
            items.length > 1
        ) {
            e.preventDefault();
            removeItem(id);
            if (index > 0 && itemsRef.current[index - 1])
                itemsRef.current[index - 1].focus();
        }
    };

    // 3. USE EFFECT
    useEffect(() => {
        const handleGlobalKeys = (e) => {
            if (e.key === "Escape") {
                if (showShareModal) setShowShareModal(false);
                else onBack();
            }

            if (!showShareModal) {
                if (e.key === "F2") {
                    e.preventDefault();
                    addItem();
                }
                if ((e.ctrlKey || e.metaKey) && e.key === "p") {
                    e.preventDefault();
                    handlePrint();
                }
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleOpenShare();
                }
                if (e.altKey && e.key.toLowerCase() === "l") {
                    e.preventDefault();
                    handleClear();
                }
                // ✅ ATAJO DE GUARDADO (Alt + S)
                if (e.altKey && e.key.toLowerCase() === "s") {
                    e.preventDefault();
                    handleSaveQuote();
                }
            }
        };

        window.addEventListener("keydown", handleGlobalKeys);
        return () => window.removeEventListener("keydown", handleGlobalKeys);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cliente, items, showShareModal]);

    // 4. RENDERIZADO (JSX)
    return (
        <div className={styles.container}>
            {/* HEADER */}
            <div className={styles.documentHeader}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoCircle}>⚡</div>
                    <div className={styles.brandText}>
                        <h1 className={styles.brandName}>ELECTROAPP</h1>
                        <p className={styles.brandSlogan}>
                            Servicios Eléctricos Profesionales
                        </p>
                    </div>
                </div>
                <div className={styles.docInfo}>
                    <h3>PRESUPUESTO</h3>
                </div>
            </div>

            {/* TOOLBAR */}
            <div className={`${styles.toolbar} ${styles.noPrint}`}>
                <div className={styles.titleRow}>
                    <button onClick={onBack} className={styles.backButton}>
                        ← Esc
                    </button>
                </div>
                <div className={styles.shortcutsInfo}>
                    <span>
                        <span className={styles.key}>F2</span> Nueva Fila
                    </span>
                    <span>
                        <span className={styles.key}>Enter</span> Siguiente
                    </span>
                    <span>
                        <span className={styles.key}>Alt+S</span> Guardar
                    </span>{" "}
                    {/* ✅ AVISO ATAJO */}
                    <span>
                        <span className={styles.key}>Ctrl+P</span> Imprimir
                    </span>
                </div>

                <div className={styles.buttonsContainer}>
                    {/* ✅ BOTÓN DE GUARDAR INSERTADO AQUÍ */}
                    <button
                        onClick={handleSaveQuote}
                        disabled={isSaving}
                        className={styles.saveButton}
                        title="Guardar en la nube (Alt + S)"
                    >
                        {isSaving ? "⏳" : "💾 Guardar"}
                    </button>

                    <button
                        onClick={handleClear}
                        className={styles.clearButton}
                        title="Limpiar todo (Alt + L)"
                    >
                        🗑️
                    </button>
                    <button
                        onClick={handlePrint}
                        className={styles.printButton}
                    >
                        🖨️ PDF
                    </button>
                    <button
                        onClick={handleOpenShare}
                        className={styles.sendButton}
                    >
                        🚀 Enviar
                    </button>
                </div>
            </div>

            {/* DATOS CLIENTE */}
            <div className={styles.clientSection}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Cliente / Empresa</label>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Nombre completo"
                        className={styles.input}
                        value={cliente.nombre}
                        onChange={(e) =>
                            setCliente({ ...cliente, nombre: e.target.value })
                        }
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Teléfono (WhatsApp)</label>
                    <input
                        type="text"
                        placeholder="Para envío directo..."
                        className={styles.input}
                        value={cliente.telefono}
                        onChange={(e) =>
                            setCliente({ ...cliente, telefono: e.target.value })
                        }
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="text"
                        placeholder="Opcional"
                        className={styles.input}
                        value={cliente.email}
                        onChange={(e) =>
                            setCliente({ ...cliente, email: e.target.value })
                        }
                    />
                </div>
            </div>

            {/* TABLA DE ITEMS */}
            <table className={styles.itemsTable}>
                <thead>
                    <tr>
                        <th style={{ width: "55%" }}>Descripción</th>
                        <th style={{ width: "10%" }}>Cant.</th>
                        <th style={{ width: "15%" }}>Precio Unit.</th>
                        <th style={{ width: "15%", textAlign: "right" }}>
                            Subtotal
                        </th>
                        <th
                            className={styles.noPrint}
                            style={{ width: "5%" }}
                        ></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => {
                        const isEmpty = !item.descripcion && !item.precio;
                        return (
                            <tr
                                key={item.id}
                                className={
                                    isEmpty ? styles.hideWhenPrinting : ""
                                }
                            >
                                <td>
                                    <input
                                        ref={(el) =>
                                            (itemsRef.current[index] = el)
                                        }
                                        type="text"
                                        className={styles.tableInput}
                                        placeholder="Descripción..."
                                        value={item.descripcion}
                                        onChange={(e) =>
                                            updateItem(
                                                item.id,
                                                "descripcion",
                                                e.target.value,
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDownTable(
                                                e,
                                                index,
                                                "descripcion",
                                                item.id,
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className={styles.tableInput}
                                        value={item.cantidad}
                                        onChange={(e) =>
                                            updateItem(
                                                item.id,
                                                "cantidad",
                                                e.target.value,
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const inputs =
                                                    document.querySelectorAll(
                                                        "input",
                                                    );
                                                for (
                                                    let i = 0;
                                                    i < inputs.length;
                                                    i++
                                                ) {
                                                    if (
                                                        inputs[i] ===
                                                            e.target &&
                                                        inputs[i + 1]
                                                    ) {
                                                        inputs[i + 1].focus();
                                                        break;
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className={styles.tableInput}
                                        placeholder="0.00"
                                        value={item.precio}
                                        onChange={(e) =>
                                            updateItem(
                                                item.id,
                                                "precio",
                                                e.target.value,
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDownTable(
                                                e,
                                                index,
                                                "precio",
                                                item.id,
                                            )
                                        }
                                    />
                                </td>
                                <td
                                    style={{ textAlign: "right" }}
                                    className={styles.rowTotal}
                                >
                                    $
                                    {(
                                        (parseFloat(item.cantidad) || 0) *
                                        (parseFloat(item.precio) || 0)
                                    ).toLocaleString()}
                                </td>
                                <td
                                    className={styles.noPrint}
                                    style={{ textAlign: "center" }}
                                >
                                    <button
                                        tabIndex="-1"
                                        onClick={() => removeItem(item.id)}
                                        className={styles.iconBtn}
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className={styles.actions}>
                <div className={styles.totalBox}>
                    <span className={styles.totalLabel}>TOTAL ESTIMADO</span>
                    <span className={styles.totalAmount}>
                        ${total.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* MODAL DE ENVÍO */}
            {showShareModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>🚀 Enviar Presupuesto</h3>
                        <p>Elige el medio para enviar el detalle:</p>
                        <button
                            onClick={sendWhatsApp}
                            className={styles.whatsappBtn}
                        >
                            📱 Enviar por WhatsApp
                        </button>
                        <button onClick={sendEmail} className={styles.emailBtn}>
                            📧 Enviar por Email
                        </button>
                        <button
                            onClick={() => setShowShareModal(false)}
                            className={styles.cancelBtn}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cotizador;
