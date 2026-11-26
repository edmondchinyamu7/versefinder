let verses = [
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
];;
const BIBLE_BOOKS=["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];
let bibleLoaded=false, bibleLoading=null, bibleDbPromise=null;
function bibleDb(){
 if(!("indexedDB" in window))return Promise.resolve(null);
 if(!bibleDbPromise)bibleDbPromise=new Promise(resolve=>{
  const req=indexedDB.open("versefinder_bible",1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains("books"))req.result.createObjectStore("books")};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>resolve(null);
 });
 return bibleDbPromise;
}
async function cachedBook(name){
 try{const db=await bibleDb();if(db)return await new Promise(resolve=>{const req=db.transaction("books","readonly").objectStore("books").get(name);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>resolve(null)})}catch{}
 try{const raw=localStorage.getItem("vf_kjv_"+name.toLowerCase().replace(/[^a-z0-9]/g,"_"));return raw?JSON.parse(raw):null}catch{return null}
}
async function saveBook(name,data){
 try{const db=await bibleDb();if(db){await new Promise(resolve=>{const tx=db.transaction("books","readwrite");tx.objectStore("books").put(data,name);tx.oncomplete=tx.onerror=()=>resolve()});return}}catch{}
 try{localStorage.setItem("vf_kjv_"+name.toLowerCase().replace(/[^a-z0-9]/g,"_"),JSON.stringify(data))}catch{}
}
const BIBLE_BOOK_FILE_IDS=["Gen","Exod","Lev","Num","Deut","Josh","Judg","Ruth","1Sam","2Sam","1Kgs","2Kgs","1Chr","2Chr","Ezra","Neh","Esth","Job","Ps","Prov","Eccl","Song","Isa","Jer","Lam","Ezek","Dan","Hos","Joel","Amos","Obad","Jonah","Mic","Nah","Hab","Zeph","Hag","Zech","Mal","Matt","Mark","Luke","John","Acts","Rom","1Cor","2Cor","Gal","Eph","Phil","Col","1Thess","2Thess","1Tim","2Tim","Titus","Phlm","Heb","Jas","1Pet","2Pet","1John","2John","3John","Jude","Rev"];
async function fetchKjvBook(name){
 const cached=await cachedBook(name);if(cached)return parseKjvBook(cached,name);
 const bookIndex=BIBLE_BOOKS.indexOf(name);
 const fileId=bookIndex>=0?BIBLE_BOOK_FILE_IDS[bookIndex]:name;
 const url="https://raw.githubusercontent.com/midvash/bible-data/main/versions/en/kjv/books/"+encodeURIComponent(fileId)+".json";
 const response=await fetch(url);if(!response.ok)throw new Error("Could not load "+name+" ("+response.status+")");
 const data=await response.json();await saveBook(name,data);
 return parseKjvBook(data,name);
}
function parseKjvBook(data,name){
 const bookName=data.englishName||data.name||name, out=[];
 const chapters=data.chapters||[];
 if(Array.isArray(chapters)){
  chapters.forEach((chapter,ci)=>{
   const rows=chapter.verses||[];
   rows.forEach((v,vi)=>{
    const textValue=typeof v==="string"?v:v.text;
    if(textValue)out.push({ref:bookName+" "+(chapter.chapter||ci+1)+":"+(v.number||v.verse||vi+1),text:String(textValue).replace(/\s+/g," ").trim(),topics:[]});
   });
  });
 }else{
  Object.entries(chapters).forEach(([chapterNo,chapter])=>Object.entries(chapter.verses||chapter).forEach(([verseNo,v])=>{
   const textValue=typeof v==="string"?v:v.text;
   if(textValue)out.push({ref:bookName+" "+chapterNo+":"+verseNo,text:String(textValue).replace(/\s+/g," ").trim(),topics:[]});
  }));
 }
 return out;
}
async function loadFullBible(){
 if(bibleLoaded)return;
 if(bibleLoading)return bibleLoading;
 bibleLoading=(async()=>{
  const all=[];
  for(let i=0;i<BIBLE_BOOKS.length;i+=6){
   const batch=await Promise.all(BIBLE_BOOKS.slice(i,i+6).map(async name=>{try{return await fetchKjvBook(name)}catch(err){console.warn("VerseFinder: book unavailable",name,err);return []}}));
   batch.forEach(rows=>all.push(...rows));
  }
  const seen=new Set(verses.map(v=>v.ref.toLowerCase()));
  all.forEach(v=>{if(!seen.has(v.ref.toLowerCase())){verses.push(v);seen.add(v.ref.toLowerCase())}});
  bibleLoaded=all.length>30000;
  if(!bibleLoaded)throw new Error("The complete Bible library could not be loaded. Check your connection and try again.");
 })().finally(()=>{bibleLoading=null});
 return bibleLoading;
}

const topics=[["Peace","☁","For a calm and steady heart"],["Strength","⚡","When you need courage"],["Love","♡","The gift of love"],["Anxiety","☾","When worries feel heavy"],["Guidance","✧","For your next step"],["Hope","☀","A reason to keep going"],["Faith","◇","Trusting beyond what you see"],["Comfort","❋","For difficult days"],["Prayer","⌁","Growing closer to God"],["Purpose","➶","Finding meaning"],["Fear","♧","When you feel afraid"],["Rest","☁","Permission to pause"]];
const plan=[
 ["Begin with trust","Proverbs 3:5-6"],["Courage for today","Joshua 1:9"],["Peace through prayer","Philippians 4:6-7"],["Strength in hard times","Isaiah 41:10"],["Hope for tomorrow","Jeremiah 29:11"],["Rest for your soul","Matthew 11:28"],["Keep walking in faith","Hebrews 11:1"],["God is our refuge","Psalm 46:1"],["Love one another","John 13:34-35"],["A heart of gratitude","1 Thessalonians 5:16-18"],["Wisdom for decisions","James 1:5"],["A patient spirit","Romans 12:12"],["Forgive as you are forgiven","Ephesians 4:32"],["Serve with kindness","Galatians 5:13"],["God's faithful care","1 Peter 5:7"],["A light for your path","Psalm 119:105"],["Choose what is good","Micah 6:8"],["A gentle answer","Proverbs 15:1"],["Persevere with hope","Romans 5:3-5"],["The gift of grace","Ephesians 2:8-10"],["Seek understanding","Proverbs 2:1-6"],["Peace with others","Matthew 5:9"],["Use your gifts well","1 Peter 4:10"],["God's unfailing love","Romans 8:38-39"],["Be strong and steady","1 Corinthians 16:13-14"],["A renewed mind","Romans 12:2"],["Encourage one another","1 Thessalonians 5:11"],["Walk in humility","Philippians 2:3-5"],["Give thanks in all things","Colossians 3:15-17"],["Continue in hope","Romans 15:13"]
];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem("vf_"+k))??d}catch{return d}},set(k,v){localStorage.setItem("vf_"+k,JSON.stringify(v))}};
let favorites=store.get("favorites",[]), journal=store.get("journal",[]), completed=store.get("completed",[]), activeTopic="";
function toast(s){let t=$("#toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2100)}
function verseCard(v){let saved=favorites.includes(v.ref);return `<article class="verse-item"><div class="verse-text">${escapeHtml(v.text)}</div><div class="verse-ref">${escapeHtml(v.ref.toUpperCase())} · KJV</div><div class="verse-actions"><button class="action-button ${saved?'saved':''}" data-fav="${v.ref}">${saved?'♥ Saved':'♡ Save'}</button><button class="action-button" data-copy="${v.ref}">▢ Copy</button><button class="action-button" data-share="${v.ref}">↗ Share</button><button class="action-button" data-open-ref="${escapeHtml(v.ref)}">Read in Bible →</button><button class="action-button" data-collection-verse="${escapeHtml(v.ref)}" type="button">＋ Collection</button></div></article>`}
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
 if(q&&!bibleLoaded){
  $("#resultsMeta").textContent="Loading the complete KJV library (31,102 verses)…";
  $("#searchResults").innerHTML='<div class="verse-item">Preparing the full Bible search. This may take a moment the first time.</div>';
  try{await loadFullBible()}catch(error){if(request!==searchRequest)return;$("#resultsMeta").textContent="Using the available verse collection";console.warn(error)}
  if(request!==searchRequest)return;
 }
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
let editingJournalIndex=null;
function renderJournal(){let box=$("#journalEntries");box.innerHTML=journal.length?journal.map((e,i)=>`<article class="journal-entry"><div class="journal-entry-actions"><button class="edit-entry" data-edit-journal="${i}" type="button">Edit</button><button class="delete-entry" data-delete="${i}" type="button">Delete ×</button></div><strong>${escapeHtml(e.title||'Untitled entry')}</strong><small>${e.date}</small><p>${escapeHtml(e.text)}</p></article>`).join(""):'<p class="results-meta">Your journal is waiting for your first entry.</p>'}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderPlan(){let count=completed.length;$("#planProgress").textContent=`${count} of ${plan.length} completed`;$("#progressFill").style.width=(count/plan.length*100)+"%";$("#planDays").innerHTML=plan.map((p,i)=>`<div class="plan-day ${completed.includes(i)?'done':''}"><button class="day-check" data-day="${i}">${completed.includes(i)?'✓':''}</button><div><strong>Day ${i+1} · ${p[0]}</strong><small>Read ${p[1]} · KJV</small></div><span class="day-ref">${completed.includes(i)?'COMPLETED':'READING'}</span></div>`).join("")}
function closeMobileMore(){const panel=$("#mobileMorePanel"),backdrop=$("#mobileMoreBackdrop"),trigger=$("#mobileMore");if(panel)panel.classList.remove("open");if(panel)panel.setAttribute("aria-hidden","true");if(backdrop)backdrop.hidden=true;if(trigger)trigger.setAttribute("aria-expanded","false")}
function navigate(view){const target=$("#view-"+view);if(!target){console.warn("VerseFinder: section not found",view);return false}$$(".view").forEach(x=>x.classList.toggle("active",x===target));$$(".nav-item[data-view]").forEach(x=>x.classList.toggle("active",x.dataset.view===view));closeMobileMore();if(view==="favorites")renderFavorites();if(view==="journal")renderJournal();if(view==="plan")renderPlan();if(view==="reader"&&typeof window.vfLoadReaderChapter==="function")window.vfLoadReaderChapter();window.scrollTo({top:0,behavior:"smooth"});return true}
window.navigate=navigate;
const moreTrigger=$("#mobileMore"),morePanel=$("#mobileMorePanel"),moreBackdrop=$("#mobileMoreBackdrop");
function toggleMobileMore(force){if(!morePanel||!moreBackdrop||!moreTrigger)return;const open=typeof force==="boolean"?force:!morePanel.classList.contains("open");morePanel.classList.toggle("open",open);morePanel.setAttribute("aria-hidden",String(!open));moreBackdrop.hidden=!open;moreTrigger.setAttribute("aria-expanded",String(open))}
if(moreTrigger)moreTrigger.addEventListener("click",()=>toggleMobileMore());
const closeMore=$("#closeMobileMore");if(closeMore)closeMore.addEventListener("click",()=>toggleMobileMore(false));
if(moreBackdrop)moreBackdrop.addEventListener("click",()=>toggleMobileMore(false));
document.addEventListener("keydown",e=>{if(e.key==="Escape")toggleMobileMore(false)});
document.addEventListener("click",event=>{const viewButton=event.target.closest("[data-view]");if(viewButton){event.preventDefault();navigate(viewButton.dataset.view);return}const goButton=event.target.closest("[data-go]");if(goButton){event.preventDefault();navigate(goButton.dataset.go)}});
document.addEventListener("click",async e=>{
 let openRef=e.target.closest("[data-open-ref]");if(openRef){const reference=openRef.dataset.openRef;navigate("reader");if(typeof window.vfOpenReference==="function"){const opened=await window.vfOpenReference(reference);if(!opened)toast("Could not open "+reference+" in the reader")}else{toast("The Bible reader is still loading")}}
 let fav=e.target.closest("[data-fav]");if(fav){let r=fav.dataset.fav;favorites=favorites.includes(r)?favorites.filter(x=>x!==r):[...favorites,r];store.set("favorites",favorites);daily();renderFavorites();renderSearch();toast(favorites.includes(r)?"Verse saved":"Removed from saved verses")}
 let cp=e.target.closest("[data-copy]");if(cp){let v=verses.find(x=>x.ref===cp.dataset.copy);try{await navigator.clipboard.writeText(`${v.text} — ${v.ref} (KJV)`);toast("Verse copied")}catch{toast("Copy is not available in this browser")}}
 let sh=e.target.closest("[data-share]");if(sh){let v=verses.find(x=>x.ref===sh.dataset.share);let msg=`${v.text} — ${v.ref} (KJV)`;if(navigator.share){navigator.share({title:"VerseFinder",text:msg}).catch(()=>{})}else{try{await navigator.clipboard.writeText(msg);toast("Verse copied to share")}catch{toast(msg)}}}
 let tp=e.target.closest("[data-topic]");if(tp){activeTopic=tp.dataset.topic;$("#searchInput").value="";navigate("search");renderSearch()}
 let day=e.target.closest("[data-day]");if(day){let i=+day.dataset.day;completed=completed.includes(i)?completed.filter(x=>x!==i):[...completed,i];store.set("completed",completed);renderPlan()}
 let edit=e.target.closest("[data-edit-journal]");if(edit){editingJournalIndex=Number(edit.dataset.editJournal);const entry=journal[editingJournalIndex];$("#journalTitle").value=entry.title||"";$("#journalText").value=entry.text||"";$("#journalForm").querySelector("button[type=submit],button").textContent="Update entry →";$("#journalTitle").focus();return}
 let del=e.target.closest("[data-delete]");if(del){journal.splice(+del.dataset.delete,1);store.set("journal",journal);if(editingJournalIndex!==null){editingJournalIndex=null;$("#journalForm").reset();$("#journalForm").querySelector("button[type=submit],button").textContent="Save entry →"}renderJournal();toast("Entry deleted")}
});
$("#searchInput").addEventListener("input",renderSearch);$("#clearSearch").onclick=()=>{$("#searchInput").value="";activeTopic="";renderSearch()};
$("#newDaily").onclick=()=>{let v=verses[Math.floor(Math.random()*verses.length)];$("#dailyCard").innerHTML=`<div class="verse-text">${escapeHtml(v.text)}</div><div class="verse-ref">${escapeHtml(v.ref.toUpperCase())} · KJV</div><div class="verse-actions"><button class="action-button ${favorites.includes(v.ref)?'saved':''}" data-fav="${v.ref}">${favorites.includes(v.ref)?'♥ Saved':'♡ Save verse'}</button><button class="action-button" data-copy="${v.ref}">▢ Copy</button><button class="action-button" data-share="${v.ref}">↗ Share</button></div>`};
$("#journalForm").addEventListener("submit",e=>{e.preventDefault();let title=$("#journalTitle").value.trim(),text=$("#journalText").value.trim();if(!text){toast("Write a reflection first");return}if(editingJournalIndex!==null){const previous=journal[editingJournalIndex];journal[editingJournalIndex]={...previous,title,text,updated:new Date().toLocaleDateString()};editingJournalIndex=null;toast("Journal entry updated")}else{journal.unshift({title,text,date:new Date().toLocaleDateString()});toast("Journal entry saved")}store.set("journal",journal);e.target.reset();e.target.querySelector("button").textContent="Save entry →";renderJournal()});
function toggleTheme(){document.body.classList.toggle("dark");store.set("dark",document.body.classList.contains("dark"))}
$("#themeToggle").onclick=toggleTheme;$("#headerTheme").onclick=toggleTheme;if(store.get("dark",false))document.body.classList.add("dark");
$("#todayLabel").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
renderTopics("#homeTopics");renderTopics("#allTopics");daily();renderSearch();renderFavorites();renderJournal();renderPlan();