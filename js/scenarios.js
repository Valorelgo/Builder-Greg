/* =========================================================
   SCÉNARIOS ET MISSIONS — moteur
   Les données de la saison sont dans saisons/saison-XXXX.js.
   Les modifications faites dans l'appli sont enregistrées
   dans la sauvegarde, par saison (settings.scenarios[id]).
   ========================================================= */

const DispositionOrder = ["priority-assets", "reconnaissance", "disruption", "purge-the-foe", "take-and-hold"];

const Missions = Season.missions;

const Scenarios = {
  // Nom de la mission pour une combinaison, en tenant compte des modifications enregistrées
  get(mine, theirs) {
    const all = Store.data && Store.data.settings.scenarios;
    const custom = all && all[Season.id];
    const c = custom && custom[mine] && custom[mine][theirs];
    return c || (Season.scenarios[mine] && Season.scenarios[mine][theirs]) || null;
  }
};

const Deployments = {
  // Clé d'une paire, indépendante de l'ordre (thpf = pfth) : codes dans l'ordre de DispositionOrder
  key(a, b) {
    const order = Season.deploymentOrder || DispositionOrder;
    const [x, y] = [a, b].sort((p, q) => order.indexOf(p) - order.indexOf(q));
    const c = Season.deploymentCodes || {};
    return `${c[x] || x}${c[y] || y}`;
  },
  configs() { return Season.deploymentConfigs || ["A", "B", "C"]; },
  letter(n) { return this.configs()[n - 1] || String(n); },
  ext() { return Season.deploymentExt || "jpg"; },
  file(a, b, n, ext) {
    const pre = Season.deploymentPrefix;
    const name = pre != null ? `${pre}${this.key(a, b)}${this.letter(n).toLowerCase()}` : `${this.key(a, b)}_${this.letter(n)}`;
    return `${Season.deploymentsFolder}/${name}.${ext || this.ext()}`;
  },
  // Format de secours (si l'image a été convertie)
  altFile(a, b, n) { return this.file(a, b, n, this.ext() === "png" ? "jpg" : "png"); },
  name(a, b, n) {
    const names = Season.deploymentNames && Season.deploymentNames[this.key(a, b)];
    return (names && names[n - 1]) || `Config ${this.letter(n)}`;
  },
  random() { return 1 + Math.floor(Math.random() * this.configs().length); },
  // Les 45 noms de fichiers attendus
  allFiles() {
    const out = [];
    DispositionOrder.forEach((a, i) => DispositionOrder.slice(i).forEach(b =>
      this.configs().forEach((l, k) => out.push(this.file(a, b, k + 1).split("/").pop()))));
    return out;
  }
};

/* ---------- Visionneuse plein écran (indépendante du rendu de l'appli) ----------
   Toucher l'image : zoom ×2 centré sur le point touché ; toucher à nouveau : vue entière.
   En zoom, on se déplace en glissant (doigt, stylet ou souris). */
const DeployViewer = {
  el: null,
  open(src, title, alt) {
    this.close();
    const v = document.createElement("div");
    v.className = "dv";
    v.innerHTML = `<div class="dv-bar"><span class="dv-title"></span>
        <span class="dv-hint">Touche l'image pour zoomer</span>
        <button class="btn btn-s dv-close" type="button">Fermer ✕</button></div>
      <div class="dv-scroll"><img class="dv-img" alt=""></div>`;
    v.querySelector(".dv-title").textContent = title || "";
    const img = v.querySelector(".dv-img");
    img.src = src;
    img.onerror = () => { if (alt && img.src.indexOf(alt) < 0) img.src = alt; };
    const box = v.querySelector(".dv-scroll");
    v.querySelector(".dv-close").onclick = () => this.close();
    // Glisser pour se déplacer (souris) ; le tactile défile nativement
    let drag = null, moved = false;
    box.addEventListener("pointerdown", e => {
      moved = false;
      if (e.pointerType === "mouse" && v.classList.contains("is-zoom"))
        drag = { x: e.clientX, y: e.clientY, l: box.scrollLeft, t: box.scrollTop };
    });
    box.addEventListener("pointermove", e => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      box.scrollLeft = drag.l - dx; box.scrollTop = drag.t - dy;
    });
    const stop = () => { drag = null; };
    box.addEventListener("pointerup", stop);
    box.addEventListener("pointerleave", stop);
    img.addEventListener("click", e => {
      if (moved) return;
      const r = img.getBoundingClientRect();
      const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      const zoom = !v.classList.contains("is-zoom");
      v.classList.toggle("is-zoom", zoom);
      if (zoom) {
        const fitH = r.height;
        img.style.height = `${fitH * 2}px`;
        requestAnimationFrame(() => {
          box.scrollLeft = fx * img.offsetWidth - box.clientWidth / 2;
          box.scrollTop = fy * img.offsetHeight - box.clientHeight / 2;
        });
      } else img.style.height = "";
    });
    this.key = e => { if (e.key === "Escape") this.close(); };
    document.addEventListener("keydown", this.key);
    document.body.appendChild(v);
    this.el = v;
  },
  close() {
    if (!this.el) return;
    this.el.remove(); this.el = null;
    document.removeEventListener("keydown", this.key);
  }
};
