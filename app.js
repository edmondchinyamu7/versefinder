const verses = [
 {ref:"Philippians 4:6-7",text:"Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",topics:["Peace","Anxiety","Prayer","Hope"]},
 {ref:"Isaiah 41:10",text:"Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",topics:["Strength","Fear","Hope"]},
 {ref:"Psalm 23:1",text:"The LORD is my shepherd; I shall not want.",topics:["Comfort","Faith","Hope"]},
 {ref:"Proverbs 3:5-6",text:"Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",topics:["Guidance","Faith","Trust"]},
 {ref:"Jeremiah 29:11",text:"For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",topics:["Hope","Purpose","Peace"]},
 {ref:"Matthew 11:28",text:"Come unto me, all ye that labour and are heavy laden, and I will give you rest.",topics:["Rest","Comfort","Strength"]},
 {ref:"Joshua 1:9",text:"Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",topics:["Courage","Strength","Fear"]},
 {ref:"Romans 8:28",text:"And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",topics:["Hope","Faith","Purpose"]},
 {ref:"Psalm 46:1",text:"God is our refuge and strength, a very present help in trouble.",topics:["Strength","Comfort","Fear"]},
 {ref:"1 Peter 5:7",text:"Casting all your care upon him; for he careth for you.",topics:["Anxiety","Prayer","Comfort"]},
 {ref:"John 10:10",text:"The thief cometh not, but for to steal, and to kill, and to destroy: I am come that they might have life, and that they might have it more abundantly.",topics:["Life","Hope","Faith"]},
 {ref:"John 14:27",text:"Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",topics:["Peace","Fear","Comfort"]},
 {ref:"Psalm 119:105",text:"Thy word is a lamp unto my feet, and a light unto my path.",topics:["Guidance","Faith"]},
 {ref:"1 Corinthians 13:4",text:"Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.",topics:["Love","Faith"]},
 {ref:"Lamentations 3:22-23",text:"It is of the LORD'S mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",topics:["Hope","Faith","Comfort"]},
 {ref:"Psalm 34:18",text:"The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",topics:["Comfort","Love","Grief"]},
 {ref:"Romans 12:12",text:"Rejoicing in hope; patient in tribulation; continuing instant in prayer.",topics:["Hope","Prayer","Strength"]},
 {ref:"Matthew 5:9",text:"Blessed are the peacemakers: for they shall be called the children of God.",topics:["Peace","Love"]},
 {ref:"Galatians 6:9",text:"And let us not be weary in well doing: for in due season we shall reap, if we faint not.",topics:["Strength","Purpose","Hope"]},
 {ref:"Psalm 37:4",text:"Delight thyself also in the LORD; and he shall give thee the desires of thine heart.",topics:["Faith","Purpose","Trust"]},
 {ref:"Hebrews 11:1",text:"Now faith is the substance of things hoped for, the evidence of things not seen.",topics:["Faith","Hope"]}
];
const topics=[["Peace","☁","For a calm and steady heart"],["Strength","⚡","When you need courage"],["Love","♡","The gift of love"],["Anxiety","☾","When worries feel heavy"],["Guidance","✧","For your next step"],["Hope","☀","A reason to keep going"],["Faith","◇","Trusting beyond what you see"],["Comfort","❋","For difficult days"],["Prayer","⌁","Growing closer to God"],["Purpose","➶","Finding meaning"],["Fear","♧","When you feel afraid"],["Rest","☁","Permission to pause"]];
const plan=[["Begin with trust","Proverbs 3:5-6"],["Courage for today","Joshua 1:9"],["Peace in prayer","Philippians 4:6-7"],["Strength in hard times","Isaiah 41:10"],["Hope for tomorrow","Jeremiah 29:11"],["Rest for your soul","Matthew 11:28"],["Keep walking in faith","Hebrews 11:1"]];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem("vf_"+k))??d}catch{return d}},set(k,v){localStorage.setItem("vf_"+k,JSON.stringify(v))}};
let favorites=store.get("favorites",[]), journal=store.get("journal",[]), completed=store.get("completed",[]), activeTopic="";
function toast(s){let t=$("#toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2100)}
function verseCard(v){let saved=favorites.includes(v.ref);return `<article class="verse-item"><div class="verse-text">${escapeHtml(v.text)}</div><div class="verse-ref">${escapeHtml(v.ref.toUpperCase())} · KJV</div><div class="verse-actions"><button class="action-button ${saved?'saved':''}" data-fav="${v.ref}">${saved?'♥ Saved':'♡ Save'}</button><button class="action-button" data-copy="${v.ref}">▢ Copy</button><button class="action-button" data-share="${v.ref}">↗ Share</button></div></article>`}
function daily(){let n=new Date();let v=verses[(n.getFullYear()*366+Math.floor((n-new Date(n.getFullYear(),0,0))/86400000))%verses.length];$("#dailyCard").innerHTML=`<div class="verse-text">${escapeHtml(v.text)}</div><div class="verse-ref">${escapeHtml(v.ref.toUpperCase())} · KJV</div><div class="verse-actions"><button class="action-button ${favorites.includes(v.ref)?'saved':''}" data-fav="${v.ref}">${favorites.includes(v.ref)?'♥ Saved':'♡ Save verse'}</button><button class="action-button" data-copy="${v.ref}">▢ Copy</button><button class="action-button" data-share="${v.ref}">↗ Share</button></div>`}
function renderTopics(target){$(target).innerHTML=topics.map(([name,icon,desc])=>`<button class="topic-card" data-topic="${name}"><span class="topic-icon">${icon}</span><strong>${name}</strong><small>${desc}</small></button>`).join("")}
function normalizeReference(input){
 let q=input.trim().toLowerCase().replace(/[.,]/g," ").replace(/\b(chapter|chap)\b/g," ").replace(/\b(verse|verses|vs|v)\b/g,":").replace(/\s*:\s*/g,":").replace(/\s+/g," ").trim();
 const aliases={"gen":"Genesis","ge":"Genesis","ex":"Exodus","ps":"Psalms","psalm":"Psalms","prov":"Proverbs","pro":"Proverbs","isa":"Isaiah","jer":"Jeremiah","lam":"Lamentations","matt":"Matthew","mt":"Matthew","mk":"Mark","mrk":"Mark","lk":"Luke","jn":"John","jhn":"John","rom":"Romans","1 cor":"1 Corinthians","2 cor":"2 Corinthians","gal":"Galatians","phil":"Philippians","php":"Philippians","heb":"Hebrews","1 pet":"1 Peter","2 pet":"2 Peter"};
 for(const [shortName,fullName] of Object.entries(aliases)){if(q===shortName||q.startsWith(shortName+" ")){q=fullName+q.slice(shortName.length);break}}
 const match=q.match(/^(.+?)\s+(\d+)\s*:?\s*(\d+)(?:\s*[-–]\s*(\d+))?$/);
 return match?`${match[1]} ${match[2]}:${match[3]}${match[4]?"-"+match[4]:""}`:null;
}
let searchRequest=0;
async function renderSearch(){
 const raw=$("#searchInput").value.trim(),q=raw.toLowerCase(),request=++searchRequest,normalized=normalizeReference(raw);
 let found=verses.filter(v=>(!activeTopic||v.topics.includes(activeTopic))&&(!q||v.text.toLowerCase().includes(q)||v.ref.toLowerCase().includes(q)||v.topics.some(t=>t.toLowerCase().includes(q))||!!(normalized&&v.ref.toLowerCase()===normalized.toLowerCase())));
 if(found.length){$("#resultsMeta").textContent=`${found.length} ${found.length===1?'verse':'verses'} found${activeTopic?' in '+activeTopic:''}`;$("#searchResults").innerHTML=found.map(verseCard).join("");return}
 if(normalized&&!activeTopic){
  $("#resultsMeta").textContent=`Looking up ${normalized} in the KJV…`;
  $("#searchResults").innerHTML='<div class="verse-item">Searching the Bible reference…</div>';
  try{
   const response=await fetch(`https://bible-api.com/${encodeURIComponent(normalized)}?translation=kjv`);
   if(!response.ok)throw new Error("Reference not found");
   const data=await response.json();if(request!==searchRequest)return;
   const textValue=(data.verses||[]).map(v=>v.text.trim()).join(" ").trim()||data.text?.trim();
   if(!textValue)throw new Error("No verse returned");
   const result={ref:data.reference||normalized,text:textValue.replace(/\s+/g," "),topics:["Bible lookup"]};
   if(!verses.some(v=>v.ref.toLowerCase()===result.ref.toLowerCase()))verses.push(result);
   $("#resultsMeta").textContent="1 verse found · KJV · Online lookup";$("#searchResults").innerHTML=verseCard(result);
  }catch(error){if(request!==searchRequest)return;$("#resultsMeta").textContent="No verse found";$("#searchResults").innerHTML='<div class="verse-item">We couldn’t find that reference. Check the book, chapter and verse, or try <strong>John 10:10</strong>.</div>'}
  return;
 }
 $("#resultsMeta").textContent=`${found.length} ${found.length===1?'verse':'verses'} found${activeTopic?' in '+activeTopic:''}`;
 $("#searchResults").innerHTML=found.length?found.map(verseCard).join(""):'<div class="verse-item">No matching verses in the built-in collection. Try a Bible reference such as <strong>John 10:10</strong> to look it up online.</div>';
}
function renderFavorites(){let arr=verses.filter(v=>favorites.includes(v.ref));$("#favoriteResults").innerHTML=arr.length?arr.map(verseCard).join(""):'<div class="verse-item">Your saved verses will appear here. Tap ♡ on any verse to keep it close.</div>';$("#favCount").textContent=favorites.length}
function renderJournal(){let box=$("#journalEntries");box.innerHTML=journal.length?journal.map((e,i)=>`<article class="journal-entry"><button class="delete-entry" data-delete="${i}">Delete ×</button><strong>${escapeHtml(e.title||'Untitled entry')}</strong><small>${e.date}</small><p>${escapeHtml(e.text)}</p></article>`).join(""):'<p class="results-meta">Your journal is waiting for your first entry.</p>'}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderPlan(){let count=completed.length;$("#planProgress").textContent=`${count} of 7 completed`;$("#progressFill").style.width=(count/7*100)+"%";$("#planDays").innerHTML=plan.map((p,i)=>`<div class="plan-day ${completed.includes(i)?'done':''}"><button class="day-check" data-day="${i}">${completed.includes(i)?'✓':''}</button><div><strong>Day ${i+1} · ${p[0]}</strong><small>Read ${p[1]} · KJV</small></div><span class="day-ref">${completed.includes(i)?'COMPLETED':'READING'}</span></div>`).join("")}
function navigate(view){$$(".view").forEach(x=>x.classList.remove("active"));$("#view-"+view).classList.add("active");$$(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.view===view));if(view==="favorites")renderFavorites();if(view==="journal")renderJournal();if(view==="plan")renderPlan();window.scrollTo(0,0)}
$$("[data-view]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));
document.addEventListener("click",async e=>{
 let fav=e.target.closest("[data-fav]");if(fav){let r=fav.dataset.fav;favorites=favorites.includes(r)?favorites.filter(x=>x!==r):[...favorites,r];store.set("favorites",favorites);daily();renderFavorites();renderSearch();toast(favorites.includes(r)?"Verse saved":"Removed from saved verses")}
 let cp=e.target.closest("[data-copy]");if(cp){let v=verses.find(x=>x.ref===cp.dataset.copy);try{await navigator.clipboard.writeText(`${v.text} — ${v.ref} (KJV)`);toast("Verse copied")}catch{toast("Copy is not available in this browser")}}
 let sh=e.target.closest("[data-share]");if(sh){let v=verses.find(x=>x.ref===sh.dataset.share);let msg=`${v.text} — ${v.ref} (KJV)`;if(navigator.share){navigator.share({title:"VerseFinder",text:msg}).catch(()=>{})}else{try{await navigator.clipboard.writeText(msg);toast("Verse copied to share")}catch{toast(msg)}}}
 let tp=e.target.closest("[data-topic]");if(tp){activeTopic=tp.dataset.topic;$("#searchInput").value="";navigate("search");renderSearch()}
 let day=e.target.closest("[data-day]");if(day){let i=+day.dataset.day;completed=completed.includes(i)?completed.filter(x=>x!==i):[...completed,i];store.set("completed",completed);renderPlan()}
 let del=e.target.closest("[data-delete]");if(del){journal.splice(+del.dataset.delete,1);store.set("journal",journal);renderJournal();toast("Entry deleted")}
});
$("#searchInput").addEventListener("input",renderSearch);$("#clearSearch").onclick=()=>{$("#searchInput").value="";activeTopic="";renderSearch()};
$("#newDaily").onclick=()=>{let v=verses[Math.floor(Math.random()*verses.length)];$("#dailyCard").innerHTML=`<div class="verse-text">${escapeHtml(v.text)}</div><div class="verse-ref">${escapeHtml(v.ref.toUpperCase())} · KJV</div><div class="verse-actions"><button class="action-button ${favorites.includes(v.ref)?'saved':''}" data-fav="${v.ref}">${favorites.includes(v.ref)?'♥ Saved':'♡ Save verse'}</button><button class="action-button" data-copy="${v.ref}">▢ Copy</button><button class="action-button" data-share="${v.ref}">↗ Share</button></div>`};
$("#journalForm").addEventListener("submit",e=>{e.preventDefault();let title=$("#journalTitle").value.trim(),text=$("#journalText").value.trim();if(!text){toast("Write a reflection first");return}journal.unshift({title,text,date:new Date().toLocaleDateString()});store.set("journal",journal);e.target.reset();renderJournal();toast("Journal entry saved")});
function toggleTheme(){document.body.classList.toggle("dark");store.set("dark",document.body.classList.contains("dark"))}
$("#themeToggle").onclick=toggleTheme;$("#headerTheme").onclick=toggleTheme;if(store.get("dark",false))document.body.classList.add("dark");
$("#todayLabel").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
renderTopics("#homeTopics");renderTopics("#allTopics");daily();renderSearch();renderFavorites();renderJournal();renderPlan();