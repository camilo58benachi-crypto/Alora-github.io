// ==========================================================================
// CONFIGURACIÓN GLOBAL DE DATOS DE CONTACTO DE ALORA
// ==========================================================================
const CONFIG_ALORA = {
  telefonoWhatsapp: "573126206584",      // Tu número de Popayán, Colombia
  correoAlora: "capricholacteo@gmail.com" // Tu correo real detectado en pantalla
};

const cart = [];

const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const closeCartPanelBtn = document.getElementById("closeCartPanelBtn");
const cartItems = document.getElementById("cartItems");
const totalEl = document.getElementById("total");
const countEl = document.getElementById("cart-count");

// LOGICA MODAL SELLO TRADICIONAL
const selloMenuBtn = document.getElementById("selloMenuBtn");
const selloHeroBtn = document.getElementById("selloHeroBtn"); 
const selloModal = document.getElementById("selloModal");
const closeSelloModalBtn = document.getElementById("closeSelloModalBtn");

// BASE DE DATOS LOCAL PARA LA INTERACCIÓN DE "NOSOTROS"
const aboutData = {
  origenes: {
    title: "Nuestros Orígenes",
    img: "./imagenes/nuestro-origenes.jpg",
    desc: "En Alora, comenzamos con una simple pasión por los productos lácteos artesanales, utilizando ingredientes locales que reflejan la riqueza de nuestra tierra. Cada yogur que elaboramos es un homenaje a nuestra herencia y a las tradiciones que nos inspiran."
  },
  innovacion: {
    title: "Innovación y Sabor",
    img: "./imagenes/inovacion.jpg",
    desc: "La creatividad es clave en nuestro proceso. Buscamos constantemente nuevas combinaciones de sabores y técnicas para sorprender a nuestros consumidores, manteniendo siempre la esencia de lo artesanal en cada bocado."
  },
  compromiso: {
    title: "Compromiso con la Calidad",
    img: "./imagenes/merca.jpg",
    desc: "Nos enorgullece seleccionar solo los mejores ingredientes locales para garantizar que cada producto sea no solo delicioso, sino también nutritivo. Este compromiso con la calidad se traduce en yogures que nuestros clientes pueden disfrutar con confianza."
  }
};

// MANEJO DE APERTURA Y CIERRE DE LA MODAL DE SELLO
if (selloModal && closeSelloModalBtn) {
  const openSelloModal = (e) => {
    e.preventDefault();
    selloModal.classList.remove("hidden");
  };

  if (selloMenuBtn) selloMenuBtn.onclick = openSelloModal;
  if (selloHeroBtn) selloHeroBtn.onclick = openSelloModal;

  closeSelloModalBtn.onclick = () => {
    selloModal.classList.add("hidden");
  };

  window.addEventListener("click", (e) => {
    if (e.target === selloModal) {
      selloModal.classList.add("hidden");
    }
  });
}

// FUNCIONES INTERACTIVAS PARA LA SECCIÓN "NOSOTROS"
window.openAboutDetail = function(key) {
  const data = aboutData[key];
  if (!data) return;

  document.getElementById("aboutDetailImg").src = data.img;
  document.getElementById("aboutDetailImg").alt = data.title;
  document.getElementById("aboutDetailTitle").innerText = data.title;
  document.getElementById("aboutDetailDescription").innerText = data.desc;

  document.getElementById("aboutMainView").classList.add("hidden");
  document.getElementById("aboutDetailView").classList.remove("hidden");
};

window.closeAboutDetail = function() {
  document.getElementById("aboutDetailView").classList.add("hidden");
  document.getElementById("aboutMainView").classList.remove("hidden");
};

// CONTROL DEL PANEL LATERAL DEL CARRITO
if (cartBtn) {
  cartBtn.onclick = () => {
    cartPanel.classList.toggle("open");
  };
}

if (closeCartPanelBtn) {
  closeCartPanelBtn.onclick = () => {
    cartPanel.classList.remove("open");
  };
}

// Actualizar precios dinámicamente según el select de tamaño
document.querySelectorAll(".size-select").forEach(select => {
  select.addEventListener("change", function() {
    const card = this.closest(".product-card");
    if (card) {
      const priceEl = card.querySelector(".price");
      if (priceEl) {
        const numericPrice = parseInt(this.value) || 0;
        priceEl.innerText = "$" + numericPrice.toLocaleString("es-CO");
      }
    }
  });
});

// Registrar productos seleccionados
document.querySelectorAll(".btn-add-to-cart").forEach(btn => {
  btn.addEventListener("click", function() {
    const card = this.closest(".product-card");
    if (!card) return;

    const name = card.dataset.name;
    const sizeSelect = card.querySelector(".size-select");
    if (!sizeSelect) return;

    const price = parseInt(sizeSelect.value) || 0;
    const label = sizeSelect.options[sizeSelect.selectedIndex].text.split(" - ")[0];

    const existing = cart.find(i => i.name === name && i.size === label);

    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, size: label, price, qty: 1 });
    }

    renderCart();
    if (cartPanel) cartPanel.classList.add("open");
  });
});

// Renderizar elementos del carrito
function renderCart() {
  if (!cartItems) return;
  cartItems.innerHTML = "";
  let total = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    totalItems += item.qty;

    const itemEl = document.createElement("div");
    itemEl.classList.add("cart-item");
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <p>${item.size}</p>
        <p class="cart-item-price">$${(item.price * item.qty).toLocaleString("es-CO")}</p>
      </div>
      <div class="cart-item-controls-block">
        <div class="cart-item-actions">
          <button onclick="changeQty(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
        <button class="delete-item-btn" onclick="removeItem(${index})">🗑️</button>
      </div>
    `;
    cartItems.appendChild(itemEl);
    
    // Línea divisoria decorativa
    const divider = document.createElement("hr");
    divider.classList.add("cart-divider");
    cartItems.appendChild(divider);
  });

  if (totalEl) totalEl.innerText = total.toLocaleString("es-CO");
  if (countEl) countEl.innerText = totalItems;
}

// Cambiar cantidad (+ / -)
window.changeQty = function(index, change) {
  if (cart[index]) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    renderCart();
  }
};

// Eliminar un producto por completo
window.removeItem = function(index) {
  if (cart[index]) {
    cart.splice(index, 1);
    renderCart();
  }
};

// ==========================================================================
// PROCESAMIENTO UNIFICADO DE PAGO: VOUCHER, WHATSAPP Y EMAIL OPTIMIZADO
// ==========================================================================
const checkoutBtn = document.getElementById("checkoutBtn");
const voucherModal = document.getElementById("voucherModal");
const voucherContent = document.getElementById("voucherContent");

if (checkoutBtn) {
  checkoutBtn.onclick = () => {
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    let itemsHtml = "";
    let textoPlanoProductos = "";
    let total = 0;
    
    const fechaActual = new Date().toLocaleDateString('es-CO');
    const numeroPedido = Math.floor(100000 + Math.random() * 900000);

    // Recopilar información de los arreglos del carrito
    cart.forEach(item => {
      const subtotalItem = item.price * item.qty;
      total += subtotalItem;
      itemsHtml += `<p>• ${item.qty}x ${item.name} (${item.size}) - $${subtotalItem.toLocaleString("es-CO")}</p>`;
      textoPlanoProductos += `- ${item.qty}x ${item.name} (${item.size}) - $${subtotalItem.toLocaleString("es-CO")}\n`;
    });

    // 1. GENERAR MENSAJE PARA WHATSAPP
    const mensajeWhatsapp = 
`¡Hola Alora! 🐄✨
He generado un nuevo pedido desde la página web. Aquí está mi recibo:

📄 *Pedido N°:* #${numeroPedido}
📅 *Fecha:* ${fechaActual}
----------------------------------
*PRODUCTOS:*
${textoPlanoProductos}
----------------------------------
💰 *TOTAL A PAGAR:* *$${total.toLocaleString('es-CO')}*

Por favor, me confirman los datos para el pago y el envío. ¡Muchas gracias!`;

    const urlWhatsapp = `https://wa.me/${CONFIG_ALORA.telefonoWhatsapp}?text=${encodeURIComponent(mensajeWhatsapp)}`;

    // 2. GENERAR ENLACE DIRECTO A GMAIL WEB (Soluciona el bloqueo y la pantalla en blanco)
    const asuntoCorreo = `Nuevo Pedido Web Alora - #${numeroPedido}`;
    const cuerpoCorreo = 
`Detalle del Pedido Recibido desde la Web:\n\n
Pedido N°: #${numeroPedido}\n
Fecha: ${fechaActual}\n
----------------------------------\n
PRODUCTOS:\n
${textoPlanoProductos}\n
----------------------------------\n
TOTAL GENERAL: $${total.toLocaleString('es-CO')}\n\n
* Recuerda adjuntar tu comprobante si realizas transferencia bancaria.`;

    const urlGmailWeb = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONFIG_ALORA.correoAlora}&su=${encodeURIComponent(asuntoCorreo)}&body=${encodeURIComponent(cuerpoCorreo)}`;

    // 3. RENDERIZAR TU RESUMEN DE VOUCHER ORIGINAL CON MEJORAS
    if (voucherModal && voucherContent) {
      voucherContent.innerHTML = `
        <h2 style="color: #2c5f4d; text-align: center; margin-bottom: 5px;">¡Gracias por tu compra!</h2>
        <p style="text-align: center; color: #666; font-size: 0.9rem; margin-bottom: 15px;">Pedido #${numeroPedido} • ${fechaActual}</p>
        
        <p style="margin-bottom: 10px;"><strong>Resumen de tu pedido en Alora:</strong></p>
        <div style="background: #fdfbf9; padding: 15px; border-radius: 12px; margin-bottom: 15px; border: 1px solid #eaddd3;">
          ${itemsHtml}
        </div>
        <h3 style="text-align: right; margin-bottom: 25px; color: #2c5f4d;">Total: $${total.toLocaleString("es-CO")}</h3>
        
        <div class="voucher-buttons" style="display: flex; gap: 10px;">
          <button onclick="window.print()" style="background: #2c5f4d; color: white; flex: 1; padding: 12px; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">Imprimir Recibo</button>
          <button onclick="closeVoucher()" style="background: #00bfa5; color: white; flex: 1; padding: 12px; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">Completar Orden</button>
        </div>
      `;
      
      voucherModal.classList.remove("hidden");
      
      // 4. LANZAMIENTO SEGURO DE ENLACES EXTERNOS
      // Primero abre la interfaz de Gmail para redactar directamente en el navegador
      window.open(urlGmailWeb, '_blank');

      // Segundo abre WhatsApp Web/App evitando el solapamiento del navegador
      setTimeout(() => {
        window.open(urlWhatsapp, '_blank');
      }, 750);

      // Limpieza estructural del estado del carrito
      cart.length = 0; 
      renderCart();
      if (cartPanel) cartPanel.classList.remove("open");
    }
  };
}

window.closeVoucher = function() {
  if (voucherModal) voucherModal.classList.add("hidden");
};