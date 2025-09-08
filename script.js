// Ko La Min Real Estate — Vanilla JS SPA
// Burmese comments ဆက်ဖြည့်ထားပါတယ်။
(() => {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  const state = {
    listings: load("klm_listings", []),
    favorites: new Set(load("klm_favs", [])),
    // Filters
    q: "", type: "", beds: "", minPrice: "", maxPrice: "", sort: "newest",
  };

  // Seed data (ပထမဆုံး လုံးဝအလွတ် ဖြစ်ရင် သမိုင်း sample ၃ခုထည့်)
  if (state.listings.length === 0) {
    state.listings = [
      {
        id: uid(), title: "Thamine 2BR Apartment", location: "Hlaing, Yangon",
        price: 45000000, bedrooms: 2, ptype: "Apartment",
        image: "https://images.unsplash.com/photo-1505691723518-36a5ac3b2a59?q=80&w=1200&auto=format&fit=crop",
        notes: "Lift + car park, near bus stop",
        createdAt: Date.now()
      },
      {
        id: uid(), title: "Corner Shop (Main Road)", location: "Mandalay, Chanayethazan",
        price: 120000000, bedrooms: 0, ptype: "Shop",
        image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop",
        notes: "Good for minimart",
        createdAt: Date.now() - 86400000
      },
      {
        id: uid(), title: "4BR Family House", location: "Bahan Township",
        price: 680000000, bedrooms: 4, ptype: "House",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
        notes: "Garden + quiet street",
        createdAt: Date.now() - 3600_000
      }
    ];
    persist();
  }

  // Elements
  const els = {
    year: $("#year"),
    results: $("#results"),
    empty: $("#empty"),
    form: $("#listingForm"),
    formToggle: $("#formToggle"),
    id: $("#id"),
    title: $("#title"),
    location: $("#location"),
    price: $("#price"),
    bedrooms: $("#bedrooms"),
    ptype: $("#ptype"),
    image: $("#image"),
    notes: $("#notes"),
    resetForm: $("#resetForm"),
    // Filters
    q: $("#q"), type: $("#type"), beds: $("#beds"),
    minPrice: $("#minPrice"), maxPrice: $("#maxPrice"), sort: $("#sort"),
    clearFilters: $("#clearFilters"),
    cardTpl: $("#cardTpl")
  };

  els.year.textContent = new Date().getFullYear();

  // Bind filter handlers
  [
    "q","type","beds","minPrice","maxPrice","sort"
  ].forEach(k => {
    els[k].addEventListener("input", () => {
      state[k] = els[k].value.trim();
      render();
    });
  });
  els.clearFilters.addEventListener("click", () => {
    ["q","type","beds","minPrice","maxPrice","sort"].forEach(k => {
      state[k] = k==="sort" ? "newest" : "";
      els[k].value = state[k];
    });
    render();
  });

  // Form submit (create/update)
  els.form.addEventListener("submit", e => {
    e.preventDefault();
    const item = collectForm();
    if (!item.title || !item.location) return;

    if (item.id) {
      // Update
      const i = state.listings.findIndex(x => x.id === item.id);
      if (i >= 0) {
        state.listings[i] = { ...state.listings[i], ...item };
      }
    } else {
      item.id = uid();
      item.createdAt = Date.now();
      state.listings.unshift(item);
    }
    persist();
    resetForm();
    els.formToggle.open = false;
    render();
  });

  els.resetForm.addEventListener("click", resetForm);

  // Card actions (event delegation)
  els.results.addEventListener("click", e => {
    const card = e.target.closest(".listing");
    if (!card) return;
    const id = card.dataset.id;
    const action = e.target.closest("button")?.classList;

    if (action?.contains("edit")) {
      const it = state.listings.find(x => x.id === id);
      if (!it) return;
      fillForm(it);
      window.scrollTo({ top: 0, behavior: "smooth" });
      els.formToggle.open = true;
    }
    if (action?.contains("del")) {
      if (confirm("ဤစာရင်းကို ဖျက်မှာ သေချာပါသလား?")) {
        state.listings = state.listings.filter(x => x.id !== id);
        state.favorites.delete(id);
        persist();
        render();
      }
    }
    if (action?.contains("favBtn")) {
      toggleFav(id);
      render(); // refresh star UI
    }
  });

  function toggleFav(id){
    if (state.favorites.has(id)) state.favorites.delete(id);
    else state.favorites.add(id);
    save("klm_favs", Array.from(state.favorites));
  }

  function collectForm(){
    return {
      id: els.id.value.trim(),
      title: els.title.value.trim(),
      location: els.location.value.trim(),
      price: Number(els.price.value || 0),
      bedrooms: Number(els.bedrooms.value || 0),
      ptype: els.ptype.value,
      image: els.image.value.trim(),
      notes: els.notes.value.trim(),
    };
  }
  function fillForm(it){
    els.id.value = it.id;
    els.title.value = it.title;
    els.location.value = it.location;
    els.price.value = it.price;
    els.bedrooms.value = it.bedrooms;
    els.ptype.value = it.ptype;
    els.image.value = it.image || "";
    els.notes.value = it.notes || "";
  }
  function resetForm(){
    els.form.reset();
    els.id.value = "";
  }

  function render(){
    const out = filterSort(state.listings);
    els.results.innerHTML = "";
    els.empty.hidden = out.length > 0;

    out.forEach(it => {
      const node = els.cardTpl.content.cloneNode(true);
      const art = node.querySelector(".listing");
      art.dataset.id = it.id;

      const img = node.querySelector("img");
      img.src = it.image || `https://placehold.co/800x500?text=${encodeURIComponent(it.ptype)}`;
      img.alt = it.title;

      const favBtn = node.querySelector(".favBtn");
      favBtn.classList.toggle("active", state.favorites.has(it.id));
      favBtn.textContent = state.favorites.has(it.id) ? "★" : "☆";

      node.querySelector(".title").textContent = it.title;
      node.querySelector(".meta").textContent =
        `${it.ptype} • ${it.bedrooms} BR • ${it.location}`;
      node.querySelector(".price").textContent = `${formatMMK(it.price)} ကျပ်`;
      node.querySelector(".notes").textContent = it.notes || "";

      els.results.appendChild(node);
    });
  }

  function filterSort(list){
    let arr = list.slice();

    // Filters
    const q = state.q.toLowerCase();
    if (q) arr = arr.filter(x =>
      x.title.toLowerCase().includes(q) || x.location.toLowerCase().includes(q)
    );
    if (state.type) arr = arr.filter(x => x.ptype === state.type);
    if (state.beds) arr = arr.filter(x => x.bedrooms >= Number(state.beds));
    if (state.minPrice) arr = arr.filter(x => x.price >= Number(state.minPrice));
    if (state.maxPrice) arr = arr.filter(x => x.price <= Number(state.maxPrice));

    // Sort
    const s = state.sort;
    arr.sort((a,b) => {
      if (s === "newest") return b.createdAt - a.createdAt;
      if (s === "priceAsc") return a.price - b.price;
      if (s === "priceDesc") return b.price - a.price;
      if (s === "bedsDesc") return b.bedrooms - a.bedrooms;
      return 0;
    });

    return arr;
  }

  // Storage helpers
  function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
  function load(key, fallback){
    try{
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    }catch(e){ return fallback; }
  }
  function persist(){ save("klm_listings", state.listings); }

  // Utils
  function uid(){ return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }
  function formatMMK(n){
    // Myanmar Kyat formatting (no decimals)
    return Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });
  }

  // First render
  render();
})();
