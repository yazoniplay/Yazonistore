(() => {
  "use strict";
  const STORAGE_PRODUCTS = "offcut.products.v1";
  const STORAGE_BAG = "offcut.bag.v1";
  const imageFallback = "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80";
  const seedProducts = [
    {id:"desk-stand",name:"Foldable phone stand",price:189,category:"Desk",description:"A simple little stand for calls, videos and a tidier desk.",image:"https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=85",badge:"The desk edit",featured:true},
    {id:"cable-kit",name:"Cable tidy set",price:99,category:"Desk",description:"Keep the everyday cables in their place, without making a fuss.",image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85",badge:"Small upgrade",featured:false},
    {id:"travel-pouch",name:"Everyday travel pouch",price:159,category:"Travel",description:"A compact home for the small things that usually disappear in your bag.",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",badge:"On the move",featured:true},
    {id:"desk-light",name:"Soft desk light",price:249,category:"Everyday",description:"A warm, practical light for the corner you spend your time in.",image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",badge:"Everyday essential",featured:false}
  ];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const money = value => new Intl.NumberFormat("sv-SE",{style:"currency",currency:"SEK",maximumFractionDigits:0}).format(Number(value)||0);
  const readStore = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
  let products = readStore(STORAGE_PRODUCTS, seedProducts);
  let bag = readStore(STORAGE_BAG, []);
  let activeCategory = "All";
  let searchTerm = "";
  let activeProductId = null;
  let toastTimeout;
  const persistProducts = () => localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
  const persistBag = () => localStorage.setItem(STORAGE_BAG, JSON.stringify(bag));
  const getProduct = id => products.find(product => product.id === id);
  const showToast = message => {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 2600);
  };
  const showOverlay = () => { $("#overlay").hidden = false; document.body.classList.add("no-scroll"); };
  const hideOverlayIfClear = () => {
    const modalOpen = !$("#productModal").hidden || !$("#adminModal").hidden;
    if (!modalOpen && !$("#bagDrawer").classList.contains("open")) {
      $("#overlay").hidden = true;
      document.body.classList.remove("no-scroll");
    }
  };
  const openModal = modal => { modal.hidden = false; showOverlay(); };
  const closeAll = () => {
    $("#productModal").hidden = true;
    $("#adminModal").hidden = true;
    $("#bagDrawer").classList.remove("open");
    $("#bagDrawer").setAttribute("aria-hidden","true");
    $("#overlay").hidden = true;
    document.body.classList.remove("no-scroll");
  };
  const productImage = product => escapeHTML(product.image || imageFallback);
  const renderProducts = () => {
    let list = products.filter(product => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const text = (product.name + " " + product.description + " " + product.category).toLowerCase();
      return matchesCategory && text.includes(searchTerm.toLowerCase());
    });
    const sort = $("#sortSelect").value;
    if (sort === "low") list.sort((a,b) => a.price-b.price);
    if (sort === "high") list.sort((a,b) => b.price-a.price);
    if (sort === "name") list.sort((a,b) => a.name.localeCompare(b.name));
    if (sort === "featured") list.sort((a,b) => Number(b.featured)-Number(a.featured));
    $("#allCount").textContent = String(products.length).padStart(2,"0");
    $("#productGrid").innerHTML = list.map(product => `
      <article class="product-card">
        <div class="product-image-wrap" data-view="${escapeHTML(product.id)}" tabindex="0" role="button" aria-label="View ${escapeHTML(product.name)}">
          <img class="product-image" src="${productImage(product)}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback}'">
          ${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ""}
          <button class="quick-add" type="button" data-add="${escapeHTML(product.id)}">Add to bag <span aria-hidden="true">＋</span></button>
        </div>
        <div class="product-meta"><button class="product-name text-button" data-view="${escapeHTML(product.id)}">${escapeHTML(product.name)}</button><span class="product-price">${money(product.price)}</span></div>
        <p class="product-description">${escapeHTML(product.description)}</p>
      </article>`).join("");
    $("#emptyState").hidden = list.length > 0;
  };
  const renderBag = () => {
    bag = bag.filter(item => getProduct(item.id) && item.qty > 0);
    persistBag();
    const count = bag.reduce((sum,item) => sum + item.qty,0);
    $("#bagCount").textContent = count;
    $("#drawerCount").textContent = "(" + count + ")";
    $("#bagItems").innerHTML = bag.length ? bag.map(item => {
      const product = getProduct(item.id);
      return `<div class="bag-line"><img src="${productImage(product)}" alt="" onerror="this.onerror=null;this.src='${imageFallback}'"><div><h3>${escapeHTML(product.name)}</h3><p>${money(product.price)}</p><div class="qty-control"><button data-qty="${escapeHTML(item.id)}" data-delta="-1" aria-label="Remove one">−</button><span>${item.qty}</span><button data-qty="${escapeHTML(item.id)}" data-delta="1" aria-label="Add one">+</button></div></div><button class="remove-item" data-remove="${escapeHTML(item.id)}">Remove</button></div>`;
    }).join("") : '<div class="bag-empty">Your bag is taking a breather.<br>Have a look around and add a find.</div>';
    const total = bag.reduce((sum,item) => sum + getProduct(item.id).price*item.qty,0);
    $("#bagSubtotal").textContent = money(total);
  };
  const addToBag = id => {
    if (!getProduct(id)) return;
    const existing = bag.find(item => item.id === id);
    if (existing) existing.qty += 1; else bag.push({id,qty:1});
    persistBag(); renderBag(); showToast("Added to your bag.");
  };
  const openBag = () => { $("#productModal").hidden = true; $("#adminModal").hidden = true; $("#bagDrawer").classList.add("open"); $("#bagDrawer").setAttribute("aria-hidden","false"); showOverlay(); };
  const openProduct = id => {
    const product = getProduct(id);
    if (!product) return;
    activeProductId = id;
    $("#productModalContent").innerHTML = `
      <div class="product-detail">
        <img src="${productImage(product)}" alt="${escapeHTML(product.name)}" onerror="this.onerror=null;this.src='${imageFallback}'">
        <div class="product-detail-copy"><p class="eyebrow">${escapeHTML(product.category)} / THE EVERYDAY EDIT</p><h2>${escapeHTML(product.name)}</h2><p class="detail-price">${money(product.price)}</p><p class="detail-description">${escapeHTML(product.description)}</p><button class="button button-dark" data-detail-add="${escapeHTML(product.id)}">Add to bag <span>＋</span></button><p class="detail-fineprint">This is a product preview. Supplier, delivery, returns and payment details must be confirmed before a live launch.</p></div>
      </div>`;
    openModal($("#productModal"));
  };
  const renderAdminList = () => {
    $("#adminProductCount").textContent = products.length + " items";
    $("#adminProductList").innerHTML = products.map(product => `
      <div class="admin-product-row"><img src="${productImage(product)}" alt="" onerror="this.onerror=null;this.src='${imageFallback}'"><div><strong>${escapeHTML(product.name)}</strong><small>${money(product.price)} · ${escapeHTML(product.category)}${product.featured ? " · Featured" : ""}</small></div><div class="admin-row-actions"><button data-edit="${escapeHTML(product.id)}">Edit</button><button data-delete="${escapeHTML(product.id)}">Delete</button></div></div>`).join("") || '<p class="detail-fineprint">No products yet. Add your first one above.</p>';
  };
  const openAdmin = () => { $("#productModal").hidden = true; $("#bagDrawer").classList.remove("open"); renderAdminList(); resetProductForm(); openModal($("#adminModal")); };
  const resetProductForm = () => { $("#productForm").reset(); $("#editId").value = ""; $("#saveProduct").textContent = "Save product"; $("#cancelEdit").hidden = true; };
  const editProduct = id => {
    const product = getProduct(id);
    if (!product) return;
    $("#editId").value = product.id;
    $("#productName").value = product.name;
    $("#productPrice").value = product.price;
    $("#productCategory").value = product.category;
    $("#productDescription").value = product.description;
    $("#productImage").value = product.image && !product.image.startsWith("data:") ? product.image : "";
    $("#productFeatured").checked = Boolean(product.featured);
    $("#saveProduct").textContent = "Update product";
    $("#cancelEdit").hidden = false;
    $("#productName").focus();
    $("#productForm").scrollIntoView({behavior:"smooth",block:"start"});
  };
  const compressImage = file => new Promise((resolve,reject) => {
    if (!file) return resolve("");
    if (!file.type.startsWith("image/")) return reject(new Error("Choose an image file."));
    if (file.size > 8 * 1024 * 1024) return reject(new Error("Image is too large. Choose one under 8 MB."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not load that image."));
      img.onload = () => {
        const max = 1000;
        const scale = Math.min(1,max/Math.max(img.width,img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width*scale); canvas.height = Math.round(img.height*scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL("image/jpeg",.78));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
  $("#categoryFilters").addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    $$(".filter-chip").forEach(chip => chip.classList.toggle("active",chip === button));
    renderProducts();
  });
  $("#sortSelect").addEventListener("change",renderProducts);
  $("#searchInput").addEventListener("input",event => { searchTerm = event.target.value.trim(); renderProducts(); });
  $(".search-toggle").addEventListener("click",() => { const row=$("#searchRow"); row.hidden=!row.hidden; if(!row.hidden) $("#searchInput").focus(); });
  $("#clearSearch").addEventListener("click",() => { $("#searchInput").value=""; searchTerm=""; renderProducts(); });
  $("#resetFilters").addEventListener("click",() => { activeCategory="All";searchTerm="";$("#searchInput").value="";$$(".filter-chip").forEach(chip=>chip.classList.toggle("active",chip.dataset.category==="All"));renderProducts(); });
  $("#productGrid").addEventListener("click",event => {
    const add = event.target.closest("[data-add]");
    if(add){event.stopPropagation();addToBag(add.dataset.add);return;}
    const view = event.target.closest("[data-view]");
    if(view) openProduct(view.dataset.view);
  });
  $("#productGrid").addEventListener("keydown",event => { if((event.key==="Enter"||event.key===" ")&&event.target.matches("[data-view]")){event.preventDefault();openProduct(event.target.dataset.view);} });
  $("#openBag").addEventListener("click",openBag);
  $("#bagItems").addEventListener("click",event => {
    const qty = event.target.closest("[data-qty]");
    const remove = event.target.closest("[data-remove]");
    if(qty){const item=bag.find(row=>row.id===qty.dataset.qty);if(item)item.qty+=Number(qty.dataset.delta);bag=bag.filter(row=>row.qty>0);renderBag();}
    if(remove){bag=bag.filter(row=>row.id!==remove.dataset.remove);renderBag();}
  });
  $("#bagItems").addEventListener("change",renderBag);
  $("#productModalContent").addEventListener("click",event => { const button=event.target.closest("[data-detail-add]");if(button){addToBag(button.dataset.detailAdd);closeAll();openBag();} });
  $("#checkoutButton").addEventListener("click",() => showToast("Checkout isn't connected yet — no payment has been taken."));
  $("#newsletterForm").addEventListener("submit",event => {event.preventDefault();showToast("Email sign-up is a preview and isn't connected yet.");event.target.reset();});
  $("#adminOpen").addEventListener("click",openAdmin);
  $("#productForm").addEventListener("submit",async event => {
    event.preventDefault();
    const saveButton=$("#saveProduct"); saveButton.disabled=true; saveButton.textContent="Saving…";
    try {
      const editId=$("#editId").value;
      const old=editId?getProduct(editId):null;
      const uploaded=await compressImage($("#productUpload").files[0]);
      const url=$("#productImage").value.trim();
      const image=uploaded || url || (old&&old.image) || imageFallback;
      const product={id:editId||("item-"+Date.now().toString(36)),name:$("#productName").value.trim(),price:Number($("#productPrice").value),category:$("#productCategory").value,description:$("#productDescription").value.trim(),image,badge:$("#productFeatured").checked?"Editor’s pick":"",featured:$("#productFeatured").checked};
      if(!product.name||!product.description||!Number.isFinite(product.price)||product.price<=0) throw new Error("Check the product details and price.");
      if(old) products=products.map(item=>item.id===editId?product:item); else products.unshift(product);
      persistProducts();renderProducts();renderAdminList();resetProductForm();showToast(old?"Product updated in this browser.":"Product added to this browser.");
    } catch(error) { showToast(error.message || "Could not save the product."); }
    finally {saveButton.disabled=false;saveButton.textContent=$("#editId").value?"Update product":"Save product";}
  });
  $("#cancelEdit").addEventListener("click",resetProductForm);
  $("#adminProductList").addEventListener("click",event => {
    const edit=event.target.closest("[data-edit]");
    const del=event.target.closest("[data-delete]");
    if(edit) editProduct(edit.dataset.edit);
    if(del){const product=getProduct(del.dataset.delete);if(product&&confirm("Remove “"+product.name+"” from this browser's catalogue?")){products=products.filter(item=>item.id!==del.dataset.delete);bag=bag.filter(item=>item.id!==del.dataset.delete);persistProducts();persistBag();renderProducts();renderBag();renderAdminList();showToast("Product removed from this browser.");}}
  });
  $("#resetDemo").addEventListener("click",() => {if(confirm("Reset the catalogue in this browser to the original demo items?")){products=seedProducts.map(product=>({...product}));bag=[];persistProducts();persistBag();renderProducts();renderBag();renderAdminList();resetProductForm();showToast("Demo catalogue restored.");}});
  $("#overlay").addEventListener("click",closeAll);
  $$("[data-close]").forEach(button=>button.addEventListener("click",closeAll));
  document.addEventListener("keydown",event=>{if(event.key==="Escape")closeAll();});
  $("#menuToggle").addEventListener("click",()=>{document.querySelector("#shop").scrollIntoView({behavior:"smooth"});showToast("Browse the current edit below.");});
  $("#year").textContent=new Date().getFullYear();
  renderProducts();renderBag();
})();