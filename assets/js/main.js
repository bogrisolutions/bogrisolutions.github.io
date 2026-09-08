/* ============================================================
   Bogri Solutions — main.js
   ============================================================ */

/* --- CONFIG (edit these two) --------------------------------
   RFQ_ENDPOINT: the public n8n webhook that receives the quote
   form as JSON. Final URL TBC — update when the website-rfq
   webhook is live. No tokens/secrets here: this is a public,
   static site, so anything in this file is visible to everyone.
   ------------------------------------------------------------ */
const RFQ_ENDPOINT = "https://n8n.bogrisolutions.com/webhook/website-rfq";
const FALLBACK_EMAIL = "office@bogrisolutions.com";
const SHOW_IMAGE_SLOT_LABELS = false;  // set true to show filename tags on image slots (helpful when swapping in your own photos)
const SUBMIT_TIMEOUT_MS = 12000;

/* ---------------- i18n dictionary ---------------- */
const I18N = {
  mk: {
    "nav.services":"Услуги","nav.why":"Зошто Богри","nav.coverage":"Покриеност","nav.about":"За нас","nav.contact":"Контакт",
    "cta.quote":"Побарајте понуда","cta.services":"Нашите услуги",
    "hero.eyebrow":"Глобална шпедиција · Кина ⇄ Македонија ⇄ Европа",
    "hero.h1":"Вашиот товар, на секоја дестинација во светот.",
    "hero.lead":"Богри Солутионс е глобален шпедитер со седиште во Скопје — поморски, патен и воздушен транспорт, царинско посредување и door-to-door логистика. Со посебна експертиза на коридорот Кина ⇄ Македонија.",
    "hero.t1":"🌍 Глобална мрежа","hero.t2":"🚢 Поморски · Патен · Воздушен","hero.t3":"⚡ Капацитет за итни пратки",
    "svc.eyebrow":"Услуги","svc.h2":"Целосна логистика, за секој вид товар",
    "svc.lead":"Сите видови транспорт под еден кров — од стандардни контејнерски пратки до временски најкритични испораки на рака.",
    "svc.sea.t":"Поморски транспорт","svc.sea.d":"Целосни (FCL) и збирни (LCL) контејнерски пратки од сите големи азиски и европски пристаништа, со конкурентни поморски стапки.",
    "svc.road.t":"Патен транспорт","svc.road.d":"Целосни (FTL) и збирни (LTL) камионски пратки низ цела Европа и регионот, со редовни релации и следење.",
    "svc.air.t":"Воздушен транспорт","svc.air.d":"Брз авионски карго за временски чувствителни пратки до и од кој било аеродром во светот.",
    "pill.premium":"Premium","svc.charter.d":"Наменет авионски чартер за вонгабаритни, итни или пратки со голем волумен — кога редовниот карго не е доволен.",
    "pill.urgent":"Итно","svc.obc.d":"Лична достава на рака — курир патува заедно со пратката за најитни испораки, мерени во часови, не денови.",
    "svc.customs.s":"Увоз & извоз","svc.customs.t":"Царинско посредување","svc.customs.d":"Комплетно увозно и извозно царинење — документација, класификација и усогласеност, средено за Вас.",
    "svc.dtd.s":"Мулти-модално","svc.dtd.t":"Door-to-door","svc.dtd.d":"Логистика од врата до врата преку повеќе видови транспорт — еден соговорник за целиот синџир на испорака.",
    "why.eyebrow":"Зошто Богри","why.h2":"Глобален дофат, локална посветеност",
    "why.lead":"Комбинираме светска мрежа на партнери со длабоко познавање на коридорот Кина ⇄ Македонија и грижа за секоја пратка.",
    "why.1.t":"Глобална мрежа","why.1.d":"Покриеност на сите континенти преку проверени агенти и превозници во главните светски пристаништа и аеродроми.",
    "why.2.t":"Експертиза за Кина","why.2.d":"Специјализирани за релацијата Кина ⇄ Македонија — оптимизирани рути, стапки и царински процедури.",
    "why.3.t":"Door-to-door","why.3.d":"Преземаме одговорност за целиот синџир — од подигнување кај испраќачот до достава на Вашиот праг.",
    "why.4.t":"Царина под контрола","why.4.d":"Комплетно царинско посредување — без непредвидени задршки на граница и без административен товар за Вас.",
    "why.5.t":"Итни пратки","why.5.d":"Air Charter и OBC за најкритични рокови — кога испораката едноставно не смее да задоцни.",
    "cov.eyebrow":"Покриеност","cov.h2":"Светска покриеност, со јасен фокус",
    "cov.lead":"Организираме пратки до и од практично секоја дестинација во светот. Нашата срцевина е коридорот што го познаваме најдобро.",
    "cov.s1":"Континенти","cov.s2":"Вида транспорт","cov.s3":"За итни пратки",
    "cov.callout":"Нашата специјалност е коридорот <b>Кина ⇄ Македонија ⇄ Европа</b> — поморски преку Пиреја и Солун, патни релации низ регионот и воздушен карго за брзи испораки.",
    "about.eyebrow":"За нас","about.h2":"Богри Солутионс ДООЕЛ",
    "about.p1":"Со седиште во Скопје, Богри Солутионс е шпедитерска и логистичка компанија која ги поврзува македонските и европските компании со светските пазари. Нашата мисија е едноставна — Вашиот товар да пристигне навреме, безбедно и по конкурентна цена.",
    "about.p2":"Иако нудиме глобална покриеност, нашата препознатлива сила е релацијата Кина ⇄ Македонија, каде што годишно искуство ни овозможува да понудиме рути и стапки прилагодени на Вашиот бизнис.",
    "about.resp":"Одговорно лице:",
    "contact.h2":"Побарајте понуда",
    "contact.lead":"Пополнете го формуларот со деталите на Вашата пратка и ќе Ви одговориме со понуда во најкус можен рок. За итни пратки, јавете се директно.",
    "contact.k.phone":"Телефон","contact.k.email":"Е-пошта","contact.k.addr":"Адреса","contact.country":"Северна Македонија",
    "form.g.contact":"Контакт","form.name":"Име и презиме","form.company":"Компанија","form.email":"Е-пошта","form.phone":"Телефон",
    "form.g.route":"Релација","form.origin":"Потекло (земја / град / пристаниште)","form.origin.country":"Земја на потекло","form.origin.city":"Потекло (град)","form.dest":"Дестинација (земја / град / пристаниште)","form.dest.country":"Земја на дестинација","form.dest.city":"Дестинација (град)",
    "form.g.ship":"Пратка","form.mode":"Вид транспорт","form.mode.ph":"Изберете…",
    "form.incoterm":"Incoterm","form.incoterm.ph":"Изберете…","form.incoterm.unsure":"Не сум сигурен/на",
    "form.pickup_zip":"Поштенски код — подигнување","form.delivery_zip":"Поштенски код — испорака",
    "form.dg":"Опасни материи (ADR / IMDG / IATA DGR)","form.dg.un":"UN број / класа","form.dg.un.h":"(пр. UN1263, класа 3)",
    "form.goods":"Опис на стоката","form.weight":"Тежина (kg)","form.volume":"Волумен (m³ / CBM)",
    "form.dims":"Димензии","form.dims.h":"(Д×Ш×В по колет)","form.dims.title":"📐 Димензии и наплатна тежина","form.dims.add":"＋ Додади димензии","form.pieces":"Парчиња / палети","form.equip":"Опрема / тип возило","form.equip.ph":"— не е потребно —","form.temp":"🌡️ Температурен режим","form.temp.chilled":"Ладно +2/+8","form.temp.frozen":"Замрзнато -18/-25","form.temp.custom":"Друго","form.ctype":"Тип контејнер","form.cqty":"Број контејнери",
    "form.ready":"Подготвена на (датум)","form.empty":" ","form.fastnote":"⚡ За Air Charter / OBC препорачуваме и телефонски повик.",
    "form.notes":"Дополнителни белешки","form.submit":"Испратете барање за понуда",
    "form.privacy":"Со испраќање се согласувате да Ве контактираме во врска со Вашето барање.",
    "form.err.req":"Ова поле е задолжително.","form.err.email":"Внесете валидна е-пошта.",
    "form.sending":"Се испраќа…",
    "form.ok":"Благодариме! Вашето барање е примено. Ќе Ве контактираме наскоро со понуда.",
    "form.err.network":"Барањето не помина по електронски пат. Ве молиме обидете се повторно или",
    "form.err.mailto":"испратете го преку е-пошта.",
    "foot.tag":"Глобална шпедиција и логистика од Скопје. Поморски, патен и воздушен транспорт, царина и door-to-door — со експертиза за коридорот Кина ⇄ Македонија.",
    "foot.nav":"Навигација","foot.legal":"Правни податоци","foot.company":"Компанија","foot.resp":"Одговорно лице","foot.rights":"Сите права задржани."
  },
  en: {
    "nav.services":"Services","nav.why":"Why Bogri","nav.coverage":"Coverage","nav.about":"About","nav.contact":"Contact",
    "cta.quote":"Request a quote","cta.services":"Our services",
    "hero.eyebrow":"Global freight forwarding · China ⇄ Macedonia ⇄ Europe",
    "hero.h1":"Your cargo, delivered anywhere in the world.",
    "hero.lead":"Bogri Solutions is a Skopje-based global freight forwarder — sea, road and air transport, customs clearance and door-to-door logistics. With deep expertise on the China ⇄ Macedonia corridor.",
    "hero.t1":"🌍 Global network","hero.t2":"🚢 Sea · Road · Air","hero.t3":"⚡ Urgent-shipment capability",
    "svc.eyebrow":"Services","svc.h2":"End-to-end logistics, for every kind of cargo",
    "svc.lead":"Every transport mode under one roof — from standard container shipments to the most time-critical hand-carried deliveries.",
    "svc.sea.t":"Sea freight","svc.sea.d":"Full-container (FCL) and groupage (LCL) shipments from all major Asian and European ports, at competitive ocean rates.",
    "svc.road.t":"Road freight","svc.road.d":"Full-truck (FTL) and part-load (LTL) shipments across Europe and the region, with regular lanes and tracking.",
    "svc.air.t":"Air freight","svc.air.d":"Fast air cargo for time-sensitive shipments to and from any airport worldwide.",
    "pill.premium":"Premium","svc.charter.d":"Dedicated air charter for oversized, urgent or high-volume cargo — when scheduled air freight isn't enough.",
    "pill.urgent":"Urgent","svc.obc.d":"Personal hand-carry — a courier travels with your shipment for the most urgent deliveries, measured in hours, not days.",
    "svc.customs.s":"Import & export","svc.customs.t":"Customs clearance","svc.customs.d":"Complete import and export clearance — documentation, classification and compliance, handled for you.",
    "svc.dtd.s":"Multi-modal","svc.dtd.t":"Door-to-door","svc.dtd.d":"Door-to-door logistics across multiple transport modes — a single point of contact for the entire delivery chain.",
    "why.eyebrow":"Why Bogri","why.h2":"Global reach, local commitment",
    "why.lead":"We combine a worldwide partner network with deep knowledge of the China ⇄ Macedonia corridor and care for every single shipment.",
    "why.1.t":"Global network","why.1.d":"Coverage across every continent through trusted agents and carriers at the world's major ports and airports.",
    "why.2.t":"China expertise","why.2.d":"Specialised on the China ⇄ Macedonia lane — optimised routes, rates and customs procedures.",
    "why.3.t":"Door-to-door","why.3.d":"We take responsibility for the whole chain — from pickup at the shipper to delivery at your door.",
    "why.4.t":"Customs handled","why.4.d":"Complete customs brokerage — no unexpected delays at the border and no administrative burden for you.",
    "why.5.t":"Urgent shipments","why.5.d":"Air Charter and OBC for the most critical deadlines — when a delivery simply cannot be late.",
    "cov.eyebrow":"Coverage","cov.h2":"Worldwide coverage, with a clear focus",
    "cov.lead":"We arrange shipments to and from virtually any destination in the world. Our heartland is the corridor we know best.",
    "cov.s1":"Continents","cov.s2":"Transport modes","cov.s3":"For urgent cargo",
    "cov.callout":"Our specialty is the <b>China ⇄ Macedonia ⇄ Europe</b> corridor — sea via Piraeus and Thessaloniki, road lanes across the region and air cargo for fast deliveries.",
    "about.eyebrow":"About","about.h2":"Bogri Solutions DOOEL",
    "about.p1":"Headquartered in Skopje, Bogri Solutions is a freight forwarding and logistics company that connects Macedonian and European businesses to global markets. Our mission is simple — get your cargo there on time, safely and at a competitive price.",
    "about.p2":"While we offer global coverage, our signature strength is the China ⇄ Macedonia lane, where years of experience let us offer routes and rates tailored to your business.",
    "about.resp":"Responsible person:",
    "contact.h2":"Request a quote",
    "contact.lead":"Fill in the form with your shipment details and we'll reply with a quote as soon as possible. For urgent shipments, call us directly.",
    "contact.k.phone":"Phone","contact.k.email":"Email","contact.k.addr":"Address","contact.country":"North Macedonia",
    "form.g.contact":"Contact","form.name":"Full name","form.company":"Company","form.email":"Email","form.phone":"Phone",
    "form.g.route":"Route","form.origin":"Origin (country / city / port)","form.origin.country":"Origin country","form.origin.city":"Origin (city)","form.dest":"Destination (country / city / port)","form.dest.country":"Destination country","form.dest.city":"Destination (city)",
    "form.g.ship":"Shipment","form.mode":"Transport mode","form.mode.ph":"Select…",
    "form.incoterm":"Incoterm","form.incoterm.ph":"Select…","form.incoterm.unsure":"Not sure",
    "form.pickup_zip":"Pickup postal code","form.delivery_zip":"Delivery postal code",
    "form.dg":"Dangerous goods (ADR / IMDG / IATA DGR)","form.dg.un":"UN number / class","form.dg.un.h":"(e.g. UN1263, class 3)",
    "form.goods":"Goods description","form.weight":"Weight (kg)","form.volume":"Volume (m³ / CBM)",
    "form.dims":"Dimensions","form.dims.h":"(L×W×H per package)","form.dims.title":"📐 Dimensions & chargeable weight","form.dims.add":"＋ Add dimensions","form.pieces":"Pieces / pallets","form.equip":"Equipment / vehicle type","form.equip.ph":"— not required —","form.temp":"🌡️ Temperature regime","form.temp.chilled":"Chilled +2/+8","form.temp.frozen":"Frozen -18/-25","form.temp.custom":"Custom","form.ctype":"Container type","form.cqty":"Number of containers",
    "form.ready":"Ready date","form.empty":" ","form.fastnote":"⚡ For Air Charter / OBC we recommend a phone call too.",
    "form.notes":"Additional notes","form.submit":"Send quote request",
    "form.privacy":"By submitting you agree to be contacted regarding your request.",
    "form.err.req":"This field is required.","form.err.email":"Enter a valid email.",
    "form.sending":"Sending…",
    "form.ok":"Thank you! Your request has been received. We'll be in touch shortly with a quote.",
    "form.err.network":"The request couldn't be sent electronically. Please try again or",
    "form.err.mailto":"send it by email.",
    "foot.tag":"Global freight forwarding and logistics from Skopje. Sea, road and air transport, customs and door-to-door — with expertise on the China ⇄ Macedonia corridor.",
    "foot.nav":"Navigation","foot.legal":"Legal details","foot.company":"Company","foot.resp":"Responsible person","foot.rights":"All rights reserved."
  }
};

/* ---------------- language ---------------- */
let currentLang = "mk";
function t(key){ return (I18N[currentLang] && I18N[currentLang][key]) || (I18N.mk[key] || key); }

function applyLang(lang){
  if(!I18N[lang]) lang = "mk";
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const v = I18N[lang][el.getAttribute("data-i18n")];
    if(v !== undefined) el.innerHTML = v;   // content is first-party (safe), allows <b>
  });
  document.querySelectorAll(".lang button").forEach(b=>{
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
  });
  try{ localStorage.setItem("bogri_lang", lang); }catch(e){}
}

/* ---------------- init ---------------- */
document.addEventListener("DOMContentLoaded", ()=>{

  // image slot filename labels
  if(SHOW_IMAGE_SLOT_LABELS) document.body.classList.add("slots-on");

  // year
  const y = document.getElementById("year"); if(y) y.textContent = new Date().getFullYear();

  // restore language
  let saved = "mk";
  try{ saved = localStorage.getItem("bogri_lang") || "mk"; }catch(e){}
  applyLang(saved);
  document.querySelectorAll(".lang button").forEach(b=>{
    b.addEventListener("click", ()=> applyLang(b.dataset.lang));
  });

  // mobile menu
  const menuBtn = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if(menuBtn && navLinks){
    menuBtn.addEventListener("click", ()=>{
      const open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach(a=>a.addEventListener("click", ()=>{
      navLinks.classList.remove("open"); menuBtn.setAttribute("aria-expanded","false");
    }));
  }

  // scroll reveal
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
    }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
    document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el=>el.classList.add("in"));
  }

  setupForm();
});

/* ---------------- form ---------------- */
function setupForm(){
  const form = document.getElementById("rfqForm");
  if(!form) return;
  const modeSel = form.querySelector("#mode");
  const okBox = document.getElementById("formOk");
  const errBox = document.getElementById("formErr");
  const submitBtn = document.getElementById("submitBtn");

  // show FCL fields only for sea_fcl
  modeSel.addEventListener("change", ()=>{
    form.classList.toggle("show-fcl", modeSel.value === "sea_fcl");
  });

  // show pickup/delivery ZIP for door incoterms
  const incoSel = form.querySelector("#incoterm");
  const DOOR_INCOTERMS = ["EXW","FCA","CPT","CIP","DAP","DPU","DDP","unsure"];
  if(incoSel) incoSel.addEventListener("change", ()=>{
    form.classList.toggle("show-zip", DOOR_INCOTERMS.includes(incoSel.value));
  });

  // reveal UN number / class when dangerous goods is checked
  const dgChk = form.querySelector("#dangerous_goods");
  if(dgChk) dgChk.addEventListener("change", ()=>{
    form.classList.toggle("show-dg", dgChk.checked);
  });

  const REQUIRED = ["contact_name","email","phone","origin_country","origin_city","dest_country","dest_city","mode","goods_description"];
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function fieldWrap(el){ return el.closest(".field"); }
  function clearErrors(){ form.querySelectorAll(".field.invalid").forEach(f=>f.classList.remove("invalid")); }

  function validate(){
    clearErrors();
    let firstBad = null;
    REQUIRED.forEach(name=>{
      const el = form.elements[name];
      if(!el) return;
      const empty = !el.value.trim();
      const bad = empty || (name==="email" && !emailRe.test(el.value.trim()));
      if(bad){ fieldWrap(el).classList.add("invalid"); if(!firstBad) firstBad = el; }
    });
    if(firstBad) firstBad.focus();
    return !firstBad;
  }

  function collect(){
    const data = {};
    new FormData(form).forEach((v,k)=>{ data[k] = typeof v === "string" ? v.trim() : v; });
    delete data.website_url; // honeypot never forwarded
    // combine country+city into single origin/destination for backend
    if (data.origin_city || data.origin_country) {
      data.origin = (data.origin_city || '') + (data.origin_country ? ', ' + data.origin_country : '');
    }
    if (data.dest_city || data.dest_country) {
      data.destination = (data.dest_city || '') + (data.dest_country ? ', ' + data.dest_country : '');
    }
    data.source = "website";
    data.lang = currentLang;
    data.submitted_at = new Date().toISOString();
    data.page_url = location.href;
    return data;
  }

  function buildMailto(data){
    const lines = [
      "Барање за понуда / Quote request","",
      "Име/Name: "+(data.contact_name||""),
      "Компанија/Company: "+(data.company||""),
      "Е-пошта/Email: "+(data.email||""),
      "Телефон/Phone: "+(data.phone||""),
      "",
      "Потекло/Origin: "+(data.origin_city||"")+" / "+(data.origin_country||""),
      "Дестинација/Destination: "+(data.dest_city||"")+" / "+(data.dest_country||""),
      "Вид/Mode: "+(data.mode||""),
      "Incoterm: "+(data.incoterm||""),
      "Поштенски подигнување/Pickup ZIP: "+(data.pickup_zip||""),
      "Поштенски испорака/Delivery ZIP: "+(data.delivery_zip||""),
      "",
      "Стока/Goods: "+(data.goods_description||""),
      "Опасни материи/Dangerous goods: "+(data.dangerous_goods ? ("Да/Yes — "+(data.un_number||"")) : "Не/No"),
      "Тежина/Weight (kg): "+(data.weight_kg||""),
      "Волумен/Volume (CBM): "+(data.volume_cbm||""),
      "Димензии/Dimensions: "+(data.dimensions||""),
      "Контејнер/Container: "+((data.container_type||"")+" x "+(data.container_qty||"")),
      "Подготвена/Ready date: "+(data.ready_date||""),
      "",
      "Белешки/Notes: "+(data.notes||"")
    ];
    const subject = "RFQ — "+(data.contact_name||"")+" ("+(data.mode||"")+")";
    return "mailto:"+FALLBACK_EMAIL+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(lines.join("\r\n"));
  }

  function hideStatus(){ okBox.classList.remove("show"); errBox.classList.remove("show"); }
  function showOk(){ hideStatus(); okBox.textContent = t("form.ok"); okBox.classList.add("show"); okBox.scrollIntoView({behavior:"smooth",block:"center"}); }
  function showErr(mailto){
    hideStatus();
    errBox.innerHTML = t("form.err.network")+' <a href="'+mailto+'">'+t("form.err.mailto")+"</a>";
    errBox.classList.add("show");
    errBox.scrollIntoView({behavior:"smooth",block:"center"});
  }

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    hideStatus();

    // honeypot: silently succeed for bots, send nothing
    if(form.elements.website_url && form.elements.website_url.value){ showOk(); form.reset(); return; }

    if(!validate()) return;

    const data = collect();
    const mailto = buildMailto(data);

    submitBtn.disabled = true;
    const orig = submitBtn.textContent;
    submitBtn.textContent = t("form.sending");

    const ctrl = new AbortController();
    const timer = setTimeout(()=>ctrl.abort(), SUBMIT_TIMEOUT_MS);
    try{
      const res = await fetch(RFQ_ENDPOINT, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(data),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if(!res.ok) throw new Error("HTTP "+res.status);
      showOk();
      form.reset();
      form.classList.remove("show-fcl","show-zip","show-dg");
    }catch(err){
      clearTimeout(timer);
      showErr(mailto);
    }finally{
      submitBtn.disabled = false;
      submitBtn.textContent = orig;
    }
  });
}

/* ---------- sticky RFQ FAB ---------- */
(function(){
  const fab = document.getElementById('fabRfq');
  if (!fab) return;
  const contact = document.getElementById('contact');
  if (contact && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      fab.classList.toggle('hide', e.isIntersecting);
    }, { threshold: 0.05 }).observe(contact);
  }
})();

/* ---------- dims calculator (mirrors portal NBK pattern) ---------- */
var _rfqDimCount = 0, _rfqUnit = 'cm';

function rfqSetUnit(u, btn) {
  _rfqUnit = u;
  btn.parentNode.querySelectorAll('button').forEach(function(b) { b.classList.remove('act'); });
  btn.classList.add('act');
  rfqCalc();
}

function rfqAddDim() {
  var i = _rfqDimCount++;
  var el = document.getElementById('dimRows');
  var row = document.createElement('div');
  row.className = 'dim-row';
  row.id = 'dr-' + i;
  row.innerHTML =
    '<input type="number" class="dim-row__qty" id="dq-' + i + '" value="1" min="1" placeholder="qty" oninput="rfqCalc()">' +
    '<span class="dim-row__x">×</span>' +
    '<input type="number" class="dim-row__inp" id="dl-' + i + '" placeholder="L" oninput="rfqCalc()">' +
    '<span class="dim-row__x">×</span>' +
    '<input type="number" class="dim-row__inp" id="dw-' + i + '" placeholder="W" oninput="rfqCalc()">' +
    '<span class="dim-row__x">×</span>' +
    '<input type="number" class="dim-row__inp" id="dh-' + i + '" placeholder="H" oninput="rfqCalc()">' +
    '<span class="dim-row__cbm" id="dcbm-' + i + '"></span>' +
    '<button type="button" class="dim-row__rm" onclick="rfqRmDim(' + i + ')" aria-label="Remove">✕</button>';
  el.appendChild(row);
  rfqCalc();
}

function rfqRmDim(i) {
  var el = document.getElementById('dr-' + i);
  if (el) el.remove();
  rfqCalc();
}

function rfqCalc() {
  var modeEl = document.getElementById('mode');
  var mode = modeEl ? modeEl.value : '';
  // Divisor by mode (air=6000, sea=5000/1000, road=3000)
  var modeKey = 'road';
  if (mode === 'air' || mode === 'air_charter' || mode === 'obc') modeKey = 'air';
  else if (mode === 'sea_fcl' || mode === 'sea_lcl') modeKey = 'sea';
  var div = { air: 6000, sea: 5000, road: 3000 }[modeKey] || 3000;
  var divLabel = { air: '÷6000 air', sea: '÷5000 sea', road: '÷3000 road' }[modeKey] || '÷3000';
  var toCm = _rfqUnit === 'in' ? 2.54 : 1;
  var totalCbm = 0, dimParts = [], totalPcs = 0;

  for (var i = 0; i < _rfqDimCount; i++) {
    var row = document.getElementById('dr-' + i);
    if (!row) continue;
    var qty = Math.max(1, Number((document.getElementById('dq-' + i) || {}).value) || 1);
    var l = Number((document.getElementById('dl-' + i) || {}).value) || 0;
    var w = Number((document.getElementById('dw-' + i) || {}).value) || 0;
    var h = Number((document.getElementById('dh-' + i) || {}).value) || 0;
    var lCm = l * toCm, wCm = w * toCm, hCm = h * toCm;
    var cbm = (lCm * wCm * hCm) / 1000000;
    var rowCbm = cbm * qty;
    totalCbm += rowCbm;
    totalPcs += qty;
    var lbl = document.getElementById('dcbm-' + i);
    if (lbl) lbl.textContent = (l && w && h) ? rowCbm.toFixed(3) + ' m³' : '';
    if (l && w && h) dimParts.push(qty + '× ' + Math.round(lCm) + '×' + Math.round(wCm) + '×' + Math.round(hCm) + ' cm');
  }

  var sumEl = document.getElementById('dimSum');
  if (!sumEl) return;
  if (totalCbm <= 0 && _rfqDimCount === 0) { sumEl.style.display = 'none'; return; }
  sumEl.style.display = '';

  var wt = Number((document.getElementById('weight_kg') || {}).value) || 0;
  var volWt = Math.ceil((totalCbm * 1000000) / div);
  var chg = Math.max(wt, volWt);
  var isVolHeavy = volWt > wt && wt > 0;

  sumEl.innerHTML =
    '<div>Total volume: <span class="cv">' + totalCbm.toFixed(3) + ' CBM</span></div>' +
    '<div>Actual weight: <span class="cv">' + (wt || '—') + ' kg</span></div>' +
    '<div>Volumetric: <span class="cv">' + volWt + ' kg</span> <span class="formula">(' + divLabel + ')</span></div>' +
    '<div class="chg">Chargeable: <span class="cv' + (isVolHeavy ? ' vol-warn' : '') + '">' + chg + ' kg</span>' +
    (isVolHeavy ? ' <span class="formula">volume > weight</span>' : '') + '</div>';

  // Auto-fill hidden fields
  var volEl = document.getElementById('volume_cbm');
  if (volEl) volEl.value = totalCbm > 0 ? totalCbm.toFixed(3) : '';
  var chgEl = document.getElementById('chargeable_kg');
  if (chgEl) chgEl.value = chg > 0 ? chg : '';
  var dimEl = document.getElementById('dimensions');
  if (dimEl) dimEl.value = dimParts.join('; ');
  // Auto-fill pieces if not manually set
  var pcEl = document.getElementById('pieces');
  if (pcEl && !pcEl.value && totalPcs > 0) pcEl.value = totalPcs;
}

/* ---------- equipment + temp regime ---------- */
var _EQUIP = {
  road: ['FTL','LTL','Partial','Van','Mega','Frigo','Curtainsider','Box','Flatbed'],
  sea:  ['20GP','40GP','40HC','45HC','20RF','40RF','20OT','40OT','20FR','40FR'],
  air:  ['Standard','ULD / PMC','Temperature controlled','Express']
};

// Modes that should show equipment selector
var _EQUIP_MODES = ['road_ftl','road_ltl','sea_fcl','sea_lcl','air','air_charter'];
// Modes that should show temp regime
var _TEMP_MODES = ['road_ftl','road_ltl','sea_fcl','air','air_charter'];

function rfqUpdateEquipTemp() {
  var form = document.getElementById('rfqForm');
  var modeVal = (document.getElementById('mode') || {}).value || '';
  var modeKey = 'road';
  if (modeVal.startsWith('sea')) modeKey = 'sea';
  else if (modeVal === 'air' || modeVal === 'air_charter' || modeVal === 'obc') modeKey = 'air';

  // Equipment
  var showEquip = _EQUIP_MODES.indexOf(modeVal) !== -1;
  form.classList.toggle('show-equip', showEquip);
  if (showEquip) {
    var sel = document.getElementById('equipment');
    var cur = sel.value;
    var phText = currentLang === 'mk' ? '— не е потребно —' : '— not required —';
    sel.innerHTML = '<option value="">' + phText + '</option>';
    (_EQUIP[modeKey] || []).forEach(function(v) {
      var o = document.createElement('option'); o.value = v; o.textContent = v; sel.appendChild(o);
    });
    if (cur) { sel.value = cur; if (!sel.value) sel.value = ''; }
  }

  // Temp regime
  var showTemp = _TEMP_MODES.indexOf(modeVal) !== -1;
  form.classList.toggle('show-temp', showTemp);
}

function rfqSetTemp(btn) {
  btn.parentNode.querySelectorAll('button').forEach(function(b) { b.classList.remove('act'); });
  btn.classList.add('act');
  var v = btn.dataset.v || '';
  var map = { chilled: '+2/+8', frozen: '-18/-25', '': '' };
  var cust = document.getElementById('tempCustom');
  var hidden = document.getElementById('temp_regime');
  if (v === 'custom') {
    cust.style.display = 'flex';
    hidden.value = '';
    // Wire custom inputs to update hidden field
    document.getElementById('temp_lo').oninput = function() { rfqTempCustom(); };
    document.getElementById('temp_hi').oninput = function() { rfqTempCustom(); };
  } else {
    cust.style.display = 'none';
    hidden.value = map[v] || '';
  }
}

function rfqTempCustom() {
  var lo = (document.getElementById('temp_lo') || {}).value || '';
  var hi = (document.getElementById('temp_hi') || {}).value || '';
  document.getElementById('temp_regime').value = (lo || hi) ? (lo || '?') + ' / ' + (hi || '?') : '';
}

/* ---------- country autocomplete (client-side, matches portal) ---------- */
var _COUNTRIES=["Afghanistan","Albania","Algeria","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium","Bolivia","Bosnia and Herzegovina","Brazil","Bulgaria","Cambodia","Cameroon","Canada","Chile","China","Colombia","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia","Ethiopia","Finland","France","Georgia","Germany","Ghana","Greece","Guatemala","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast","Japan","Jordan","Kazakhstan","Kenya","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Libya","Lithuania","Luxembourg","North Macedonia","Madagascar","Malaysia","Mali","Malta","Mexico","Moldova","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Nepal","Netherlands","New Zealand","Nicaragua","Nigeria","North Korea","Norway","Oman","Pakistan","Palestine","Panama","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Singapore","Slovakia","Slovenia","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Tunisia","Turkey","Turkmenistan","UAE","Uganda","UK","Ukraine","Uruguay","USA","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

function _acSetup(inputId) {
  var inp = document.getElementById(inputId);
  if (!inp) return;
  // Create dropdown as sibling right after the input (not after the field wrapper)
  var wrap = document.createElement('div');
  wrap.style.position = 'relative';
  inp.parentNode.insertBefore(wrap, inp);
  wrap.appendChild(inp);
  var dd = document.createElement('div');
  dd.className = 'ac-dd';
  dd.style.cssText = 'display:none;position:absolute;left:0;right:0;top:100%;z-index:100';
  wrap.appendChild(dd);
  var _hi = -1, _items = [];

  function show(arr, q) {
    _items = arr; _hi = -1;
    if (!arr.length) { dd.style.display = 'none'; return; }
    var ql = q.toLowerCase();
    dd.innerHTML = arr.map(function(v, i) {
      var idx = v.toLowerCase().indexOf(ql);
      var ht = idx >= 0 ? (v.slice(0, idx) + '<b>' + v.slice(idx, idx + q.length) + '</b>' + v.slice(idx + q.length)) : v;
      return '<div class="ac-opt" data-i="' + i + '">' + ht + '</div>';
    }).join('');
    dd.style.display = 'block';
    dd.querySelectorAll('.ac-opt').forEach(function(opt) {
      opt.addEventListener('mousedown', function(e) { e.preventDefault(); pick(Number(this.dataset.i)); });
      opt.addEventListener('touchstart', function(e) { e.preventDefault(); pick(Number(this.dataset.i)); }, {passive:false});
    });
  }
  function hide() { dd.style.display = 'none'; dd.innerHTML = ''; _items = []; _hi = -1; }
  function pick(i) { if (!_items[i]) return; inp.value = _items[i]; hide(); inp.dispatchEvent(new Event('change')); }

  inp.addEventListener('input', function() {
    var v = inp.value.trim();
    if (v.length < 1) { hide(); return; }
    var ql = v.toLowerCase();
    show(_COUNTRIES.filter(function(c) { return c.toLowerCase().indexOf(ql) >= 0; }).slice(0, 8), v);
  });
  inp.addEventListener('focus', function() {
    var v = inp.value.trim();
    if (v.length >= 1) {
      var ql = v.toLowerCase();
      show(_COUNTRIES.filter(function(c) { return c.toLowerCase().indexOf(ql) >= 0; }).slice(0, 8), v);
    }
  });
  inp.addEventListener('blur', function() { setTimeout(hide, 200); });
  inp.addEventListener('keydown', function(e) {
    if (dd.style.display === 'none' || !_items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); _hi = Math.min(_hi + 1, _items.length - 1); hilite(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); _hi = Math.max(_hi - 1, 0); hilite(); }
    else if (e.key === 'Enter' && _hi >= 0) { e.preventDefault(); pick(_hi); }
    else if (e.key === 'Escape') { hide(); }
  });
  function hilite() {
    dd.querySelectorAll('.ac-opt').forEach(function(o, i) { o.classList.toggle('hi', i === _hi); });
    if (_hi >= 0 && dd.children[_hi]) dd.children[_hi].scrollIntoView({ block: 'nearest' });
  }
}

function _acCitySetup(inputId, countryInputId) {
  var inp = document.getElementById(inputId);
  if (!inp) return;
  var wrap = document.createElement('div');
  wrap.style.position = 'relative';
  inp.parentNode.insertBefore(wrap, inp);
  wrap.appendChild(inp);
  var dd = document.createElement('div');
  dd.className = 'ac-dd';
  dd.style.cssText = 'display:none;position:absolute;left:0;right:0;top:100%;z-index:100';
  wrap.appendChild(dd);
  var _hi = -1, _items = [], _to = null;

  function show(arr, q) {
    _items = arr; _hi = -1;
    if (!arr.length) { dd.style.display = 'none'; return; }
    var ql = q.toLowerCase();
    dd.innerHTML = arr.map(function(v, i) {
      var idx = v.toLowerCase().indexOf(ql);
      var ht = idx >= 0 ? (v.slice(0, idx) + '<b>' + v.slice(idx, idx + q.length) + '</b>' + v.slice(idx + q.length)) : v;
      return '<div class="ac-opt" data-i="' + i + '">' + ht + '</div>';
    }).join('');
    dd.style.display = 'block';
    dd.querySelectorAll('.ac-opt').forEach(function(opt) {
      opt.addEventListener('mousedown', function(e) { e.preventDefault(); pick(Number(this.dataset.i)); });
      opt.addEventListener('touchstart', function(e) { e.preventDefault(); pick(Number(this.dataset.i)); }, {passive:false});
    });
  }
  function hide() { dd.style.display = 'none'; dd.innerHTML = ''; _items = []; _hi = -1; }
  function pick(i) { if (!_items[i]) return; inp.value = _items[i]; hide(); }

  function fetchCities(q) {
    var country = (document.getElementById(countryInputId) || {}).value || '';
    var url = RFQ_ENDPOINT.replace('website-rfq', 'website-city-suggest') + '?q=' + encodeURIComponent(q);
    if (country) url += '&country=' + encodeURIComponent(country);
    fetch(url).then(function(r) { return r.json(); }).then(function(d) {
      if (d.ok && d.results) show(d.results, q);
      else hide();
    }).catch(function() { hide(); });
  }

  inp.addEventListener('input', function() {
    var v = inp.value.trim();
    if (v.length < 2) { hide(); return; }
    clearTimeout(_to);
    _to = setTimeout(function() { fetchCities(v); }, 200);
  });
  inp.addEventListener('focus', function() {
    var v = inp.value.trim();
    if (v.length >= 2) { clearTimeout(_to); _to = setTimeout(function() { fetchCities(v); }, 100); }
  });
  inp.addEventListener('blur', function() { setTimeout(hide, 200); });
  inp.addEventListener('keydown', function(e) {
    if (dd.style.display === 'none' || !_items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); _hi = Math.min(_hi + 1, _items.length - 1); hilite(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); _hi = Math.max(_hi - 1, 0); hilite(); }
    else if (e.key === 'Enter' && _hi >= 0) { e.preventDefault(); pick(_hi); }
    else if (e.key === 'Escape') { hide(); }
  });
  function hilite() {
    dd.querySelectorAll('.ac-opt').forEach(function(o, i) { o.classList.toggle('hi', i === _hi); });
    if (_hi >= 0 && dd.children[_hi]) dd.children[_hi].scrollIntoView({ block: 'nearest' });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  _acSetup('origin_country');
  _acSetup('dest_country');
  _acCitySetup('origin_city', 'origin_country');
  _acCitySetup('dest_city', 'dest_country');
  _acZipSetup('pickup_zip', 'origin_country', 'origin_city');
  _acZipSetup('delivery_zip', 'dest_country', 'dest_city');
});

// BOG-241: postal code autocomplete for pickup_zip / delivery_zip
function _acZipSetup(inputId, countryInputId, cityInputId) {
  var inp = document.getElementById(inputId);
  if (!inp) return;
  var wrap = document.createElement('div');
  wrap.style.position = 'relative';
  inp.parentNode.insertBefore(wrap, inp);
  wrap.appendChild(inp);
  var dd = document.createElement('div');
  dd.className = 'ac-dd';
  dd.style.cssText = 'display:none;position:absolute;left:0;right:0;top:100%;z-index:100';
  wrap.appendChild(dd);
  var _hi = -1, _items = [], _to = null;

  function show(arr, q) {
    _items = arr; _hi = -1;
    if (!arr.length) { dd.style.display = 'none'; return; }
    var ql = q.toLowerCase();
    dd.innerHTML = arr.map(function(v, i) {
      var label = v.zip + ' — ' + v.place;
      var idx = label.toLowerCase().indexOf(ql);
      var ht = idx >= 0 ? (label.slice(0, idx) + '<b>' + label.slice(idx, idx + q.length) + '</b>' + label.slice(idx + q.length)) : label;
      return '<div class="ac-opt" data-i="' + i + '">' + ht + '</div>';
    }).join('');
    dd.style.display = 'block';
    dd.querySelectorAll('.ac-opt').forEach(function(opt) {
      opt.addEventListener('mousedown', function(e) { e.preventDefault(); pick(Number(this.dataset.i)); });
      opt.addEventListener('touchstart', function(e) { e.preventDefault(); pick(Number(this.dataset.i)); }, {passive:false});
    });
  }
  function hide() { dd.style.display = 'none'; dd.innerHTML = ''; _items = []; _hi = -1; }
  function pick(i) {
    if (!_items[i]) return;
    inp.value = _items[i].zip;
    // auto-fill city if empty
    var cityInp = document.getElementById(cityInputId);
    if (cityInp && !cityInp.value.trim()) cityInp.value = _items[i].place;
    hide();
  }

  function fetchZips(q) {
    var country = (document.getElementById(countryInputId) || {}).value || '';
    var url = RFQ_ENDPOINT.replace('website-rfq', 'website-zip-suggest') + '?q=' + encodeURIComponent(q);
    if (country) url += '&country=' + encodeURIComponent(country);
    fetch(url).then(function(r) { return r.json(); }).then(function(d) {
      if (d.ok && d.results) show(d.results, q);
      else hide();
    }).catch(function() { hide(); });
  }

  inp.addEventListener('input', function() {
    var v = inp.value.trim();
    if (v.length < 2) { hide(); return; }
    clearTimeout(_to);
    _to = setTimeout(function() { fetchZips(v); }, 200);
  });
  inp.addEventListener('focus', function() {
    var v = inp.value.trim();
    if (v.length >= 2) { clearTimeout(_to); _to = setTimeout(function() { fetchZips(v); }, 100); }
  });
  inp.addEventListener('blur', function() { setTimeout(hide, 200); });
  inp.addEventListener('keydown', function(e) {
    if (dd.style.display === 'none' || !_items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); _hi = Math.min(_hi + 1, _items.length - 1); hilite(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); _hi = Math.max(_hi - 1, 0); hilite(); }
    else if (e.key === 'Enter' && _hi >= 0) { e.preventDefault(); pick(_hi); }
    else if (e.key === 'Escape') { hide(); }
  });
  function hilite() {
    dd.querySelectorAll('.ac-opt').forEach(function(o, i) { o.classList.toggle('hi', i === _hi); });
    if (_hi >= 0 && dd.children[_hi]) dd.children[_hi].scrollIntoView({ block: 'nearest' });
  }
}
