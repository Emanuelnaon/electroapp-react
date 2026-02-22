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
        { id: 1, descripcion: "", cantidad: 1, precio: "", materiales: "" },
    ]);
    const [misItemsGuardados, setMisItemsGuardados] = useState([]);
    const [clientesGuardados, setClientesGuardados] = useState([]);
    const [sugerenciasClientes, setSugerenciasClientes] = useState([]);
    const [mostrarSugerenciasClientes, setMostrarSugerenciasClientes] =
        useState(false);
    const [sugerencias, setSugerencias] = useState([]);
    const [filaActivaSugerencia, setFilaActivaSugerencia] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // ✅ AGREGADO
    const itemsRef = useRef([]);
    const [showAgendaModal, setShowAgendaModal] = useState(false);
    const [sugerenciaResaltada, setSugerenciaResaltada] = useState(-1);

    // Cargar los items guardados del usuario al abrir el cotizador
    useEffect(() => {
        const cargarDatos = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            // Cargar Items
            const { data: itemsData } = await supabase
                .from("mis_items")
                .select("*")
                .eq("user_id", user.id);
            if (itemsData) setMisItemsGuardados(itemsData);

            // Cargar Clientes
            const { data: clientesData } = await supabase
                .from("clientes")
                .select("*")
                .eq("user_id", user.id);
            if (clientesData) setClientesGuardados(clientesData);
        };
        cargarDatos();
    }, []);

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
                {
                    id: Date.now(),
                    descripcion: "",
                    cantidad: 1,
                    precio: "",
                    materiales: "",
                },
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
            materiales: "", // Nos aseguramos de que inicie vacío
        };
        setItems((prev) => [...prev, newItem]);

        // Esperamos a que React dibuje la fila y hacemos focus en la nueva descripción
        setTimeout(() => {
            const inputsDesc = document.querySelectorAll(
                'input[placeholder="Ej: Instalación de toma..."]',
            );
            if (inputsDesc.length > 0) {
                inputsDesc[inputsDesc.length - 1].focus();
            }
        }, 100);
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

    const updateItem = (index, field, value) => {
        const newItems = [...items];

        // 🛡️ PARCHE DE SEGURIDAD: Si la fila no existe por algún motivo, abortamos sin crashear.
        if (!newItems[index]) return;

        // 🛠️ CLONAMOS el objeto correctamente (React odia que modifiquemos las cosas directamente)
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);

        // 💡 LÓGICA DE AUTOCOMPLETADO (Solo busca cuando escribes en "descripcion")
        if (field === "descripcion") {
            if (value.trim().length > 0) {
                const filtrados = misItemsGuardados.filter((item) =>
                    item.nombre.toLowerCase().includes(value.toLowerCase()),
                );
                setSugerencias(filtrados);
                setFilaActivaSugerencia(index);
                setSugerenciaResaltada(-1);
            } else {
                setSugerencias([]);
                setFilaActivaSugerencia(null);
                setSugerenciaResaltada(-1);
            }
        }
    };

    const seleccionarSugerencia = (index, sugerencia) => {
        const newItems = [...items];

        // 🛡️ PARCHE DE SEGURIDAD AQUÍ TAMBIÉN
        if (!newItems[index]) return;

        // Rellenamos ambos campos automáticamente
        newItems[index] = {
            ...newItems[index],
            descripcion: sugerencia.nombre,
            precio: sugerencia.precio,
        };
        setItems(newItems);

        // Cerramos el menú flotante
        setSugerencias([]);
        setFilaActivaSugerencia(null);
        setSugerenciaResaltada(-1);
    };

    // --- LÓGICA AUTOCOMPLETADO DE CLIENTES ---
    const handleClientNameChange = (e) => {
        const value = e.target.value;
        setCliente({ ...cliente, nombre: value });

        if (value.trim().length > 0) {
            const filtrados = clientesGuardados.filter((c) =>
                c.nombre.toLowerCase().includes(value.toLowerCase()),
            );
            setSugerenciasClientes(filtrados);
            setMostrarSugerenciasClientes(true);
        } else {
            setSugerenciasClientes([]);
            setMostrarSugerenciasClientes(false);
        }
    };

    const seleccionarCliente = (clienteSeleccionado) => {
        setCliente({
            nombre: clienteSeleccionado.nombre,
            telefono: clienteSeleccionado.telefono || "",
            email: clienteSeleccionado.email || "",
            fecha: cliente.fecha, // Mantenemos la fecha actual
        });
        setSugerenciasClientes([]);
        setMostrarSugerenciasClientes(false);
        toast.success(`Datos de ${clienteSeleccionado.nombre} cargados`);
    };

    // Calcular Total (Suma Precio Unitario + Materiales, multiplicado por la Cantidad)
    const total = items.reduce((acc, item) => {
        const cant = parseFloat(item.cantidad) || 0;
        const precioManoObra = parseFloat(item.precio) || 0;
        const precioMateriales = parseFloat(item.materiales) || 0;
        return acc + cant * (precioManoObra + precioMateriales);
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
        // --- 1. LÓGICA DE NAVEGACIÓN EN EL MENÚ DESPLEGABLE ---
        if (
            field === "descripcion" &&
            filaActivaSugerencia === index &&
            sugerencias.length > 0
        ) {
            if (e.key === "ArrowDown") {
                e.preventDefault(); // Evita que el cursor se mueva dentro del input
                setSugerenciaResaltada((prev) =>
                    prev < sugerencias.length - 1 ? prev + 1 : prev,
                );
                return;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setSugerenciaResaltada((prev) => (prev > 0 ? prev - 1 : -1));
                return;
            }
            if (e.key === "Enter" && sugerenciaResaltada >= 0) {
                e.preventDefault();
                // Si presionó Enter y tenía una sugerencia marcada, la selecciona
                seleccionarSugerencia(index, sugerencias[sugerenciaResaltada]);
                return;
            }
        }

        // --- 2. LÓGICA DEL ENTER (Pasa de celda en celda y crea fila nueva) ---
        if (e.key === "Enter") {
            e.preventDefault();

            // Cerramos cualquier menú abierto
            setSugerencias([]);
            setFilaActivaSugerencia(null);

            if (field === "materiales") {
                // Si estamos en la última celda, creamos fila (el focus lo hace addItem)
                addItem();
            } else {
                // Si estamos en el medio, saltamos a la siguiente celda de ESTA fila
                const rowInputs = e.target
                    .closest("tr")
                    .querySelectorAll("input");
                const currentIndex = Array.from(rowInputs).indexOf(e.target);
                if (currentIndex > -1 && rowInputs[currentIndex + 1]) {
                    rowInputs[currentIndex + 1].focus();
                }
            }
        }
    };
    // 1. FIN DE FUNCIONES

    // 3. USE EFFECT
    useEffect(() => {
        const handleGlobalKeys = (e) => {
            if (e.key === "Escape") {
                if (showShareModal) setShowShareModal(false);
                else if (showAgendaModal) setShowAgendaModal(false);
                else {
                    onBack?.();
                }
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
    }, [cliente, items, showShareModal, onBack, showAgendaModal]);

    // 4. RENDERIZADO (JSX)
    return (
        <div className={styles.container}>
            {/* --- LAYOUT DIVIDIDO DEFINITIVO --- */}
            <div className={styles.splitLayout}>
                {/* === PANEL IZQUIERDO (HERRAMIENTAS) === */}
                <div className={styles.leftPanel}>
                    {/* ENCABEZADO Y LOGO */}
                    <div className={styles.documentHeader}>
                        <div className={styles.logoContainer}>
                            <div className={styles.logoCircle}>⚡</div>
                            <div className={styles.brandText}>
                                <h1 className={styles.brandName}>ELECTROAPP</h1>
                                <p className={styles.brandSlogan}>
                                    Nuevo Presupuesto
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* DATOS DEL CLIENTE Y AGENDA */}
                    <div className={styles.clientSection}>
                        <div className={styles.inputGroup}>
                            <div className={styles.labelRow}>
                                <label className={styles.label}>
                                    Cliente / Empresa
                                </label>
                                <button
                                    className={styles.agendaBtn}
                                    onClick={() => setShowAgendaModal(true)}
                                >
                                    📖 Agenda
                                </button>
                            </div>
                            <div className={styles.inputWrapper}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Buscar o escribir nombre..."
                                    className={styles.input}
                                    value={cliente.nombre}
                                    onChange={handleClientNameChange}
                                    onBlur={() =>
                                        setTimeout(
                                            () =>
                                                setMostrarSugerenciasClientes(
                                                    false,
                                                ),
                                            200,
                                        )
                                    }
                                />
                                {mostrarSugerenciasClientes &&
                                    sugerenciasClientes.length > 0 && (
                                        <ul className={styles.suggestionsList}>
                                            {sugerenciasClientes.map((c) => (
                                                <li
                                                    key={c.id}
                                                    onClick={() =>
                                                        seleccionarCliente(c)
                                                    }
                                                    className={
                                                        styles.suggestionItem
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.sugNombre
                                                        }
                                                    >
                                                        {c.nombre}
                                                    </span>
                                                    <span
                                                        className={
                                                            styles.sugPrecio
                                                        }
                                                    >
                                                        {c.telefono ||
                                                            "Sin teléfono"}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Teléfono</label>
                            <input
                                type="text"
                                placeholder="Para envío directo..."
                                className={styles.input}
                                value={cliente.telefono}
                                onChange={(e) =>
                                    setCliente({
                                        ...cliente,
                                        telefono: e.target.value,
                                    })
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
                                    setCliente({
                                        ...cliente,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* BOTONERA Y ATAJOS */}
                    <div className={`${styles.toolbar} ${styles.noPrint}`}>
                        <div className={styles.shortcutsInfo}>
                            <span>
                                <span className={styles.key}>F2</span> Nueva
                                Fila
                            </span>
                            <span>
                                <span className={styles.key}>Enter</span>{" "}
                                Siguiente
                            </span>
                            <span>
                                <span className={styles.key}>Alt+S</span>{" "}
                                Guardar
                            </span>
                            <span>
                                <span className={styles.key}>Ctrl+P</span>{" "}
                                Imprimir
                            </span>
                        </div>
                        <div className={styles.buttonsContainer}>
                            <button
                                onClick={handleSaveQuote}
                                disabled={isSaving}
                                className={styles.saveButton}
                            >
                                {isSaving ? "⏳" : "💾 Guardar"}
                            </button>
                            <button
                                onClick={handleClear}
                                className={styles.clearButton}
                                title="Limpiar todo"
                            >
                                🗑️ Limpiar
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
                </div>

                {/* === PANEL DERECHO (LIENZO DE PRECIOS) === */}
                <div className={styles.rightPanel}>
                    {/* TOTAL FIJO ARRIBA */}
                    <div className={styles.totalBoxSticky}>
                        <span className={styles.totalLabel}>
                            TOTAL ESTIMADO
                        </span>
                        <span className={styles.totalAmount}>
                            ${total.toLocaleString()}
                        </span>
                    </div>

                    {/* TABLA CON SCROLL INTERNO */}
                    <div className={styles.tableWrapper}>
                        <table className={styles.itemsTable}>
                            <thead>
                                <tr>
                                    <th style={{ width: "40%" }}>
                                        Descripción
                                    </th>
                                    <th
                                        style={{
                                            width: "10%",
                                            textAlign: "center",
                                        }}
                                    >
                                        Cant.
                                    </th>
                                    <th
                                        style={{
                                            width: "15%",
                                            textAlign: "center",
                                        }}
                                    >
                                        Precio M. Obra
                                    </th>
                                    <th
                                        style={{
                                            width: "15%",
                                            textAlign: "center",
                                        }}
                                    >
                                        Est. Materiales
                                    </th>
                                    <th
                                        style={{
                                            width: "15%",
                                            textAlign: "right",
                                        }}
                                    >
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
                                    const isEmpty =
                                        !item.descripcion &&
                                        !item.precio &&
                                        !item.materiales;
                                    const subtotalRow =
                                        (parseFloat(item.cantidad) || 0) *
                                        ((parseFloat(item.precio) || 0) +
                                            (parseFloat(item.materiales) || 0));

                                    return (
                                        <tr
                                            key={item.id}
                                            className={
                                                isEmpty
                                                    ? styles.hideWhenPrinting
                                                    : ""
                                            }
                                        >
                                            <td className={styles.td}>
                                                <div
                                                    className={
                                                        styles.inputWrapper
                                                    }
                                                >
                                                    <input
                                                        ref={(el) =>
                                                            (itemsRef.current[
                                                                index
                                                            ] = el)
                                                        }
                                                        className={styles.input}
                                                        type="text"
                                                        placeholder="Ej: Instalación de toma..."
                                                        value={item.descripcion}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
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
                                                        onBlur={() =>
                                                            setTimeout(
                                                                () =>
                                                                    setFilaActivaSugerencia(
                                                                        null,
                                                                    ),
                                                                200,
                                                            )
                                                        }
                                                    />
                                                    {/* MENÚ DE SUGERENCIAS */}
                                                    {filaActivaSugerencia ===
                                                        index &&
                                                        sugerencias.length >
                                                            0 && (
                                                            <ul
                                                                className={
                                                                    styles.suggestionsList
                                                                }
                                                            >
                                                                {sugerencias.map(
                                                                    (
                                                                        sug,
                                                                        sugIndex,
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                sug.id
                                                                            }
                                                                            onClick={() =>
                                                                                seleccionarSugerencia(
                                                                                    index,
                                                                                    sug,
                                                                                )
                                                                            }
                                                                            className={`${styles.suggestionItem} ${sugerenciaResaltada === sugIndex ? styles.suggestionItemActive : ""}`}
                                                                        >
                                                                            <span
                                                                                className={
                                                                                    styles.sugNombre
                                                                                }
                                                                            >
                                                                                {
                                                                                    sug.nombre
                                                                                }
                                                                            </span>
                                                                            <span
                                                                                className={
                                                                                    styles.sugPrecio
                                                                                }
                                                                            >
                                                                                $
                                                                                {sug.precio.toLocaleString()}
                                                                            </span>
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        )}
                                                </div>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className={
                                                        styles.tableInput
                                                    }
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                    value={item.cantidad}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "cantidad",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className={
                                                        styles.tableInput
                                                    }
                                                    placeholder="0.00"
                                                    value={item.precio}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
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
                                            {/* NUEVA COLUMNA MATERIALES */}
                                            <td>
                                                <input
                                                    type="number"
                                                    className={
                                                        styles.tableInput
                                                    }
                                                    placeholder="0.00"
                                                    value={
                                                        item.materiales || ""
                                                    }
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "materiales",
                                                            e.target.value,
                                                        )
                                                    }
                                                    onKeyDown={(e) =>
                                                        handleKeyDownTable(
                                                            e,
                                                            index,
                                                            "materiales",
                                                            item.id,
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: "right",
                                                    fontWeight: "bold",
                                                }}
                                                className={styles.rowTotal}
                                            >
                                                ${subtotalRow.toLocaleString()}
                                            </td>
                                            <td
                                                className={styles.noPrint}
                                                style={{ textAlign: "center" }}
                                            >
                                                <button
                                                    tabIndex="-1"
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
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
                        <div className={`${styles.tableFooter} ${styles.noPrint}`}>
                            <button onClick={addItem} className={styles.addBtn}>
                                + Agregar Fila
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            {/* --- FIN LAYOUT DIVIDIDO --- */}

            {/* MODAL DE AGENDA */}
            {showAgendaModal && (
                <div className={styles.modalOverlay}>
                    <div
                        className={styles.modalContent}
                        style={{ maxWidth: "500px", width: "95%" }}
                    >
                        <div className={styles.modalHeader}>
                            <h3>📖 Mis Clientes</h3>
                            <button
                                onClick={() => setShowAgendaModal(false)}
                                className={styles.iconBtn}
                            >
                                ×
                            </button>
                        </div>

                        {clientesGuardados.length === 0 ? (
                            <p
                                style={{
                                    textAlign: "center",
                                    color: "#718096",
                                    padding: "20px",
                                }}
                            >
                                Aún no tienes clientes guardados en la nube.
                            </p>
                        ) : (
                            <div className={styles.agendaList}>
                                {clientesGuardados.map((c) => (
                                    <div
                                        key={c.id}
                                        className={styles.agendaItem}
                                        onClick={() => {
                                            seleccionarCliente(c);
                                            setShowAgendaModal(false);
                                        }}
                                    >
                                        <div className={styles.agendaItemInfo}>
                                            <span
                                                className={
                                                    styles.agendaItemName
                                                }
                                            >
                                                {c.nombre}
                                            </span>
                                            <span
                                                className={
                                                    styles.agendaItemDetails
                                                }
                                            >
                                                {c.telefono &&
                                                    `📱 ${c.telefono}  `}
                                                {c.email && `📧 ${c.email}`}
                                            </span>
                                        </div>
                                        <button className={styles.selectBtn}>
                                            Elegir
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
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
